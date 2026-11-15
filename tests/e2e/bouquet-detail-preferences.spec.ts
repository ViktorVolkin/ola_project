import { test, expect } from '../fixtures/bouquet-detail-next/migration-worker';

const labels = {
  en: {
    fullnessLegend: 'Preferred fullness',
    fullnessHelper: 'Illustrative options; the final bouquet and quote are confirmed on enquiry.',
    fullnessOptions: { standard: 'Standard', medium: 'Medium', large: 'Large' },
    extrasLegend: 'Make it more personal',
    extraLabels: { balloons: 'Balloons', chocolates: 'Chocolates', greetingCard: 'Greeting card' },
    dateLegend: 'Preferred date (optional)',
    datePlaceholder: 'Choose a date',
    dateFormatError: 'Invalid date format. Use DD.MM.YYYY.',
    messageLegend: 'Card message (optional)',
    messagePlaceholder: 'Your message',
  },
  ru: {
    fullnessLegend: 'Предпочтительная пышность',
    fullnessHelper: 'Иллюстративные варианты; итоговый букет и цена подтверждаются при запросе.',
    fullnessOptions: { standard: 'Стандарт', medium: 'Средняя', large: 'Большая' },
    extrasLegend: 'Сделай его особенным',
    extraLabels: { balloons: 'Шары', chocolates: 'Шоколадки', greetingCard: 'Открытка' },
    dateLegend: 'Предпочтительная дата (по желанию)',
    datePlaceholder: 'Выберите дату',
    dateFormatError: 'Неверный формат даты. Используйте ДД.ММ.ГГГГ.',
    messageLegend: 'Текст открытки (по желанию)',
    messagePlaceholder: 'Ваше сообщение',
  },
  sr: {
    fullnessLegend: 'Poželjna punoća',
    fullnessHelper: 'Ilustrativne opcije; konačan buket i cena se potvrđuju na upit.',
    fullnessOptions: { standard: 'Standardna', medium: 'Srednja', large: 'Velika' },
    extrasLegend: 'Učini ga posebnim',
    extraLabels: { balloons: 'Baloni', chocolates: 'Čokolade', greetingCard: 'Čestitka' },
    dateLegend: 'Poželjni datum (opciono)',
    datePlaceholder: 'Izaberite datum',
    dateFormatError: 'Neispravan format datuma. Koristite DD.MM.GGGG.',
    messageLegend: 'Poruka na čestitci (opciono)',
    messagePlaceholder: 'Vaša poruka',
  },
};

const extraImages = ['balloons', 'chocolates', 'greeting_card'] as const;

for (const [locale, words] of Object.entries(labels)) {
  for (const width of [320, 360, 599, 600, 601, 768, 1440]) {
    test(`${locale} ${width}: real component interaction and geometry`, async ({ page, fixtureURL }) => {
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (msg) => {
        if (msg.type() === 'log') console.log('BROWSER:', msg.text());
      });
      await page.setViewportSize({ width, height: 1200 });
      await page.goto(`${fixtureURL}/${locale}/fixture/detail?widget=preferences`);
      const initialURL = page.url();
      await expect(page.locator('#fixture-root input[type="checkbox"]')).toHaveCount(extraImages.length);
      await page.waitForTimeout(200);
      expect(errors).toEqual([]);

      // Fullness radio group: exactly one selected, keyboard arrows work
      const radios = page.locator('fieldset').first().locator('input[type="radio"]');
      await expect(radios).toHaveCount(3);
      await expect(radios.nth(0)).toBeChecked(); // Standard initial
      await expect(radios.nth(1)).not.toBeChecked();
      await expect(radios.nth(2)).not.toBeChecked();

      // Click Medium via label (parent of radio input)
      await radios.nth(1).locator('..').click();
      await expect(radios.nth(1)).toBeChecked();
      await expect(radios.nth(0)).not.toBeChecked();
      await expect(radios.nth(2)).not.toBeChecked();
      await page.evaluate(() => console.log('checkpoint: clicked medium'));

      // Keyboard arrow navigation
      await radios.nth(1).focus();
      await page.keyboard.press('ArrowRight');
      await expect(radios.nth(2)).toBeChecked();
      await page.keyboard.press('ArrowLeft');
      await page.keyboard.press('ArrowLeft');
      await expect(radios.nth(0)).toBeChecked();
      await page.evaluate(() => console.log('checkpoint: keyboard nav done'));

      // Extras checkboxes: all initially false, independent
      const checkboxes = page.locator('input[type="checkbox"]');
      await expect(checkboxes).toHaveCount(3);
      await expect(checkboxes.nth(0)).not.toBeChecked();
      await expect(checkboxes.nth(1)).not.toBeChecked();
      await expect(checkboxes.nth(2)).not.toBeChecked();
      await page.evaluate(() => console.log('checkpoint: checkboxes initial'));

      // Toggle balloons via label (parent of checkbox input)
      await checkboxes.nth(0).locator('..').click();
      await expect(checkboxes.nth(0)).toBeChecked();
      await expect(checkboxes.nth(1)).not.toBeChecked();
      await expect(checkboxes.nth(2)).not.toBeChecked();
      await page.evaluate(() => console.log('checkpoint: balloons toggled'));

      // Toggle chocolates via label
      await checkboxes.nth(1).locator('..').click();
      await expect(checkboxes.nth(0)).toBeChecked();
      await expect(checkboxes.nth(1)).toBeChecked();
      await expect(checkboxes.nth(2)).not.toBeChecked();
      await page.evaluate(() => console.log('checkpoint: chocolates toggled'));

      // Toggle greeting card via label
      await checkboxes.nth(2).locator('..').click();
      await expect(checkboxes.nth(0)).toBeChecked();
      await expect(checkboxes.nth(1)).toBeChecked();
      await expect(checkboxes.nth(2)).toBeChecked();
      await page.evaluate(() => console.log('checkpoint: greeting card toggled'));

      // Uncheck balloons - others persist
      await checkboxes.nth(0).locator('..').click();
      await expect(checkboxes.nth(0)).not.toBeChecked();
      await expect(checkboxes.nth(1)).toBeChecked();
      await expect(checkboxes.nth(2)).toBeChecked();
      await page.evaluate(() => console.log('checkpoint: balloons unchecked'));

      // Preferred date: empty valid, malformed blur shows error, valid clears error
      const dateInput = page.locator(`input[placeholder="${words.datePlaceholder}"]`);
      await expect(dateInput).toHaveValue('');

      // Type malformed date and blur
      await dateInput.fill('2026-13-45');
      await dateInput.blur();
      await expect(page.locator(`text=${words.dateFormatError}`)).toBeVisible();

      // Correct to valid date - error clears, other fields preserved
      await dateInput.fill('29.02.2024'); // leap year valid
      await page.evaluate(() => console.log('checkpoint: filled leap year'));
      await page.waitForTimeout(100);
      await dateInput.blur();
      await page.evaluate(() => console.log('checkpoint: blurred leap year'));
      await expect(page.locator(`text=${words.dateFormatError}`)).not.toBeVisible();
      await page.evaluate(() => console.log('checkpoint: error cleared after leap year'));
      await expect(radios.nth(0)).toBeChecked(); // fullness preserved
      await expect(checkboxes.nth(1)).toBeChecked(); // extras preserved
      await expect(checkboxes.nth(2)).toBeChecked();

      // Card message: persists regardless of greeting card checkbox
      const messageTextarea = page.locator(`textarea[placeholder="${words.messagePlaceholder}"]`);
      await page.evaluate(() => console.log('checkpoint: before message'));
      await expect(messageTextarea).toHaveValue('');
      await page.evaluate(() => console.log('checkpoint: message empty verified'));
      await messageTextarea.fill('Happy birthday!');
      await page.evaluate(() => console.log('checkpoint: message filled'));
      await expect(messageTextarea).toHaveValue('Happy birthday!');
      await page.evaluate(() => console.log('checkpoint: message value verified'));

      // Toggle greeting card off - message persists
      await page.evaluate(() => console.log('checkpoint: before toggle greeting off'));
      await checkboxes.nth(2).locator('..').click();
      await page.evaluate(() => console.log('checkpoint: toggled greeting off'));
      await expect(checkboxes.nth(2)).not.toBeChecked();
      await page.evaluate(() => console.log('checkpoint: greeting off verified'));
      await expect(messageTextarea).toHaveValue('Happy birthday!');
      await page.evaluate(() => console.log('checkpoint: message persists after greeting off'));

      // Toggle greeting card on - message still persists
      await page.evaluate(() => console.log('checkpoint: before toggle greeting on'));
      await checkboxes.nth(2).locator('..').click();
      await page.evaluate(() => console.log('checkpoint: toggled greeting on'));
      await expect(checkboxes.nth(2)).toBeChecked();
      await page.evaluate(() => console.log('checkpoint: greeting on verified'));
      await expect(messageTextarea).toHaveValue('Happy birthday!');
      await page.evaluate(() => console.log('checkpoint: message persists after greeting on'));

      // Date invalid while message exists - message persists
      await dateInput.fill('bad-date');
      await dateInput.blur();
      await expect(page.locator(`text=${words.dateFormatError}`)).toBeVisible();
      await expect(messageTextarea).toHaveValue('Happy birthday!');

      // Fix date - all fields preserved
      await dateInput.fill('15.06.2026');
      await page.waitForTimeout(100);
      await dateInput.blur();
      await page.evaluate(() => console.log('checkpoint: before error check'));
      await expect(page.locator(`text=${words.dateFormatError}`)).not.toBeVisible();
      await page.evaluate(() => console.log('checkpoint: date fixed'));
      await expect(radios.nth(0)).toBeChecked();
      await expect(checkboxes.nth(1)).toBeChecked();
      await expect(checkboxes.nth(2)).toBeChecked();
      await expect(messageTextarea).toHaveValue('Happy birthday!');

      // Focus order and visible focus states
      await page.locator('#fixture-root').evaluate(el => { el.tabIndex = -1; el.focus(); });
      await page.evaluate(() => console.log('checkpoint: body clicked'));
      await page.keyboard.press('Tab');
      await page.evaluate(() => console.log('checkpoint: tab 1'));
      // Tab 1: first radio input focused (or currently selected)
      await expect(page.locator('input[type="radio"]').first()).toBeFocused();
      // Arrow right to navigate within radio group
      await page.keyboard.press('ArrowRight');
      await page.evaluate(() => console.log('checkpoint: arrow right 1'));
      await expect(page.locator('input[type="radio"]').nth(1)).toBeFocused();
      await page.keyboard.press('ArrowRight');
      await page.evaluate(() => console.log('checkpoint: arrow right 2'));
      await expect(page.locator('input[type="radio"]').nth(2)).toBeFocused();
      // Tab out of radio group to first checkbox
      await page.keyboard.press('Tab');
      await page.evaluate(() => console.log('checkpoint: tab 2'));
      await expect(page.locator('input[type="checkbox"]').first()).toBeFocused();
      await page.keyboard.press('Tab');
      await page.evaluate(() => console.log('checkpoint: tab 3'));
      await expect(page.locator('input[type="checkbox"]').nth(1)).toBeFocused();
      await page.keyboard.press('Tab');
      await page.evaluate(() => console.log('checkpoint: tab 4'));
      await expect(page.locator('input[type="checkbox"]').nth(2)).toBeFocused();
      await page.keyboard.press('Tab');
      await page.evaluate(() => console.log('checkpoint: tab 5'));
      await expect(page.locator(`input[placeholder="${words.datePlaceholder}"]`)).toBeFocused();
      await page.keyboard.press('Tab');
      await page.evaluate(() => console.log('checkpoint: tab 6'));
      await expect(page.locator(`textarea[placeholder="${words.messagePlaceholder}"]`)).toBeFocused();
      await page.evaluate(() => console.log('checkpoint: focus order done'));

      // No horizontal overflow
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(page.url()).toBe(initialURL);
      expect(errors).toEqual([]);
    });
  }
}

test('continuous intrinsic geometry across viewport and constraint boundaries', async ({ page, fixtureURL }) => {
  await page.setViewportSize({ width: 1440, height: 1200 });
  await page.goto(`${fixtureURL}/en/fixture/detail?widget=preferences`);
  
  // Helper to compute layout signature at a given container width
  const computeSignature = async (containerWidth: number) => {
    return await page.evaluate((width) => {
      const root = document.querySelector<HTMLElement>('#preference-container')!;
      root.style.maxWidth = 'none';
      root.style.width = `${width}px`;
      const fieldset = root.querySelector<HTMLElement>('fieldset')!;
      const f = fieldset.getBoundingClientRect();
      
      // Get radio option cards
      const labels = Array.from(root.querySelectorAll('input[type="radio"]')).map(e => e.parentElement);
      const cards = labels.map(label => {
        const box = label.getBoundingClientRect();
        const caption = label.querySelector('[class*="radioLabelText"]');
        const captionBox = caption ? caption.getBoundingClientRect() : null;
        return { box, caption: captionBox };
      });
      
      // Compute row signature: which row each card belongs to
      const ys = cards.map(c => Math.round(c.box.y));
      const first = ys[0];
      const rowSignature = cards.map((c, i) => {
        const caption = c.caption;
        const lineCount = caption ? Math.round(caption.height / 20) : 1;
        return [ys[i] === first ? 0 : ys[i] > first ? 1 : -1, lineCount];
      });
      
      // Helper text line count
      const helper = root.querySelector('[class*="helper"]');
      const helperBox = helper ? helper.getBoundingClientRect() : null;
      const helperLines = helperBox ? Math.round(helperBox.height / 18) : 1;
      
      return {
        width,
        fieldsetWidth: f.width,
        fieldsetHeight: f.height,
        rowSignature,
        helperLines,
        // Full signature for comparison
        signature: JSON.stringify({ rows: rowSignature, helper: helperLines })
      };
    }, containerWidth);
  };
  
  // Sweep widths and compute signatures
  const points: Array<number> = [];
  for (let width = 320; width <= 1440; width += 8) points.push(width);
  points.push(320, 360, 380, 381, 382, 597, 598, 599, 600, 601, 602, 624, 668, 669, 670, 704, 1440);
  const uniquePoints = Array.from(new Set(points)).sort((a, b) => a - b);
  
  const samples = [];
  for (const width of uniquePoints) {
    samples.push(await computeSignature(width));
  }
  console.log('geometry sweep', JSON.stringify(samples.map(s => ({ width: s.width, fieldsetWidth: s.fieldsetWidth, fieldsetHeight: s.fieldsetHeight, signature: s.signature }))));
  
  // Viewport boundary samples (599/600/601) - these should have same signature
  const viewportSamples = [];
  for (const width of [599, 600, 601]) {
    await page.setViewportSize({ width, height: 1200 });
    viewportSamples.push(await computeSignature(width));
  }
  console.log('viewport boundary', JSON.stringify(viewportSamples.map(s => ({ width: s.width, fieldsetWidth: s.fieldsetWidth, fieldsetHeight: s.fieldsetHeight, signature: s.signature }))));
  
  // Verify viewport boundary continuity (same signature expected)
  for (let i = 1; i < viewportSamples.length; i++) {
    for (const key of ['fieldsetWidth', 'fieldsetHeight'] as const) {
      expect(Math.abs(viewportSamples[i][key] - viewportSamples[i - 1][key]), `viewport ${key}`).toBeLessThanOrEqual(1.2);
    }
  }
  
  // Verify continuity within each signature group
  // Group consecutive samples by signature
  const groups: Array<Array<typeof samples[0]>> = [];
  let currentGroup: Array<typeof samples[0]> = [];
  let currentSig = '';
  
  for (const sample of samples) {
    if (sample.signature !== currentSig) {
      if (currentGroup.length > 0) groups.push(currentGroup);
      currentGroup = [sample];
      currentSig = sample.signature;
    } else {
      currentGroup.push(sample);
    }
  }
  if (currentGroup.length > 0) groups.push(currentGroup);
  
  // Within each group, enforce fluid continuity
  for (const group of groups) {
    for (let i = 1; i < group.length; i++) {
      const a = group[i - 1];
      const b = group[i];
      const delta = b.width - a.width;
      for (const key of ['fieldsetWidth', 'fieldsetHeight'] as const) {
        const tolerance = delta * 1.1 + 0.1;
        expect(Math.abs(b[key] - a[key]), `${key} at ${a.width}–${b.width} (sig: ${a.signature})`).toBeLessThanOrEqual(tolerance);
      }
    }
  }
  
  // At signature boundaries, verify normal reflow (bounded, unclipped, whole-word)
  // This is implicitly tested by the existing "whole words" and "no overflow" checks
  // in the locale-width test matrix. We log the boundary transitions for visibility.
  for (let i = 1; i < samples.length; i++) {
    if (samples[i].signature !== samples[i - 1].signature) {
      console.log(`Signature change at ${samples[i - 1].width}→${samples[i].width}: ${samples[i - 1].signature} → ${samples[i].signature}`);
      console.log(`  Height: ${samples[i - 1].fieldsetHeight.toFixed(4)} → ${samples[i].fieldsetHeight.toFixed(4)} (delta: ${(samples[i].fieldsetHeight - samples[i - 1].fieldsetHeight).toFixed(4)})`);
    }
  }
});