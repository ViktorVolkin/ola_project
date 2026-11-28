import type messages from "../i18n/messages/en.json";
import type homeMessages from "../i18n/messages/home/en.json";
import type aboutMessages from "../i18n/messages/about/en.json";
import type weddingsMessages from "../i18n/messages/weddings/en.json";
import type balloonsMessages from "../i18n/messages/balloons/en.json";
import type contactMessages from "../i18n/messages/contact/en.json";
import type bouquetsMessages from "../i18n/messages/bouquets/en.json";
import type {routing} from "../i18n/routing";

declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages & {Home: typeof homeMessages; About: typeof aboutMessages; Weddings: typeof weddingsMessages; Balloons: typeof balloonsMessages; Contact: typeof contactMessages; Bouquets: typeof bouquetsMessages};
  }
}
