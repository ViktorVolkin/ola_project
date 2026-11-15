# OLA Floral Studio — Application Architecture

## Текущий статус

**Текущий increment — новый404, ещё не закрыт:** [исходники и QA](docs/qa/not-found/README.md) содержат recovery screen из серверных компонентов, fluid D/T/M artwork и one-shot ring intro<4с. Lint/types/build и24unit прошли; первый92-case E2E gate FAILED:86passed/6failed. Девять EN/RU/SR captures сохранены. [Блокер Next16.4.3](docs/qa/not-found/ssr-blocker.md): HTTP404 с пустым HTML, no-JS не работает. Изолированная проверка native dynamic-params guard не сохранила локализованный recovery shell, поэтому в сайт не внесена. [Mobile natural flow разрешён дизайнером](docs/qa/not-found/mobile-flow-clarification.md), это не дефект и не требует CSS-правки. Runtime source unchanged; прежние gates не выданы за успешную SSR/no-JS доставку.

**Каталог Bouquets:** EN/RU/SR frontend preview реализован, `AWAITING REVIEW`; [integration evidence](docs/qa/bouquets/integration/final-report.md), build `bxS-t3-XdQ48QF4iLPTqe`. Scoped checks и native/browser comparisons выполнены; actual Sol Supervisor, дизайн, права и финальные переводы ещё не утверждены. P01 OWNER HOLD сохранён.

**Предыдущая проверенная локальная правка:** [Balloons hit-area review/fix](docs/qa/balloons/hit-area-review.md) — перекрытие заголовков исправлено без изменения визуального layout. На том snapshot прошли lint/types/build,24unit/88релевантныхE2E. Поздний narrow correction recheck прошёл и принят после сверки двух хешей; это не текущий full-site/visual/release gate. Старый212-case gate ниже относится к предшествующему shell build, не новому прогону.

**Исторический полный gate до Balloons hit-area fix и нового404 UI:** [подготовка shell404 без Footer](docs/qa/not-found-shell/README.md) — lint/typecheck/build,24unit и212E2E прошли (desktop106/mobile106). Footer явно включён в обычные thin routes и отсутствует на404. Статическое shell review принято для того snapshot после10hash checks. На нём ещё не было нового artwork/radar; эти проверки не доказывали no-JS доставку и не суммируются с новым gate.

**План дальнейшей работы:** [`docs/ROADMAP.md`](docs/ROADMAP.md) — все страницы, Lenis/scrollbar, Framer Motion, строгий code/a11y/responsive review и измерение производительности; задачи и критерии приёмки отмечаются по фактическому выполнению.

**Состояние каждой страницы:** [`docs/qa/pages/README.md`](docs/qa/pages/README.md) — реестр реализации, code/review evidence, адаптива, интерактива, тестов и открытых вопросов. Старые прогоны сохранены с собственной provenance. Balloons EN/RU/SR реализована; [`Figwright follow-up`](docs/qa/balloons/figwright-followup.md) и последующий hit-area fix имеют отдельные проверенные snapshots, но independent final/owner gates не закрыты. Для нового404 [`план`](docs/design/not-found-implementation-plan.md) и QA выше отражают фактическую реализацию и blocker; последнее Figwright listing было пустым, compact input получен из существующего designer brief, не придуман.

Рабочая ветка: **`development`**. Home (`/en`, `/ru`, `/sr`) и `/{locale}/about` реализованы и проверены для frontend preview с общими Header/Footer, переключением языка и modal navigation. About прошёл независимые spec/visual и code reviews; reviewer использовал сохранённые native references и screenshots, без собственной live Figma pixel-parity проверки. Это не owner/Lead Designer production acceptance.

`/{locale}/weddings-events` реализован EN/RU/SR и проверен для технического frontend preview: шесть section-owned widgets, подтверждённые supplied assets, process anchor и topic-preserving enquiry controls с честным disabled preview. Точный статус тестов, визуальных сравнений и независимых ревью — [`docs/qa/weddings/README.md`](docs/qa/weddings/README.md); план/карта ассетов — `docs/design/weddings-implementation-plan.md` и `weddings-asset-map.json`. Bouquets и Contact реализованы как frontend preview, Bouquet Detail остаётся не реализован; Balloons уже существует с открытыми visual gates, описанными выше. Общий intake — `docs/design/implementation-plan.md`; About plan/asset map — `docs/design/about-implementation-plan.md` и `about-asset-map.json` рядом. Runtime evidence находится в `docs/qa/`.

EN перенесён из изученного Figma; RU/SR — явно отмеченные редакционные drafts, требующие утверждения до публикации. Настоящий WhatsApp recipient пока не предоставлен: enquiry controls отключены с локализованным объяснением. Ссылки Mood ведут к соответствующим catalogue anchors без выдуманных product slugs. Финальная визуальная приёмка отдельно от браузерных проверок.

Страницы используют section-owned CSS Modules и общую систему `Container` с вариантами `default`/`wide`; компактная навигация — modal overlay на Radix Dialog. Типографика и безопасные размерные параметры fluid; media queries оставлены для дискретной композиции/поведения. Home/About: [`docs/qa/responsive-second-pass/README.md`](docs/qa/responsive-second-pass/README.md), предыдущий baseline — `docs/qa/fluid-layout/`. Weddings: [`docs/qa/weddings/README.md`](docs/qa/weddings/README.md).

Stack: Next.js 16 App Router, React 19, TypeScript strict, `next-intl` 4, CSS Modules. Deployment ориентирован на **Vercel**, без `output: export` и без отдельного бизнес-backend.

### Запуск

Node **24.x** (проверенная версия в `.nvmrc`), npm **11.x** (`packageManager` закреплён в `package.json`). При использовании nvm:

```sh
nvm install
nvm use
npm install --global npm@11.20.0
npm ci
npm run dev
```

Открыть `http://localhost:3000` — он перенаправит на `/en`. Для запуска foundation не нужны `.env`, контактные данные или доступ к исходному design package. Рабочие изображения поставляются вместе с проектом; `next/font/google` загружает шрифты при сборке и затем раздаёт их локально с сайта.

```sh
npm run lint       # ESLint, warnings запрещены
npm run typecheck  # next typegen + tsc --noEmit; работает и до первой сборки
npm test           # unit checks: локали, navigation URL, messages, asset integrity
npm run build     # production build
npx playwright install chromium
npm run test:e2e  # production HTTP/browser smoke, порт 3100 должен быть свободен
npm run check     # все проверки выше, включая build перед e2e
```

Для production smoke: `npm run build && npm start`. Playwright сам запускает и останавливает отдельный production server; dev server для e2e не нужен. В Linux CI browser dependencies устанавливаются через `npx playwright install --with-deps chromium`.

`.github/workflows/ci.yml` запускает quality gates для push в `development` и pull requests. Добавление workflow само по себе не подтверждает успешный удалённый CI run.

### Фактические файлы

```text
src/
├── app/[locale]/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── about/page.tsx
│   ├── weddings-events/page.tsx
│   ├── balloons/page.tsx
│   ├── not-found.tsx
│   └── [...rest]/page.tsx
├── components/
│   ├── pages/{HomePage/,AboutPage/,WeddingsPage/,BalloonsPage/,NotFoundPage.tsx}
│   ├── widgets/                # HomeBlocks, AboutBlocks, WeddingsBlocks, BalloonsBlocks, NotFoundRecovery, Header/Footer, enquiry
│   └── shared/                 # Container, ActionLink, Icon, useDisclosure
├── content/{site.ts,home.ts,about.ts,weddings.ts,balloons.ts}
├── i18n/
│   ├── routing.ts
│   ├── navigation.ts
│   ├── request.ts
│   └── messages/              # common + home/ + about/ + weddings/ + balloons/, каждый EN/RU/SR
├── styles/
│   ├── Application.module.css  # scoped reset, tokens, focus, skip link
│   └── fonts.ts              # next/font/google, shared CSS variables
└── types/i18n.d.ts
public/assets/                # 82 supplied working/mock assets
docs/assets-manifest.json     # paths relative to public/, sizes, SHA-256
docs/ASSETS.md
tests/{unit,e2e}/
```

`lib` пока зарезервирован без файлов. Пустые директории Git не сохраняет: они появятся в clean checkout с первым реальным модулем, без `.gitkeep`, пустых barrel exports и фиктивных компонентов. Корневого `app/` больше нет; alias `@/*` указывает на `src/*`. Не создавать `src/pages`: page compositions находятся в `src/components/pages`, а не в Pages Router.

## 1. Общая архитектура

Сайт строится как frontend-приложение на **Next.js с App Router и TypeScript**. Деревья компонентов ниже описывают целевую архитектуру; фактически существующие файлы перечислены в разделе «Текущий статус».

Основной принцип разделения:

```text
app
  ↓
pages
  ↓
widgets
  ↓
shared
```

Каждый уровень имеет отдельную ответственность.

```text
src/
├── app/
├── components/
│   ├── pages/
│   ├── widgets/
│   └── shared/
├── content/
├── i18n/
├── lib/
├── styles/
└── types/
```

---

## 2. `app/` — routing layer

`app` отвечает за маршрутизацию Next.js и всё, что непосредственно связано с URL.

Целевые routes (сейчас реализованы locale root, About, Weddings & Events, Balloons & Gifts и минимальная обработка 404; новый 404 дизайн ещё не внедрён):

```text
src/app/
└── [locale]/
    ├── layout.tsx
    ├── page.tsx
    │
    ├── bouquets/
    │   ├── page.tsx
    │   └── [slug]/
    │       └── page.tsx
    │
    ├── balloons/
    │   └── page.tsx
    │
    ├── weddings-events/
    │   └── page.tsx
    │
    ├── about/
    │   └── page.tsx
    │
    └── contact/
        └── page.tsx
```

URL имеют locale prefix:

```text
/en
/en/bouquets
/en/bouquets/[slug]

/ru
/ru/bouquets
/ru/bouquets/[slug]

/sr
/sr/bouquets
/sr/bouquets/[slug]
```

`app/` отвечает за:

- routing;
- locale;
- route params;
- metadata;
- canonical/hreflang;
- `notFound`;
- redirects;
- получение route-level данных.

Route-файлы должны оставаться относительно тонкими.

Утверждённые правила: locale prefix обязателен для контентных страниц; default locale EN; `/` → `/en` (308), без trailing slash. Slugs и статические route segments одинаковы между локалями. Неизвестные locale/route/slug возвращают 404 без English fallback. `/{locale}/bouquets` реализован; bouquet detail routes остаются будущей работой. Locale switch сохраняет текущий route/query/hash; его UI реализован в общих Header/Footer. Product identity будет сохраняться на тех же условиях после реализации detail routes.

`next.config.ts` задаёт root redirect и `trailingSlash: false`. `next-intl` читает locale из `next/root-params` (API установленной Next.js 16.4), без `setRequestLocale`, cookies и определения языка по браузеру. Proxy/middleware пока не нужен: URL уже содержит locale, неизвестные prefix не следует автоматически переписывать в `/en/...`. `generateStaticParams` генерирует EN/RU/SR на build. `[...rest]` вызывает `notFound()` до начала streaming для локализованных 404. Некорректные locale используют стандартный framework 404; его дизайн пока не реализуется.

---

## 3. `components/pages/` — композиция страниц

Этот слой представляет конкретные страницы сайта.

Например:

```text
components/pages/
├── HomePage/
├── BouquetsPage/
├── BouquetDetailPage/
├── BalloonsPage/
├── WeddingsEventsPage/
├── AboutPage/
└── ContactPage/
```

Page component собирает готовую страницу из крупных блоков.

Текущая композиция Home:

```text
HomePage
├── HomeHeroBlock
├── HomeServicesBlock
├── HomeMoodBlock
├── HomeCustomExtrasBlock
├── HomeMeetBlock
└── HomeEventsBlock
```

Таким образом:

`app/[locale]/page.tsx` — URL и данные.

`HomePage` — композиция самой страницы.

Общие Header/Footer собираются locale layout. Завершённые секции Home и About живут в `widgets/HomeBlocks` и `widgets/AboutBlocks`, вместе со своими CSS Modules. Страница получает контент и переводы и передаёт блокам типизированные данные/готовые подписи; в её JSX остаются `main` и композиция блоков, а не внутренние `section/div/img`. Переводчик `t` через props не передаётся. Небольшие элементы внутри секции не выделяются в widgets только ради уменьшения файла.

---

## 4. `components/widgets/` — крупные самостоятельные блоки

Widgets — законченные секции и крупные функциональные блоки интерфейса. Они могут быть специфичны для одной страницы: повторное использование не является обязательным условием выделения полноценной секции.

Например:

```text
components/widgets/
├── Header/
├── Footer/
├── Hero/
├── BouquetGrid/
├── BouquetGallery/
├── CategoryGrid/
├── FAQ/
├── EnquiryForm/
├── WhatsAppCTA/
└── LanguageSwitcher/
```

Widget может состоять из нескольких небольших компонентов и содержать собственную UI-логику.

При этом widget не импортирует route-файлы, page components или их стили. Контент и UI-подписи получает через props либо владеет своими самостоятельными widget-specific переводами.

Например, `BouquetGrid` можно использовать на разных страницах с разными данными.

---

## 5. `components/shared/` — базовые UI-компоненты

Нижний reusable UI layer.

Например:

```text
components/shared/
├── Button/
├── Container/
├── Section/
├── Heading/
├── TextField/
├── TextArea/
├── Select/
├── Icon/
├── Image/
└── Link/
```

Здесь находятся небольшие универсальные компоненты, соответствующие дизайн-системе OLA.

Они не должны знать, на какой странице используются.

---

## 6. Направление зависимостей

Основное направление:

```text
app
 ↓
pages
 ↓
widgets
 ↓
shared
```

Нижние уровни не должны зависеть от верхних.

Пропуск уровней допустим: `app → widgets` для общего chrome и `pages → shared` не нарушают иерархию. `lib`, `i18n`, `content`, `types` — поддерживающие модули, не дополнительные UI-слои; они не импортируют page compositions/routes. Общие типы вводятся только при реальном межмодульном использовании, локальные остаются у владельца.

Например:

```text
shared → pages
```

не допускается.

А:

```text
pages → widgets → shared
```

является нормальной зависимостью.

Это позволяет не превращать приложение в набор компонентов, связанных друг с другом произвольным образом.

---

## 7. Контент отделён от UI

Контент сайта не должен быть размазан непосредственно по JSX-компонентам.

Для него предусмотрен отдельный слой:

```text
content/
```

Например:

```text
content/
├── bouquets/
├── balloons/
├── weddings/
└── pages/
```

Карточка букета может иметь структуру примерно такого уровня:

```text
slug
title
subtitle
description
images
category
featured
```

Это позволит позднее заменить локальный content layer на CMS без полной переделки UI.

На текущем этапе CMS не требуется.

`content/site.ts` содержит название студии и явный nullable WhatsApp URL. `content/home.ts` владеет текстами главной, стабильными IDs карточек, asset paths и destination routes; статус RU/SR зафиксирован как `translation-draft`. `content/bouquets.ts` содержит preview IDs, image records и selector associations без product slugs. Контент страницы и catalogue copy не смешиваются с системными UI messages. Не выводить реальные цены, наличие, опции и доставку из названий мокапов.

---

## 8. Internationalization

Сайт изначально проектируется для трёх языков:

```text
EN
RU
SR
```

UI-переводы хранятся отдельно:

```text
i18n/
├── messages/
│   ├── en.json
│   ├── ru.json
│   └── sr.json
└── ...
```

Например, сюда относятся:

- navigation;
- buttons;
- form labels;
- validation messages;
- accessibility messages;
- системные подписи интерфейса.

Большой контент страниц и каталог не следует смешивать с системными UI messages.

Используется **`next-intl`**, не собственный translation framework. `routing.ts` — единый источник locale config; `request.ts` загружает только выбранный словарь с явной проверкой locale; `navigation.ts` экспортирует locale-aware Link/router/redirect/getPathname. Для будущих внутренних ссылок использовать эти wrappers, а не вручную склеивать locale prefix.

SR — **Latin**: URL `/sr`, HTML language tag `sr-Latn`. EN — default. Типы locale/messages подключены через `types/i18n.d.ts`; unit tests сверяют структуру непустых словарей. Общие словари содержат 404 и namespaces Navigation/Footer/Enquiry; `messages/home/` — UI namespace Home. `request.ts` объединяет только выбранную локаль на сервере. Будущие страницы не заполняются выдуманным контентом.

Переводы принадлежат ближайшему смысловому владельцу: widget переводит свои labels; page — свои UI-тексты; generic Button/Input получают labels через props/children и не знают business translations. Server Components используют `getTranslations`/поддерживаемый server API. Client islands получают готовые labels. Locale layout содержит минимальный `NextIntlClientProvider` с `locale` и `messages={null}` для client navigation: полные словари в browser bundle не передаются. Не скрывать отсутствующие ключи production fallback-строками: полнота и утверждение переводов — release gate.

---

## 9. Assets

Рабочие runtime assets находятся централизованно и не игнорируются Git:

```text
public/assets/
├── images/
│   ├── home/
│   ├── about/
│   ├── balloons/
│   ├── bouquets/
│   ├── bouquet-detail/
│   ├── weddings-events/
│   └── contact/
│
├── icons/
└── decorative/
```

Описание ассетов находится в:

```text
docs/ASSETS.md
```

Визуальные reference renders:

```text
ola_dev_design/references/   # optional local reference package, ignored by Git
```

Figma остаётся основным источником актуального дизайна, а `references/` используется как дополнительный визуальный reference.

Изображения — разрешённые владельцем **мокапы, приближённые к реальным**: большинство позднее заменится, часть может остаться. Это не блокер frontend. Все 82 supplied assets скопированы в `public/assets`, manifest — в `docs/assets-manifest.json`. `npm test` проверяет наличие, размер и SHA-256 каждого файла. Clean install/build не обращается к игнорируемому `ola_dev_design`; reference renders не публикуются как assets. При добавлении/замене файла обновить manifest, content mapping, dimensions/alt/crop и проверить layout. Финальная подборка и права подтверждаются до публикации.

---

## 10. Styles и design tokens

Общие стили и дизайн-токены отделяются от компонентов:

```text
styles/
```

Базовая палитра OLA:

```text
Ivory   #FAF7F2
Wine    #641323
Ink     #241E1B
Blush   #F1E4DE
```

Основная типографика:

```text
Cormorant Garamond
Manrope
Great Vibes
```

Great Vibes используется как декоративный handwritten typography layer, а не как основной UI font.

Шрифты подключены штатно через `next/font/google` в `src/styles/fonts.ts`: Manrope (variable200–800), Cormorant Garamond (variable300–700, normal/italic), Great Vibes (400). Для всех заданы `latin`, `latin-ext`, `cyrillic`, чтобы покрыть EN/RU/SR Latin. CSS variables `--font-manrope`, `--font-cormorant`, `--font-great-vibes` сохранены. Next загружает CSS/font assets при build и раздаёт их с сайта: браузер не обращается к Google, но чистая сборка требует доступа к Google Fonts. Локальные TTF, их копии лицензий и pinned-source инфраструктура удалены; fully offline build и фиксация точных font bytes не являются требованиями. Great Vibes применяется и к русским надписям: прежние RU overrides на Cormorant italic удалены как ошибка, а не как необходимый fallback. Проверки реальных glyph fonts и миграции — `tests/e2e/fonts.spec.ts`, `docs/qa/fonts/`. Палитра задаётся обычными наследуемыми CSS custom properties; автоматической dark theme нет.

Все authored стили находятся в `*.module.css`; Tailwind, его loader и `globals.css` удалены. `Application.module.css` задаёт scoped reset, наследуемые CSS tokens и accessibility defaults через локальный класс корневого `html`, без глобальных utility-классов. Reset находится в низкоприоритетном CSS layer, чтобы не переопределять стили компонентов при другом порядке загрузки. Section styles принадлежат widgets, page styles — только оболочке композиции; нижние слои не импортируют CSS верхних. `cacheComponents`, `partialPrefetching` и экспериментальный `agentFeedback` не включены — текущему локальному контенту они не нужны.

---

## 11. `lib/`

`lib/` содержит общую прикладную инфраструктуру, которая не является UI.

Например:

```text
lib/
├── routes/
├── seo/
├── whatsapp/
└── utils/
```

Сюда могут относиться:

- построение URL;
- WhatsApp links;
- SEO helpers;
- locale helpers;
- общие utility functions.

---

## 12. `types/`

Общие TypeScript-типы:

```text
types/
├── bouquet.ts
├── navigation.ts
├── locale.ts
└── content.ts
```

Типы, используемые только внутри одного компонента, могут оставаться рядом с этим компонентом.

---

## 13. Server и Client Components

По умолчанию страницы и статические компоненты могут работать как Server Components.

Client Components нужны только для элементов, которым действительно необходима browser-side интерактивность.

Например:

```text
mobile navigation
language selector
gallery controls
interactive forms
accordions
```

Статические секции страницы не требуют превращения всей страницы в Client Component.

Статическая навигация/переключение языка ссылками сами по себе не требуют client boundary; он нужен только при реальном browser-side поведении. Не импортировать server dictionaries, весь каталог или server-only utilities в client module graph. Client islands — LanguageSwitcher с `useDisclosure`, маленький DesktopNavigation с `usePathname` для актуального `aria-current`, и MobileNavigation на Radix Dialog: portal/overlay, focus trap/restore, scroll lock и закрытие по Escape/Close/backdrop/navigation link. Первый Escape закрывает вложенный language disclosure, второй — dialog. Переход viewport в desktop navigation закрывает modal и снимает scroll lock. Страницы, Header и Footer остаются серверными; `BouquetFragmentFocus` — ограниченный клиентский island для фокуса каталожных anchors при переходе и reload без принудительного scroll; горизонтальный Mood rail использует нативный CSS scrolling без viewport JS.

---

## 14. Текущая граница системы

На первом этапе архитектура рассчитана на:

```text
responsive frontend
+
EN / RU / SR
+
navigation
+
basic UI interactions
+
WhatsApp enquiry flow
```

Архитектура не требует отдельного backend для этой версии.

Backend, CMS, auth, payments и database не входят в scope. Foundation не реализует cart, checkout, order persistence, uploads, live availability или delivery integrations. Будущая эволюция не является причиной добавлять их заранее.

## 15. WhatsApp enquiry и формы

Утверждён **frontend-only handoff**: валидная форма/CTA открывает WhatsApp с подготовленным сообщением; отправку выполняет сам пользователь. Не использовать WhatsApp API или Server Actions для фиктивной отправки и не показывать «заявка отправлена» после открытия ссылки.

Номер, реальные формы, поля, required/optional, ограничения, язык и шаблоны сообщения пока не предоставлены. Поэтому form UI, validation schema, ссылки с выдуманным номером и неиспользуемый WhatsApp helper сейчас не создаются. Когда контракт известен: semantic form, client validation, локализованные field errors и focus behavior; URL encoding/optional fields/Unicode покрыть targeted tests. Не сохранять персональные данные в analytics/localStorage или URL сайта. Содержимое handoff URL уходит во внешний сервис — включать только согласованные данные.

Weddings использует небольшой проверяемый URL helper для подтверждённой темы event/category: сохраняет существующий `text` и кодирует точную переданную тему, не придумывая полный шаблон. При `site.whatsappUrl=null` URL не создаётся, EnquiryLink возвращает disabled button с локализованным объяснением; получатель и финальный шаблон остаются release gates. Вдохновляющие фотографии не превращаются в фиктивные product links.

## 16. Responsive, accessibility и QA

Реализовывать continuous responsive CSS (Grid/Flex, fluid containers, sensible wrapping), не отдельные фиксированные сайты для ширин из макета. Обычную адаптивность решать CSS, без viewport JavaScript. Figma reference widths и промежуточные ширины проверяются в браузере после UI-реализации.

Accessibility входит в acceptance: semantic HTML, keyboard/focus, translated visible labels, доступные состояния controls и form errors; не добавлять ARIA вместо native semantics. Проверять EN/RU/SR, Cyrillic и Serbian Latin, длинные строки, overflow и изображения.

Browser suite использует production server и Chromium: locale HTML, title/noindex, шрифты, runtime errors, redirect/slash policy, реальные локализованные 404 и прямой asset URL. Home checks дополнительно проверяют EN/RU/SR на ширинах 1440/1280/1024/768/599/390/360/320, доступные размеры controls, нативную keyboard-прокрутку Mood, размеры фото и центрирование Extras. Navigation tests проверяют Escape, focus restoration, outside click и сохранение route/query/hash при смене языка. Это не замена визуальной приёмке по Figma. Unit tests проверяют routing/messages и asset integrity. TDD используется пропорционально риску: behavior/logic/utilities/regressions; не требуется для простой статической композиции или Figma styling.

## 17. SEO и deployment

Vercel project: framework **Next.js**, Node **24.x**, install `npm ci`, build `npm run build`; output directory — framework default. Root redirect обрабатывается Next config, поэтому отдельный `vercel.json` не требуется. Реального Vercel deployment в bootstrap не выполнялось; привязка проекта и production domain настраиваются владельцем.

Базовый title использует только подтверждённое название OLA Floral Studio. **Проект намеренно `noindex, nofollow`, включая production build**: главная уже реализована, но сайт ещё не принят к публикации. Перед launch: утвердить domain/content, задать metadataBase, локализованные title/description/OG, canonical/hreflang (SR Latin), sitemap реальных routes и robots policy; снять noindex только для готового production сайта и сохранить запрет индексации preview. Защиту preview не подменять robots.txt.

Не выдумывать domain, контакты, business claims, цены или JSON-LD offers. Middleware alternate links отключены в routing config: будущий SEO layer должен формировать их по реально существующему контенту, а не объявлять все будущие страницы опубликованными. Domain и WhatsApp number — будущий явный public config; секреты в repository не добавляются.

`output: export` не используется: Vercel/Next runtime поддерживает redirects и image optimization без отдельного прикладного backend. Static-only hosting потребовал бы отдельного согласования.

## 18. Следующий этап и нерешённые данные

Figma intake и implementation plan выполнены до UI. Главная и необходимые общие widgets реализованы; остальные страницы и формы не входят в завершённый Home scope. Перед переходом к каждой следующей странице повторно читать её актуальные scoped Figma sections, а не считать общий intake исчерпывающей спецификацией всех стилей.

Нужны по мере реализации: утверждённые page/catalogue translations, product slugs и реальные опции, WhatsApp номер и form contract, финальный domain/SEO content, финальная подборка изображений/прав и brand favicon/logo. Это content/release gates, а не повод строить CMS/backend или блокировать независимую frontend-работу.

`docs/architecture-readiness-review.md` — исторический review до bootstrap. При расхождении с ним приоритет у утверждённых решений и текущего README; в частности, решение о `next-intl` уже принято и реализовано.
