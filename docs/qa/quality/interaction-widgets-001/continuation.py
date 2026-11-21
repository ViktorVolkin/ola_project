import hashlib
import json
import subprocess
from pathlib import Path

root = Path.cwd()
out = root / 'docs/qa/quality/interaction-widgets-001'
base = 'src/components/widgets/'
node = root / '.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node'
prettier = root / 'node_modules/prettier/bin/prettier.cjs'
files = [
 'BouquetDetailGallery/BouquetDetailGallery.module.css',
 'BouquetDetailPreferences/BouquetDetailPreferences.module.css',
 'BouquetDetailSupporting/BouquetDetailSupporting.module.css',
 'ContactBlocks/ContactFaq.module.css',
 'BouquetsInspiration/BouquetsInspiration.module.css',
 'HomeBlocks/HomeServicesBlock/HomeServices.module.css',
 'HomeBlocks/HomeMoodBlock/HomeMood.module.css',
 'BouquetDetailHero/BouquetDetailHero.module.css',
 'BouquetsHero/BouquetsHero.module.css',
 'ContactBlocks/ContactHero.module.css',
 'BalloonsBlocks/BalloonsHeroBlock.module.css',
 'WeddingsBlocks/WeddingsHeroBlock/WeddingsHeroBlock.module.css',
 'BalloonsBlocks/BalloonsCategoriesBlock.module.css',
 'WeddingsBlocks/WeddingsCategoriesBlock/WeddingsCategoriesBlock.module.css',
]
assert len(files) == len(set(files))
assert subprocess.check_output([str(node), '--version'], text=True).strip() == 'v24.22.3'
hashes = {}
for file in files:
 current = root / base / file
 before = out / 'before' / (current.name + '.txt')
 assert before.exists(), before
 subprocess.run([str(node), str(prettier), '--parser', 'css', str(current)], stdout=subprocess.DEVNULL, check=True)
 hashes[base + file] = {'before_sha256': hashlib.sha256(before.read_bytes()).hexdigest(), 'source_sha256': hashlib.sha256(current.read_bytes()).hexdigest(), 'before': str(before.relative_to(root))}

def has(path, *tokens):
 text = (root / path).read_text()
 for token in tokens:
  assert token in text, (path, token)

for file in ['BouquetsHero/BouquetsHero', 'ContactBlocks/ContactHero', 'BalloonsBlocks/BalloonsHeroBlock', 'WeddingsBlocks/WeddingsHeroBlock/WeddingsHeroBlock', 'BouquetDetailHero/BouquetDetailHero']:
 has(base + file + '.tsx', 'styles.breadcrumb', '<Link')
 has(base + file + '.module.css', '.breadcrumb a:hover', '.breadcrumb a:focus-visible', '.breadcrumb a:active', 'prefers-reduced-motion: no-preference')
has(base + 'BouquetDetailHero/BouquetDetailHero.tsx', 'styles.back', 'href="/bouquets"')
has(base + 'BouquetDetailHero/BouquetDetailHero.module.css', '.back:hover', '.back:focus-visible', '.back:active')
has(base + 'HomeBlocks/HomeServicesBlock/HomeServicesBlock.tsx', 'styles.service', 'styles.serviceArrow', '<Link')
has(base + 'HomeBlocks/HomeServicesBlock/HomeServices.module.css', '.service:hover .serviceArrow', '.service:focus-visible', '.service:active .serviceArrow', 'prefers-reduced-motion: no-preference')
has(base + 'HomeBlocks/HomeMoodBlock/HomeMoodBlock.tsx', 'styles.textLink', 'styles.moodRail', 'tabIndex={0}')
has(base + 'HomeBlocks/HomeMoodBlock/HomeMood.module.css', '.textLink:hover', '.textLink:focus-visible', '.textLink:active', '.moodRail:focus-visible')
has(base + 'BouquetDetailGallery/BouquetDetailGallery.tsx', 'styles.thumbnail', 'aria-pressed={selected === index}')
has(base + 'BouquetDetailGallery/BouquetDetailGallery.module.css', '.thumbnail[aria-pressed=', '.thumbnail:focus-visible', '.thumbnail:not(:disabled):hover', '.thumbnail:not(:disabled):active', 'prefers-reduced-motion: reduce')
has(base + 'BouquetDetailPreferences/BouquetDetailPreferences.tsx', 'type="radio"', 'type="checkbox"', 'styles.radioLabel', 'styles.checkboxLabel', 'aria-invalid={dateError}', 'styles.fieldTextarea')
has(base + 'BouquetDetailPreferences/BouquetDetailPreferences.module.css', '.radioInput:checked + .radioLabel', '.checkboxInput:checked + .checkboxLabel', '.radioInput:focus-visible + .radioLabel', '.checkboxInput:focus-visible + .checkboxLabel', '.radioInput:not(:disabled):hover + .radioLabel', '.checkboxInput:not(:disabled):active + .checkboxLabel', '.fieldError', 'prefers-reduced-motion: reduce')
has(base + 'BouquetDetailSupporting/BouquetDetailSupporting.tsx', '<details', '<summary>', 'styles.chevron')
has(base + 'BouquetDetailSupporting/BouquetDetailSupporting.module.css', 'details[open] > summary .chevron', '.information summary:hover', '.information summary:focus-visible', '.information summary:active', 'prefers-reduced-motion: reduce')
has(base + 'ContactBlocks/ContactFaq.tsx', 'styles.trigger', 'styles.sign', 'aria-expanded={expanded}')
has(base + 'ContactBlocks/ContactFaq.module.css', '.trigger:focus-visible', '.trigger:not(:disabled):hover', '.trigger:not(:disabled):active .sign', 'prefers-reduced-motion: reduce')
has(base + 'BouquetsInspiration/BouquetsInspiration.tsx', 'styles.selector', 'href={`#${selector.targetId}`}', 'type="button" disabled')
has(base + 'BouquetsInspiration/BouquetsInspiration.module.css', '.selector:hover', '.selector:focus-visible', '.selector:active', 'prefers-reduced-motion: reduce')
for widget in ['BalloonsBlocks/BalloonsCategoriesBlock', 'WeddingsBlocks/WeddingsCategoriesBlock/WeddingsCategoriesBlock']:
 has(base + widget + '.tsx', 'EnquiryLink', 'className={styles.circle}', 'variant="text"')
 has(base + widget + '.module.css', '.circle:not(:disabled):not([aria-disabled="true"]):hover', '.circle:not(:disabled):not([aria-disabled="true"]):active')
has('src/components/pages/BouquetDetailPage/BouquetDetailPage.tsx', '<EnquiryLink variant="secondary" subject={names[n]}>', 'action={<EnquiryLink subject={i.title}>', 'action={<EnquiryLink subject={c.customAction}>')
has(base + 'EnquiryLink/EnquiryLink.tsx', 'actionClassName(variant, className)', '<ActionButton', 'disabled', 'return <a href={href}')
has('src/components/shared/ActionLink.module.css', '.action:focus-visible', '.text:not(:disabled)', 'prefers-reduced-motion: no-preference')

families = [
 {'id':'gallery-thumbnails','status':'implemented','refs':['BouquetDetailGallery/BouquetDetailGallery.tsx','.thumbnail[aria-pressed], :hover, :focus-visible, :active'], 'notes':'Native button; selection preserved; no gallery arrows in JSX.'},
 {'id':'preferences-fullness','status':'implemented','refs':['BouquetDetailPreferences/BouquetDetailPreferences.tsx','.radioInput + .radioLabel'], 'notes':'Native radio; checked/focus retained, disabled excluded.'},
 {'id':'preferences-extras','status':'implemented','refs':['BouquetDetailPreferences/BouquetDetailPreferences.tsx','.checkboxInput + .checkboxLabel'], 'notes':'Native checkbox; checked/focus retained, disabled excluded.'},
 {'id':'preferences-fields','status':'implemented','refs':['BouquetDetailPreferences/BouquetDetailPreferences.tsx','.fieldInput, .fieldTextarea, .fieldError'], 'notes':'Date is text with custom validation; no fake press motion.'},
 {'id':'detail-information','status':'implemented','refs':['BouquetDetailSupporting/BouquetDetailSupporting.tsx','.information summary, details[open] > summary .chevron'], 'notes':'Native details/summary; open transform preserved.'},
 {'id':'contact-faq','status':'implemented','refs':['ContactBlocks/ContactFaq.tsx','.trigger, .sign'], 'notes':'Button aria-expanded; actual icon changes via JSX.'},
 {'id':'bouquets-anchors','status':'implemented','refs':['BouquetsInspiration/BouquetsInspiration.tsx','.selector'], 'notes':'Real fragment anchors; .all is static styling, not dynamic selected state.'},
 {'id':'home-services','status':'implemented','refs':['HomeBlocks/HomeServicesBlock/HomeServicesBlock.tsx','.service, .serviceArrow'], 'notes':'Whole service card is a link; press moves only arrow.'},
 {'id':'home-mood-link','status':'implemented','refs':['HomeBlocks/HomeMoodBlock/HomeMoodBlock.tsx','.textLink'], 'notes':'Card article/photo not clickable; text link is.'},
 {'id':'home-scroll-region','status':'inherited_existing','refs':['HomeBlocks/HomeMoodBlock/HomeMoodBlock.tsx','.moodRail:focus-visible'], 'notes':'Focusable native scroll region, not a button; no press motion.'},
 {'id':'detail-navigation','status':'implemented','refs':['BouquetDetailHero/BouquetDetailHero.tsx','.breadcrumb a, .back'], 'notes':'Native links; existing breakpoint styling maintained.'},
 {'id':'hero-breadcrumbs','status':'implemented','refs':['BouquetsHero/BouquetsHero.tsx','ContactBlocks/ContactHero.tsx','BalloonsBlocks/BalloonsHeroBlock.tsx','WeddingsBlocks/WeddingsHeroBlock/WeddingsHeroBlock.tsx','.breadcrumb a'], 'notes':'Five breadcrumb widget styles including detail, six lexical Link sites.'},
 {'id':'category-icon-actions','status':'implemented','refs':['BalloonsBlocks/BalloonsCategoriesBlock.tsx','WeddingsBlocks/WeddingsCategoriesBlock/WeddingsCategoriesBlock.tsx','.section .circle, .categories .circle','src/components/shared/ActionLink.module.css .action'], 'notes':'Shared text action has SVG only so underline hover is invisible; local hover/active colors, disabled excluded, shared focus/transitions inherited.'},
 {'id':'common-actions','status':'covered_by_shared','refs':['src/components/shared/ActionLink.tsx','src/components/shared/ActionButton.tsx','src/components/shared/ActionLink.module.css','EnquiryLink/EnquiryLink.tsx'], 'notes':'ActionLink, ActionButton, actionClassName and EnquiryLink on Home/About/Weddings/Balloons/Bouquets/Contact/detail/404. Shared owner; disabled button if no URL.'},
 {'id':'detail-supplied-actions','status':'covered_by_shared','refs':['src/components/pages/BouquetDetailPage/BouquetDetailPage.tsx','BouquetDetailSupporting/BouquetDetailSupporting.tsx','EnquiryLink/EnquiryLink.tsx','src/components/shared/ActionLink.module.css'], 'notes':'Actual hero, related and custom ReactNode actions are EnquiryLink. Articles and photos are not controls.'},
 {'id':'bouquets-disabled-card-actions','status':'excluded_disabled','refs':['BouquetsInspiration/BouquetsInspiration.tsx','.action'], 'notes':'Always native disabled, pending reason; no hover or motion.'},
 {'id':'page-skip','status':'outside_owner','refs':['src/app/[locale]/layout.tsx','src/styles/Application.module.css .skipLink'], 'notes':'Global owner, no source write.'},
]
assert len({f['id'] for f in families}) == len(families)
chrome = json.loads((root / 'docs/qa/quality/interaction-chrome-001/inventory.json').read_text())
classification = {'chrome-action':['common-actions','category-icon-actions','detail-supplied-actions'], 'chrome-desktop-nav':['outside_owner'], 'chrome-mobile-controls':['outside_owner'], 'chrome-mobile-nav':['outside_owner'], 'chrome-footer-nav':['outside_owner'], 'chrome-language':['outside_owner'], 'chrome-wordmark':['outside_owner'], 'page-skip':['page-skip'], 'page-breadcrumb':['hero-breadcrumbs','detail-navigation'], 'page-home-cards':['home-services','home-mood-link'], 'page-scroll-rail':['home-scroll-region'], 'page-bouquet-selectors':['bouquets-anchors'], 'page-bouquet-disabled':['bouquets-disabled-card-actions'], 'page-gallery':['gallery-thumbnails'], 'page-preferences':['preferences-fullness','preferences-extras','preferences-fields'], 'page-disclosures':['contact-faq','detail-information'], 'page-detail-back':['detail-navigation']}
assert {f['id'] for f in chrome['families']} == set(classification)
counts = {status: sum(f['status'] == status for f in families) for status in sorted({f['status'] for f in families})}
counts['remaining'] = sum(f['status'] == 'remaining' for f in families)
record = {'task':'OLA-INTERACTION-WIDGETS-001','outcome':'implemented_awaiting_integration_validation','risk_level':'medium','risk_reason':'interaction CSS affects responsive controls, focus, selection and touch','review_required':True,'review_status':'pending actual Supervisor Sol after real Next gates','source_freeze':'FINALWRITEFREEZE: executor stopped source writes; hashes below identify this checkpoint, not a whole-tree freeze','families':families,'counts':counts,'global_inventory_reconciliation':{'path':'docs/qa/quality/interaction-chrome-001/inventory.json','classification':classification,'family_count':len(classification),'unmapped_count':0,'note':'Maps lexical families, not rendered instance counts. Shared chrome and skip are other owner.'},'source_hashes':hashes,'static_checks':{'node':'v24.22.3 explicit .local-tools binary','prettier_css_parser':'pass for all 14 changed files','selector_jsx_state_tokens':'pass targeted assertions only; not cascade/browser proof','git_diff_check':'see final command output','format':'parser only; pre-existing mixed CSS formatting preserved'},'history':['Prior checkpoint: five files/seven implemented families; Node v26.13.1 parser pass; initial dangerous inline terminal command blocked before execution.', 'Continuation: first multi-file patch validation failed atomically due to ambiguous hunk; corrected patch passed. Overwrite of prior checkpoint helper was refused, so continuation.py preserves it. Prior 13 API calls / 159.4 s reported by user; cost unknown.'], 'limitations':['No production build, actual Next browser, locale/responsive/touch/keyboard/contrast/reduced-motion verification or review in this continuation.', 'Visual contrast, cascade, hover behavior and clipping require integrated browser verification; source assertions do not prove them.', 'No Balloons dialog exists in inspected JSX; enquiry is link or disabled button.', 'No semantic, content, 404 or pre-existing mobile-disabled behavior changed.', 'checkpoint.py is the superseded partial-checkpoint generator; use continuation.py for current record.'], 'next_gate':'After all source writers freeze and Engineer confirms ready cache, separate owner builds actual Next; original executor validates EN/RU/SR mobile/tablet/desktop, keyboard/touch/reduced motion and obtains actual Supervisor Sol review.'}
(out / 'coverage.json').write_text(json.dumps(record, indent=2, ensure_ascii=False) + '\n')
print('PASS Node 24 Prettier CSS parser:', len(files), 'files; targeted JSX/state checks; reconciled global families:', len(classification))
print('counts:', json.dumps(counts))
