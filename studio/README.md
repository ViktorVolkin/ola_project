# OLA home Studio — draft preparation (not a launch approval)

The Studio connects to existing Sanity project `zhn2ddaj`, dataset `production`. This package is built with the documented local Node 24 environment; `studio/dist` is the local static build. It is not a public Studio URL.

## Before any publication

English is the supplied source; Russian and Serbian text is **draft translation**, not approved. Confirm translations, photo rights and all business copy before publishing. No custom authentication or protected draft preview is implemented.

Generate an offline text draft and asset map from this checkout (choose a new output filename; neither output may already exist):

```sh
/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node studio/scripts/prepare-seed.mjs /absolute/path/home-seed.json
```

The tool reads current local copy/messages and original `public/` images, validates that all 14 image paths exist, and writes `home-seed.json` plus `home-seed.json.ndjson`. It performs no upload or network write. The NDJSON is a draft (`drafts.homePage`) with local `_sanityAsset` file URLs for Sanity's importer; the original files must remain accessible on the machine running the import. Never import the envelope JSON as a document. After authenticating securely, and only after checking that no draft of that ID exists, the owner may run from `studio/`: `node_modules/.bin/sanity datasets import -p zhn2ddaj -d production /absolute/path/home-seed.json.ndjson`. This command **does upload assets and write a draft**; it has not been executed or live-validated here. Do not use `--replace` without a separate explicit decision. No credential should be sent in chat. Review all imported fields and images in Studio; preparation and import do not publish. RU/SR are unapproved drafts.

## Owner-led Studio connection

Serve the existing `studio/dist` from an approved local origin, or deploy Studio to an owner-chosen HTTPS origin using Sanity's standard deployment process. Add that **exact origin** (scheme, host and port, not a URL path) in project API/CORS settings with credentials allowed for Studio, then use standard Sanity account login and an account authorized for this project/dataset. The local test at `http://127.0.0.1:42180` stopped at Sanity's “Connect this Studio to your project / Add CORS origin” screen; login and manager authorization were not tested. Choose the actual intended origin rather than adding this transient test port blindly.

Open the Home page document, verify all 14 specified photos were imported and attached (shared images may be reused) and verify the corresponding EN/RU/SR alt text, crop and hotspot. Review every field, especially untranslated/draft language, then publish only after explicit approval. Local responsive crop/focal handling and populated-CMS rendering have now been checked with a **synthetic** published-document API and generated images across EN/RU/SR at 360/768/1024/1440, including scrolled mobile mood cards. This is not a live import/publication test. The editor crop is applied by Sanity's standard URL builder without a guessed output aspect ratio; CSS cover alone adapts to the actual frame. The crop-relative hotspot center stays in frame; a hotspot region larger than a frame cannot all remain visible, and the explicit editor crop wins if it excludes the center. Existing gradients/captions can still overlay the focal point. Local fallback photography keeps its original crop/zoom unchanged.

The site fetches only published content with a 3-second request timeout and a 60-second revalidation interval. A controlled production test observed stale-while-revalidate followed by updated synthetic text; **60 seconds is not a guaranteed publication deadline**. After the authorized real publish, check the public site in all three locales and representative mobile/desktop sizes; allow regeneration and verify the actual changed text, alt text and each photo, rather than relying on a timer. Failed/incomplete CMS data falls back to local content as a whole, so an unchanged page is not proof of a successful publish.

**Not manager-ready or deployed:** owner CORS/login, authorized import/upload, translation/photo approval, actual publish-to-site validation, deployment and the independent Sol Supervisor gate remain open. See `../docs/qa/quality/sanity-home-ready-001/FINAL.md` for the local technical packet. A public-site link shows published content only; it is not protected draft preview.
