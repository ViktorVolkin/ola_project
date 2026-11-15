# OLA — состояние страниц и карта QA

Обновлено: **2026-11-14**. Ветка: `development`. Общий backlog: [страницы, scroll/motion и строгая финальная QA](../../ROADMAP.md).

Это единая точка входа для проверки состояния каждой страницы. Подробные исходные отчёты и неизменённые доказательства находятся по ссылкам ниже; их не следует заменять новым пересказом или суммировать пересекающиеся тестовые прогоны.

## Быстрый статус

| Страница | Route, одинаковый для EN/RU/SR | Реализация | Код / браузер / адаптив | Следующее действие |
|---|---|---|---|---|
| [Home](#home) | `/{locale}` | Frontend preview | Проверено, см. отчёты | Mood anchors подключены; release inputs |
| [About](#about) | `/{locale}/about` | Frontend preview | Проверено, см. отчёты | Release inputs |
| [Weddings & Events](#weddings--events) | `/{locale}/weddings-events` | Frontend preview + cleanup | Проверено; cleanup без пиксельных изменений | Release inputs |
| [Balloons & Gifts](#balloons--gifts) | `/{locale}/balloons` | Реализована; correction recheck принят | Figwright+hit-area snapshot24unit/88E2E; narrow static PASS с хешами | Full-page visual/release/shared-chrome gates отдельно |
| [Bouquets](#bouquets) | `/{locale}/bouquets` | Frontend preview; AWAITING REVIEW | [Integration evidence](../bouquets/integration/final-report.md), build `bxS-t3-XdQ48QF4iLPTqe` | Actual Sol Supervisor, design/release/translation/rights и P01 остаются открыты |
| [Bouquet Detail](#bouquet-detail) | `/{locale}/bouquets/{slug}` | Не реализована, 404 | Не проверено: страницы нет | Контракт compositions/slugs и отдельный intake |
| [Contact](#contact) | `/{locale}/contact` | Frontend preview реализована | Scoped technical acceptance: [Supervisor review 4 PASS](../contact/supervisor-review-4.json); FAQ pilot [PASS](../pilot/OLA-PILOT-FAQ-001/supervisor-review-1.json) | Реальные recipient и editorial/release inputs остаются открыты |
| [Новый дизайн 404](#новый-дизайн-404) | Unknown routes | UI работает с JS; SSR/no-JS blocker | Lint/types/build24unit; E2E86/92pass, gate FAILED;9captures | [Framework blocker](../not-found/ssr-blocker.md); Mobile natural flow разрешён, не объявлять complete |

**Frontend preview не означает готовность к публикации.** Рабочий WhatsApp recipient, согласованные сообщения, утверждённые RU/SR тексты, production imagery/rights, domain/SEO inputs и финальная визуальная приёмка не получены. Отсутствие реального контакта не блокирует вёрстку: enquiry controls остаются честно disabled с локализованным объяснением.

## Как читать доказательства

- Предыдущая проверенная изолированная правка: [Balloons hit-area fix](../balloons/hit-area-review.md), lint/types/build,24unit/88E2E на своём snapshot. Поздний narrow correction recheck принят после сверки двух неизменённых хешей; ранний truncated attempt не выдан за PASS. Новый404 имеет отдельный failed gate; counts на него не переносятся.

- Исторический общий gate после [явной композиции Footer/error shell](../not-found-shell/README.md): lint/typecheck/build,24unit и212project/test cases прошли в disjoint desktop106/mobile106 batches. Его source/build — в [shell manifest](../not-found-shell/rendered/manifest.json). Тогда404 был минимальным и уже без Footer; эти HTTP/JS DOM проверки не доказывали no-JS delivery. Новый UI/SSR blocker описан отдельно.

- «Проверено» ниже ссылается на реально выполненные прогоны, а не на наличие конфигурации тестов.
- Исторические отчёты Home/About содержат меньшие количества тестов и более ранние скриншоты. Для актуального адаптива использовать **responsive second pass**, для полного интеграционного gate после Weddings — её **final confirmation**, для последней правки — **Weddings cleanup**.
- Исторический полный интеграционный gate до Balloons: lint, typecheck, build, **19 unit / 174 E2E**; доказательство — [Weddings QA](../weddings/README.md), `final-confirmation.log` и source fingerprints рядом. Это не текущий прогон нового UI.
- Предыдущий cleanup Weddings: lint/typecheck/build, **19 unit / 64 релевантных E2E**, эквивалентность JS/CSS и девять pixel-identical screenshots. Его historical fingerprint относится к source до Balloons, не к текущему рабочему дереву.
- Актуальный Balloons increment: **lint/typecheck/build, 24 unit / 68 релевантных E2E PASS**, Node24.22.2; [Balloons QA](../balloons/README.md). Реальные browser checks, 75 locale/width combinations и девять captures выполнены; текущий build/source identity — в [manifest](../balloons/figwright-rendered/manifest.json). Старый 174-test gate не переносится на эту сборку и количества прогонов не складываются.
- Narrow independent correction recheck Balloons **принят**; это два source/test файла, не blanket visual/full-site verdict. Parent visual follow-up имеет собственный snapshot. Общий quality/performance/WCAG аудит и owner visual acceptance остаются отдельными gates.

## Home

### Реализация и качество кода

- Route: `/{locale}`; EN/RU/SR. Композиция — `src/components/pages/HomePage/HomePage.tsx`.
- Шесть section-owned widgets: Hero, Services, Mood, Custom/Extras, Meet, Events. Страница остаётся серверной композицией, а общие Header/Footer и language/modal behavior имеют собственные границы ответственности.
- Контент — `src/content/home.ts`; UI namespace — `src/i18n/messages/home/`; общие примитивы не ищут бизнес-переводы самостоятельно.
- [Исходный QA и code/visual review](../home/README.md): проверка spec, кода и screenshot-based visual review. Ограничения независимого доступа к live Figma явно сохранены.
- [Актуальный responsive pass](../responsive-second-pass/README.md) имеет приоритет над ранними screenshot/layout наблюдениями. Его независимое spec/quality review прошло; не требуется новый рефакторинг только ради повторной проверки.

### Дизайн, ассеты, адаптив

- Figma D/T/M: `1:22` / `55:439` / `57:3038`.
- [Asset map](../../design/home-asset-map.json): точные соответствия supplied assets; phone Weddings panorama исключение задокументировано отдельно.
- Typography, gutters и безопасные размеры fluid. Для сложных editorial overlay, tablet Services span и мобильного Mood rail сохранены осмысленные дискретные переходы; их причины перечислены в responsive-отчёте.
- Mood и Custom/Extras используют естественный reflow там, где он сохраняет композицию. Проверены промежуточные ширины и соседи breakpoint, а не только 360/768/1440.

### Поведение и проверки

- Общий header modal: focus trap/restore, scroll lock, Escape/Close/backdrop/link, закрытие при переходе к desktop navigation.
- Header/Footer language disclosure: outside click, Escape, эквивалентный route/query/hash; Mood rail доступен клавиатурой, фокус не обрезан.
- Тесты: `tests/e2e/home.spec.ts`, `responsive.spec.ts`, `typography-fluid.spec.ts`, `navigation.spec.ts`, `fonts.spec.ts`, locale/routing tests и unit contracts.
- Совместный финальный DOM/screenshot sweep Home/About: **198 locale/width случаев**, 33 ширины, без зафиксированных page errors/document overflow. Это общий результат, не 198 случаев на каждую страницу.
- Доказательства: [responsive manifest](../responsive-second-pass/after/manifest.json); [исходный Home capture manifest](../home/capture-manifest.json) — более ранний baseline.

### Незавершённое / ограничения

Mood links подключены к catalogue anchors: Soft & Romantic → Soft Romance; Bright & Joyful → Sunset; Natural & Airy → Natural & Airy. Это не product slugs. Общие release inputs остаются открыты. Owner acceptance и полноценный screen-reader/WCAG audit не заявлены.

## About

### Реализация и качество кода

- Route: `/{locale}/about`; EN/RU/SR. Композиция — `src/components/pages/AboutPage/AboutPage.tsx`.
- Шесть widgets: Hero, Story, Principles, Style, Why, CTA. Контент — `src/content/about.ts`; namespace — `src/i18n/messages/about/`.
- [Подробный About QA](../about/README.md) сохраняет первоначальные дефекты, исправления и независимые spec/visual/code verdicts. Первоначальные проблемы не следует читать как актуальные дефекты.
- [Responsive second pass](../responsive-second-pass/README.md) — актуальный источник для fluid typography, Story/Why reflow и оставшихся composition thresholds.

### Дизайн, ассеты, адаптив

- Figma D/T/M: `67:3045` / `67:3399` / `68:3655`.
- [Asset map](../../design/about-asset-map.json), [intake](../../design/about-intake.json): проверенные фотографии и supplied botanical decoration.
- Исправлены Story editorial tracks, Hero crop/fade, абзацы, Style alignment и мобильный CTA. Page-level overflow masking удалён.
- Principles сохраняет 2×2/4 grouping. Проверенный auto-fit candidate давал 3+1 на промежуточных ширинах; решение оставлено на основании браузерного эксперимента, а не привычного breakpoint.
- Story и Why частично перестраиваются intrinsically; типографика непрерывна также на бывших thresholds. Малые различия browser text flow не маскируются фиксированной высотой страницы.

### Поведение и проверки

- Native tablet context в Header, story anchor, переходы и честные enquiry controls; общие modal/language сценарии проверены.
- Тесты: `tests/e2e/about.spec.ts`, `responsive.spec.ts`, `typography-fluid.spec.ts`, `navigation.spec.ts`, `fonts.spec.ts` и общие contracts.
- [About capture manifest](../about/capture-manifest.json) — ранний исправленный baseline; более поздний адаптив — [responsive manifest](../responsive-second-pass/after/manifest.json).
- Проверено отсутствие скачков typography на reference/current/retired границах, переполнения документа и ошибок в совместном 198-case sweep.

### Незавершённое / ограничения

RU/SR и production imagery требуют утверждения, контакты не настроены. Независимое visual review было по captured references/screenshots, не собственным live Figma pixel-parity аудитом. Полная WCAG certification, все браузеры и публикация не заявлены.

## Weddings & Events

### Реализация и качество кода

- Route: `/{locale}/weddings-events`; EN/RU/SR. Композиция — `src/components/pages/WeddingsPage/WeddingsPage.tsx`.
- Шесть widgets: Hero, Categories, Approach, Process, Inspiration, CTA. Контент — `src/content/weddings.ts`; namespace — `src/i18n/messages/weddings/`.
- [Полный QA](../weddings/README.md): родительская проверка интеграции, исправления неполных результатов субагентов, scope независимых reviews и release границы.
- [Финальный cleanup](../weddings-cleanup/README.md): читаемый JSX/CSS, пояснения нетривиальных формул, без новой архитектуры и без изменения поведения. Сравнение JS/CSS и всего остального source/config подтверждает ограниченный scope.

### Дизайн, ассеты, адаптив

- Figma D/T/M: `105:2977` / `105:3329` / `106:3476`.
- [Asset map](../../design/weddings-asset-map.json), [intake](../../design/weddings-intake.json): 11 placements / 10 уникальных ассетов, сверенных с native fills.
- Hero overlay включается как смена композиции; Categories/Process/Inspiration сохраняют 1/2/4 grouping; Approach wraps intrinsically; пропорция CTA и safe dimensions fluid.
- [Последний pixel comparison](../weddings-cleanup/pixel-comparison.json): EN/RU/SR × 360/768/1440, во всех девяти кадрах одинаковые размеры и **0 changed pixels** относительно pre-cleanup final baseline.
- [Final text sweep](../weddings/final/text-overflow.json): 72 locale/width случая 320–1600px без findings; cleanup не менял CSS values/условия.

### Поведение и проверки

- Our process → `#our-process`; generic event enquiries не получают случайную категорию/сцену; category enquiry сохраняет тему. Реальный контакт отсутствует, поэтому действие честно disabled, без фиктивной отправки.
- Header context/current-page state, modal focus/scroll/Escape/dismiss/resize, locale route/query/hash preservation проверены с этой страницы.
- Тесты: `tests/e2e/weddings.spec.ts`, shared navigation/fonts/routing/locales; `tests/unit/weddings.test.ts` и `enquiry-url.test.ts`.
- Последний cleanup: 19 unit и 64 релевантных E2E, lint/typecheck/build; предыдущий полный gate — 174 E2E. Пересекающиеся прогоны не складываются.

### Незавершённое / ограничения

Recipient, approved prefill, RU/SR approval и release acceptance отсутствуют. Независимые последние reviews ограничены supplied source excerpts: это не независимый whole-page/browser/translation audit. Ноль pixel differences доказывает сохранение baseline в перечисленных состояниях, не универсальный pixel-perfect по всем браузерам.

## Balloons & Gifts

- **Статус:** IMPLEMENTED / TECHNICAL CHECKS PASS / VISUAL ACCEPTANCE PENDING. Все три locale routes возвращают HTTP200 и статически генерируются; VERIFIED/public-release не заявляется.
- **Дизайн:** D/T/M `98:2166` / `98:2496` / `98:2959`. Сохранённый [общий intake](../../design/implementation-plan.md) описывает Hero → 4 categories → 4 favourites → personalisation + 4 extras → final CTA. Favourites остаются 2×2 на mobile.
- **Ассеты:** [asset map](../../design/balloons-asset-map.json) подтверждена родителем по реальным локальным SHA-1: 15 placements, 13 уникальных sources, без unmatched; SHA-256 integrity и manifest dimensions совпали. Hero — Home01. Совпадение hash не заменяет art-directed crops.
- **Код/адаптив/интерактив:** пять server widgets, thin page/route, typed content и UI namespace. Реально проверены anchor, точные enquiry topics, честные disabled controls, modal focus/scroll/Escape/dismiss/resize и language route/query/hash preservation. 25 widths / 75 distinct locale-width combinations без overflow/clipped-copy findings. Новых client boundaries или dependencies нет.
- **Reference:** [parent-reviewed intake](../../design/balloons-intake.json) имеет приоритет над ошибочным partial child extraction. Сохранены реальные D/T/M crop geometry и исправления для tablet Favourites/extra card, Enquire fonts, Hero line breaks. Это проверка design input, не готовая браузерная страница.
- **Доказательства и дефекты:** [подробный QA](../balloons/README.md), [manifest](../balloons/rendered/manifest.json), lint/typecheck/build, 24 unit и 68 релевантных E2E. Исправлены RU320 caption overflow, неполное заполнение tablet scene из-за singleton grow<1 и compact extra caption/action composition. Все 45 EN reference photo geometries совпали в пределах1px; RU category heights могут естественно расти с длинным текстом.
- **Актуальный follow-up:** [fresh Figwright comparison](../balloons/figwright-followup.md), [новый manifest](../balloons/figwright-rendered/manifest.json). Mobile wash, compact surfaces/insets и Favourites rhythm исправлены. Снова прошли lint/typecheck/build,24 unit,68 E2E; native EN section heights защищены тестом, pointer hit-region44px проверен вне21px visual box. Независимый review в работе; shared Footer выше Figma примерно25px и остаётся в общем chrome audit. Контакты/copy approval, imagery rights и owner acceptance открыты.

## Новый дизайн 404

- Новый thin server `NotFoundPage` + `NotFoundRecovery` widget/artwork реализованы; только короткий lifecycle колец — client island. Existing Header/no-Footer composition и URL strategy не менялись. EN из дизайна, RU/SR остаются drafts.
- [Актуальная QA](../not-found/README.md): lint/types/build24unit pass;92selected E2E86passed/6failed, общий gate FAILED. Motion/preference, JS-enabled responsive/optical geometry и keyboard/Header checks прошли; no-JS не работает из-за воспроизведённого [framework blocker](../not-found/ssr-blocker.md). Два font-timeout cases отдельно прошли повторно; это не новый full-suite PASS.
- [Девять captures/source manifest](../not-found/rendered/manifest.json) и geometry: EN/RU/SR360/768/1440. D/T English boxes совпадают в пределах округления. [Mobile2line flow разрешён дизайнером](../not-found/mobile-flow-clarification.md): три строки в Figma были отдельными TEXT, не browser-constraint;25px natural height delta не дефект. Runtime не менялся. Actual glyphs проверены; independent final/owner visual gates открыты.
- [Reference/provenance](../../design/not-found-reference.json): прежние успешные native D/M reads и прямой handoff существующего designer brief/accepted Tablet snapshot. Последний plugin listing пустой; нового live Figma read или design approval не заявляли. 404 increment ещё НЕ COMPLETE.

## Bouquets

- **Текущее состояние:** `AWAITING REVIEW`, реализован frontend preview; [интеграционный отчёт](../bouquets/integration/final-report.md) и evidence относятся к build `bxS-t3-XdQ48QF4iLPTqe`. Предыдущий Figwright/intake blocker был историческим; intake завершён и native sections доступны в текущем evidence.

- **Статус:** `/{locale}/bouquets` возвращает 200 для EN/RU/SR; scoped production checks выполнены, но независимый actual Sol Supervisor и design/release approval ещё не выполнены.
- **Дизайн:** D/T/M `106:3849` / `106:4294` / `106:4757`; Hero → style selector anchors → 8 inspirations → custom CTA → seasonal tiles. Mobile catalogue остаётся двухколоночным.
- **Intake:** [implementation-ready](../../design/bouquets-intake-completion/implementation-ready.md), [crop map](../../design/bouquets-intake-completion/crop-map.json) и [native/browser captures](../bouquets/integration/final-report.md). ImageTransform не сериализован; source-coordinate recipes остаются условными, а визуальные сравнения не являются design approval.
- **Ассеты:** 12 supplied files проверены; full D/T/M sampled rendered photo/mask evidence сохранено. Image rights остаются отдельным release gate.
- **P01 OWNER HOLD:** [существующий contract](../../design/bouquets-action-contract.md) запрещает самостоятельно выбирать Detail-first/direct/hybrid для восьми карточек. Отдельное LEAD semantic decision для Home Mood: Soft & Romantic→Soft Romance, Bright & Joyful→Sunset, Natural & Airy→Natural & Airy; localized catalogue+видимый anchor, все восемь карточек видимы/no filters. Это draft inspiration labels, не sellable compositions/slugs; fragment wiring подключён к созданным targets. Повторный owner-запрос из-за этого clarification не нужен.
- **Style anchors:** дизайнер подтвердил существующее Lead association **Statement→Wild Beauty** ([contract/provenance](../../design/bouquets-action-contract.md#catalogue-style-selector--statement-target-confirmed)). Scroll/focus к видимой карточке, не фильтр и не Detail/product mapping; reduced motion, все восемь карточек в текущем порядке. При смене финальных фото association пересматривается. P01 отдельно остаётся OWNER HOLD; повторный owner-запрос из этого clarification не следует.
- **Качество/адаптив/интерактив:** lint/types/unit/build, 12 scoped E2E и 51 locale/width sweep прошли; native section/crop comparisons и ограничения — в [отчёте](../bouquets/integration/final-report.md). Без all-site PASS; известный RU 404 SSR вне scope. P01 не разрешён.

## Bouquet Detail

- **Статус:** не реализована, `/{locale}/bouquets/{slug}` пока 404. Не опубликована как карточка товара.
- **Дизайн:** D/T/M `107:5266` / `108:5654` / `113:6259`; gallery + enquiry preferences → related inspirations → custom CTA.
- **Ассеты:** bouquet-detail набор и bouquets11 указаны по ролям в общем intake; точные fills/crops предстоит проверить.
- **Зависимости:** identity/slugs/content contract композиций, смысл fullness/extras/optional enquiry fields и связь с каталогом. Цены, stock, checkout и persistent cart не подразумеваются дизайном/общим разрешением.
- **Качество/адаптив/интерактив:** not tested — страницы и gallery/preferences реализации нет. После согласования контракта проверить gallery keyboard/focus, выбранные preferences, locale identity preservation, unknown slug real404 и user-initiated enquiry без автоматической отправки.

## Contact

- **Статус:** frontend preview реализована для `/{locale}/contact` (EN/RU/SR); это не 404. Техническая приёмка собранного preview — scoped [Supervisor review 4 PASS](../contact/supervisor-review-4.json), R1–R6 разрешены в указанном review scope; отдельное FAQ keyboard enhancement прошло [pilot review 1 PASS](../pilot/OLA-PILOT-FAQ-001/supervisor-review-1.json). Эти два verdict относятся к разным scope и не суммируются в общий сайт/публикационный PASS.
- **Дизайн:** D/T/M `119:4999` / `119:5396` / `119:5796`; Hero → Montenegro/location/date → 3 topics → process/photo/FAQ.
- **Ассеты:** CT02 crop margins были independently recomputed в scoped review; CT03 inputs/crop recipe не менялись. CT01 inner crop остаётся неизвестным. Rights/production imagery approval открыты; см. ограничения review 4.
- **Открыто:** реальный recipient, EN/RU бизнес/editorial approval, права на изображения, CT01 inner crop, owner design/release approval. Recipient остаётся отключён; формы/backend/fake contacts не добавлены. Не изобретать адрес, телефон, график, delivery terms, form endpoint или отправку данных.
- **Качество/адаптив/интерактив:** технический scope подтверждён указанными review receipts; это не новый прогон и не полное покрытие всех сетевых/визуальных/релизных требований. FAQ pilot — отдельное улучшение клавиатуры. Границы и остаточные ограничения см. в receipts и [Contact report](../contact/report.md).

## Общий completion gate для каждой новой страницы

1. До кода: полный D/T/M scoped intake, assets/fills, точные EN тексты, interaction contract и список pending product decisions; сохранить plan/asset map.
2. Реализация: `app → pages → widgets → shared`, server по умолчанию; typed content и semantic-owner translations; без конкурирующих примитивов, новых крупных систем и speculative UI.
3. Parent code review всей страницы и затронутых общих компонентов: зависимости, ненужный client JS, CSS Modules, duplication/readability, accessibility и подозрительные/устаревшие решения. Независимый review со сформулированным scope и ограничениями.
4. Lint, typecheck, unit, production build, релевантные E2E и affected-page regressions. После последних исправлений повторить затронутые проверки; не переносить verdict со старой сборки на новую без основания.
5. Production browser EN/RU/SR: reference 360/768/1440, узкие/широкие и промежуточные widths, breakpoint neighbours; actual font glyphs, text/image bounds, crops, wrap, focus и runtime errors.
6. С этой страницы открыть header modal, language disclosure, проверить scroll/focus/Escape/dismiss/resize; проверить весь page-local interactive behavior, anchors и destinations.
7. Visual QA против текущего authoritative Figma; сохранять locale/viewport/build/source provenance. Screenshot pass, code review и owner approval — разные статусы.
8. Обновить этот реестр и page-specific MD: что сделано, источники, changed files, команды/результаты, defects/fixes, screenshots/manifests, review limitations, blockers и release inputs. Не объявлять ещё не реализованные страницы проверенными.

Источники структуры: [README проекта](../../../README.md), [общий design intake](../../design/implementation-plan.md). В этот проход приложение не изменялось, новые прогоны QA не фабриковались; архивные результаты сохранены с их границами применимости.
