
import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import type {VisualEditingOptions} from "@sanity/visual-editing";

const state = vi.hoisted(() => ({
  path: "/en",
  effects: [] as (() => unknown)[],
  options: null as VisualEditingOptions | null,
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  refresh: vi.fn(),
  disable: vi.fn(),
}));

vi.mock("react", () => ({
  useEffect: (fn: () => unknown) => state.effects.push(fn),
  useRef: () => ({current: undefined}),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => state.path,
  useRouter: () => ({
    push: state.push,
    replace: state.replace,
    back: state.back,
    refresh: state.refresh,
  }),
}));

vi.mock("@sanity/visual-editing", () => ({
  enableVisualEditing: (options: VisualEditingOptions) => {
    state.options = options;
    return state.disable;
  },
}));

import {HomeVisualEditing} from "@/components/widgets/HomeBlocks/HomeCommon/HomeVisualEditing";

const origin = "https://preview.example.test";

beforeEach(() => {
  state.options = null;
  state.effects = [];
  vi.clearAllMocks();

  vi.stubGlobal("location", {
    origin,
    href: origin + state.path,
  });

  vi.stubGlobal("window", {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    matchMedia: () => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  });

  vi.stubGlobal("document", {
    body: {},
    querySelectorAll: () => [],
  });

  vi.stubGlobal(
    "MutationObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

function mount(path: string) {
  state.path = path;
  HomeVisualEditing();
  return state.effects[0]();
}

describe("shared SDK exact route lifecycle and history", () => {
  it.each([
    "/en",
    "/ru",
    "/sr",
    "/en/about",
    "/ru/about",
    "/sr/about",
    "/en/contact",
    "/ru/contact",
    "/sr/contact",
  ])("initializes and cleans up %s", (path) => {
    const cleanup = mount(path) as () => void;

    expect(state.options).not.toBeNull();

    cleanup();

    expect(state.disable).toHaveBeenCalledOnce();
  });

  it.each([
    "/de/about",
    "/en/about/x",
    "/en/contact/x",
  ])("does not initialize outside %s", (path) => {
    mount(path);
    expect(state.options).toBeNull();
  });

  it("permits supported routes while rejecting unsafe URLs", () => {
    mount("/en/about");

    const update = state.options!.history!.update;

    // Allowed navigation.
    update({type: "push", url: "/ru"});
    expect(state.push).toHaveBeenLastCalledWith("/ru");

    update({
      type: "replace",
      url: origin + "/sr/about",
    });
    expect(state.replace).toHaveBeenLastCalledWith("/sr/about");

    update({type: "push", url: "/en/contact"});
    expect(state.push).toHaveBeenLastCalledWith("/en/contact");

    // Reset call history before testing rejected URLs.
    state.push.mockClear();
    state.replace.mockClear();

    const rejectedUrls = [
      "https://evil.test/en/about",
      "//evil.test/en/about",
      "/en/../ru/about",
      "/en/%61bout",
      "/en/about?x=1",
      "/en/about#x",
      "https://preview.example.test\\en/about",
      "https://user@preview.example.test/en/about",
      "https://[",
      "",
    ];

    for (const url of rejectedUrls) {
      update({type: "push", url});
      update({type: "replace", url});
    }

    expect(state.push).not.toHaveBeenCalled();
    expect(state.replace).not.toHaveBeenCalled();
    expect(state.back).not.toHaveBeenCalled();

    // Valid pop navigation uses replace, never back().
    update({type: "pop", url: "/en/contact"});
    expect(state.replace).toHaveBeenLastCalledWith("/en/contact");

    update({type: "pop", url: "/en/about"});
    expect(state.replace).toHaveBeenLastCalledWith("/en/about");

    expect(state.back).not.toHaveBeenCalled();
  });
});
