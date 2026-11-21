import json
import hashlib
from pathlib import Path
from collections import Counter

root=Path.cwd()
out=root/'docs/qa/quality/interaction-widgets-001'
fixture=root/'.local-tools/ola-qa/header-fixture-wxM6wf'
remaining=json.loads((out/'remaining-results.json').read_text())
geometry=json.loads((out/'geometry-results.json').read_text())
cues=json.loads((out/'disabled-cues-results.json').read_text())
initial=json.loads((out/'disabled-cues-initial-results.json.txt').read_text())
changes=[]
image_samples=0
adjacent_samples=0
for case in geometry['cases']:
 if case['status']!='pass':
  continue
 first=case['detail']['initial']
 image_samples += bool(first['image'])
 for phase in ('hover','press','after'):
  cur=case['detail'][phase]
  if first['adjacent'] and cur['adjacent']:
   adjacent_samples+=1
   delta=max(abs((first['adjacent'][key]+(first['viewport']['scrollY'] if key=='y' else 0))-(cur['adjacent'][key]+(cur['viewport']['scrollY'] if key=='y' else 0))) for key in ('x','y','w','h'))
   if delta>.5:
    changes.append({'family':case['family'],'locale':case['locale'],'width':case['width'],'phase':phase,'delta':delta})
contrasts=[x['detail']['error']['contrast'] for x in remaining['cases'] if x['name']=='detail tab sequence and error contrast' and x['status']=='pass']
source={}
for p in ['src/content/site.ts','src/components/widgets/EnquiryLink/EnquiryLink.tsx','src/components/widgets/EnquiryLink/enquiry-url.ts']:
 a=hashlib.sha256((root/p).read_bytes()).hexdigest()
 b=hashlib.sha256((fixture/p).read_bytes()).hexdigest()
 source[p]={'root':a,'fixture':b,'match':a==b}
assert all(x['match'] for x in source.values())
cache=fixture/'.next/cache/images'
cache_files=[p for p in cache.rglob('*') if p.is_file()] if cache.exists() else []
record={'task':'OLA-INTERACTION-WIDGETS-001','risk':'medium','outcome':'implemented_partially_runtime_verified_awaiting_completion_and_review','review':'Actual Supervisor Sol not requested; required after all gates.', 'build_id':'0RKE00M-JxGMYb9sr8we6', 'prior_history':'User reports prior 385.58s and 16 API calls; cost unknown.', 'current_runs':{'tab_back_error_disabled':remaining['summary'],'geometry':geometry['summary'],'disabled_cues_initial':initial['summary'],'disabled_cues_recheck':cues['summary']}, 'initial_check_failures':'Three assertions sampled transitional border/shadow too early; raw initial results retained. Recheck measured immediate outline separately and selection/error color after 220ms; 12/12 groups passed. This is a timing-expectation correction, not a source change.', 'coverage':{'tab_back_error_disabled':'18 contexts: EN/RU/SR × 360/768/1440 × normal/reduced; six grouped checks per context. Includes native Tab on gallery/radio/checkbox/date/textarea/details, FAQ, Home controls, anchors; detail back click/Enter/history; disabled bouquet action click/Enter/Space.', 'error_contrast':{'min':min(contrasts),'max':max(contrasts),'sample_count':len(contrasts),'method':'WCAG relative luminance on computed text and first solid ancestor without background image; ancestry recorded in remaining-results.json'}, 'geometry':'126 sampled control cases across 14 styles × 9 locale/width contexts (768 reduced, 360/1440 normal). Layout offset dimensions, hover/press visual rects, available descendant image fit/position, and document overflow measured; not historical pixel comparison.', 'adjacent_scroll_corrected_samples':adjacent_samples,'adjacent_shift_gt_half_pixel':changes,'descendant_image_case_samples':image_samples,'selection_disabled':'At width 768, EN/RU/SR × normal/reduced, checkbox/radio selected colors and focused error state measured; real Balloons/Weddings SVG buttons disabled and inert for pointer/Enter/Space.', 'enabled_svg':'Not applicable on this actual build: site.ts whatsappUrl=null, EnquiryLink returns disabled ActionButton. Root and fixture source witnesses below; no enabled state fabricated.'}, 'conditional_source_hashes':source,'runtime_image_cache_after':{'files':len(cache_files),'bytes':sum(p.stat().st_size for p in cache_files),'growth':'unknown; no pre-run image cache snapshot; normal Next image-cache writes are not bundle/source writes'}, 'cleanup':[remaining['cleanup'],geometry['cleanup'],initial['cleanup'],cues['cleanup']], 'source_unchanged':remaining['sourceUnchanged'] and geometry['sourceUnchanged'] and initial['sourceUnchanged'] and cues['sourceUnchanged'], 'remaining':['Geometry script does not independently capture before/during/after keyboard-focus phase for all 14 styles; detailed focus-visible/viewport coverage is instead in separate tab checks for controls, FAQ, Home and anchors, not each breadcrumb/circle.', 'The 126 geometry cases capture object-fit/object-position only for descendant images actually present within target, not a complete crop comparison of every adjacent card image; inert before CSS is retained but no historical render baseline exists.', 'Selected/focus/error cues and disabled SVG were sampled at 768 only; no broad contrast certification or assistive-technology announcement test (DOM aria-describedby/role=alert verified).', 'Actual Supervisor Sol review remains required. No full acceptance, all-site audit or independent design certification claimed.'], 'evidence':['remaining-results.json','geometry-results.json','disabled-cues-initial-results.json.txt','disabled-cues-results.json','remaining.mjs','geometry.mjs','disabled-cues.mjs']}
(out/'completion-record.json').write_text(json.dumps(record,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'runs':record['current_runs'],'contrast_min':record['coverage']['error_contrast']['min'],'adjacent_samples':adjacent_samples,'adjacent_shifts':len(changes),'image_samples':image_samples,'cache':record['runtime_image_cache_after'],'outcome':record['outcome']},indent=2))
