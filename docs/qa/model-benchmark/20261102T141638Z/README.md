# Follow-up: завершение исходного benchmark

Исправлена моя ошибка name-before-id при разборе Kilo. Display name не является request ID. Исходный raw artifact не изменён: /home/viktor/Projects/ola_project/docs/qa/model-benchmark/20261102T140126Z/benchmark.json

GLM: выбран обычный glm-5.3-flash по явному указанию parent. FlashX/legal не подставлялись.
Kilo Auto Free request ID из фактического поля id: kilo-auto/free

## Реальные итоги follow-up
{
  "inference_calls_attempted": 3,
  "successful_api_responses": 2,
  "failed_inference_calls": 1,
  "tasks_not_sent": 1,
  "corrective_catalog_fetches": 1,
  "transport_retries": 0
}

## Накопительные итоги
{
  "inference_calls_attempted": 7,
  "successful_api_responses": 5,
  "failed_inference_calls": 2,
  "visible_nonempty_outputs": 3,
  "inference_cap": 8,
  "catalog_fetches": 4,
  "transport_retries": 0
}

## Вызовы
- GLM Flash/A: quota_or_rate_limit; 0.603s; requested=glm-5.3-flash; returned=None; finish=None; usage=null
- Kilo Auto Free/A: ok; 6.984s; requested=kilo-auto/free; returned=reflection/beam-free; finish=length; usage={"prompt_tokens": 307, "completion_tokens": 1200, "total_tokens": 1507, "cost": 0, "is_byok": false, "prompt_tokens_details": {"cached_tokens": 0, "audio_tokens": 0, "video_tokens": 0}, "cost_details": {"upstream_inference_cost": 0, "upstream_inference_prompt_cost": 0, "upstream_inference_completions_cost": 0}, "completion_tokens_details": {"reasoning_tokens": 1199, "image_tokens": 0}, "cache_creation_input_tokens": 0}
- Kilo Auto Free/B: ok; 4.997s; requested=kilo-auto/free; returned=reflection/beam-free; finish=stop; usage={"prompt_tokens": 252, "completion_tokens": 898, "total_tokens": 1150, "cost": 0, "is_byok": false, "prompt_tokens_details": {"cached_tokens": 64, "audio_tokens": 0, "video_tokens": 0}, "cost_details": {"upstream_inference_cost": 0, "upstream_inference_prompt_cost": 0, "upstream_inference_completions_cost": 0}, "completion_tokens_details": {"reasoning_tokens": 772, "image_tokens": 0}, "cache_creation_input_tokens": 0}

## Классификация ограничений, не оценка качества

GLM/A: HTTP 429, provider error code 1113: «Insufficient balance or no resource package. Please recharge.» Это billing/resource-package blocker, а не неверное решение или установленный дефект модели. По условию остановки маршрута GLM/B не отправлялся; повторов не было.

Kilo/A: HTTP 200, но видимый output пустой, finish_reason=length, completion_tokens=1200 (из них reasoning_tokens=1199). HTTP-успех не означает полученное решение задачи. Kilo/B вернула непустой текст; семантические тесты оставлены parent. В обоих ответах сервер указал model=reflection/beam-free — это фактически наблюдавшийся backend этих двух вызовов, а не постоянная привязка router.

Все исходные prompts и system неизменны; temperature0/max_tokens1200/deadline90s/no tools/no fallback. Существующие default credentials использованы штатно и не выводились. Настройки/default/delegation/pools/credentials/код сайта не менялись. Сгенерированный код на хосте не исполнялся; качество не ранжировалось. Gemini/Gemma не повторялись.

Полные outputs, usage/errors и исправленный id/name mapping: /home/viktor/Projects/ola_project/docs/qa/model-benchmark/20261102T141638Z/benchmark.json
