import {expect, test, type Page} from "@playwright/test";
import en from "../../src/i18n/messages/en.json";
import ru from "../../src/i18n/messages/ru.json";
import sr from "../../src/i18n/messages/sr.json";
import {writeFile} from "node:fs/promises";

for (const motion of ["no-preference", "reduce"] as const) {
  test(`${motion}: active wheel hands off to native Home`, async ({page}, info) => {
    await page.setViewportSize({width: 1280, height: 800});
    await page.emulateMedia({reducedMotion: motion});
    await page.goto("/en");
    if (motion === "no-preference") await expect(page.locator("html")).toHaveClass(/\blenis\b/);
    await page.evaluate(() => { window.scrollTo(0, 1500); });
    await page.waitForTimeout(150);
    await page.evaluate(() => {
      const evidence = {key: null as null | object, frames: [] as number[]};
      Object.assign(window, {__handoff: evidence});
      document.addEventListener("keydown", e => {
        if (e.key !== "Home") return;
        evidence.key = {key: e.key, trusted: e.isTrusted, prevented: e.defaultPrevented, y: scrollY, root: document.documentElement.className, focus: document.activeElement?.outerHTML.slice(0, 300)};
        const tick = () => { evidence.frames.push(scrollY); if (evidence.frames.length < 90) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }, {capture: true, once: true});
    });
    await page.mouse.move(640, 400);
    await page.mouse.wheel(0, 1000);
    await page.waitForTimeout(50);
    const before = await state(page);
    await page.keyboard.press("Home");
    await expect.poll(() => page.evaluate(() => (window as unknown as {__handoff: {frames: number[]}}).__handoff.frames.length)).toBe(90);
    const evidence = await page.evaluate(() => (window as unknown as {__handoff: {key: {trusted: boolean; prevented: boolean; root: string; y: number}; frames: number[]}}).__handoff);
    console.log("HANDOFF", motion, JSON.stringify({before, ...evidence}));
    await writeFile(info.outputPath("handoff.json"), JSON.stringify({before, ...evidence}, null, 2));
    expect(evidence.key.trusted).toBe(true);
    expect(evidence.key.prevented).toBe(false);
    if (motion === "no-preference") expect(before.root).toContain("lenis-smooth");
    expect(evidence.frames[89]).toBeLessThan(2);
    const reachedHome = evidence.frames.findIndex(y => y < 2);
    expect(reachedHome).toBeGreaterThanOrEqual(0);
    expect(evidence.frames.slice(reachedHome).every(y => y < 2)).toBe(true);
  });
}

async function state(page: Page) {
  return page.evaluate(() => ({url: location.href, y: scrollY, root: document.documentElement.className, reduced: matchMedia("(prefers-reduced-motion: reduce)").matches, focus: document.activeElement?.outerHTML.slice(0, 300)}));
}

async function settled(page: Page) {
  await page.evaluate(() => new Promise<void>((resolve, reject) => {
    let last = scrollY, stable = 0, frames = 0;
    const tick = () => { stable = Math.abs(scrollY - last) < 0.5 ? stable + 1 : 0; last = scrollY; if (stable >= 12) resolve(); else if (++frames > 360) reject(new Error("scroll did not settle")); else requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }));
}

test("active wheel hands off to offscreen native focus", async ({page}) => {
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/en");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(150);
  await page.mouse.move(200, 300);
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(50);
  expect((await state(page)).root).toContain("lenis-smooth");
  const target = page.locator("footer a[href]").last();
  await target.focus();
  await expect(target).toBeFocused();
  await settled(page);
  await expect(target).toBeFocused();
  expect(await target.evaluate(el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; })).toBe(true);
});

test("active Lenis restores deep full-route history in both directions", async ({page}, info) => {
  const observations: Record<string, unknown> = {};
  const ready = async () => {
    await page.evaluate(async () => {
      for (const image of document.images) image.loading = "eager";
      await document.fonts.ready;
      await Promise.all(Array.from(document.images, image => image.decode()));
    });
    await expect(page.locator("html")).toHaveClass(/\blenis\b/);
    await settled(page);
  };
  try {
    await page.emulateMedia({reducedMotion: "no-preference"});
    await page.goto("/en/about");
    await ready();
    const link = page.locator('footer a[href="/en/contact"]');
    await link.scrollIntoViewIfNeeded();
    await settled(page);
    await page.evaluate(() => document.addEventListener("click", event => {
      const target = (event.target as Element).closest("a");
      if (target?.getAttribute("href") === "/en/contact") sessionStorage.setItem("deepHistoryClick", JSON.stringify({y: scrollY, href: target.getAttribute("href"), focus: document.activeElement?.outerHTML.slice(0, 300), root: document.documentElement.className}));
    }, {capture: true, once: true}));
    await link.click();
    await expect(page).toHaveURL(/\/en\/contact$/);
    observations.click = JSON.parse((await page.evaluate(() => sessionStorage.getItem("deepHistoryClick")))!);
    const sourceY = (observations.click as {y: number}).y;
    expect(sourceY).toBeGreaterThan(800);
    await ready();
    await page.locator("footer").scrollIntoViewIfNeeded();
    await settled(page);
    const targetY = await page.evaluate(() => scrollY);
    observations.target = await state(page);
    expect(targetY).toBeGreaterThan(800);
    await page.goBack();
    await expect(page).toHaveURL(/\/en\/about$/);
    await ready();
    observations.back = await state(page);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(sourceY, 0);
    await settled(page);
    observations.backStable = await state(page);
    expect((observations.backStable as {y: number}).y).toBeCloseTo(sourceY, 0);
    await page.goForward();
    await expect(page).toHaveURL(/\/en\/contact$/);
    await ready();
    observations.forward = await state(page);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(targetY, 0);
    await settled(page);
    observations.forwardStable = await state(page);
    expect((observations.forwardStable as {y: number}).y).toBeCloseTo(targetY, 0);
  } finally {
    await writeFile(info.outputPath("deep-history.json"), JSON.stringify(observations, null, 2));
    console.log("DEEP_HISTORY", JSON.stringify(observations));
  }
});

for (const motion of ["no-preference", "reduce"] as const) {
  test(`${motion}: keyboard focus, skip and full route history`, async ({page}, info) => {
    const observations: unknown[] = [];
    await page.emulateMedia({reducedMotion: motion});
    await page.setViewportSize({width: 1440, height: 900});
    await page.goto("/en");
    if (motion === "reduce") await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
    else await expect(page.locator("html")).toHaveClass(/\blenis\b/);
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", {name: "Skip to content"})).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main-content$/);
    await expect.poll(() => page.locator("#main-content").evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
    observations.push({step: "skip", ...(await state(page))});
    const target = page.locator("footer a[href]").last();
    await target.focus();
    await expect(target).toBeFocused();
    await expect.poll(() => target.evaluate(el => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; })).toBe(true);
    await settled(page);
    observations.push({step: "offscreen focus", ...(await state(page))});
    await page.goto("/en/about");
    await page.keyboard.press("End");
    await expect.poll(() => page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
    await settled(page);
    await page.keyboard.press("Home");
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(10);
    await settled(page);
    observations.push({step: "home settled", ...(await state(page))});
    await page.keyboard.press("PageDown");
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
    await settled(page);
    observations.push({step: "page down", ...(await state(page))});
    const link = page.getByRole("banner").getByRole("link", {name: "Contact", exact: true});
    await link.focus();
    await settled(page);
    const beforeRoute = await page.evaluate(() => scrollY);
    await link.click();
    await expect(page).toHaveURL(/\/en\/contact$/);
    observations.push({step: "contact", ...(await state(page))});
    await page.goBack();
    await expect(page).toHaveURL(/\/en\/about$/);
    await settled(page);
    await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(beforeRoute, 0);
    observations.push({step: "back", beforeRoute, ...(await state(page))});
    await page.goForward();
    await expect(page).toHaveURL(/\/en\/contact$/);
    await settled(page);
    observations.push({step: "forward", ...(await state(page))});
    const header = page.getByRole("banner");
    await header.getByRole("button", {name: /Language/}).click();
    await header.getByRole("link", {name: "Srpski", exact: true}).click();
    await expect(page).toHaveURL(/\/sr\/contact$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "sr-Latn");
    observations.push({step: "locale", ...(await state(page))});
    await info.attach("focus-history.json", {body: JSON.stringify(observations, null, 2), contentType: "application/json"});
  });
}

for (const [locale, {Navigation: labels}] of Object.entries({en, ru, sr})) {
  for (const width of [360, 768, 1440]) {
    test(`${locale} ${width}: static chrome, controls and focus bounds`, async ({page}, info) => {
      await page.setViewportSize({width, height: 900});
      await page.emulateMedia({reducedMotion: "no-preference"});
      await page.goto(`/${locale}/about`);
      await expect(page.locator("html")).toHaveClass(/\blenis\b/);
      await page.evaluate(() => document.fonts.ready);
      const header = page.getByRole("banner");
      const control = width < 1000 ? header.locator('button[aria-haspopup="dialog"]') : header.getByRole("navigation", {name: labels.navigation});
      await expect(control).toBeVisible();
      const headerBounds = await header.evaluate(el => el.getBoundingClientRect().toJSON());
      let focusBounds;
      if (width < 1000) {
        await control.focus();
        await expect(control).toBeFocused();
        focusBounds = await control.evaluate(el => ({rect: el.getBoundingClientRect().toJSON(), focused: document.activeElement === el}));
        await control.click();
        await expect(page.getByRole("dialog")).toBeVisible();
      }
      const scope = width < 1000 ? page.getByRole("dialog") : control;
      const metrics = await scope.locator("a:visible, button:visible").evaluateAll(elements => elements.map(el => {
        const r = el.getBoundingClientRect(), css = getComputedStyle(el);
        return {text: el.textContent?.trim(), x: r.x, y: r.y, width: r.width, height: r.height, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, color: css.color, font: css.fontFamily};
      }));
      await writeFile(info.outputPath("bounds.json"), JSON.stringify({locale, width, headerBounds, focusBounds, metrics}, null, 2));
      expect(metrics.length).toBeGreaterThan(0);
      for (const r of metrics) {
        expect(r.width).toBeGreaterThan(0);
        expect(r.x).toBeGreaterThanOrEqual(-1);
        expect(r.x + r.width).toBeLessThanOrEqual(width + 1);
        expect(r.scrollWidth).toBeLessThanOrEqual(r.clientWidth + 1);
      }
      await info.attach("bounds.json", {body: JSON.stringify(metrics, null, 2), contentType: "application/json"});
      await page.screenshot({path: info.outputPath("chrome.png")});
      if (width < 1000) {
        await page.keyboard.press("Escape");
        await expect(control).toBeFocused();
      }
    });
  }
}

test("touch control diagnostic", async ({browser}, info) => {
  for (const mode of ["control", "main-reduce", "main-normal", "reduce", "normal"] as const) {
    const context = await browser.newContext({baseURL: "http://127.0.0.1:3100", viewport: {width: 390, height: 300}, hasTouch: true, isMobile: true, reducedMotion: mode.includes("reduce") ? "reduce" : "no-preference"});
    const page = await context.newPage();
    if (mode === "control") await page.setContent('<meta name="viewport" content="width=device-width, initial-scale=1"><div id="control" style="overflow:auto;height:220px;width:390px"><div style="height:504px">control</div></div>');
    else { await page.goto('/en'); if (!mode.startsWith('main')) await page.getByRole('button', {name: 'Open navigation'}).tap(); else if (mode === 'main-normal') await expect(page.locator('html')).toHaveClass(/\blenis\b/); }
    const surface = mode === "control" ? page.locator('#control') : mode.startsWith('main') ? page.locator('html') : page.getByRole('dialog');
    await expect(surface).toBeVisible();
    const box = (await surface.boundingBox())!;
    const x = mode.startsWith('main') ? 195 : box.x + box.width / 2, y = mode.startsWith('main') ? 260 : Math.min(box.y + box.height - 30, 260);
    await page.evaluate(() => {
      const events: unknown[] = [];
      (window as unknown as {touchLog: unknown[]}).touchLog = events;
      for (const type of ['touchstart', 'touchmove', 'touchend', 'touchcancel']) document.addEventListener(type, e => {
        const target = e.target as Element;
        const record = {type, trusted: e.isTrusted, cancelable: e.cancelable, prevented: false, target: target?.outerHTML.slice(0, 200)};
        events.push(record); setTimeout(() => {record.prevented = e.defaultPrevented;}, 0);
      }, {capture: true, passive: true});
    });
    const before = await surface.evaluate((el, point) => {
      const hit = document.elementFromPoint(point.x, point.y); const ancestors = [];
      for (let node = hit; node; node = node.parentElement) { const c = getComputedStyle(node); ancestors.push({tag: node.tagName, className: node.className, overflowY: c.overflowY, touchAction: c.touchAction, scrollTop: node.scrollTop, scrollHeight: node.scrollHeight, clientHeight: node.clientHeight}); }
      return {touch: navigator.maxTouchPoints, rect: el.getBoundingClientRect().toJSON(), hit: hit?.outerHTML.slice(0, 200), ancestors, windowY: scrollY, root: document.documentElement.className};
    }, {x, y});
    const session = await context.newCDPSession(page);
    await session.send('Input.dispatchTouchEvent', {type: 'touchStart', touchPoints: [{x, y}]});
    for (let step = 1; step <= 6; step++) await session.send('Input.dispatchTouchEvent', {type: 'touchMove', touchPoints: [{x, y: y - step * 30}]});
    await session.send('Input.dispatchTouchEvent', {type: 'touchEnd', touchPoints: []});
    await page.waitForTimeout(500);
    const after = await surface.evaluate(el => ({scrollTop: el.scrollTop, windowY: scrollY, events: (window as unknown as {touchLog: unknown[]}).touchLog}));
    console.log('CONTROL_DIAGNOSTIC', JSON.stringify({mode, x, y, before, after}));
    await writeFile(info.outputPath(`${mode}.json`), JSON.stringify({mode, x, y, before, after}, null, 2));
    expect(after.events.length).toBeGreaterThan(2);
    if (mode.startsWith('main')) expect(after.windowY).toBeGreaterThan(0);
    else { expect(after.scrollTop).toBeGreaterThan(0); expect(after.windowY).toBe(0); }
    await context.close();
  }
});

test("touch-emulated short menu accepts native panel swipe", async ({browser}, info) => {
  const context = await browser.newContext({baseURL: "http://127.0.0.1:3100", viewport: {width: 390, height: 300}, hasTouch: true, isMobile: true, reducedMotion: "no-preference"});
  const page = await context.newPage();
  await page.goto("/en");
  await page.getByRole("button", {name: "Open navigation"}).tap();
  const panel = page.getByRole("dialog");
  await expect(panel).toBeVisible();
  const box = (await panel.boundingBox())!;
  const session = await context.newCDPSession(page);
  const x = box.x + box.width / 2, y = Math.min(box.y + box.height - 30, 260);
  const before = await panel.evaluate((el, point) => ({scrollTop: el.scrollTop, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight, rect: el.getBoundingClientRect().toJSON(), hit: document.elementFromPoint(point.x, point.y)?.outerHTML.slice(0, 300), viewport: {width: innerWidth, height: innerHeight}}), {x, y});
  console.log("touch-before", JSON.stringify(before));
  await session.send("Input.dispatchTouchEvent", {type: "touchStart", touchPoints: [{x, y}]});
  for (let step = 1; step <= 6; step++) await session.send("Input.dispatchTouchEvent", {type: "touchMove", touchPoints: [{x, y: y - step * 30}]});
  await session.send("Input.dispatchTouchEvent", {type: "touchEnd", touchPoints: []});
  await expect.poll(() => panel.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await info.attach("touch.json", {body: JSON.stringify({panelScroll: await panel.evaluate(el => el.scrollTop), windowScroll: await page.evaluate(() => scrollY), box}, null, 2), contentType: "application/json"});
  await context.close();
});

test("current SSR and hydrated reduced and normal chrome at rest", async ({browser}, info) => {
  const samples = [];
  for (const mode of ["no-js", "reduce", "normal"] as const) {
    const context = await browser.newContext({baseURL: "http://127.0.0.1:3100", viewport: {width: 1440, height: 900}, javaScriptEnabled: mode !== "no-js", reducedMotion: mode === "reduce" ? "reduce" : "no-preference"});
    const page = await context.newPage();
    await page.goto("/en/about");
    await page.evaluate(() => document.fonts.ready);
    if (mode === "normal") await expect(page.locator("html")).toHaveClass(/\blenis\b/);
    const sample = await page.locator("header").evaluate(el => { const r = el.getBoundingClientRect(), c = getComputedStyle(el); return {x: r.x, y: r.y, width: r.width, height: r.height, color: c.color, font: c.fontFamily}; });
    samples.push({mode, ...sample});
    await page.screenshot({path: info.outputPath(`${mode}.png`)});
    await context.close();
  }
  expect(samples[1].height).toBe(samples[0].height);
  expect(samples[2].height).toBe(samples[0].height);
  await info.attach("render-comparison.json", {body: JSON.stringify(samples, null, 2), contentType: "application/json"});
});
