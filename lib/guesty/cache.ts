import { Redis } from "@upstash/redis";

let client: Redis | null | undefined;
let warnedMissing = false;
let warnedError = false;

function persistEnabled(): boolean {
  return process.env.GUESTY_TOKEN_PERSIST !== "false";
}

function getClient(): Redis | null {
  if (client !== undefined) return client;
  if (!persistEnabled()) {
    client = null;
    return null;
  }
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    if (!warnedMissing) {
      console.warn(
        "[guesty-cache] KV_REST_API_URL / KV_REST_API_TOKEN not set — falling back to in-memory cache only",
      );
      warnedMissing = true;
    }
    client = null;
    return null;
  }
  client = new Redis({ url, token });
  console.warn("[guesty-cache] KV connected");
  return client;
}

export async function getJson<T>(key: string): Promise<T | null> {
  const c = getClient();
  if (!c) return null;
  try {
    const v = await c.get<T>(key);
    return v ?? null;
  } catch (err) {
    if (!warnedError) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[guesty-cache] read failed:", msg);
      warnedError = true;
    }
    return null;
  }
}

export async function setJson(
  key: string,
  value: unknown,
  ttlSeconds: number,
): Promise<void> {
  const c = getClient();
  if (!c) return;
  if (!Number.isFinite(ttlSeconds) || ttlSeconds <= 0) return;
  try {
    await c.set(key, value, { ex: Math.ceil(ttlSeconds) });
  } catch (err) {
    if (!warnedError) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[guesty-cache] write failed:", msg);
      warnedError = true;
    }
  }
}

// Sentinel returned when no KV client is configured. Callers treat this
// as "lock acquired" so memory-only mode behaves like the previous
// single-flight implementation (no cross-process coordination available).
export const NO_KV_LOCK = "__no_kv__";

/**
 * Best-effort distributed lock using SET NX EX. Returns a unique token
 * on success (which the caller must pass to releaseLock), or null if
 * another holder already owns the lock. Returns NO_KV_LOCK when KV is
 * disabled, so callers can proceed in memory-only mode.
 */
export async function acquireLock(
  key: string,
  ttlSeconds: number,
): Promise<string | null> {
  const c = getClient();
  if (!c) return NO_KV_LOCK;
  const value = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  try {
    const result = await c.set(key, value, {
      nx: true,
      ex: Math.max(1, Math.ceil(ttlSeconds)),
    });
    return result === "OK" ? value : null;
  } catch (err) {
    if (!warnedError) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[guesty-cache] lock acquire failed:", msg);
      warnedError = true;
    }
    // On KV error, behave like memory-only so we don't deadlock the caller.
    return NO_KV_LOCK;
  }
}

/**
 * Release a lock, only if we still own it (compare-and-delete via Lua).
 * No-op when value is the NO_KV_LOCK sentinel.
 */
export async function releaseLock(key: string, value: string): Promise<void> {
  if (value === NO_KV_LOCK) return;
  const c = getClient();
  if (!c) return;
  const script =
    'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end';
  try {
    await c.eval(script, [key], [value]);
  } catch (err) {
    if (!warnedError) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn("[guesty-cache] lock release failed:", msg);
      warnedError = true;
    }
  }
}
