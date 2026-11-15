# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: bouquet-detail-preferences.spec.ts >> ru 599: real component interaction and geometry
- Location: tests/e2e/bouquet-detail-preferences.spec.ts:101:9

# Error details

```
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 3

- Array []
+ Array [
+   "process is not defined",
+ ]
```

# Test source

```ts
  19  |   },
  20  |   ru: {
  21  |     fullnessLegend: 'Предпочтительная пышность',
  22  |     fullnessHelper: 'Иллюстративные варианты; итоговый букет и цена подтверждаются при запросе.',
  23  |     fullnessOptions: { standard: 'Стандарт', medium: 'Средняя', large: 'Большая' },
  24  |     extrasLegend: 'Сделай его особенным',
  25  |     extraLabels: { balloons: 'Шары', chocolates: 'Шоколадки', greeting_card: 'Открытка' },
  26  |     dateLegend: 'Предпочтительная дата (по желанию)',
  27  |     datePlaceholder: 'Выберите дату',
  28  |     dateFormatError: 'Неверный формат даты. Используйте ГГГГ-ММ-ДД.',
  29  |     messageLegend: 'Текст открытки (по желанию)',
  30  |     messagePlaceholder: 'Ваше сообщение',
  31  |   },
  32  |   sr: {
  33  |     fullnessLegend: 'Poželjna punoća',
  34  |     fullnessHelper: 'Ilustrativne opcije; konačan buket i cena se potvrđuju na upit.',
  35  |     fullnessOptions: { standard: 'Standardna', medium: 'Srednja', large: 'Velika' },
  36  |     extrasLegend: 'Učini ga posebnim',
  37  |     extraLabels: { balloons: 'Baloni', chocolates: 'Čokolade', greeting_card: 'Čestitka' },
  38  |     dateLegend: 'Poželjni datum (opciono)',
  39  |     datePlaceholder: 'Izaberite datum',
  40  |     dateFormatError: 'Neispravan format datuma. Koristite GGGG-MM-DD.',
  41  |     messageLegend: 'Poruka na čestitci (opciono)',
  42  |     messagePlaceholder: 'Vaša poruka',
  43  |   },
  44  | };
  45  | 
  46  | const extraImages = ['balloons', 'chocolates', 'greeting_card'] as const;
  47  | const fullnessImages = ['standard', 'medium', 'large'] as const;
  48  | const extraImageIndices = [8, 9, 10] as const;
  49  | let script = '';
  50  | let css = '';
  51  | 
  52  | test.beforeAll(async () => {
  53  |   const result = await build({
  54  |     configFile: false,
  55  |     define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  56  |     logLevel: 'error',
  57  |     build: {
  58  |       write: false,
  59  |       target: 'esnext',
  60  |       minify: false,
  61  |       lib: {
  62  |         entry: resolve('tests/fixtures/bouquet-detail-preferences/entry.tsx'),
  63  |         formats: ['iife'],
  64  |         name: 'PreferencesFixture',
  65  |       },
  66  |     },
  67  |   });
  68  |   for (const output of Array.isArray(result) ? result : [result]) {
  69  |     if (!('output' in output)) throw new Error('Unexpected Vite watcher');
  70  |     for (const item of output.output) {
  71  |       if (item.type === 'chunk') script += item.code;
  72  |       else if (item.fileName.endsWith('.css')) css += item.source.toString();
  73  |     }
  74  |   }
  75  |   if (!script || !css) throw new Error('Missing fixture bundle');
  76  |   console.log(
  77  |     'fixture bundle SHA256',
  78  |     createHash('sha256').update(script).digest('hex'),
  79  |     'CSS SHA256',
  80  |     createHash('sha256').update(css).digest('hex')
  81  |   );
  82  | });
  83  | 
  84  | const loadImages = (localeWords: typeof labels.en) => ({
  85  |   fullness: fullnessImages.map((name, index) => ({
  86  |     src: `data:image/jpeg;base64,${readFileSync(resolve('public/assets/images/bouquet-detail', `0${5 + index}_size_${name}.jpg`)).toString('base64')}`,
  87  |     alt: `${localeWords.fullnessOptions[name as keyof typeof localeWords.fullnessOptions]} ${index + 1}`,
  88  |   })),
  89  |   extras: extraImages.map((name, index) => {
  90  |     const num = extraImageIndices[index];
  91  |     const prefix = num < 10 ? `0${num}` : `${num}`;
  92  |     return {
  93  |       src: `data:image/jpeg;base64,${readFileSync(resolve('public/assets/images/bouquet-detail', `${prefix}_extra_${name}.jpg`)).toString('base64')}`,
  94  |       alt: `${localeWords.extraLabels[name as keyof typeof localeWords.extraLabels]} ${index + 1}`,
  95  |     };
  96  |   }),
  97  | });
  98  | 
  99  | for (const [locale, words] of Object.entries(labels)) {
  100 |   for (const width of [320, 360, 599, 600, 601, 768, 1440]) {
  101 |     test(`${locale} ${width}: real component interaction and geometry`, async ({ page }) => {
  102 |       const errors: string[] = [];
  103 |       page.on('pageerror', (error) => errors.push(error.message));
  104 |       page.on('console', (msg) => {
  105 |         if (msg.type() === 'log') console.log('BROWSER:', msg.text());
  106 |       });
  107 |       await page.setViewportSize({ width, height: 1200 });
  108 |       await page.setContent('<!doctype html><html><head></head><body><div id="root"></div><script type="application/json" id="data"></script></body></html>');
  109 |       const imgs = loadImages(words as typeof labels.en);
  110 |       await page.locator('#data').evaluate((el, data) => {
  111 |         el.textContent = JSON.stringify(data);
  112 |       }, { labels: words, fullnessImages: imgs.fullness, extraImages: imgs.extras });
  113 |       const galleryWidth = width >= 1200 ? 704 : width >= 600 ? 704 : width - 40;
  114 |       await page.addStyleTag({
  115 |         content: `*{box-sizing:border-box}body{margin:0;padding:0 20px;background:#faf7f2}#root{width:${galleryWidth}px;max-width:100%;margin:auto}${css}`,
  116 |       });
  117 |       await page.addScriptTag({ content: script });
  118 |       await page.waitForTimeout(200);
> 119 |       expect(errors).toEqual([]);
      |                      ^ Error: expect(received).toEqual(expected) // deep equality
  120 | 
  121 |       // Fullness radio group: exactly one selected, keyboard arrows work
  122 |       const radios = page.locator('fieldset').first().locator('input[type="radio"]');
  123 |       await expect(radios).toHaveCount(3);
  124 |       await expect(radios.nth(0)).toBeChecked(); // Standard initial
  125 |       await expect(radios.nth(1)).not.toBeChecked();
  126 |       await expect(radios.nth(2)).not.toBeChecked();
  127 | 
  128 |       // Click Medium via label (parent of radio input)
  129 |       await radios.nth(1).locator('..').click();
  130 |       await expect(radios.nth(1)).toBeChecked();
  131 |       await expect(radios.nth(0)).not.toBeChecked();
  132 |       await expect(radios.nth(2)).not.toBeChecked();
  133 |       await page.evaluate(() => console.log('checkpoint: clicked medium'));
  134 | 
  135 |       // Keyboard arrow navigation
  136 |       await radios.nth(1).focus();
  137 |       await page.keyboard.press('ArrowRight');
  138 |       await expect(radios.nth(2)).toBeChecked();
  139 |       await page.keyboard.press('ArrowLeft');
  140 |       await page.keyboard.press('ArrowLeft');
  141 |       await expect(radios.nth(0)).toBeChecked();
  142 |       await page.evaluate(() => console.log('checkpoint: keyboard nav done'));
  143 | 
  144 |       // Extras checkboxes: all initially false, independent
  145 |       const checkboxes = page.locator('input[type="checkbox"]');
  146 |       await expect(checkboxes).toHaveCount(3);
  147 |       await expect(checkboxes.nth(0)).not.toBeChecked();
  148 |       await expect(checkboxes.nth(1)).not.toBeChecked();
  149 |       await expect(checkboxes.nth(2)).not.toBeChecked();
  150 |       await page.evaluate(() => console.log('checkpoint: checkboxes initial'));
  151 | 
  152 |       // Toggle balloons via label (parent of checkbox input)
  153 |       await checkboxes.nth(0).locator('..').click();
  154 |       await expect(checkboxes.nth(0)).toBeChecked();
  155 |       await expect(checkboxes.nth(1)).not.toBeChecked();
  156 |       await expect(checkboxes.nth(2)).not.toBeChecked();
  157 |       await page.evaluate(() => console.log('checkpoint: balloons toggled'));
  158 | 
  159 |       // Toggle chocolates via label
  160 |       await checkboxes.nth(1).locator('..').click();
  161 |       await expect(checkboxes.nth(0)).toBeChecked();
  162 |       await expect(checkboxes.nth(1)).toBeChecked();
  163 |       await expect(checkboxes.nth(2)).not.toBeChecked();
  164 |       await page.evaluate(() => console.log('checkpoint: chocolates toggled'));
  165 | 
  166 |       // Toggle greeting card via label
  167 |       await checkboxes.nth(2).locator('..').click();
  168 |       await expect(checkboxes.nth(0)).toBeChecked();
  169 |       await expect(checkboxes.nth(1)).toBeChecked();
  170 |       await expect(checkboxes.nth(2)).toBeChecked();
  171 |       await page.evaluate(() => console.log('checkpoint: greeting card toggled'));
  172 | 
  173 |       // Uncheck balloons - others persist
  174 |       await checkboxes.nth(0).locator('..').click();
  175 |       await expect(checkboxes.nth(0)).not.toBeChecked();
  176 |       await expect(checkboxes.nth(1)).toBeChecked();
  177 |       await expect(checkboxes.nth(2)).toBeChecked();
  178 |       await page.evaluate(() => console.log('checkpoint: balloons unchecked'));
  179 | 
  180 |       // Preferred date: empty valid, malformed blur shows error, valid clears error
  181 |       const dateInput = page.locator(`input[placeholder="${words.datePlaceholder}"]`);
  182 |       await expect(dateInput).toHaveValue('');
  183 | 
  184 |       // Type malformed date and blur
  185 |       await dateInput.fill('2026-13-45');
  186 |       await dateInput.blur();
  187 |       await expect(page.locator(`text=${words.dateFormatError}`)).toBeVisible();
  188 | 
  189 |       // Correct to valid date - error clears, other fields preserved
  190 |       await dateInput.fill('29.02.2024'); // leap year valid
  191 |       await page.evaluate(() => console.log('checkpoint: filled leap year'));
  192 |       await page.waitForTimeout(100);
  193 |       await dateInput.blur();
  194 |       await page.evaluate(() => console.log('checkpoint: blurred leap year'));
  195 |       await expect(page.locator(`text=${words.dateFormatError}`)).not.toBeVisible();
  196 |       await page.evaluate(() => console.log('checkpoint: error cleared after leap year'));
  197 |       await expect(radios.nth(0)).toBeChecked(); // fullness preserved
  198 |       await expect(checkboxes.nth(1)).toBeChecked(); // extras preserved
  199 |       await expect(checkboxes.nth(2)).toBeChecked();
  200 | 
  201 |       // Card message: persists regardless of greeting card checkbox
  202 |       const messageTextarea = page.locator(`textarea[placeholder="${words.messagePlaceholder}"]`);
  203 |       await page.evaluate(() => console.log('checkpoint: before message'));
  204 |       await expect(messageTextarea).toHaveValue('');
  205 |       await page.evaluate(() => console.log('checkpoint: message empty verified'));
  206 |       await messageTextarea.fill('Happy birthday!');
  207 |       await page.evaluate(() => console.log('checkpoint: message filled'));
  208 |       await expect(messageTextarea).toHaveValue('Happy birthday!');
  209 |       await page.evaluate(() => console.log('checkpoint: message value verified'));
  210 | 
  211 |       // Toggle greeting card off - message persists
  212 |       await page.evaluate(() => console.log('checkpoint: before toggle greeting off'));
  213 |       await checkboxes.nth(2).locator('..').click();
  214 |       await page.evaluate(() => console.log('checkpoint: toggled greeting off'));
  215 |       await expect(checkboxes.nth(2)).not.toBeChecked();
  216 |       await page.evaluate(() => console.log('checkpoint: greeting off verified'));
  217 |       await expect(messageTextarea).toHaveValue('Happy birthday!');
  218 |       await page.evaluate(() => console.log('checkpoint: message persists after greeting off'));
  219 | 
```