import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';
const supported = ['en', 'ru', 'sr'] as const;
export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale;
  const validatedLocale = supported.find((candidate) => candidate === locale);
  if (!validatedLocale) notFound();
  const messages = (await import(`../../../../src/i18n/messages/${validatedLocale}.json`)).default;
  return {locale: validatedLocale, messages};
});
