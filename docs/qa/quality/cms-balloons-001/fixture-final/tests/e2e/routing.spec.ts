import { expect, test } from "@playwright/test";
import ru from "../../src/i18n/messages/ru.json";

test("root redirects to English independently of browser preferences", async ({
  request,
}) => {
  const response = await request.get("/", {
    maxRedirects: 0,
    headers: {
      "Accept-Language": "ru",
      Cookie: "NEXT_LOCALE=sr",
    },
  });

  expect(response.status()).toBe(308);
  expect(new URL(response.headers().location, response.url()).pathname).toBe(
    "/en",
  );
  expect(response.headers()["set-cookie"]).toBeUndefined();
});

test("unknown Russian routes return a localized real 404", async ({
  request,
}) => {
  const response = await request.get("/ru/does-not-exist", { maxRedirects: 0 });

  expect(response.status()).toBe(404);
  expect(await response.text()).toContain(ru.NotFound.title);
});
