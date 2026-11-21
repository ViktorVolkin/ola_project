# Balloons & Gifts — intake и план реализации

Статус: **UI IMPLEMENTED / TECHNICAL CHECKS PASS / INDEPENDENT REVIEW PENDING**. Реализация и актуальные доказательства — [Balloons QA](../qa/balloons/README.md), приоритет имеет связанный из него fresh Figwright follow-up. Mobile Hero wash, compact surfaces/insets и native section rhythm исправлены и проверены; независимый review в работе. Это не public-release или owner visual acceptance. Figwright доступен; прежний Starter limit official MCP больше не design-access blocker.

## Разрешённый scope

Владелец разрешил продолжать остальные страницы и вести подробный MD-статус каждой. Предыдущий Home-only scope в `implementation-plan.md` — исторический, не текущее ограничение. Рабочая ветка `development`; без commit/staging/push/deployment или изменений Figma.

Следующей выбрана Balloons & Gifts: отдельная страница из существующего route/design inventory, не требующая придумывать catalogue product slugs. Interaction contract подтверждён отдельным сообщением Lead Designer и сохранён в parent-reviewed intake.

## Известные источники

- Route: `/{locale}/balloons`, локали EN/RU/SR; все три production routes реализованы и статически генерируются.
- Figma reference roots: Desktop `98:2166`, Tablet `98:2496`, Mobile `98:2959`.
- Сохранённый общий intake: `docs/design/implementation-plan.md`.
- Структура из intake: Hero → четыре categories → четыре favourites → personalisation + четыре extras → final CTA; favourites 2×2 на mobile.
- Hero использует `home/01_home_hero_florist_balloons_montenegro.jpg`, а не `balloons/01_balloons_hero.jpg` по одному совпадению имени.
- Parent-reviewed данные: `balloons-intake.json`; соответствия supplied assets: `balloons-asset-map.json`. Все 15 placements сопоставлены по SHA-1 с 13 уникальными локальными изображениями; SHA-256 integrity и размеры из manifest совпали. Это не только role-based соответствие по имени файла. Локальный `ola_dev_design/references/balloons.png` остаётся вторичной ориентацией, не runtime image.

## История блокеров и актуальная подготовка

Первоначальный Figwright запрос действительно вернул пустой список и закрытую панель. Затем canonical URL `https://www.figma.com/design/l0Te0ZppAJZ3LSIIrcRZ5n/OLA` получен от Lead Designer, а ожидаемые roots и section contexts прочитаны через доступный read-only Figma MCP. Native image hashes, crops, typography и interactive variants сверены родителем; Figma не изменялась.

Отдельная поломка parent terminal/file exposure также снята: реальные read/write/patch/search/execute smoke проверки прошли. Сейчас нельзя продолжать ссылаться на недоступную Figma как текущий blocker. Запуск Node24.22.2 из `.nvmrc` проверен через `npm exec --yes --package=node@24.22.2 -- …`: lint/typecheck/19 unit прошли. Для следующего build использовать этот pinned runtime; глобальный Node26 и project engines не менялись.

Частичный `balloons-responsive-intake.json` сохранён как исторический output субагента и помечен superseded. В нём были неверные обобщения: tablet extra card166px вместо208px, card/photo bounds, Enquire typography, crop offsets и неверное описание missing node. Для реализации использовать **`balloons-intake.json`**, где родитель закрыл gap tablet Favourites прямым native read. Браузерная реализация ещё не проверена.

Контакты, final prefill и RU/SR approval остаются release inputs, но не блокируют private frontend preview с честными disabled enquiries. UI по памяти и placeholder routes HTTP200 не создавать.

## Зафиксированные implementation decisions

- Пять содержательных widgets: Hero, Categories, Favourites, Personalisation/Extras, Final CTA. Page остаётся тонкой server composition; не копировать число секций Weddings.
- Tablet Header Balloons не имеет page-context label; общий Header уже содержит route item, повторно не добавлять его.
- Hero → local Favourites anchor. Categories/favourites/extras → соответствующая видимая topic. Ask about sets → общий sets enquiry. Final → общий custom-gift enquiry. Никаких product slugs/stock/checkout; источник контракта — сообщение Lead Designer, не выдуманное чтение отсутствующего operations brief.
- Не превращать один typography token в правило всей страницы: favourites Enquire — Manrope Regular14/21, а separate extras Enquire — Medium14/21; tablet extra card146×208, mobile152×210. На compact экранах подпись extra и отдельное Enquire действие различаются от desktop label+arrow.
- `balloons-intake.json` хранит 45 reference crop records. Teddy bears использует тот же source, что большая scene, с увеличенным смещённым inner image rectangle внутри clip; обычный centered cover недостаточен. Проверять также tablet favourite focus и B10/B15 panorama crops.
- Lenis/motion не вводить в эту вёрстку попутно: они отдельными измеряемыми этапами записаны в `../ROADMAP.md`.

## Порядок дальнейшей работы

1. Использовать проверенные D/T/M intake/asset map; обращаться к точным nodes при оставшейся неоднозначности, не повторять большие whole-root exports без необходимости.
2. Сохранить соответствия source identity и фактическое clipping при переводе в CSS; наличие совпадающего hash не означает одинаковый crop.
3. Реализовать подтверждённый action contract. Не переносить Weddings contract автоматически и не придумывать availability, цены, delivery terms, contact URL или booking/checkout.
4. Прочитать актуальные установленные Next.js/next-intl guides для затронутых APIs; использовать существующие Container/ActionLink/Icon/EnquiryLink и правила переводов. Новые компоненты создавать только с понятной semantic ownership.
5. Создать typed page content и namespaced UI labels EN/RU/SR. Новые переводы обозначать как drafts до approval. Не внедрять CMS/backend/global state.
6. Спланировать section-owned widgets и тонкую page composition; узко делегировать отдельные sections/content/QA без пересекающейся ownership. Учитывать фактическую модель implementer, проверять её output и не принимать self-report за gate.
7. Реализовать continuous responsive sizes; media conditions только для необходимых composition/behavior changes. Проверить intrinsic alternatives перед введением thresholds. Не фиксировать общую высоту страницы по Figma.
8. Parent review, независимый scoped review, production build, lint/typecheck/unit/E2E, EN/RU/SR browser sweeps и actual header/page interactions; исправления и повторная проверка после последнего изменения.
9. Создать `docs/qa/balloons/README.md` с реальными доказательствами и обновить `docs/qa/pages/README.md` и root README. Until then Balloons не помечать VERIFIED.

## Приёмка

Пять widgets, typed content, UI namespace и thin route/page реализованы. Актуальная проверка: lint/typecheck/build, 24 unit и 68 релевантных E2E; rendered evidence и оставшиеся gates — в [Balloons QA](../qa/balloons/README.md). Старые подготовительные проверки выше — исторический intake, не доказательство текущей готовности. Page-completion gate и правила статусов находятся в `docs/qa/pages/README.md`, общий backlog — `docs/ROADMAP.md`. Текущие Home/About/Weddings не менять ради универсальной абстракции для этой страницы.
