# Disjoint implementation packages — ready for non-public presentation

Inputs: [crop-map.json](crop-map.json), [readable geometry](crop-map.md), [copy/style](copy-style-map.md), [action contract](../bouquets-action-contract.md), and existing EN editorial copy. Reference snapshots are not fixed site widths or fixed localized text heights. Centered FILL/FIT source bounds are explicitly conditional because native paint serialization omitted imageTransform; compare actual rendered crops during integration, not a visual PASS. These packages authorize future bounded implementation, not publication or P01 action wiring.

Common image prop, owned by integrator's data not shared types: `{src:string; alt:string; width:number; height:number}`. No external network images or inferred product data. All are server presentation widgets; sections own CSS Modules and responsive geometry. Do not add code outside listed widget directory.

## A — Hero — READY

Own only `src/components/widgets/BouquetsHero/BouquetsHero.tsx` and `BouquetsHero.module.css`. Props:

```ts
{content:{breadcrumb:string; title:string; subtitle:string; body:string; script:string; actionLabel:string}; inspirationHref:string; image:{src:string;alt:string;width:number;height:number}}
```

The target is the existing page's `#bouquet-inspiration` anchor; localized route/fragment composition is integrator-owned. D split/fade/script, compact copy-before-full-bleed-photo; preserve natural paragraphs and reference script break without fixed text height.

## B — selectors + eight cards — READY for disabled technical preview

Own only `src/components/widgets/BouquetsInspiration/BouquetsInspiration.tsx` and `BouquetsInspiration.module.css`. Props:

```ts
{heading:string; selectors:readonly {label:string;targetId:string;image:{src:string;alt:string;width:number;height:number}}[]; cards:readonly {id:string;title:string;image:{src:string;alt:string;width:number;height:number};actionLabel:string}[]; cardActionPendingReason:string}
```

Five selectors are anchor links, not filters. Four associations follow existing action contract; Statement→Wild Beauty; All→`bouquet-inspiration`. Keep all eight visible in order. Technical fragment IDs are not product slugs. Respect reduced motion and accessible target/focus behavior.

Actual @ola-lead-designer message delivery `50c317cf2df2dcb7b647b97bd8ecacef98bff0db619727535929793e4903b182` (process `proc_7fd761531a0c`) authorizes **non-public technical preview only**: eight visible Enquire controls neutrally disabled with a **visible localized** reason meaning “Card action awaits a decision,” not missing WhatsApp recipient. The designer reported a separate handoff edit; that file was not read in this mount. No href, target, payload, recipient, prefill, navigation, send, clickable card/photo, or enabled-hover affordance. Preserve all labels and hierarchy. Use a neutral native disabled control; existing EnquiryLink can produce a WhatsApp link and its missing-contact branch communicates the wrong reason, so do not use it for held cards. P01 direct/detail/hybrid/slugs remain OWNER HOLD; no owner question repeated.

## C — custom + seasonal — READY

Own only `src/components/widgets/BouquetsEditorial/BouquetsEditorial.tsx` and `BouquetsEditorial.module.css`. Props:

```ts
{custom:{eyebrow:string;title:string;body:string;action:React.ReactNode;image:{src:string;alt:string;width:number;height:number}}; seasonal:{eyebrow:string;title:string;body:string;labels:readonly string[];image:{src:string;alt:string;width:number;height:number}}}
```

Integrator supplies the custom action as a server-renderable node using existing enquiry contract; `EnquiryLink` reads `site.whatsappUrl` itself and has no nullable-contact prop. It is separate from P01; no invented recipient or subject. Four seasonal labels use one FIT montage/mask recipe, not four independent centered images; four-up D/T, two-up M. D split/overlay; compact stacking.

## Integrator and gates

A single later integrator owns all other files: content/messages/namespace/locale, route/page composition, Home anchors, shared types/assets, tests, QA, browser/build evidence and docs. Home semantic anchors are Soft→Soft Romance, Bright→Sunset, Natural→Natural & Airy; no filter. Confirm actual APIs at integration; preserve shared Header/Footer. RU/SR drafts require semantic checks. Verify images/paint visually at D/T/M and intermediate/boundary widths, keyboard/focus/reduced motion, no card navigation, localized disabled reason and route behavior. Actual runtime-confirmed @supervisor Sol review is required for medium integrated UI; neither this input nor a build is a UI PASS. Source rights/release approval and product action decisions remain separate gates.
