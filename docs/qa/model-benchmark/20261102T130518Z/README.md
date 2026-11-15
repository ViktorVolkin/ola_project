# Разовый bounded model benchmark — заблокирован до API-вызовов

Профиль: `lead`. Разрешение распространялось только на этот тест; обычная роль System Engineer не изменена.

## Реальный результат

Штатный `hermes_cli.runtime_provider.resolve_runtime_provider` в выбранном профиле вернул `AuthError: No usable credentials found` для `gemini`, `zai` и `kilocode`. Проверка выполнялась с обычным загрузчиком env профиля, без внешних secret-manager helpers. Изменение config/credentials/пулов было запрещено процессным audit guard; запрет ни разу не сработал. Это локальный blocker resolver, не ошибка ответа удалённой модели и не доказательство отсутствия пользовательского подключения в другом профиле.

Модельных API-вызовов: 0. Успешных: 0. Неуспешных удалённых вызовов: 0. Transport retries: 0. Восемь запланированных задач не отправлялись. Поэтому elapsed/usage/output/returned model не измерены и записаны `null`, а не выдуманными значениями.

## Маршруты и IDs

| Human label | Provider | ID из локального каталога | Статус |
| --- | --- | --- | --- |
| Gemini 3.5 Flash-Lite | `gemini` | `gemini-3.5-flash-lite` | Credentials не разрешены; live доступность не проверена |
| GLM Flash | `zai` | Не определён | В кэше zai только `glm-5.2`, `glm-5`, `glm-4-9b`; вариант Flash не угадывался |
| Kilo Auto Free | `kilocode` | `kilo-auto/free` | Credentials не разрешены; это router, underlying backend неизвестен |
| Gemma 4 31B через Google | `gemini` | Не определён | В Google/Gemini кэше такого ID нет; live каталог недоступен из-за credentials blocker |

Кэш: `/home/viktor/.hermes/profiles/lead/provider_models_cache.json`. Кэш не является доказательством рабочей авторизации или текущей доступности модели.

В кэше ДРУГОГО провайдера `kilocode` есть `google/gemma-4-31b-it` и несколько GLM Flash IDs, перечисленных отдельно в JSON. Они не использованы как подмена Google-native Gemma или неопределённого GLM Flash.

## Артефакт

`benchmark.json` содержит точный system prompt, оба исходных user prompts, ограничения теста, безопасные ошибки resolver, evidence по маршрутам и статусы всех восьми неотправленных задач. `calls` пуст: фактических ответов моделей не было.

Путь с хоста:
`/home/viktor/Projects/ola_project/docs/qa/model-benchmark/20261102T130518Z/benchmark.json`

Путь Lead в Docker:
`/workspace/docs/qa/model-benchmark/20261102T130518Z/benchmark.json`

Конфигурация/default/delegation/aliases/credential pools не менялись, credentials не создавались и не переносились. В артефактах нет ключей, headers или credential request dumps. Код сайта не менялся, сгенерированный моделями код не исполнялся. Качество и скорость моделей не ранжировались. Настройки для устранения blocker не ремонтировались; требуется штатно доступный разрешённый маршрут, а не обход границы другого профиля.
