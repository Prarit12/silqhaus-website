let cachedToken = null;
let tokenRequestPromise = null;

const normalizeApiUrl = (url) => (url ? url.replace(/\/$/, "") : "");

export const getHostawayAccessToken = async () => {
  // Serve cached token if still valid (refresh 30s early)
  if (cachedToken && Date.now() < cachedToken.expires_at - 30000) {
    return cachedToken.access_token;
  }

  // If a token request is already in progress, wait for it
  if (tokenRequestPromise) {
    return tokenRequestPromise;
  }

  const apiUrl = normalizeApiUrl(process.env.HOSTAWAY_API_URL);
  const clientId = process.env.HOSTAWAY_CLIENT_ID;
  const clientSecret = process.env.HOSTAWAY_CLIENT_SECRET;

  if (!apiUrl || !clientId || !clientSecret) {
    throw new Error("Hostaway credentials not configured");
  }

  tokenRequestPromise = (async () => {
    const body = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "general",
    });

    const response = await fetch(`${apiUrl}/accessTokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Hostaway token error: ${response.status} ${errorText}`);
    }

    const json = await response.json();
    const expiresIn = Number(json.expires_in || 0);

    if (json.access_token && expiresIn > 0) {
      cachedToken = {
        access_token: json.access_token,
        expires_at: Date.now() + expiresIn * 1000,
      };
    }

    return json.access_token;
  })();

  try {
    return await tokenRequestPromise;
  } finally {
    // Always clear the promise so future refreshes can happen
    tokenRequestPromise = null;
  }
};

export const getHostAwayListings = async () => {
  const accessToken = await getHostawayAccessToken();
  const apiUrl = normalizeApiUrl(process.env.HOSTAWAY_API_URL);

  const response = await fetch(`${apiUrl}/listings`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hostaway listings error: ${response.status} ${errorText}`);
  }

  return response.json();
};

export const getHostAwayListingById = async (id) => {
  const accessToken = await getHostawayAccessToken();
  const apiUrl = normalizeApiUrl(process.env.HOSTAWAY_API_URL);

  const response = await fetch(`${apiUrl}/listings/${id}?includeResources=1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hostaway listing error: ${response.status} ${errorText}`);
  }

  return response.json();
};

export const getHostAwayCalendar = async (listingId, startDate, endDate) => {
  const accessToken = await getHostawayAccessToken();
  const apiUrl = normalizeApiUrl(process.env.HOSTAWAY_API_URL);

  const params = new URLSearchParams({
    startDate,
    endDate,
  });

  const response = await fetch(
    `${apiUrl}/listings/${listingId}/calendar?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Cache-Control": "no-cache",
      },
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hostaway calendar error: ${response.status} ${errorText}`);
  }

  return response.json();
};

export const calculateTotalPrice = (calendarData, checkOutDate) => {
  if (!calendarData || !Array.isArray(calendarData)) {
    return { totalPrice: 0, nights: 0, unavailableDates: [], minimumStay: 1 };
  }

  let totalPrice = 0;
  let nights = 0;
  let allDaysTotal = 0;
  let allDaysCount = 0;
  const unavailableDates = [];
  let minimumStay = 1;

  for (const day of calendarData) {
    if (checkOutDate && day.date === checkOutDate) {
      continue;
    }

    if (day.minimumStay && day.minimumStay > minimumStay) {
      minimumStay = day.minimumStay;
    }

    if (day.price && day.price > 0) {
      allDaysTotal += day.price;
      allDaysCount++;
    }

    if (day.isAvailable === 1 && day.status === "available") {
      totalPrice += day.price || 0;
      nights++;
    } else {
      unavailableDates.push(day.date);
    }
  }

  return {
    totalPrice,
    nights,
    unavailableDates,
    minimumStay,
    averageNightlyRate:
      nights > 0
        ? Math.round(totalPrice / nights)
        : allDaysCount > 0
          ? Math.round(allDaysTotal / allDaysCount)
          : 0,
  };
};

export const getHostAwayReviews = async (listingMapId) => {
  const accessToken = await getHostawayAccessToken();
  const apiUrl = normalizeApiUrl(process.env.HOSTAWAY_API_URL);

  const params = new URLSearchParams({
    type: "guest-to-host",
    sortBy: "departureDate",
    sortOrder: "desc",
    limit: "500", // Fetch up to 500 reviews to ensure we get all relevant ones for the listing
  });

  // console.log("Fetching reviews with listingMapId:", listingMapId);

  if (listingMapId) {
    params.set("listingMapIds", listingMapId);
  }

  const response = await fetch(`${apiUrl}/reviews?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Cache-Control": "no-cache",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hostaway reviews error: ${response.status} ${errorText}`);
  }

  return response.json();
};
