# OLA — план разработки и финальной приёмки

Обновлено: **2026-11-14**. Рабочая ветка: `development`.

Это рабочий backlog по поручению владельца: закончить все страницы, добавить Lenis и кастомный scrollbar, добавить Framer Motion для интерактивных блоков, провести строгий аудит кода/a11y/адаптива/скорости. Здесь отмечаются только фактически выполненные задачи. Подробное состояние каждой страницы и ссылки на доказательства — в [реестре страниц](qa/pages/README.md).

## Принципы и порядок

- Сохранять `app → pages → widgets → shared`, TypeScript strict, CSS Modules, EN/RU/SR и текущие approved Figma references. Не строить новые архитектурные системы ради анимации.
- **Server-first:** страницы, контент, статические секции и изображения остаются серверными. Клиентский код — только для фактического интерактива, scroll lifecycle и нужных motion boundaries. Передача server-rendered children в узкий client wrapper сама по себе не требует превращать их в client components.
- Делать a11y/code/responsive QA при завершении каждой страницы, а не откладывать все дефекты до последнего этапа. Затем провести отдельный общий жёсткий аудит.
- Lenis и Framer Motion разрешены владельцем как отдельные этапы. Сейчас они не установлены; перед добавлением проверить актуальные официальные API, совместимость с React/Next и обоснованность каждого client boundary.
- Порядок: страницы и их QA → baseline скорости → Lenis/scrollbar → state-driven motion → повторные измерения и финальное ревью. При доработке отдельных страниц исправлять понятные локальные дефекты сразу; не подменять эту работу масштабным рефакторингом.
- Не менять модель/провайдера, конфигурацию безопасности или major architecture ради обхода проблем. Открытые продуктовые вопросы отмечать явно, продолжая независимую работу.

## 0. Рабочая среда и доказательства

- [x] Проверить восстановление parent terminal/read/write/patch/search/execute инструментов реальными вызовами; временный smoke-файл удалён, приложение не изменялось.
- [x] Проверить запуск Node **24.22.2** из `.nvmrc` с npm **11.20.0** без изменения project engines: `npm exec --yes --package=node@24.22.2 -- sh -c 'node --version && npm run lint && npm run typecheck && npm test'` прошёл, включая 19 unit checks. Глобально активен Node26.11.1; для последующих build/test использовать pinned runtime, а не полагаться на глобальный PATH.
- [x] После паузы перепроверить текущие исходники, supplied assets и partial intake: source preservation check прошёл; ошибочный child extraction помечен superseded, принят parent-reviewed intake. Это не новая UI/browser приёмка.
- [ ] Каждый новый gate связывать с версией source/build, locale/viewport, реальными командами и результатами. Не переносить PASS со старой сборки на изменённый код без проверки.

## 1. Создать все страницы

### Уже реализованные technical frontend previews

- [x] Home — `/{locale}`.
- [x] About — `/{locale}/about`.
- [x] Weddings & Events — `/{locale}/weddings-events`, включая проверенный readability cleanup.

Эти отметки означают реализацию и ранее выполненную техническую QA, **не public-release/owner acceptance**. Их регрессии обязательно включать в общий gate после shared-изменений.

### Следующие страницы

- [ ] **Balloons & Gifts** — `/{locale}/balloons`.
  - [x] Принять D/T/M design intake: `balloons-intake.json`; partial `balloons-responsive-intake.json` помечен superseded. Браузерные layout/overflow checks выполнены; полная визуальная приёмка открыта.
  - [x] Сверить native image hashes с supplied локальными файлами: 15 placements / 13 уникальных sources, SHA-1, SHA-256 integrity и manifest dimensions совпали. `balloons-asset-map.json` и 45 reference crop records сохранены; все 45 EN photo geometries проверены в production browser в пределах1px, включая Teddy bears/tablet favourites/крупные сцены.
  - [x] Реализовать пять содержательных секций: Hero, Categories, Favourites, Personalisation/Extras, Final CTA. Не создавать шестую секцию только по аналогии с Weddings.
  - [x] Сохранить подтверждённый action contract: Hero → локальный Favourites anchor; categories/favourites/extras → enquiries с правильной темой; общие CTA не получают случайный favourite.
  - [x] Тонкий route/page, section-owned widgets, typed content, EN/RU/SR, отсутствие ложных SKU/наличия/цен.
  - [ ] Code review, production browser QA, релевантные тесты, screenshot/overflow evidence, отдельный page MD.
    - [Свежий Figwright follow-up](qa/balloons/figwright-followup.md): mobile wash, compact card surfaces/insets и native Favourites rhythm исправлены; lint/typecheck/build,24 unit,68 релевантных E2E прошли заново.75 locale/width combinations и новые captures сохранены. Независимое review в работе; общие release inputs и site-wide shared-chrome review открыты. Не выдавать прошлый MCP quota за текущий blocker.
- [ ] **Bouquets** — `/{locale}/bouquets`.
  - [Текущее состояние](qa/pages/README.md#bouquets): frontend preview `AWAITING REVIEW`; build `bxS-t3-XdQ48QF4iLPTqe`, [evidence и ограничения](qa/bouquets/integration/final-report.md). Actual Sol Supervisor ещё не выполнен.
  - [x] Scoped intake, asset map, style/composition anchors и двухколоночный mobile catalogue.
  - [x] Preview восьми held controls с локализованной причиной; P01 OWNER HOLD не разрешён.
  - [x] Подключить подтверждённые соответствия Home Mood к реальным anchors без detail slugs.
  - [ ] Независимый actual Supervisor и отдельные design/rights/translation/release решения.
- [ ] **Bouquet Detail** — `/{locale}/bouquets/{slug}`.
  - [ ] Зафиксировать identity/slug/content contract до реализации product routes.
  - [ ] Gallery, enquiry preferences/extras и related compositions по актуальному дизайну; не вводить ecommerce/cart/checkout.
  - [ ] Проверить keyboard/focus, сохранение locale identity и настоящий HTTP404 неизвестного slug.
  - [ ] EN/RU/SR, browser/code/visual QA и page MD.
- [x] **Contact technical frontend preview** — `/{locale}/contact` (EN/RU/SR); это не 404 и не public-release acceptance.
  - [x] Scoped technical acceptance: [actual Supervisor review 4 PASS](qa/contact/supervisor-review-4.json), с R1–R6 разрешёнными в пределах receipts. Отдельное FAQ keyboard pilot: [review 1 PASS](qa/pilot/OLA-PILOT-FAQ-001/supervisor-review-1.json). Это разные scopes, не суммарный сайт PASS и не новый QA run.
  - [ ] Реальный recipient, EN/RU business/editorial approval, CT01 inner crop, image rights, owner design/release acceptance. Не выдумывать контакты/условия; recipient отключён, fake contacts/backend/form submission отсутствуют. Подробные ограничения — [реестр Contact](qa/pages/README.md#contact) и receipts.
- [ ] **Обновить 404 по новому дизайну Figma** — отдельный следующий increment, не прерывая текущую Balloons реализацию.
  - [Актуальная QA](qa/not-found/README.md): UI/кольца/EN/RU/SR реализованы, lint/types/build24unit pass;92selected E2E86passed/6failed, gate FAILED.9captures сохранены. [Блокер Next16.4.3](qa/not-found/ssr-blocker.md): настоящий404, но no-JS не работает. Native guard spike проверен и отклонён: локализованный shell не сохраняется. [Mobile natural flow разрешён](qa/not-found/mobile-flow-clarification.md), source не менялся. Не менять routing/framework ради обхода без нужного решения.
  - [x] Подготовить явную no-Footer композицию404 без сменыURL/global CSS/client pathname: normal routes сохраняют Footer; localized404 без него. [Историческая shell QA](qa/not-found-shell/README.md):24unit/212E2E и принятое static review10hashes относятся к тому snapshot, а не к новому UI/no-JS.
  - [x] Принять core D/T/M input: прежние successful native reads + designer brief/accepted Tablet handoff, [provenance](design/not-found-reference.json). Mobile body ambiguity закрыта прямым designer clarification:2natural lines допустимы, spacer/break/max-width218 не нужны. Нового live-read/owner visual acceptance не заявляли.
  - [x] Реализовать разрешённое one-shot outward ring intro: CSS3950ms со stagger, lifecycle4000ms; только scale/opacity колец, затем static. Actual JS-enabled motion/preference checks прошли. Это не infinite radar или owner visual acceptance.
  - [x] Сохранить server-component page/artwork и узкий client lifecycle без новой библиотеки. Это архитектура исходников, не доказательство успешной SSR-доставки404: actual framework blocker выше остаётся открытым.
  - [ ] `prefers-reduced-motion` — без radar motion, со статичным осмысленным fallback; проверить доступную остановку/скрытие несущественного auto-motion, если она требуется по фактическому поведению и WCAG. Не допускать вспышек, layout shift или перехвата pointer/focus декоративными волнами.
  - [ ] Не сломать реальный HTTP404, unknown locale/route/slug behavior и locale ownership. Отдельно определить по дизайну scope локализованного и framework fallback, а не менять routing strategy попутно.
  - [ ] EN/RU/SR, mobile/tablet/desktop и intermediate widths, keyboard/focus, reduced motion, animation performance и production HTTP tests; сохранить отдельный 404 QA MD и добавить в реестр страниц.

### Gate каждой страницы

- [ ] Полный parent review страницы и затронутых shared-зависимостей; независимый review с указанным scope.
- [ ] Lint, typecheck, unit, production build, релевантные E2E и affected-page regressions после последней правки.
- [ ] 360/768/1440 как контрольные состояния, узкие/широкие и промежуточные widths, immediate breakpoint neighbours. Проверять text/image overflow и реальные font glyphs всех локалей.
- [ ] С каждой страницы реально открыть/закрыть header modal, проверить nested language, focus/scroll lock, Escape/backdrop/link/resize, anchors, URL/query/hash и page-local controls.
- [ ] Сравнить браузерный результат с authoritative design, не только проверить DOM-presence. Не выдавать screenshot pass за WCAG или owner acceptance.
- [ ] Обновить page-specific QA MD и [реестр страниц](qa/pages/README.md): файлы, источники, проверки, defects/fixes, evidence, review limitations и оставшиеся gates.

## 2. Добавить Lenis и кастомизировать scrollbar

- [ ] До внедрения снять production baseline: загрузка, scroll responsiveness, клиентский JS, anchors и modal behavior.
- [ ] Проверить актуальные Lenis API/React integration/Next compatibility; добавить только нужную зависимость без второго animation/scroll orchestration слоя.
- [ ] Узкая клиентская интеграция с одним управляемым lifecycle; не делать весь layout/page клиентским. Не оставлять дублирующиеся RAF loops, listeners или эффекты после locale navigation/unmount.
- [ ] Сохранить обычную прокрутку, touch, wheel/trackpad, PageUp/PageDown/Home/End, skip link, hash/deep links, browser back/forward и scroll restoration.
- [ ] Обеспечить работу с Radix modal scroll lock, вложенными scrollable областями и focus scrolling. Не перехватывать wheel/keyboard глобально там, где это ломает controls.
- [ ] При `prefers-reduced-motion` отключать smooth interpolation и сохранять нативное предсказуемое поведение. Touch — native-first; не форсировать smooth touch без причины.
- [x] **Получить рекомендацию OLA Lead Designer по scrollbar:** ниже зафиксирован ответ из его сообщения. Это новая design recommendation, не существующий Figma-компонент, не owner acceptance и не выполненная browser/a11y QA.
  - Document scrollbar: track `#FAF7F2`, thumb default `#655C56`, hover `#641323`, active/drag `#4D0E1A`; все цвета непрозрачные. Border `#D9CCC4` не использовать как default thumb на ivory.
  - Не переключать document scrollbar при прохождении wine секций; никаких scroll listeners ради темы. Только для уже необходимого отдельного overflow-контейнера на wine: track `#641323`, thumb `#D9CCC4`, hover `#F1E4DE`, active `#FFF9F3`. Не создавать containers ради оформления.
  - Native/OS auto по умолчанию. Где desktop styling поддерживается — ориентир 12 CSS px и мягкое скругление, без теней/ободка; это рекомендация, не approved geometry. Hover/active только если native styling позволяет; иначе оставить default pair без JS-overlay.
  - Touch/overlay scrollbar остаётся платформенным; не принуждать постоянную видимость. Forced-colors — native/auto, без `forced-color-adjust: none`.
- [ ] Измерить реальный thumb/track contrast (цель минимум 3:1 там, где применим WCAG non-text contrast), rendered thickness/hit area и поддержку состояний в фактически проверенных браузерах. Дизайнер не выполнял численные измерения и не заявлял WCAG PASS.
  - Справочная проверка родителем: Python-расчёт WCAG relative luminance для указанных непрозрачных sRGB пар, без браузера. Document default/hover/active: **6.106:1 / 11.843:1 / 14.104:1**; отдельный wine overflow default/hover/active: **8.066:1 / 10.180:1 / 12.112:1**. Все выбранные пары превышают 3:1. Это проверка палитры, не фактического native rendering, hit area или полной WCAG compliance; checkbox browser QA остаётся открытым.
- [ ] Реализовать progressive enhancement native scrollbar, без custom scroll container/замены механизма прокрутки ради оформления. Не скрывать scrollbar; в forced-colors сохранять нативную доступность, учитывать различия браузеров/overlay scrollbars.
- [ ] Повторить keyboard/modal/anchor/resize/reduced-motion QA, проверить доступные browser engines и зафиксировать фактически выполненное покрытие.
- [ ] Повторить измерения скорости и сравнить с baseline. Не принимать заметное ухудшение responsiveness ради декоративного эффекта.

## 3. Добавить Framer Motion и анимации интерактивных блоков

- [ ] Проверить совместимую версию **`framer-motion`** и актуальные официальные React/Next API перед установкой. Это явное поручение владельца; не заменять библиотеку другой без причины.
- [ ] Составить карту действительно нужных state-driven анимаций: раскрытие/закрытие, presence, изменение состояния controls, допустимые microinteractions. Не оборачивать все статические секции в client/motion-компоненты автоматически.
- [ ] По возможности анимировать transform/opacity; избегать лишних layout animations, тяжёлых blur/filter и бесконечных циклов. Простые hover/focus transitions могут оставаться CSS.
- [ ] Подключать motion функциональность минимальным практичным bundle; выбрать lazy/features подход по актуальной документации, без конкурирующих wrappers/providers.
- [ ] Сохранить Radix/native semantics: анимация не заменяет focus management, accessible name, expanded/selected state, scroll lock или keyboard dismissal.
- [ ] Учесть reduced motion, быстрые повторные clicks, interrupted/exit transitions, resize и locale navigation; скрытые/закрытые элементы не должны оставаться tabbable.
- [ ] Не задерживать доступ к основному контенту до hydration/animation и не допускать CLS, invisible content при ошибке JS или несогласованного initial state.
- [ ] Снять before/after screenshots и interaction traces, перепроверить функциональность и bundle/performance delta.

## 4. Жёсткое финальное ревью: код, a11y, адаптив, скорость

### Код и архитектура

- [ ] Прочитать интегрированный код всех страниц и shared-компонентов, а не ограничиваться отчётами implementers и зелёным build.
- [ ] Проверить dependency direction, thin routes/pages, server/client boundaries и отсутствие случайного попадания content/server modules в browser bundle.
- [ ] Удалить dead code/imports/styles, временные experiments, fake controls и неоправданные зависимости. Не сохранять несколько конкурирующих вариантов одного примитива.
- [ ] Исправить плотный/нечитабельный JSX/CSS, неоправданную абстракцию и действительно вредное дублирование. Не переписывать нормальный код только ради нового стиля.
- [ ] Проверить типы, keys, effects/listener/RAF cleanup, ошибки URL/handoff, CSS Modules selector scope/specificity и непрерывность сложных responsive формул.
- [ ] Проверить переводы и длинные labels EN/RU/SR, Cyrillic/Serbian Latin, отсутствие mixed-language fragments. Draft/approved статусы сохранять честно.
- [ ] Независимый code/spec review + parent triage: закрыть все подтверждённые Critical/High findings; остальные явно исправить либо обоснованно зафиксировать. Не принимать автоматический совет добавить ARIA без проверки смысла.

### Accessibility

- [ ] Semantic HTML, landmark/heading order, meaningful image alternatives, labels и native element choice.
- [ ] Полный keyboard walkthrough: tab order, visible focus, traps/restore/dismiss, modal/background isolation, menus/selectors/gallery/FAQ/forms где они существуют.
- [ ] Accessible names и state/error associations; отсутствие redundant/incorrect ARIA и недоступных disabled/no-op действий.
- [ ] Контраст текста/controls/focus, touch targets, zoom/reflow, reduced motion и forced colors. Не ломать интерфейс custom scrollbar/Lenis/motion.
- [ ] Автоматический accessibility scan всех реализованных routes/локалей + ручные проверки. Screen-reader проверки выполнить в реально доступной среде и указать конкретный AT/browser; не объявлять полную WCAG certification по одному автоматическому инструменту.

### Responsive и functional regression

- [ ] Все страницы/локали, контрольные и промежуточные widths, boundary neighbours, длинные заголовки/buttons и отсутствие clipping/overflow.
- [ ] Все transitions и controls реальными browser interactions, не только статическими screenshots.
- [ ] Полный `npm run check` после интеграции и финальных fixes; дополнительный motion/scroll/a11y regression coverage.
- [ ] Проверить реальные404, locale switching, broken destinations и navigation. Нереализованную/blocked часть не маркировать complete.

### Производительность

- [ ] Измерять **production build**, не `next dev`; зафиксировать Node/browser/build/source, viewport, network/CPU profile и cache state.
- [ ] Lighthouse/DevTools traces для репрезентативных страниц, особенно самых тяжёлых фото/интерактивных. Несколько повторов в одинаковых условиях; агрегаты считать инструментом, не выбирать лучший случай.
- [ ] Проверить LCP/FCP/CLS и lab TBT, long tasks, hydration/main-thread work, image sizes/priority/lazy loading, font loading, transferred bytes и initial client JS по routes.
- [ ] Измерить отзывчивость actual interactions/scroll/modal отдельно. Не называть Lighthouse TBT реальным INP: field INP/p75 и реальная аудитория потребуют отдельного production/RUM этапа, не выдумывать их из localhost.
- [ ] Предварительные performance budgets: LCP ≤2.5s, CLS ≤0.1; field INP ≤200ms, когда появятся реальные данные. Это цели, **не уже полученные результаты**. Условия и допустимую погрешность lab сравнения записать до итогового verdict.
- [ ] Сравнить baseline без Lenis/motion с итогом, разобрать client-bundle delta и устранить ненужный JS. Не добиваться score ценой ухудшения дизайна, UX или доступности.
- [ ] Сохранить отчёт, исходные JSON/trace artifacts и реальные ограничения: локальные lab measurements не подтверждают live network/SEO/remote CI/deployment readiness.

## Итоговые артефакты и release boundaries

- [ ] Актуальный реестр страниц + подробный QA MD для каждой страницы.
- [ ] Общий итоговый review MD с findings/severity/disposition и evidence, отдельные a11y и performance отчёты.
- [ ] Зафиксированные рекомендации дизайнера по scrollbar и проверенный motion/scroll regression.
- [ ] Удалённые временные эксперименты и остановленные task-owned QA servers; no known unreviewed Critical/High defects.
- [ ] Отдельно закрыть реальные contact URLs/prefill, утверждение RU/SR, photography/rights, domain/SEO и owner visual/content acceptance. Не считать эти inputs полученными из разрешения на frontend-разработку.
- [ ] Публичный deployment/commit/push не выполнять без отдельного поручения.

## Текущие решения, не требующие дополнительного вопроса

Сохраняем существующую архитектуру; новые библиотеки изолируем в минимальных client islands; native/reduced-motion fallback обязателен; бизнес/backend scope не расширяем. Продуктовые неоднозначности карточек/slug/handoff отмечаем и разрешаем по authoritative источнику, а не скрытой догадке. Обязательных архитектурных вопросов к владельцу сейчас нет.
