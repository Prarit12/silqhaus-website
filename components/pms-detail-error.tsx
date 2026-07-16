import { AlertCircle, ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

interface PMSDetailErrorProps {
  basePath: "properties-for-rent" | "properties-for-sale";
}

export async function PMSDetailError({ basePath }: PMSDetailErrorProps) {
  const t = await getTranslations("pmsPropertyDetail");
  const tList = await getTranslations(
    basePath === "properties-for-rent"
      ? "propertiesForRent"
      : "propertiesForSale",
  );
  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-4 py-24">
      <div className="max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#7e6725]/15 text-[#7e6725] mb-6">
          <AlertCircle className="w-7 h-7" />
        </div>
        <h1 className="text-2xl md:text-3xl font-gilroy font-bold text-white mb-3">
          {t("errorTitle")}
        </h1>
        <p className="text-mist font-poppins mb-8">{t("errorBody")}</p>
        <Link
          href={`/${basePath}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#7e6725] hover:bg-[#6b5a20] text-white font-poppins text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          {tList("backToList")}
        </Link>
      </div>
    </main>
  );
}
