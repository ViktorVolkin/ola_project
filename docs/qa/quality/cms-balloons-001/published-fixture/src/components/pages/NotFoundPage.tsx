import { getTranslations } from "next-intl/server";
import { NotFoundRecoveryBlock } from "@/components/widgets/NotFoundRecovery/NotFoundRecoveryBlock";

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound");
  const copy = {
    eyebrow: t("eyebrow"),
    title: t("title"),
    body: t("body"),
    home: t("home"),
    explore: t("explore"),
    signature: t("signature"),
  };
  return (
    <main id="main-content" data-not-found="">
      <NotFoundRecoveryBlock copy={copy} />
    </main>
  );
}
