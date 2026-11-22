# Balloons schema and exact-route integration mapping

Implemented after Lead released the shared freeze following actual Weddings Supervisor review 2. The mapping below describes the registered Studio schema and exact allowlist; review and owner manual verification remain pending.

After actual Weddings Supervisor review and explicit Lead release of shared files, add one Studio singleton `_id`/`_type` `balloonsPage` in `studio/sanity.config.js`, using existing localized text and image helpers and fixed grouped objects. Text/alt/label fields below are independent optional `{en,ru,sr}` values, selected by exact current locale; photos are nonlocalized Sanity image fields with crop/hotspot, validated by the existing shared image guard. No document references, arbitrary URLs, actions or destination fields. Omitted/invalid fields fall back draft → published → original local same-locale value. Existing fixed order and IDs remain code-owned.

- `pageTitle`; `hero.{title,titleTablet,titleDesktop,body,imageAlt,photo}`.
- `categories.{sets,balloons,gifts,personalised}.{title,description,imageAlt,photo}`.
- `favourites.{eyebrow,title}`; `favourites.{blush,birthday,colourful,neutral}.{title,imageAlt,photo}`.
- `personalisation.{eyebrow,title,body,imageAlt,photo}`; `personalisation.{chocolates,teddy,card,personalisation}.{title,imageAlt,photo}`.
- `cta.{title,body,imageAlt,photo}`.
- `labels.{home,exploreSets,categoriesLabel,enquire,askSets,createGift}`.

Add Studio structure list, singleton declaration and Presentation locations for `/en/balloons`, `/ru/balloons`, `/sr/balloons`; extend only the existing exact preview-route allowlist in `src/content/sanity/preview-policy.ts` for those three literal routes, with positive and negative root-discoverable unit cases. No wildcard, prefix, cross-origin, cookie, CSP, authentication or SDK relaxation. Confirm official secure enable/disable, annotations and saved-draft mutations with owner later; neither this plan nor DOM annotation tests establishes the official flow. Shared Home/Detail local asset reuse does not affect other pages. All enquiry destinations and subjects remain local/code-owned.
