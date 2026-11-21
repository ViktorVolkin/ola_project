# Одноразовый bounded benchmark — default context

Существующие ключи default использованы через штатные getter/resolver в отдельном процессе. Настройки, lead credentials, pools/default/delegation не менялись.

## Фактические итоги
{
  "inference_calls_attempted": 4,
  "successful_api_responses": 3,
  "failed_inference_calls": 1,
  "tasks_not_sent": 4,
  "catalog_fetches": 3,
  "transport_retries": 0
}

## Маршруты
- Gemini 3.5 Flash-Lite: provider=gemini, model=gemini-3.5-flash-lite, status=available; candidates=[]; reason=None
- GLM Flash: provider=zai, model=None, status=skipped; candidates=['glm-5.3-flash', 'glm-5.3-flashx', 'glm-5.3-flashx-legal']; reason=Multiple GLM Flash variants; no selected default among candidates; owner choice required
- Kilo Auto Free: provider=kilocode, model=kilo-auto/free, status=skipped; candidates=[]; reason=Exact model absent from this single live catalog fetch
- Google-native Gemma 4 31B: provider=gemini, model=gemma-4-31b-it, status=available; candidates=['gemma-4-31b-it']; reason=None

## Фактические вызовы
Время — monotonic end-to-end для одного HTTP-запроса, включая чтение и JSON decoding; не time-to-first-token.
- Gemini 3.5 Flash-Lite/A: ok; 19.659s; returned_model=gemini-3.5-flash-lite; usage={"promptTokenCount": 274, "candidatesTokenCount": 138, "totalTokenCount": 412, "promptTokensDetails": [{"modality": "TEXT", "tokenCount": 274}], "serviceTier": "standard"}
- Gemini 3.5 Flash-Lite/B: ok; 25.289s; returned_model=gemini-3.5-flash-lite; usage={"promptTokenCount": 205, "candidatesTokenCount": 145, "totalTokenCount": 350, "promptTokensDetails": [{"modality": "TEXT", "tokenCount": 205}], "serviceTier": "standard"}
- Google-native Gemma 4 31B/A: ok; 67.691s; returned_model=gemma-4-31b-it; usage={"promptTokenCount": 274, "totalTokenCount": 1471, "promptTokensDetails": [{"modality": "TEXT", "tokenCount": 274}], "thoughtsTokenCount": 1197, "serviceTier": "standard"}
- Google-native Gemma 4 31B/B: http_error; 0.818s; returned_model=None; usage=null

## Ограничения интерпретации

Три HTTP/API-успеха НЕ означают три решённые задачи. Gemma/A вернула пустой видимый ответ с finish_reason=MAX_TOKENS; usage сообщает thoughtsTokenCount=1197, но candidatesTokenCount отсутствует. Gemma/B получила HTTP 500 INTERNAL «Internal error encountered.», usage не предоставлен. Дополнительные попытки не выполнялись.

Качество решений и соответствие формату оценивает parent отдельно; наличие текста или HTTP 200 не объявляется прохождением задачи.

Полные тексты ответов, usage, безопасные ошибки, каталоги и оба исходных prompts находятся в benchmark.json. API errors/ambiguity/отсутствие в каталоге не оценка качества модели. Kilo — router. Качество не ранжировалось; сгенерированный код не исполнялся. В запросы не добавлялись tools/project context/hidden hints. Temperature=0 у всех реально отправленных запросов.

Артефакт: /home/viktor/Projects/ola_project/docs/qa/model-benchmark/20261102T140126Z/benchmark.json
