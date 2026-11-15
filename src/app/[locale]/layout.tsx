import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {hasLocale, NextIntlClientProvider} from "next-intl";
import {getTranslations} from "next-intl/server";
import {Header} from "@/components/widgets/Header/Header";
import {site} from "@/content/site";
import {languageTags, routing} from "@/i18n/routing";
import {cormorant, greatVibes, manrope} from "@/styles/fonts";
import styles from "@/styles/Application.module.css";

export const metadata: Metadata = {
  title: {default: site.name, template: `%s | ${site.name}`},
  robots: {index: false, follow: false}
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: LayoutProps<"/[locale]">) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const navigation = await getTranslations("Navigation");
  const enquiry = await getTranslations("Enquiry");

  return (
    <html lang={languageTags[locale]} className={`${styles.root} ${manrope.variable} ${cormorant.variable} ${greatVibes.variable}`}>
      <body className={styles.body}>
        <a href="#main-content" className={styles.skipLink}>{navigation("skip")}</a>
        <NextIntlClientProvider locale={locale} messages={null}>
          <Header />
          {children}
        </NextIntlClientProvider>
        <p id="enquiry-unavailable" className={styles.visuallyHidden}>{enquiry("unavailable")}</p>
      </body>
    </html>
  );
}
