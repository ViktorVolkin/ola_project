import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {EnquiryLink} from '@/components/widgets/EnquiryLink/EnquiryLink';
import './globals.css';
export const metadata: Metadata = {title: 'ActionButton fixture'};
export function generateStaticParams() { return ['en', 'ru', 'sr'].map((locale) => ({locale})); }
export default async function Layout({children, params}: LayoutProps<'/[locale]'>) {
  const {locale} = await params;
  if (!hasLocale(['en', 'ru', 'sr'], locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations('Enquiry');
  return <html lang={locale}><body><NextIntlClientProvider locale={locale}><main>{children}<EnquiryLink variant="primary" subject="fixture">{locale === 'ru' ? 'Спросить студию' : locale === 'sr' ? 'Pitajte studio' : 'Ask the studio'}</EnquiryLink></main></NextIntlClientProvider><p id="enquiry-unavailable" className="visually-hidden">{t('unavailable')}</p></body></html>;
}
