# OLA-WEB-PERFORMANCE-001 — current production-build lab

Diagnostic measurement only; no acceptance or real-user claims. Post-animation/header baseline; no before/after claim. Coverage: 36 rows / 36 unique of 36 planned, missing 0, duplicates 0; 2 separately scoped Home full-scroll captures. Build 0RKE00M-JxGMYb9sr8we6; webpack; Node v24.22.3, Chromium 156.0.8078.4, Playwright 1.64.1; linux arm64, CPU Neoverse-N1 (4 logical CPUs), server/browser co-located. Origin http://127.0.0.1:34873; server PID 5772, cwd /workspace/.local-tools/ola-qa/header-fixture-wxM6wf, ready observed 2026-11-18T20:55:04.303Z; exact start time unavailable due to a process-stat parsing error. HTML SHA-256 f35b1cdbf4912a0715e1826436ced3395122f1e6a678cfacdbb8151c9a8e8bf9; /_next/static/chunks/webpack-5e4655f172428669.js SHA-256 20960f511aefe4a7700845a5227773d6d94f8d151da3412c0513cd5d10582033. Image optimizer cache existed before test and may be warm.

Mobile 390×844 DPR2, touch/mobile, CDP CPU 4× slowdown and 150ms latency, 1.6 Mbps download / 0.75 Mbps upload; desktop 1440×900 DPR1, CPU/network unthrottled. One fresh browser context per route/profile, cold navigation then warm navigation in same context with normal HTTP cache; default SW allowed, controller reported per raw case. Initial window = load + 2s, before interactions/scroll; includes automatic Next prefetch, near-viewport lazy images. CDP encodedDataLength for completed requests with disk/memory hits set to zero: wire-ish HTTP not TCP/TLS; decoded is CDP dataReceived bytes, possibly absent for cached responses, not logical warm total. Pending requests and failed responses identified in JSON. Per-case requests are not deduplicated; unique URL counts separately recorded. No ResourceTiming totals added.

## Initial cases

MiB = 1,048,576 bytes; JS/CSS/img/font/doc/other are encoded. FCP/LCP/TTFB/DOM/load in ms; CLS observed max session window. Single runs are noisy.

| Route | Profile | Cache | MiB | Requests (unique) | JS | CSS | Images | Fonts | Doc | Other | TTFB | FCP | LCP | CLS | DOM | Load |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| /en | mobile | cold | 0.582 | 34 (34) | 0.214 | 0.016 | 0.210 | 0.117 | 0.011 | 0.013 | 62 | 880 | 1420 | 0.0003 | 587 | 3423 |
| /en | mobile | warm | 0.014 | 33 (33) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.013 | 6 | 356 | 356 | 0.0000 | 461 | 555 |
| /en/about | mobile | cold | 0.562 | 34 (34) | 0.214 | 0.017 | 0.190 | 0.117 | 0.010 | 0.014 | 8 | 816 | 1788 | 0.0020 | 509 | 3474 |
| /en/about | mobile | warm | 0.015 | 34 (34) | 0.000 | 0.000 | 0.001 | 0.000 | 0.000 | 0.014 | 5 | 372 | 372 | 0.0000 | 589 | 595 |
| /en/balloons | mobile | cold | 0.537 | 33 (33) | 0.214 | 0.017 | 0.197 | 0.089 | 0.012 | 0.008 | 60 | 764 | 1472 | 0.0003 | 522 | 3197 |
| /en/balloons | mobile | warm | 0.009 | 33 (33) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.008 | 4 | 352 | 352 | 0.0000 | 468 | 609 |
| /en/bouquets | mobile | cold | 0.569 | 35 (35) | 0.214 | 0.016 | 0.203 | 0.117 | 0.010 | 0.008 | 5 | 700 | 2196 | 0.0000 | 508 | 3471 |
| /en/bouquets | mobile | warm | 0.009 | 31 (31) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.008 | 4 | 320 | 320 | 0.0000 | 428 | 532 |
| /en/contact | mobile | cold | 0.453 | 28 (28) | 0.214 | 0.017 | 0.087 | 0.117 | 0.010 | 0.008 | 6 | 772 | 1488 | 0.0000 | 515 | 2847 |
| /en/contact | mobile | warm | 0.009 | 28 (28) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.008 | 4 | 420 | 420 | 0.0000 | 460 | 579 |
| /en/weddings-events | mobile | cold | 0.573 | 30 (30) | 0.214 | 0.013 | 0.209 | 0.117 | 0.011 | 0.008 | 6 | 692 | 1748 | 0.0001 | 504 | 3362 |
| /en/weddings-events | mobile | warm | 0.009 | 30 (30) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.008 | 3 | 376 | 376 | 0.0000 | 527 | 527 |
| /en/preview/bouquet | mobile | cold | 2.722 | 40 (40) | 0.218 | 0.020 | 2.344 | 0.117 | 0.010 | 0.013 | 10 | 724 | 12612 | 0.0000 | 521 | 14754 |
| /en/preview/bouquet | mobile | warm | 0.015 | 40 (40) | 0.000 | 0.000 | 0.001 | 0.000 | 0.000 | 0.013 | 4 | 488 | 488 | 0.0000 | 544 | 657 |
| /ru | mobile | cold | 0.632 | 36 (36) | 0.214 | 0.016 | 0.210 | 0.165 | 0.013 | 0.015 | 8 | 720 | 1348 | 0.0005 | 516 | 3617 |
| /ru | mobile | warm | 0.015 | 35 (35) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.015 | 3 | 452 | 452 | 0.0000 | 471 | 602 |
| /sr | mobile | cold | 0.659 | 36 (36) | 0.214 | 0.016 | 0.210 | 0.194 | 0.012 | 0.014 | 63 | 760 | 1532 | 0.0003 | 566 | 3901 |
| /sr | mobile | warm | 0.014 | 35 (35) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.014 | 5 | 348 | 348 | 0.0000 | 457 | 563 |
| /en | desktop | cold | 0.879 | 55 (55) | 0.226 | 0.027 | 0.464 | 0.117 | 0.011 | 0.034 | 5 | 376 | 376 | 0.0005 | 271 | 585 |
| /en | desktop | warm | 0.034 | 53 (53) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.034 | 4 | 276 | 276 | 0.0000 | 25 | 105 |
| /en/about | desktop | cold | 0.721 | 55 (55) | 0.226 | 0.027 | 0.307 | 0.117 | 0.010 | 0.034 | 5 | 380 | 380 | 0.0003 | 94 | 585 |
| /en/about | desktop | warm | 0.035 | 55 (55) | 0.000 | 0.000 | 0.001 | 0.000 | 0.000 | 0.034 | 4 | 168 | 168 | 0.0000 | 24 | 97 |
| /en/balloons | desktop | cold | 0.774 | 56 (56) | 0.226 | 0.027 | 0.386 | 0.089 | 0.012 | 0.034 | 6 | 396 | 424 | 0.0004 | 99 | 510 |
| /en/balloons | desktop | warm | 0.034 | 54 (54) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.034 | 3 | 172 | 172 | 0.0000 | 27 | 100 |
| /en/bouquets | desktop | cold | 0.774 | 58 (58) | 0.226 | 0.027 | 0.360 | 0.117 | 0.010 | 0.034 | 5 | 392 | 408 | 0.0001 | 102 | 531 |
| /en/bouquets | desktop | warm | 0.034 | 54 (54) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.034 | 3 | 148 | 148 | 0.0000 | 27 | 82 |
| /en/contact | desktop | cold | 0.602 | 48 (48) | 0.226 | 0.027 | 0.188 | 0.117 | 0.010 | 0.034 | 5 | 304 | 304 | 0.0000 | 98 | 414 |
| /en/contact | desktop | warm | 0.034 | 48 (48) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.034 | 4 | 104 | 104 | 0.0000 | 23 | 90 |
| /en/weddings-events | desktop | cold | 0.758 | 53 (53) | 0.226 | 0.027 | 0.343 | 0.117 | 0.011 | 0.034 | 5 | 304 | 304 | 0.0014 | 228 | 499 |
| /en/weddings-events | desktop | warm | 0.034 | 52 (52) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.034 | 4 | 184 | 184 | 0.0000 | 28 | 111 |
| /en/preview/bouquet | desktop | cold | 2.849 | 60 (60) | 0.231 | 0.031 | 2.426 | 0.117 | 0.010 | 0.034 | 5 | 520 | 520 | 0.0001 | 112 | 641 |
| /en/preview/bouquet | desktop | warm | 0.035 | 60 (60) | 0.000 | 0.000 | 0.001 | 0.000 | 0.000 | 0.034 | 4 | 240 | 240 | 0.0000 | 27 | 58 |
| /ru | desktop | cold | 0.932 | 57 (57) | 0.226 | 0.027 | 0.464 | 0.165 | 0.013 | 0.037 | 5 | 312 | 400 | 0.0007 | 300 | 529 |
| /ru | desktop | warm | 0.038 | 55 (55) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.037 | 4 | 168 | 168 | 0.0000 | 26 | 83 |
| /sr | desktop | cold | 0.957 | 57 (57) | 0.226 | 0.027 | 0.464 | 0.194 | 0.012 | 0.034 | 5 | 420 | 420 | 0.0004 | 99 | 634 |
| /sr | desktop | warm | 0.035 | 55 (55) | 0.000 | 0.000 | 0.000 | 0.000 | 0.000 | 0.034 | 3 | 340 | 340 | 0.0000 | 26 | 160 |

## Largest completed cold responses per route/profile

### mobile /en
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
- js: 64492 bytes — /_next/static/chunks/0937d497-fd8f6d7590251668.js
- fonts: 38076 bytes — /_next/static/media/7b89a4fd5e90ede0-s.woff2
- images: 35886 bytes — /_next/image?url=%2Fassets%2Fimages%2Fhome%2F08_wedding_events_main.jpg&w=750&q=75
### mobile /en/about
- images: 97878 bytes — /_next/image?url=%2Fassets%2Fdecorative%2Fstory_botanical_transparent.png&w=256&q=75
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
- js: 64492 bytes — /_next/static/chunks/0937d497-fd8f6d7590251668.js
- images: 60637 bytes — /_next/image?url=%2Fassets%2Fimages%2Fabout%2F02_our_story.jpg&w=750&q=75
### mobile /en/balloons
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
- js: 64492 bytes — /_next/static/chunks/0937d497-fd8f6d7590251668.js
- fonts: 38076 bytes — /_next/static/media/7b89a4fd5e90ede0-s.woff2
- images: 36470 bytes — /_next/image?url=%2Fassets%2Fimages%2Fhome%2F01_home_hero_florist_balloons_montenegro.jpg&w=828&q=75
### mobile /en/bouquets
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
- js: 64492 bytes — /_next/static/chunks/0937d497-fd8f6d7590251668.js
- images: 48902 bytes — /_next/image?url=%2Fassets%2Fimages%2Fbouquets%2F01_bouquets_hero.jpg&w=828&q=75
- fonts: 38076 bytes — /_next/static/media/7b89a4fd5e90ede0-s.woff2
### mobile /en/contact
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
- js: 64492 bytes — /_next/static/chunks/0937d497-fd8f6d7590251668.js
- images: 40865 bytes — /_next/image?url=%2Fassets%2Fimages%2Fcontact%2F02_contact_montenegro.jpg&w=828&q=75
- images: 39953 bytes — /_next/image?url=%2Fassets%2Fimages%2Fcontact%2F01_contact_hero.jpg&w=828&q=75
### mobile /en/weddings-events
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
- js: 64492 bytes — /_next/static/chunks/0937d497-fd8f6d7590251668.js
- images: 48532 bytes — /_next/image?url=%2Fassets%2Fimages%2Fweddings-events%2F12_weddings_floral_centerpiece.jpg&w=828&q=75
- images: 44532 bytes — /_next/image?url=%2Fassets%2Fimages%2Fweddings-events%2F05_weddings_hero.jpg&w=828&q=75
### mobile /en/preview/bouquet
- images: 1186409 bytes — /assets/decorative/story_botanical_transparent.png
- images: 801498 bytes — /assets/images/bouquet-detail/01_bouquet_detail_main.jpg
- images: 141677 bytes — /assets/images/bouquet-detail/02_detail_thumb1.jpg
- images: 132662 bytes — /assets/images/bouquet-detail/03_detail_thumb2.jpg
- images: 130961 bytes — /assets/images/bouquet-detail/04_detail_closeup.jpg
### mobile /ru
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
- js: 64492 bytes — /_next/static/chunks/0937d497-fd8f6d7590251668.js
- fonts: 38076 bytes — /_next/static/media/7b89a4fd5e90ede0-s.woff2
- images: 35886 bytes — /_next/image?url=%2Fassets%2Fimages%2Fhome%2F08_wedding_events_main.jpg&w=750&q=75
### mobile /sr
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
- js: 64492 bytes — /_next/static/chunks/0937d497-fd8f6d7590251668.js
- fonts: 46488 bytes — /_next/static/media/536d9d896eaf4f3f-s.woff2
- fonts: 38076 bytes — /_next/static/media/7b89a4fd5e90ede0-s.woff2
### desktop /en
- images: 97652 bytes — /_next/image?url=%2Fassets%2Fimages%2Fhome%2F08_wedding_events_main.jpg&w=1920&q=75
- images: 94235 bytes — /_next/image?url=%2Fassets%2Fimages%2Fabout%2F01_hero.jpg&w=1920&q=75
- images: 89968 bytes — /_next/image?url=%2Fassets%2Fimages%2Fhome%2F01_home_hero_florist_balloons_montenegro.jpg&w=1920&q=75
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
### desktop /en/about
- images: 94235 bytes — /_next/image?url=%2Fassets%2Fimages%2Fabout%2F01_hero.jpg&w=1920&q=75
- images: 78802 bytes — /_next/image?url=%2Fassets%2Fimages%2Fabout%2F12_final_cta.jpg&w=1920&q=75
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
- js: 64492 bytes — /_next/static/chunks/0937d497-fd8f6d7590251668.js
### desktop /en/balloons
- images: 120180 bytes — /_next/image?url=%2Fassets%2Fimages%2Fballoons%2F07_balloons_event.jpg&w=1920&q=75
- images: 89968 bytes — /_next/image?url=%2Fassets%2Fimages%2Fhome%2F01_home_hero_florist_balloons_montenegro.jpg&w=1920&q=75
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
- js: 64492 bytes — /_next/static/chunks/0937d497-fd8f6d7590251668.js
### desktop /en/bouquets
- images: 104803 bytes — /_next/image?url=%2Fassets%2Fimages%2Fbouquets%2F12_bouquets_seasonal.jpg&w=1920&q=75
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
- js: 64492 bytes — /_next/static/chunks/0937d497-fd8f6d7590251668.js
- images: 53968 bytes — /_next/image?url=%2Fassets%2Fimages%2Fbouquets%2F11_bouquets_custom.jpg&w=1080&q=75
### desktop /en/contact
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
- js: 64492 bytes — /_next/static/chunks/0937d497-fd8f6d7590251668.js
- images: 52865 bytes — /_next/image?url=%2Fassets%2Fimages%2Fcontact%2F01_contact_hero.jpg&w=1080&q=75
- images: 38466 bytes — /_next/image?url=%2Fassets%2Fimages%2Fcontact%2F03_contact_order.jpg&w=640&q=75
### desktop /en/weddings-events
- images: 106715 bytes — /_next/image?url=%2Fassets%2Fimages%2Fweddings-events%2F05_weddings_hero.jpg&w=1920&q=75
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
- js: 64492 bytes — /_next/static/chunks/0937d497-fd8f6d7590251668.js
- images: 63478 bytes — /_next/image?url=%2Fassets%2Fimages%2Fweddings-events%2F12_weddings_floral_centerpiece.jpg&w=1080&q=75
### desktop /en/preview/bouquet
- images: 1186409 bytes — /assets/decorative/story_botanical_transparent.png
- images: 801498 bytes — /assets/images/bouquet-detail/01_bouquet_detail_main.jpg
- images: 141677 bytes — /assets/images/bouquet-detail/02_detail_thumb1.jpg
- images: 132662 bytes — /assets/images/bouquet-detail/03_detail_thumb2.jpg
- images: 130961 bytes — /assets/images/bouquet-detail/04_detail_closeup.jpg
### desktop /ru
- images: 97652 bytes — /_next/image?url=%2Fassets%2Fimages%2Fhome%2F08_wedding_events_main.jpg&w=1920&q=75
- images: 94235 bytes — /_next/image?url=%2Fassets%2Fimages%2Fabout%2F01_hero.jpg&w=1920&q=75
- images: 89968 bytes — /_next/image?url=%2Fassets%2Fimages%2Fhome%2F01_home_hero_florist_balloons_montenegro.jpg&w=1920&q=75
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js
### desktop /sr
- images: 97652 bytes — /_next/image?url=%2Fassets%2Fimages%2Fhome%2F08_wedding_events_main.jpg&w=1920&q=75
- images: 94235 bytes — /_next/image?url=%2Fassets%2Fimages%2Fabout%2F01_hero.jpg&w=1920&q=75
- images: 89968 bytes — /_next/image?url=%2Fassets%2Fimages%2Fhome%2F01_home_hero_florist_balloons_montenegro.jpg&w=1920&q=75
- js: 67612 bytes — /_next/static/chunks/858-ab0b8f7301382a45.js
- js: 65075 bytes — /_next/static/chunks/764-10851d0ee58129df.js

## Additional Home scroll after warm/hydration check

- mobile: 0.105 MiB, 8 requests (8 completed), images 0.092 MiB; separate incremental scroll, not part of initial totals.
- desktop: 0.000 MiB, 0 requests (0 completed), images 0.000 MiB; separate incremental scroll, not part of initial totals.

## Findings and prioritised next investigations

1. **Preview image delivery is the clearest measured opportunity.** Cold mobile `/en/preview/bouquet` transferred 2.722 MiB, of which 2.344 MiB was images; its observed LCP was 12,612 ms and the LCP element was an `IMG` (the observer captured its tag, not its URL). The decorative PNG alone transferred 1,186,409 bytes and the main bouquet JPEG 801,498 bytes; the three remaining gallery JPEGs transferred 141,677, 132,662 and 130,961 bytes. The gallery and decorative image use native `img` in `BouquetDetailGallery.tsx` and `BouquetDetailPage.tsx`. First investigate responsive/optimised delivery of the decorative image and gallery, appropriately sized thumbnails and deferred offscreen work, while preserving gallery behaviour and visual quality. The waterfall makes bandwidth contention a plausible contributor to the slow LCP; it does not by itself prove the specific LCP URL or causation. No saving is assumed.
2. **Shared JS and main-thread work warrant profiling.** EN Home cold mobile transferred 0.214 MiB JS; three shared chunks each transferred about 64–68 kB. Six observed long tasks included 92, 187 and 311 ms tasks under 4× throttling (full events in `insights.json`); CPU execution, rendering, hydration and transfer are different costs. Profile the tasks and inspect a proper module-level bundle analysis before proposing a change; imports alone do not establish which library causes them.
3. **Inspect font requests by locale and actual usage.** Cold Home fonts were 0.117 MiB EN, 0.165 MiB RU and 0.194 MiB SR. Requests across all cases were exclusively to the local test origin; observed font URLs are `/_next/static/media/*.woff2`, not Google-hosted browser requests. Review subset/preload policy against visual correctness, without presuming removable bytes.
4. **Compare prefetch and lazy image behaviour rather than just viewport size.** Desktop Home cold fetched 55 requests and 0.464 MiB of images vs mobile 34 requests and 0.210 MiB, under different viewport/DPR and network conditions. These are not isolated causes or an apples-to-apples speed comparison. Separate Home warm-scroll samples added 0.105 MiB on mobile and no requests on desktop; they are incremental after warm load, not full cold-scroll totals. Test alternatives in a later authorised change with identical settings.

## Integrity and limitations

- All 18 warm interaction probes changed `aria-expanded` to true; mobile probes also opened a dialog. All 36 initial cases returned HTTP 200, with no captured console/page/network error or unfinished request at cutoff; no service worker controller was observed. This does not prove all app interactions.
- Before/after checks: `before-identity.json`, `after-identity.json`, full gzipped input manifests and baseline per-file diff files. Current root inputs match the original build snapshot; fixture copied inputs match source, and 328 original emitted artifact entries match except the expressly excluded mutable `.next/cache/images/` entries. Root dependency symlink target matches. Snapshots are point-in-time, not continuous immutability proof; image-cache contents were already present and were not cleared. The first startup attempt used the wrong browser path because Playwright was imported before environment setup; exit 1 and successful owned-server cleanup are preserved in `run-attempt1.log` and `cleanup-attempt1.json`. The second run used the documented command-scoped environment and exited 0. Exact process start time was not retained due to a parsing error; ready observation time is recorded, with no invented timestamp.
- Rows with status/navigation/console/network error, HTTP >=400 or pending at cutoff: 0; see measurements.json for details. Warm hydration check records click/expanded/dialog in each row; it is a small interactive probe, not full functional acceptance.
- LCP is last observed before interaction; layout shift is observed only within capture, not full lifecycle. Long-task excess over 50ms is recorded, not Lighthouse TBT; Lighthouse score and field INP are unavailable. Local TTFB is not CDN/Internet latency. No repeated-sample confidence claim.
- All resources, cache headers, origins and individual CDP records are in rows.json; no bodies or HAR. Next image optimizer URL query strings deliberately retained to distinguish source, width and quality.
- Server cleanup: PID 5772, exit 143, signal null, port 34873 free true; shared fixture retained.
