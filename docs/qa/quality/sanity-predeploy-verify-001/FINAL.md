# OLA-SANITY-PREDEPLOY-VERIFY-001 — итог

**Push readiness: NO / NOT READY.** Проверка выполнена на HEAD `5377164b` с текущим грязным рабочим деревом; исходники, тесты и конфигурации не исправлялись. QA-контроллер скопировал свежий приватный fixture `/workspace/.local-tools/ola-qa/fixture-fzwRsz`; production build ID `Rp-GZr8-oMAV7SgRiAKIA`, webpack. Корневой `.next`, порт 3100 и существующие изменения не затрагивались.

## Результаты

- Guard regressions: **26/26 passed**.
- Root Vitest: **14 файлов, 121/121 passed**; `npm run lint`: exit 0.
- Свежий fixture: `next build --webpack`, `next typegen`, `tsc --noEmit --incremental false` — exit 0; контроллер также сообщил 12 smoke checks и 5/5 focused E2E passed. Это не заменяет полный Playwright.
- Полный Playwright на том же fixture/build, оба проекта desktop/mobile: **702 теста, 473 passed, 228 failed, 1 skipped**. Запуск завершился сводкой, но wrapper вернул 124 из-за 600-секундного предела; отдельный exit CLI не зафиксирован. Среди failures: mobile-меню не видно в desktop-проекте (ожидание 120 сек), Detail/gallery проверки получают 404/недостающий контент, geometry delta 104px при ожидании ≤1.2px, также ошибки routing и SSR/no-JS 404. Все подробности/трейсы — в логе; ожидания не ослаблялись.
- Единственный skip — `contact.spec.ts` geometry/captures: явный `test.skip` для проекта, отличного от desktop; desktop-вариант исполнялся.
- Studio: typecheck и build из отдельной копии — exit 0; lint exit 0, но выводит предупреждение о несуществующей папке `pages`. У Studio нет скрипта тестов.

Подробные команды и границы: `checks.json`. Первый запуск fixture typegen без документированного SWC cache завершился `ERR_SWC_NATIVE_CACHE`; повтор с существующим `/ola-native-cache` прошёл. В build остаётся предупреждение tracing о `package-lock.json`/QA HOME. Default Turbopack не проверялся; использован документированный webpack эквивалент. Опциональная попытка inline-чтения материалов была отклонена и не повторялась; необходимые QA-документы прочитаны через `read_file`.

**Files:** `root-unit.log`, `root-lint.log`, `fixture-typegen.log`, `fixture-tsc.log`, `root-e2e-full.log`, `studio-lint.log`, `studio-typecheck.log`, `studio-build.log`, `playwright.full.config.mjs`, `checks.json`, `TRIAGE.md`. Fixture Build ID/контроллер: `../qa-environment-restore-001/run-dRYUwk/verification.json` и `verify.log`.

## Triage-добавление (полная исходная сводка не изменена)

Сопоставление source/generated config подтвердило одинаковую матрицу desktop 1280×800 + mobile 375×812 (2 workers); generated runner использовал изолированный 44535 вместо исходного 3100. Точная классификация 228 failures: 194 dedicated fixture contracts не загружены (`BD_PAGE_COPY`, `BD_MIGRATION_RUN/EVIDENCE`), 10 тестов security hard-code 3100, 9 accessibility cases названы для противоположного viewport. Эти 213 не доказывают продуктовую поломку, но остаются красными в текущей configured suite. Остальные: 2 измеренных gallery geometry failures с 104/105px скачком (viewport тест меняет сам; продукт-vs-contract требует дальнейшего разбора) и 13 неразобранных acceptance failures (motion/wheel, 404 intro/no-JS recovery, localized 404 DOM; root cause unknown). Детали и проверяемые пути — `TRIAGE.md`; полный Playwright остается 473/702 pass, 228 fail, 1 skip, wrapper 124.

**Push readiness: NO / NOT READY.** Нет исправлений, повторного прогона, deployment или Git mutation; release readiness и Sanity editing не подтверждены этими E2E results. Supervisor не инициирован.
