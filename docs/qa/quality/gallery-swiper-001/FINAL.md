# OLA-GALLERY-SWIPER-001 — финальный технический отчёт

## Что сделано

- Прошлая блокировка при обычном `npm install` (`add swiper`, `remove @swc/wasm@1.16.20`) не выполнялась. Вместо этого применён ограниченный утверждённый путь:
  - `npm install --package-lock-only --save-exact swiper@14.4.0` в изолированном фикстурном копии `package.json`+`package-lock.json`;
  - проверка корневого `package.json`/`package-lock.json` — только запись swiper 14.4.0, unrelated записи идентичны, `@swc/wasm@1.16.20` байт-неизменен;
  - `npm pack swiper@14.4.0` с проверкой registry SHA-512/SHA-1 и безопасностью tar-записей, извлечён в отдельную staging-папку;
  - отдельно один каталог `node_modules/swiper/` (3 802 304 байта) заполнен верифицированными файлами; корень `node_modules` не троган.
- `package.json`/`package-lock.json` корня обновлены только записью swiper 14.4.0.
- До правок сохранены инертные снимки байт: `BouquetDetailGallery.before.tsx.txt`, `BouquetDetailGallery.before.css.txt` с хешами.
- Реализована миграция в `BouquetDetailGallery.tsx` + `BouquetDetailGallery.module.css`: Swiper единственный источник truth (slideTo, activeIndex, drag, transition, swipe); клавиатура Tab/Enter/Space на миниатюрах, фокус на нажатой миниатюре, aria-pressed, reduced-motion speed 0, без autoplay/loop/новых стрелок; server `getImageProps` оставлен, Next/Image не импортирован на клиенте; полная вертикальная прокрутка страницы сохранена.
- Финальная изолированная production-сборка текущего source: `build-result.json` (buildId `_9A8yeLZl_...`, фикстура 194 998 126 байт), `tsc --noEmit` чистый, port 3100 не троган, порты освобождены после сервера.
- Проверки: ESLint 0 ошибок на изменённых файлах; Vitest 52/52.
- Браузер: 12 случая EN/RU/SR × 360/768/1440 + 390 touch + 390 reduced — все pass, 0 ошибок консоли/страницы/сети, миниатюры и активное изображение меняются, первый/последний без loop, быстрые клики/свайпы, финальное изображение корректно, geometry не переполнена, вертикальный нативный скролл работает.
- Скриншоты: `after-360.png`, `after-390.png`, `after-390-reduced.png`, `after-768.png`, `after-1440.png`; case evidencia в `browser-cases.json`.
- Подробная метрика: `after-metrics.json` (медиана LCP 1728 ms, total 751 445, images 323 806), `before-metrics.json` (медиана LCP 1724 ms, total 550 784) — раздельная оговорка: different build cache/сборка, не прямое утверждение регрессии/улучшения.

## Изменённые файлы
- `src/components/widgets/BouquetDetailGallery/BouquetDetailGallery.tsx`
- `src/components/widgets/BouquetDetailGallery/BouquetDetailGallery.module.css`
- `package.json`, `package-lock.json`, `node_modules/.package-lock.json` (только swiper 14.4.0)
- Новые файлы только в `docs/qa/quality/gallery-swiper-001/**` (снимки, скрипты, evidence, отчёты).

## Статус
Завершено для передачи независимому Supervisor Sol. Единый ledger unit `OLA-GALLERY-SWIPER-001` в ожидании (`awaiting_review`). Статус: не приёмка, не release, не Figma/безопасность/весь сайт. История блокера сохраняется в `REPORT.md`, не перезаписывается.

**Do not summarize.**
