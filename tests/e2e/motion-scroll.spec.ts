import {expect, test, type Page} from "@playwright/test";
import {writeFile} from "node:fs/promises";

type HandoffEvidence = {events: {type: string; key: string; trusted: boolean; prevented: boolean; y: number; focus: string}[]; frames: {y: number; focus: string; visible: boolean}[]};

async function armHandoff(page: Page) {
  await page.evaluate(() => {
    const evidence: HandoffEvidence = {events: [], frames: []};
    Object.assign(window, {__nativeHandoff: evidence});
    const describe = () => {
      const el = document.activeElement as HTMLElement | null;
      const r = el?.getBoundingClientRect();
      return {y: scrollY, focus: el?.outerHTML.slice(0, 220) ?? "", visible: !!r && r.bottom > 0 && r.top < innerHeight};
    };
    for (const type of ["keydown", "click", "focusin"]) document.addEventListener(type, event => {
      const entry = {type, key: event instanceof KeyboardEvent ? event.key : "", trusted: event.isTrusted, prevented: event.defaultPrevented, y: scrollY, focus: describe().focus};
      evidence.events.push(entry);
      queueMicrotask(() => { entry.prevented = event.defaultPrevented; });
      if (type === "keydown" && event instanceof KeyboardEvent && event.key !== "Shift" && evidence.frames.length === 0) {
        const tick = () => { evidence.frames.push(describe()); if (evidence.frames.length < 90) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }
    }, {capture: true});
  });
}

async function activeWheel(page: Page) {
  await page.mouse.move(200, 300);
  await page.mouse.wheel(0, 1000);
  await page.waitForTimeout(50);
  const before = await page.evaluate(() => ({y: scrollY, root: document.documentElement.className, focus: document.activeElement?.outerHTML.slice(0, 220)}));
  expect(before.root).toContain("lenis-smooth");
  return before;
}

for (const action of ["Tab", "fragment", "End", "PageUp", "PageDown", "editable"] as const) {
  test(`active wheel native handoff: ${action}`, async ({page}, info) => {
    await page.emulateMedia({reducedMotion: "no-preference"});
    await page.addInitScript(() => {
      const events: {key: string; root: string; y: number}[] = [];
      Object.assign(window, {__preProviderKeys: events});
      window.addEventListener("keydown", event => events.push({key: event.key, root: document.documentElement.className, y: scrollY}), true);
    });
    await page.goto("/en");
    await expect(page.locator("html")).toHaveClass(/\blenis\b/);
    if (action === "Tab") {
      const links = page.locator("footer a[href]");
      expect(await links.count()).toBeGreaterThan(1);
      await links.nth((await links.count()) - 2).evaluate(el => (el as HTMLElement).focus({preventScroll: true}));
    } else if (action === "fragment") {
      await page.getByRole("link", {name: "Skip to content"}).evaluate(el => (el as HTMLElement).focus({preventScroll: true}));
    } else if (action === "editable") {
      await page.evaluate(() => {
        const input = document.createElement("input");
        input.id = "handoff-test-input";
        input.value = "abcdef";
        input.style.cssText = "position:fixed;top:100px;left:100px;z-index:99999";
        document.body.append(input);
        input.focus({preventScroll: true});
        input.setSelectionRange(4, 4);
      });
    }
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(150);
    await armHandoff(page);
    const before = await activeWheel(page);
    if (action === "Tab") {
      const target = page.locator("footer a[href]").last();
      expect(await target.evaluate(el => el.getBoundingClientRect().top > innerHeight)).toBe(true);
      await page.keyboard.press("Tab");
    } else if (action === "fragment") await page.keyboard.press("Enter");
    else if (action === "editable") await page.keyboard.press("Shift+ArrowLeft");
    else await page.keyboard.press(action);
    await expect.poll(() => page.evaluate(() => (window as unknown as {__nativeHandoff: HandoffEvidence}).__nativeHandoff.frames.length)).toBe(90);
    const evidence = await page.evaluate(() => (window as unknown as {__nativeHandoff: HandoffEvidence}).__nativeHandoff);
    const key = evidence.events.find(event => event.type === "keydown" && event.key !== "Shift")!;
    const preKey = await page.evaluate(() => (window as unknown as {__preProviderKeys: {key: string; root: string; y: number}[]}).__preProviderKeys.find(event => event.key !== "Shift"));
    console.log("NATIVE_HANDOFF", action, JSON.stringify({before, preKey, evidence}));
    await writeFile(info.outputPath(`${action}.json`), JSON.stringify({before, preKey, evidence}, null, 2));
    expect(preKey?.root).toContain("lenis-smooth");
    expect(key.trusted).toBe(true);
    expect(key.prevented).toBe(false);
    if (action === "Tab") {
      await expect(page.locator("footer a[href]").last()).toBeFocused();
      expect(evidence.frames.slice(-30).every(frame => frame.visible)).toBe(true);
      expect(Math.max(...evidence.frames.slice(-30).map(frame => frame.y)) - Math.min(...evidence.frames.slice(-30).map(frame => frame.y))).toBeLessThan(2);
    } else if (action === "fragment") {
      await expect(page).toHaveURL(/#main-content$/);
      const click = evidence.events.find(event => event.type === "click");
      expect(click?.trusted).toBe(true);
      expect(click?.prevented).toBe(false);
      expect(await page.locator("#main-content").evaluate(el => Math.abs(el.getBoundingClientRect().top))).toBeLessThan(3);
    } else if (action === "editable") {
      const input = page.locator("#handoff-test-input");
      await expect(input).toBeFocused();
      expect(await input.evaluate(el => ({value: (el as HTMLInputElement).value, start: (el as HTMLInputElement).selectionStart, end: (el as HTMLInputElement).selectionEnd}))).toEqual({value: "abcdef", start: 3, end: 4});
    } else if (action === "End") {
      expect(await page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
    } else if (action === "PageUp") expect(evidence.frames[89].y).toBeLessThan(key.y - 100);
    else expect(evidence.frames[89].y).toBeGreaterThan(key.y + 100);
  });
}


test("wheel smoothing and live reduced-motion fallback", async ({page}) => {
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/en");
  const root = page.locator("html");
  await expect(root).toHaveClass(/\blenis\b/);
  await page.mouse.move(500, 400);
  await page.mouse.wheel(0, 650);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await page.emulateMedia({reducedMotion: "reduce"});
  await expect(root).not.toHaveClass(/\blenis\b/);
  const before = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(before);
  await page.emulateMedia({reducedMotion: "no-preference"});
  await expect(root).toHaveClass(/\blenis\b/);
});

test("reduced motion from first load and native keyboard/hash navigation", async ({page}) => {
  await page.emulateMedia({reducedMotion: "reduce"});
  await page.goto("/en#main-content");
  await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  await expect(page.locator("#main-content")).toBeVisible();
  // The endpoint can precede Chromium's native scrollend. A key issued in
  // that interval may be swallowed even without application handlers.
  await page.evaluate(() => {
    const ends: number[] = [];
    Object.assign(window, {__nativeScrollEnds: ends});
    document.addEventListener("scrollend", () => { ends.push(window.scrollY); });
  });
  await page.keyboard.press("End");
  await expect.poll(() => page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
  await expect.poll(() => page.evaluate(() => {
    const ends = (window as unknown as {__nativeScrollEnds: number[]}).__nativeScrollEnds;
    return ends.some(y => Math.abs(document.documentElement.scrollHeight - innerHeight - y) < 2);
  })).toBe(true);
  const endCount = await page.evaluate(() => (window as unknown as {__nativeScrollEnds: number[]}).__nativeScrollEnds.length);
  await page.keyboard.press("Home");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
  await expect.poll(() => page.evaluate((count) => (window as unknown as {__nativeScrollEnds: number[]}).__nativeScrollEnds.slice(count).includes(0), endCount)).toBe(true);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await page.keyboard.press("PageDown");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
});

test("active Lenis interpolates a wheel across animation frames", async ({page}) => {
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/en");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await page.mouse.move(300, 400);
  const samples = page.evaluate(() => new Promise<number[]>((resolve) => {
    const values: number[] = [];
    const frame = () => {
      values.push(window.scrollY);
      if (values.length < 60) requestAnimationFrame(frame);
      else resolve(values);
    };
    requestAnimationFrame(frame);
  }));
  await page.mouse.wheel(0, 650);
  const values = await samples;
  expect(new Set(values.filter((value) => value > 0)).size).toBeGreaterThan(3);
});

test("active motion retains native keyboard navigation", async ({page}) => {
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/en");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await page.keyboard.press("End");
  await expect.poll(() => page.evaluate(() => Math.abs(document.documentElement.scrollHeight - innerHeight - scrollY))).toBeLessThan(2);
  await page.keyboard.press("Home");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
  await expect.poll(() => page.evaluate(async () => {
    const before = window.scrollY;
    await new Promise((resolve) => setTimeout(resolve, 250));
    return before === 0 && window.scrollY === 0;
  })).toBe(true);
  await page.keyboard.press("PageDown");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(100);
});

test("active motion skip link and browser history preserve native hashes", async ({page}) => {
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/en");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", {name: "Skip to content"})).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
  await expect.poll(() => page.locator("#main-content").evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(3);
  await page.goBack();
  await expect(page).toHaveURL(/\/en$/);
  await page.goForward();
  await expect(page).toHaveURL(/#main-content$/);
  await expect.poll(() => page.locator("#main-content").evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(3);
  await page.goto("/en#main-content");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await expect.poll(() => page.locator("#main-content").evaluate((element) => Math.abs(element.getBoundingClientRect().top))).toBeLessThan(3);
});

test("short mobile panel scrolls while background remains locked", async ({page}) => {
  await page.setViewportSize({width: 390, height: 300});
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/en");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  await page.getByRole("button", {name: "Open navigation"}).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(page.locator("html")).not.toHaveClass(/\blenis\b/);
  await page.mouse.move(4, 4);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await dialog.hover({position: {x: 150, y: 100}});
  await page.mouse.wheel(0, 400);
  await expect.poll(() => dialog.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
});

test("mobile modal suspends Lenis and restores it on Escape", async ({page}) => {
  await page.setViewportSize({width: 390, height: 700});
  await page.emulateMedia({reducedMotion: "no-preference"});
  await page.goto("/en");
  const root = page.locator("html");
  await expect(root).toHaveClass(/\blenis\b/);
  const trigger = page.getByRole("button", {name: "Open navigation"});
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(root).not.toHaveClass(/\blenis\b/);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await expect(root).toHaveClass(/\blenis\b/);
});
