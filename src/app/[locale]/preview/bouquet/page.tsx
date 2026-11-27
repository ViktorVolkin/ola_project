import en from "@/i18n/messages/bouquet-detail/en.json";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import BouquetDetailPage from "@/components/pages/BouquetDetailPage/BouquetDetailPage";
import { Footer } from "@/components/widgets/Footer/Footer";

type Locale = (typeof routing.locales)[number];

// Local-data preview of the bouquet detail for EN/RU/SR. No backend, no CMS,
// no product IDs, prices, stock or checkout data — local mock data only.
// Not added to sitemap or product navigation; not indexable.
export const metadata: Metadata = {
  title: en.previewTitle,
  robots: { index: false, follow: false },
};

export const generateStaticParams = () => routing.locales.map((locale) => ({ locale }));

export default async function PreviewBouquetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  return <><BouquetDetailPage locale={locale as Locale} /><Footer /></>;
}
