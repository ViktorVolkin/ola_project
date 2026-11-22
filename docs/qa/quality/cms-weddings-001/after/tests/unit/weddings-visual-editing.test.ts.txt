import {afterEach, beforeEach, expect, it, vi} from "vitest";
import type {VisualEditingOptions} from "@sanity/visual-editing";
const state = vi.hoisted(() => ({path: "/en", effects: [] as (() => unknown)[], options: null as VisualEditingOptions | null, push: vi.fn(), replace: vi.fn(), disable: vi.fn()}));
vi.mock("react", () => ({useEffect: (fn: () => unknown) => state.effects.push(fn), useRef: () => ({current: undefined})}));
vi.mock("next/navigation", () => ({usePathname: () => state.path, useRouter: () => ({push: state.push, replace: state.replace, back: vi.fn(), refresh: vi.fn()})}));
vi.mock("@sanity/visual-editing", () => ({enableVisualEditing: (options: VisualEditingOptions) => {state.options = options; return state.disable;}}));
import {HomeVisualEditing} from "@/components/widgets/HomeBlocks/HomeCommon/HomeVisualEditing";
beforeEach(() => {
  state.options = null; state.effects = []; vi.clearAllMocks();
  vi.stubGlobal("location", {origin: "https://preview.example.test", href: "https://preview.example.test/en"});
  vi.stubGlobal("window", {addEventListener: vi.fn(), removeEventListener: vi.fn(), matchMedia: () => ({matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn()})});
  vi.stubGlobal("document", {body: {}, querySelectorAll: () => []});
  vi.stubGlobal("MutationObserver", class {observe() {} disconnect() {}});
});
afterEach(() => vi.unstubAllGlobals());
it.each(["/en/weddings-events", "/ru/weddings-events", "/sr/weddings-events"])("SDK initializes/cleans up exact %s", path => {
  state.path = path; HomeVisualEditing(); const cleanup = state.effects[0]();
  expect(state.options).not.toBeNull(); expect(cleanup).toBeTypeOf("function");
  if (typeof cleanup === "function") cleanup();
  expect(state.disable).toHaveBeenCalledOnce();
});
it("SDK permits exact cross-page navigation and rejects foreign/normalized Weddings paths", () => {
  state.path = "/en/weddings-events"; HomeVisualEditing(); state.effects[0]();
  if (!state.options?.history) throw Error("missing history");
  const update = state.options.history.update;
  update({type: "push", url: "/ru/about"}); expect(state.push).toHaveBeenLastCalledWith("/ru/about");
  update({type: "replace", url: "/sr/weddings-events"}); expect(state.replace).toHaveBeenLastCalledWith("/sr/weddings-events");
  state.push.mockClear(); state.replace.mockClear();
  for (const url of ["/en/weddings-events?x=1", "/en/%77eddings-events", "/en/../ru/weddings-events", "https://evil.test/en/weddings-events"]) {update({type: "push", url}); update({type: "replace", url});}
  expect(state.push).not.toHaveBeenCalled(); expect(state.replace).not.toHaveBeenCalled();
});
