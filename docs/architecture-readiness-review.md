# OLA — architecture/readiness review

> Исторический review до foundation/bootstrap. После него владелец утвердил `next-intl`, EN default, SR Latin, locale-prefixed URLs, общие slugs, отсутствие trailing slash и Vercel deployment. Текущее реализованное состояние и команды описаны в `README.md`; первоначальные рекомендации ниже сохранены как контекст, а не действующие альтернативы.

## Статус и границы проверки

Проверена текущая рабочая копия проекта, а не только staged README. Ветка: `development`. В контейнере репозиторий доступен как `/workspace`, соответствующий предоставленному `/home/viktor/Projects/ola_project`.

Изучены README, все существующие исходники приложения и конфигурации, package manifest/lockfile, Git-состояние, ASSETS.md и asset manifest. Выполнена файловая инвентаризация design package без визуального анализа reference renders. Для решений Next.js использована документация установленного пакета `node_modules/next/dist/docs/`.

Figma не открывалась. Страницы, UI, конфигурация и зависимости не изменялись. Этот документ — рекомендации, не утверждение новых продуктовых требований.

**Вывод:** исходный Next.js scaffold технически работоспособен. Архитектурное направление подходит задаче. Перед реализацией страниц требуется зафиксировать небольшой набор решений и выполнить отдельный foundation/bootstrap этап. Новый framework, CMS, backend, database, auth, payments или global state не нужны.

## 1. Что определено и что действительно существует

### Определено документацией

- Next.js App Router + TypeScript.
- Иерархия ответственности `app → components/pages → components/widgets → components/shared`.
- Тонкие routes; page composition отделена от routing.
- Локали EN/RU/SR и locale-prefixed URLs.
- Предварительный набор страниц: Home, Bouquets, Bouquet Detail, Balloons, Weddings & Events, About, Contact.
- Раздельные `content/` и `i18n/messages/`.
- Server Components по умолчанию, узкие client boundaries.
- Frontend с WhatsApp enquiry, без отдельного прикладного backend в текущей версии.
- Палитра и названия шрифтов как документированные ориентиры; визуальные параметры ещё предстоит проверить по Figma на следующем этапе.

### Фактическая реализация

- Есть только root `app/` со стандартной стартовой страницей Next.js.
- Нет `src/`, локализованных routes, компонентов OLA, content layer или системы переводов.
- `@/*` указывает на корень репозитория, а не `src`.
- В root layout статический `lang="en"`, Geist/Geist Mono и template metadata.
- В CSS есть template dark mode и Arial. Это не реализация дизайн-системы OLA.
- `public/` пуст; стартовая страница ссылается на отсутствующие `/next.svg` и `/vercel.svg`. Сборка не проверяет существование таких URL.
- Design package находится в `ola_dev_design/`, а не в root `assets/`/`references/`; весь пакет исключён из Git.
- Test runner, CI, typecheck script, runtime pin и deployment documentation отсутствуют.

## 2. Достаточность README

| Область | Оценка | Что требуется уточнить |
| --- | --- | --- |
| Scope | Частично | Превратить общую границу системы в явный v1 in/out scope; определить допустимые catalogue interactions, а не считать их автоматически включёнными. |
| Routes | Частично | Дерево приведено как пример, не как утверждённая таблица; отсутствуют правила `/`, invalid locale/slug, slash policy и product slugs. |
| `app → pages → widgets → shared` | В основном достаточно | Уточнить разрешённые пропуски уровней, владение Header/Footer и page-specific sections. |
| Структура `src` | Частично | Это план, не существующая структура; описать миграцию root app, alias и физические пути. |
| EN/RU/SR | Частично | Нет default locale, SR script, dictionary loader, missing-translation policy и поведения language switcher. |
| UI vs content | В основном достаточно | Нет контракта локализованного content, стабильных ID/slug, metadata/alt и ответственности за переводы. |
| Server/client | В основном достаточно | Уточнить передачу locale/messages через client boundaries и запрет загрузки всего каталога/всех словарей в browser bundle. |
| Responsive | Недостаточно | Есть только слово responsive; нужны continuous layout, CSS-first, промежуточные ширины и критерии проверки. |
| SEO | Частично | Перечислена ответственность routes, но отсутствуют metadata/content contract, sitemap, robots, canonical policy и preview indexing. |
| WhatsApp enquiry | Недостаточно | Нет номера, состава заявки, шаблонов, поведения CTA и различия между открытием WhatsApp и отправкой сообщения. |
| Формы и валидация | Недостаточно | Нет перечня форм/полей, required/optional, limits, ошибок и destination. |
| Testing/QA | Не описано | Нужны команды, минимальный набор automated checks и manual acceptance. |
| Deployment | Не описано | Нужны runtime/hosting model, configuration contract и build/release workflow. |
| Ограничения v1 | Частично | Отсутствие backend указано; нет явного исключения cart, checkout, order tracking, uploads, persistence и delivery integrations. Эти исключения предлагаются к подтверждению. |

## 3. Технический фундамент и риски

### Stack

Установлены Next.js 16.4.3, React/React DOM 19.3.0, TypeScript 5.9.3, ESLint 9.39.5 и Tailwind CSS 4.3.3. `npm ls --depth=0` завершился успешно; scaffold собирается. Нет оснований менять основной stack.

Tailwind подключён через существующий `@tailwindcss/turbopack` loader. Это реально работающая конфигурация; не следует объявлять её сломанной или добавлять PostCSS-пакеты только по привычке. Рекомендация: сохранить Tailwind 4 и этот pipeline для первого bootstrap; определить CSS custom properties как единый источник design tokens. CSS Modules допустимы для сложных локальных стилей, но не должны создавать вторую систему токенов.

### Приоритетные несоответствия

1. **README vs filesystem.** При переходе на `src/app` необходимо переместить, а не продублировать root `app`. Согласно локальной документации Next.js наличие root `app` приводит к игнорированию `src/app`. Alias следует изменить на `@/* → ./src/*` в том же шаге.
2. **Необоснованные rendering flags.** Включены `cacheComponents`, `partialPrefetching`, экспериментальный `agentFeedback`. Они не ломают текущую сборку, но README их не объясняет. Cache Components меняет правила rendering/caching и route segment configuration; это не просто ускоряющий переключатель. Для локального статического контента рекомендую убрать opt-in rendering flags на bootstrap, если нет конкретного требования их сохранить. `agentFeedback` отдельно оценить как dev tooling, не как продуктовую зависимость.
3. **Runtime не закреплён.** Проверки выполнены на Node 26.11.1 / npm 11.20.0. Установленный Next.js требует Node >=20.9.0; это нижняя граница, не рекомендация выбрать старейшую версию. Выбрать поддерживаемую целевой платформой LTS-линию Node, закрепить её в runtime file/package engines и использовать ту же линию в CI. После выбора повторить `npm ci`, lint, typecheck и build. Сейчас совместимость подтверждена только для проверенного контейнера.
4. **Ассеты не воспроизводятся из checkout.** `.gitignore:42` исключает `ola_dev_design`. Чистый clone не получит изображения. До UI-разработки выбрать tracked runtime assets и отдельно хранить тяжёлые reference renders.
5. **Template defaults не являются требованиями OLA.** Фиксированный английский `lang`, Geist, starter metadata, dark mode и framework logos необходимо убрать/заменить в разрешённом bootstrap/design этапе. Не создавать отдельную dark theme без утверждённого дизайна.
6. **Размещение общего chrome неоднозначно.** README показывает Header/Footer в HomePage. Если они общие для всех routes, их лучше собирать в locale layout, не повторять на каждой странице. Page-specific варианты допустимы по реальному дизайну.
7. **Общие `lib`/`types` рискуют стать свалкой.** Определить независимую инфраструктуру и domain types; локальные типы оставлять рядом с владельцем. Не создавать пустые абстракции «на вырост».

### Состояние Git

До review уже существовали staged scaffold-файлы, изменённый README и staged-but-deleted `AGENTS.md`. Индекс содержит инструкции Next.js, а в working tree этот файл отсутствует. Существующие изменения не восстановлены, не staged и не закоммичены. Владельцу следует осознанно решить судьбу AGENTS.md; это не разрешение автоматически отменять удаление.

## 4. Ассеты: уточнённый статус

**Уточнение владельца:** supplied images — рабочие мокапы, приближённые к реальным. Большинство, вероятно, будет заменено; часть может остаться.

Это **не блокер frontend-разработки**. Не нужно заменять их stock/generated imagery или ждать окончательной фотосъёмки для начала работы.

Проверены все 82 записи manifest: наличие файлов, byte size и SHA-256 совпадают. Это 73 JPG, 8 SVG и 1 PNG. Такая проверка подтверждает целостность поставки, но не права, финальность изображений, полноту всех будущих страниц или соответствие Figma.

Рекомендации:

- Исправить в README формулировку «все production assets»: это supplied working/mock assets с возможной последующей заменой.
- Разместить используемые runtime images/icons/decorative files под `public/assets/` и включить их в Git. Не копировать reference renders в публичную поставку.
- Хранить mapping asset paths, dimensions, alt и при необходимости focal point в content records, а не разбрасывать пути по JSX.
- Сохранять стабильные semantic IDs контента при замене изображений. У новых файлов обновлять dimensions/manifest; при cache-sensitive замене использовать новое имя/versioned URL.
- Встроенный в фотографию текст не считать переводом или подтверждённым продуктовым обещанием.
- Перед публикацией отдельно подтвердить финальную подборку и права. Проверить пригодность используемых шрифтов/логотипа и нужных glyphs; наличие только названий шрифтов не подтверждает комплектность brand assets.

## 5. Решения перед разработкой: рекомендуемый минимальный вариант

Все варианты ниже — предложения до подтверждения, а не скрыто принятые продуктовые решения.

### 5.1 Routing и локали

- Подтвердить routes: `/{locale}`, `/{locale}/bouquets`, `/{locale}/bouquets/{slug}`, `/{locale}/balloons`, `/{locale}/weddings-events`, `/{locale}/about`, `/{locale}/contact`.
- Оставить segments и product slugs одинаковыми для всех локалей; переводы titles не должны менять identity записи. Если нужны localized slugs, решить до наполнения каталога.
- Рекомендую `/ → /en` без browser language detection и cookies для v1; default EN требует подтверждения владельца.
- Рекомендую стандартные URL без trailing slash, согласованные links/canonical/sitemap. Сейчас README показывает URL со slash, а Next config не включает `trailingSlash: true` — определить единую policy.
- Неизвестные locale и slug возвращают реальный 404, а не Home/English с HTTP 200.
- Language switcher сохраняет route и идентичность букета. Для отсутствующей локализации не вести молча на другой товар.
- Подтвердить **SR Latin**; URL может остаться `/sr`, а языковые теги документа/SEO отражать `sr-Latn` после подтверждения. Не смешивать Latin и Cyrillic переводы.

### 5.2 Internationalization

Для текущих трёх локалей и небольшого frontend рекомендую typed JSON dictionaries и небольшой server-side loader без дополнительного i18n framework. Это соответствует паттерну документации установленного Next.js.

- `i18n/config.ts`: список locale, validation и default locale.
- `i18n/messages/{en,ru,sr}.json`: namespaces navigation/footer/forms/common и page-specific UI по необходимости.
- `i18n/server.ts`: server-only загрузка словаря нужной локали; type-safe интерфейс получения namespace.
- Pages владеют своим content/UI смыслом; widgets получают свой namespace самостоятельно на server стороне или через ближайшую server wrapper.
- Generic shared Button/Input не обращаются к словарям и не знают бизнес-контент.
- Client island получает только сериализуемые данные и нужные labels/errors, а не все словари и content layer.
- `locale` можно передавать явно; это не означает прокидывать каждую строку с route root через всё дерево.
- Missing keys/required translations должны обнаруживаться проверкой до release. Не скрывать отсутствующий перевод автоматическим English fallback на production.

`next-intl` не требуется автоматически. Пересмотреть это решение до bootstrap только если нужны ICU-heavy messages, более сложное форматирование или иные подтверждённые возможности. Сам факт нескольких языков не требует тяжёлого framework.

### 5.3 Content contract

Рекомендую локальные typed TypeScript records, без CMS adapter/repository architecture.

Минимальное направление модели: стабильные `id`/`slug`, общие image/category/featured поля и явные localized records для title/description/alt/SEO. Точный набор полей определяется утверждённым контентом и интерфейсом, не примером из README.

- Локализованный контент страницы и catalogue copy лежат в `content/`, короткие UI labels/errors — в `i18n/messages/`.
- Route-level данные разрешаются в app; page-specific composition не должна повторять URL parsing.
- Не добавлять обязательные price/availability/delivery guarantees, пока они не подтверждены.
- Не считать размеры/дополнения из названий изображений доказательством реальных selectable product options.
- Missing content отмечать явно, не генерировать неизвестные переводы, business claims и контактные данные.

### 5.4 WhatsApp и формы — главное продуктовое уточнение

Рекомендую единый frontend-only handoff: после валидного ввода построить `https://wa.me/<international-digits>?text=<encoded-message>`. Пользователь сам отправляет сообщение в WhatsApp. Не использовать WhatsApp API, Server Actions или email service без отдельного требования.

До реализации согласовать:

- Реальный номер получателя и общий контактный CTA.
- Какие формы реально существуют: general enquiry, bouquet enquiry, events enquiry и т. п.
- Для каждой формы: fields, required/optional, длины, допустимые значения и утверждённые error messages.
- Язык и шаблон сообщения, включение product ID/title/link и подтверждённых выбранных опций.
- Семантику dates: пожелание клиента, а не проверка доступности/обещание доставки.
- Поведение при недоступном WhatsApp и нужно ли сохранение введённого текста при смене языка. Рекомендую не вводить persistence в v1.

Инженерная база: native semantic forms + небольшая client validation; field errors связаны с inputs, доступный focus/error summary по сложности формы. React Hook Form/Zod пока не нужны без реальной сложности схем.

Чистую функцию message/link builder покрыть тестами Unicode, line breaks, `&`, `+`, URL encoding и отсутствующих optional fields. Не вставлять выдуманный номер. Не показывать «заявка отправлена»: приложение не знает, отправлено ли сообщение. Не отправлять персональные данные в аналитику, не сохранять в localStorage/URL самого сайта. Предупредить, что данные переходят во внешний WhatsApp URL; состав сведений должен быть минимальным.

### 5.5 Rendering и deployment

Рекомендую обычный Next deployment с поддержкой Node runtime (managed Next platform либо Node host), но с prerendering локального контента. Server Components и framework image optimization **не означают отдельный бизнес-backend**.

- Locale и известные catalogue slugs генерировать через `generateStaticParams` в соответствии с выбранным rendering mode.
- Предпочитать build-time/static output routes без ненужных cookies/headers/runtime personalization.
- Не включать `output: export` до подтверждения static-only hosting. Этот вариант меняет работу redirects и стандартной image optimization; его можно выбрать, но это отдельное инфраструктурное решение.
- Конкретный provider, домен и конфигурацию production/preview нужно подтвердить; Vercel не является автоматически утверждённым требованием.
- Публичный site origin должен быть явной конфигурацией для metadata и абсолютных ссылок. WhatsApp number — публичный business config, не secret.
- Документировать конфигурационный пример без реальных credentials; сейчас `.env*` игнорируется целиком, поэтому для `.env.example` потребуется явное исключение, если выбран такой способ документации.

### 5.6 Layout и зависимости

Рекомендую locale root layout `src/app/[locale]/layout.tsx`, владеющий `<html lang>` и общим Header/Footer. Root `/` redirect можно описать в Next config при рекомендованном Node deployment, без создания второй HomePage. Не оставлять поверх этого фиксированный English root layout; глобальный fallback 404 и его HTML/language handling проверить отдельно на bootstrap.

Иерархия — порядок ответственности, а не требование импортировать только ближайший уровень. `app → widgets` для общего chrome и `pages → shared` допустимы. Обратные импорты запрещены.

- Widgets не импортируют route files/page components.
- `lib`, `i18n`, `content`, `types` — supporting modules с явными владельцами, не дополнительные UI-слои.
- Shared UI может использовать нейтральный URL/link utility, но не должен загружать catalogue/business translations.
- Page-specific section остаётся рядом с page; widget выделяется при самостоятельной ответственности/переиспользовании, не только для сокращения файла.

### 5.7 Responsive, accessibility, SEO и QA

- Continuous responsive CSS, fluid containers/Grid/Flex, разумные wrapping/crops; breakpoints по реальной композиции, не только по названиям устройств.
- Figma reference widths будут критериями сравнения на следующем этапе, но не единственными поддерживаемыми ширинами. JavaScript viewport detection не нужен для обычного layout.
- Semantic HTML, keyboard navigation/focus, accessible mobile navigation, translated labels/errors и reduced motion там, где появится анимация.
- Metadata локализуется вместе с content: title/description, canonical, available locale alternates, Open Graph; `metadataBase` из утверждённого origin.
- Sitemap содержит только реальные опубликованные locale/slug пары; robots и preview noindex согласованы с deployment. Защиту preview не подменять только robots.txt.
- Не выдумывать Product offers/prices/availability/LocalBusiness facts ради JSON-LD. Structured data добавлять только на подтверждённых данных.
- Минимальные gates: lint, отдельный typecheck, production build, targeted unit tests для locale/routes/WhatsApp/content completeness и browser smoke для locales/navigation/forms/404.
- Рекомендую Vitest для pure utilities и Playwright для небольшого e2e smoke; пока это только предложение, пакеты не установлены. Не покрывать screenshot snapshots нестабильный mock content до появления утверждённого baseline.
- Manual QA: approved reference widths + intermediate widths, EN/RU/SR, Cyrillic и Serbian Latin glyphs, keyboard, overflow, image loading/crops, runtime console, metadata/alternate links, handoff без реальной отправки заявки.

## 6. Рекомендуемая структура

Создавать каталоги по мере появления реальных файлов, не генерировать пустой каркас из всех возможных widgets.

```text
/
├── README.md
├── docs/
│   └── architecture-readiness-review.md
├── public/
│   └── assets/
│       ├── images/
│       ├── icons/
│       └── decorative/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── bouquets/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── balloons/page.tsx
│   │   │   ├── weddings-events/page.tsx
│   │   │   ├── about/page.tsx
│   │   │   ├── contact/page.tsx
│   │   │   └── not-found.tsx
│   │   ├── sitemap.ts
│   │   └── robots.ts
│   ├── components/
│   │   ├── pages/        # page compositions + local sections
│   │   ├── widgets/      # substantial interface blocks
│   │   └── shared/       # generic UI primitives
│   ├── content/
│   │   ├── bouquets/    # records + localized content
│   │   ├── pages/
│   │   └── site.ts      # confirmed business facts/contacts
│   ├── i18n/
│   │   ├── config.ts
│   │   ├── server.ts
│   │   └── messages/{en,ru,sr}.json
│   ├── lib/
│   │   ├── routes/
│   │   ├── seo/
│   │   └── whatsapp/
│   ├── styles/          # global CSS + token definitions
│   └── types/           # genuinely cross-layer domain types only
├── tests/
│   └── e2e/
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
└── eslint.config.mjs
```

Unit tests допускаются рядом с pure modules. Reference renders/исходный design package — отдельный непубличный input; README должен объяснять способ их получения. `src/pages` не создавать: это специальный каталог другого router, а page composition живёт в `src/components/pages`.

Дерево показывает целевую структуру после реализации, не требование создавать страницы на readiness этапе. Глобальный 404, icons/metadata conventions и font files добавить при необходимости выбранного bootstrap/design решения.

## 7. Последовательность bootstrap/setup

1. **Зафиксировать контракт README.** Подтвердить routes, EN default, SR Latin, slugs/slash policy, hosting model и frontend-only WhatsApp; явно отделить confirmed requirements от pending content.
2. **Обеспечить воспроизводимость.** Выбрать runtime, закрепить Node/package-manager line, сохранить lockfile; проверить clean install в отдельном чистом checkout/CI. Перенести только нужные runtime assets в tracked public directory, описать mock status и источник references.
3. **Мигрировать структуру.** Однократно переместить root app в src/app, обновить alias, перенести global styles. Не держать оба app. Не добавлять fake UI.
4. **Упростить конфигурацию.** Принять решение о rendering flags, сохранить рабочий Tailwind pipeline; добавить explicit typecheck script и базовые scripts тестов при установке согласованных test tools.
5. **Установить locale/routing foundation.** Validator, dictionaries, localized root document, redirects/404, route builders и сохранение route при switch. Проверить route skeleton без самовольного дизайна страниц.
6. **Установить content/SEO contracts.** Typed records/loaders, translation completeness, image mapping и metadata helpers, origin configuration. Не наполнять фиктивными товарами и business facts.
7. **Установить enquiry contract.** Согласованные поля и templates; pure WhatsApp builder + tests. Form UI — только после изучения утверждённого дизайна.
8. **Добавить quality gates.** lint/typecheck/build/unit/e2e smoke в CI; production/preview configuration и noindex policy. Согласовать deployment target без фактической публикации по умолчанию.
9. **Пройти foundation acceptance.** Clean install/build на выбранном runtime, корректные supported/invalid URLs и language attributes, assets доступны после clone, tests проходят, отсутствуют неожиданные client-wide imports. Не выдавать scaffold build за проверку будущих страниц.
10. **Перейти к Figma.** После отдельного разрешения изучить целиком relevant pages, responsive states, components и assets; затем реализовывать страницы с visual/language/accessibility QA.

## 8. Что изменить в README

Не переписывать удачное описание слоёв. Добавить/уточнить:

1. Короткие v1 scope / non-goals и текущий implementation status.
2. Утверждённую route table и locale/slug/redirect/404/slash policies.
3. Реальные пути src/public/design input и порядок миграции scaffold.
4. Translation ownership, SR script, content schema и missing translation policy.
5. Layout ownership, допустимые dependency directions, client serialization boundaries.
6. Выбранный CSS/runtime/rendering stack и обоснование нестандартных flags либо их удаление.
7. WhatsApp flow и form contract с отдельным списком пока неизвестных бизнес-данных.
8. SEO, responsive/accessibility acceptance и QA commands.
9. Installation, configuration, tests, preview/production deployment и ограничения static export.
10. Mock-assets status: можно использовать сейчас, большинство заменится, часть может остаться; финальная публикация требует отдельного подтверждения.

README намеренно не изменён в этом review: рекомендуемые варианты ещё не утверждены владельцем.

## 9. Реальные проверки и ограничения результата

Выполнены успешно:

- `git branch --show-current`: `development` (через per-command safe.directory для container mount, без изменения global Git config).
- `npm ls --depth=0`: установленные top-level dependencies согласованы.
- `npm run lint`: exit 0.
- `npm run build`: exit 0; TypeScript проверен сборкой, prerendered routes только `/` и `/_not-found`.
- `node node_modules/typescript/bin/tsc --noEmit --incremental false`: exit 0.
- `git diff --check` и `git diff --cached --check`: exit 0 на исходном состоянии.
- Asset manifest: 82 записи, все файлы/размеры/SHA-256 совпадают.

Не выполнялись: `npm ci`/clean-room install, security advisory audit, deployment, browser/visual QA, реальные WhatsApp отправки или проверка соответствия Figma. Текущий build не доказывает готовность локализации/форм/SEO: их ещё нет.

## Итоговое решение о готовности

- **К architecture approval и foundation/bootstrap: готов.** Существующий stack менять не требуется.
- **К немедленной реализации страниц без уточнений: не полностью готов.** Сначала подтвердить locale/routing, минимальный i18n/content approach, hosting/rendering и модель WhatsApp enquiry; затем выполнить foundation setup.
- **К реализации по Figma после этих шагов: да.** Mock imagery не блокирует разработку. Окончательные фотографии, тексты, контакты, метаданные и подтверждение прав — отдельные content/release gates; отсутствие отдельных данных не должно блокировать независимые части работы.
