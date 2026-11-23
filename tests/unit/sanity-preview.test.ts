
import {beforeEach, describe, expect, it, vi} from "vitest";
import {createClient} from "next-sanity";
import {parsePreviewHome} from "@/content/sanity/preview-content";
import {getHomeContent} from "@/content/home";
import {
  homePath,
  trustedStudio,
  validEnableUrl,
} from "@/content/sanity/preview-policy";

vi.mock("server-only", () => ({}));

const state = vi.hoisted(() => ({
  enabled: false,
  token: true,
  fetch: vi.fn(),
  enable: vi.fn(),
  disable: vi.fn(),
  cookies: new Map<string, unknown>(),
  writes: [] as Record<string, unknown>[],
}));

const client = createClient({
  projectId: "zhn2ddaj",
  dataset: "production",
  apiVersion: "2025-02-19",
  token: "synthetic-test-read-token",
  useCdn: false,
});

vi.spyOn(client, "withConfig").mockReturnValue(client);
vi.spyOn(client, "fetch").mockImplementation(state.fetch);

vi.mock("@/content/sanity/preview-client", () => ({
  previewClient: () => state.token ? client : null,
}));

vi.mock("next/headers", () => ({
  draftMode: async () => ({
    isEnabled: state.enabled,
    enable: () => {
      state.enable();
      state.enabled = true;
      state.cookies.set("__prerender_bypass", {
        value: "synthetic-cookie",
      });
    },
    disable: () => {
      state.disable();
      state.enabled = false;
    },
  }),
  cookies: async () => ({
    get: (key: string) => state.cookies.get(key),
    set: (...args: unknown[]) => {
      state.writes.push(
        (typeof args[0] === "string"
          ? {
              ...(args[2] as object),
              name: args[0],
              value: args[1],
            }
          : args[0]) as Record<string, unknown>,
      );
    },
  }),
}));

const {GET: enable} = await import(
  "@/app/api/draft-mode/enable/route"
);

const {GET: disable} = await import(
  "@/app/api/draft-mode/disable/route"
);

const origin = "https://preview.example.test";

const request = (
  query = "sanity-preview-secret=synthetic-secret&sanity-preview-pathname=%2Fru",
  headers = {},
) =>
  new Request(
    `${origin}/api/draft-mode/enable?${query}`,
    {headers},
  );

function validSecret(
  studioUrl = "https://www.sanity.io/@obdulf8du/studio/xxpedejjvg9va6r4u8t4llzw",
) {
  state.fetch.mockResolvedValue({
    private: {
      _id: "sanity-preview-url-secret.synthetic",
      _updatedAt: "2026-01-01",
      secret: "synthetic-secret",
      studioUrl,
    },
    public: null,
  });
}

beforeEach(() => {
  vi.stubEnv("NODE_ENV", "production");
  vi.stubEnv("SANITY_PREVIEW_ORIGIN", origin);

  state.enabled = false;
  state.token = true;
  state.fetch.mockReset();
  state.enable.mockClear();
  state.disable.mockClear();
  state.cookies.clear();
  state.writes = [];
});

describe("official preview helper with strict homepage boundary", () => {
  it("fails closed without server config", async () => {
    state.token = false;

    expect((await enable(request())).status).toBe(503);
    expect(state.enable).not.toHaveBeenCalled();
  });

  it.each([
    "",
    "sanity-preview-pathname=%2Fen",
    "sanity-preview-secret=x&sanity-preview-pathname=https%3A%2F%2Fevil.test%2Fen",
    "sanity-preview-secret=x&sanity-preview-pathname=%2F%2Fevil.test",
    "sanity-preview-secret=x&sanity-preview-pathname=%2Fen%3Fx%3D1",
    "sanity-preview-secret=x&sanity-preview-pathname=%2Fen%23x",
    "sanity-preview-secret=x&sanity-preview-pathname=%2Fde",
    "sanity-preview-secret=x&sanity-preview-pathname=%2Fen&sanity-preview-pathname=%2Fru",
    "sanity-preview-secret=x&sanity-preview-pathname=%2Fen&sanity-preview-perspective=raw",
    "sanity-preview-secret=x&sanity-preview-pathname=%2Fen&projectId=wrong",
  ])("rejects abusive query %s before SDK/cookies", async query => {
    expect((await enable(request(query))).status).toBe(400);
    expect(state.fetch).not.toHaveBeenCalled();
    expect(state.enable).not.toHaveBeenCalled();
  });

  it.each([
    "wrong",
    "expired",
    "wrong-project",
  ])("official secret lookup rejects %s", async () => {
    state.fetch.mockResolvedValue({
      private: null,
      public: null,
    });

    expect((await enable(request())).status).toBe(401);
    expect(state.enable).not.toHaveBeenCalled();

    const [query, , options] = state.fetch.mock.calls[0];

    expect(query).toContain(
      "dateTime(_updatedAt) > dateTime(now()) - 3600",
    );
    expect(options.cache).toBe("no-store");
  });

  it("rejects API failures without reflecting secrets", async () => {
    state.fetch.mockRejectedValue(
      Error("synthetic-test-read-token synthetic-secret"),
    );

    const res = await enable(request());

    expect(res.status).toBe(401);
    expect(await res.text()).not.toMatch(/synthetic/);
  });

  it.each([
    "https://evil.test/studio",
    "https://www.sanity.io.evil.test",
    "http://localhost:3333",
  ])("rejects secret tied to untrusted Studio %s", async studio => {
    validSecret(studio);

    expect((await enable(request())).status).toBe(401);
    expect(state.enable).not.toHaveBeenCalled();
  });

  it(
    "legitimate SDK flow enables secure HttpOnly CHIPS cookie then redirects to exact locale",
    async () => {
      validSecret();

      await expect(
        enable(
          request(undefined, {
            "sec-fetch-dest": "iframe",
            "sec-fetch-site": "cross-site",
          }),
        ),
      ).rejects.toMatchObject({
        digest: expect.stringContaining(
          "NEXT_REDIRECT;replace;/ru;",
        ),
      });

      expect(state.enable).toHaveBeenCalledOnce();

      expect(state.writes).toContainEqual(
        expect.objectContaining({
          name: "__prerender_bypass",
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        }),
      );
    },
  );

  it.each([false, true])(
    "explicit exit clears regular and partitioned cookies %s",
    async partitioned => {
      validSecret();

      await expect(enable(request())).rejects.toBeDefined();

      expect(state.writes).toContainEqual(
        expect.objectContaining({
          name: "__prerender_bypass",
          partitioned: false,
        }),
      );

      if (partitioned) {
        state.cookies.set("sanity-preview-partitioned", {
          value: "1",
        });
      }

      const res = await disable(
        new Request(
          `${origin}/api/draft-mode/disable?returnTo=/sr`,
        ),
      );

      expect(res.status).toBe(303);
      expect(res.headers.get("location")).toBe(`${origin}/sr`);
      expect(res.headers.get("cache-control")).toBe(
        "private, no-store",
      );

      expect(state.disable).toHaveBeenCalledOnce();
      expect(state.enabled).toBe(false);

      const setCookies = res.headers.getSetCookie();

      for (const name of [
        "__prerender_bypass",
        "sanity-preview-perspective",
        "sanity-preview-partitioned",
      ]) {
        const matching = setCookies.filter(cookie =>
          cookie.startsWith(`${name}=`),
        );

        // One ordinary cookie and one CHIPS cookie.
        expect(matching).toHaveLength(2);

        for (const cookie of matching) {
          expect(cookie).toContain("Max-Age=0");
          expect(cookie).toContain("Path=/");
          expect(cookie).toContain("HttpOnly");
          expect(cookie).toContain("Secure");
          expect(cookie).toContain("SameSite=None");
          expect(cookie).toContain(
            "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
          );
        }

        expect(
          matching.some(cookie =>
            /(?:^|;\s*)Partitioned(?:;|$)/i.test(cookie),
          ),
        ).toBe(true);

        expect(
          matching.some(cookie =>
            !/(?:^|;\s*)Partitioned(?:;|$)/i.test(cookie),
          ),
        ).toBe(true);
      }
    },
  );

  it.each([
    "/en/about",
    "/ru/about",
    "/sr/about",
  ])(
    "official secret, origin, redirect and exit retain exact About path %s",
    async path => {
      validSecret();

      const query =
        `sanity-preview-secret=synthetic-secret&sanity-preview-pathname=${encodeURIComponent(path)}`;

      await expect(
        enable(request(query)),
      ).rejects.toMatchObject({
        digest: expect.stringContaining(
          `NEXT_REDIRECT;replace;${path};`,
        ),
      });

      expect(state.enable).toHaveBeenCalledOnce();

      const res = await disable(
        new Request(
          `${origin}/api/draft-mode/disable?returnTo=${encodeURIComponent(path)}`,
        ),
      );

      expect(res.status).toBe(303);
      expect(res.headers.get("location")).toBe(origin + path);
    },
  );

  it(
    "About auth rejects wrong request origin before the secret lookup",
    async () => {
      validSecret();

      expect(
        (
          await enable(
            new Request(
              "https://evil.test/api/draft-mode/enable?sanity-preview-secret=synthetic-secret&sanity-preview-pathname=/en/about",
            ),
          )
        ).status,
      ).toBe(400);

      expect(state.fetch).not.toHaveBeenCalled();
      expect(state.enable).not.toHaveBeenCalled();
    },
  );

  it("exit cannot redirect outside the homepage locales", async () => {
    const res = await disable(
      new Request(
        `${origin}/api/draft-mode/disable?returnTo=//evil.test`,
      ),
    );

    expect(res.status).toBe(400);
    expect(state.disable).not.toHaveBeenCalled();
  });
});

describe("preview-only partial canonical data", () => {
  it.each(["en", "ru", "sr"] as const)(
    "shows partial %s edits, never another language, and identifies every fallback",
    locale => {
      const result = parsePreviewHome(
        {
          _id: "homePage",
          _type: "homePage",
          hero: {
            title: {
              [locale]: "Synthetic edited title",
            },
          },
          labels: {
            shopBouquets: {
              [locale]: "Synthetic button",
            },
          },
        },
        locale,
        null,
      );

      expect(result.content.hero.title).toBe(
        "Synthetic edited title",
      );
      expect(result.labels.shopBouquets).toBe(
        "Synthetic button",
      );
      expect(result.content.meet).toEqual(
        getHomeContent(locale).meet,
      );
      expect(result.fallbackPaths).toContain(
        `hero.description.${locale}`,
      );
      expect(result.fallbackPaths).toContain(
        "services.weddingsMobile",
      );
      expect(result.images).toEqual({});
    },
  );

  it(
    "rejects wrong document and malicious images without weakening canonical guard",
    () => {
      expect(() =>
        parsePreviewHome(
          {
            _id: "other",
            _type: "homePage",
          },
          "en",
          null,
        ),
      ).toThrow();

      const result = parsePreviewHome(
        {
          _id: "homePage",
          _type: "homePage",
          hero: {
            photo: {
              _ref: "bad",
              asset: {
                _ref: `image-${"a".repeat(40)}-100x100-png`,
              },
            },
          },
        },
        "en",
        null,
      );

      expect(result.images.hero).toBeUndefined();
      expect(result.fallbackPaths).toContain("hero.photo");
    },
  );

  it("strict route and origin policy excludes wildcards", () => {
    expect(homePath("/en")).toBe(true);
    expect(homePath("/en/../ru")).toBe(false);

    expect(
      trustedStudio("https://www.sanity.io"),
    ).toBe(true);

    expect(
      trustedStudio("https://evil.test"),
    ).toBe(false);

    expect(
      validEnableUrl(
        new URL(
          `${origin}/?sanity-preview-secret=x&sanity-preview-pathname=/en`,
        ),
      ),
    ).toBe(true);
  });
});
