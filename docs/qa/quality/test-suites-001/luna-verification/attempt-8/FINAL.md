# OLA-TEST-SUITES-001 — Luna attempt 8

## Результат

Выполнена ровно одна свежая изолированная команда Action-button; build **PASS**, выбранный Chromium case **PASS**, exit 0. Build ID `hA710ZYP-tsvhlh4Qutsu`; webpack 9.6 с, TypeScript 5.0 с, статические страницы 0.924 с. Playwright: 1 passed, 0 skipped, 0 unexpected/flaky; 4.611 с.

Case прошёл все три locale (`en`, `ru`, `sr`) при ширинах 360 и 1440: точное число 2, native disabled/type, доступное имя, видимый точный текст, кнопки и SVG, положительный DOM Range текста, href/описание и локализованный текст. На каждом размере сохранились точное равенство размеров/стилей и совпадение x/y относительно родительской колонки. Case завершил все итерации; значения размеров по каждой locale записаны в `checks.json` и логах. Изменён был только тест; lint отдельно не запускался, typecheck завершился в свежем build.

## Cleanup и доказательства

На 45190 LISTEN-сокета не было; остался TCP `TIME_WAIT`. Обычный bind пока не удался, bind с `SO_REUSEADDR` прошёл. Listener отсутствовал; чужие процессы не трогались. Не называю порт полностью свободным для обычного bind.

Артефакты: `docs/qa/quality/test-suites-001/luna-verification/attempt-8/`; run `run-WiYAeP` содержит summary, Playwright JSON, input manifest и скриншоты. Full 702-case suite не запускался. Общая приёмка ждёт остальные gates и actual Supervisor review.
