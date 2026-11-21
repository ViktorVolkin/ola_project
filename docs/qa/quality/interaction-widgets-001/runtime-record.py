import json
from pathlib import Path

out = Path('docs/qa/quality/interaction-widgets-001')
a = json.loads((out / 'integrated-results.json').read_text())
b = json.loads((out / 'interaction-extra.json').read_text())
icons = [x for c in b['cases'] if c['name'] == 'category native enabled/disabled and no submit' and c['status'] == 'pass' for x in c['detail']]
record = {
 'task':'OLA-INTERACTION-WIDGETS-001',
 'outcome':'implemented_partially_runtime_verified_awaiting_completion_and_review',
 'risk':'medium',
 'review_required':'actual Supervisor Sol after remaining browser gates',
 'build_id':a['buildId'],
 'source_identity':'14 checkpoint SHA-256 values match root and immutable fixture before and after both browser runs',
 'cases':{'matrix_5_groups_per_context':a['summary'],'supplementary_groups':b['summary'],'definition':'Group results, not per-element assertions; 18 matrix contexts = 3 locales × 3 widths × 2 motion settings. See raw results for each group.'},
 'browser':a['witness'].get('browser'),
 'runtime_errors':a['errors'] + b['errors'],
 'icon_action_actual_disabled_count':sum(x['initial']['disabled'] for x in icons),
 'icon_action_actual_enabled_count':sum(not x['initial']['disabled'] for x in icons),
 'families':{
  'gallery':'18 contexts: Enter changes aria-pressed and image; sampled desktop hover/press and geometry. No touch gallery test.',
  'radio_checkbox':'18 contexts: Space changes native checked; six desktop contexts label clicks. No actual disabled preferences were present.',
  'date_textarea':'18 contexts: invalid date blur then valid edit, textarea edit; keyboard focus and individual error visual contrast not fully measured.',
  'details_faq':'18 contexts: details Enter; FAQ Space then Enter toggles. Focus computed in FAQ; no full focus-tab sequence for each.',
  'bouquet_anchors_disabled':'18 contexts: Enter fragment, disabled actual button state; three mobile touch taps check non-sticky hover. Disabled press/no-activation not explicitly simulated.',
  'home':'18 contexts: service/mood/rail focus styles and hrefs; six desktop contexts service hover/press and bounds, three mobile contexts native ArrowRight rail scrolling. Home link navigation not activated.',
  'breadcrumbs_and_back':'18 contexts: five route breadcrumbs focus/href, desktop hover. Detail back link, all keyboard Tab paths, click and active behavior not separately exercised.',
  'category_svg_actions':'Six desktop contexts per two routes: actual status and hover, disabled unchanged when disabled. Enabled hover/press behavior may be untestable if configuration renders disabled; no external actions invoked.',
  'shared_actions_and_detail_supplied':'Underlying actions render as observed by browser but shared variants and supplied action states not fully retested here; external contact intentionally not invoked.',
  'skip':'Six desktop contexts: first Tab, native target and outline. No separate mobile skip check.'},
 'remaining':['Full family × locale × viewport × motion × input-state coverage is not complete; raw group PASS is not a complete family gate.', 'Confirm detail back interaction, enabled SVG feedback only in an actual enabled environment, disabled controls activation/movement, expanded individual focus/error visual states, native Tab scrolling and positioning/crop/no-shift witnesses for all affected families.', 'Boundary overflow checked EN only at 599/600/1099/1100/1199/1200; no exhaustive visual geometry or contrast comparison.', 'One representative screenshot is available; no comprehensive screenshots/video were captured.', 'No source mutation, rebuild, external contact, or Supervisor review.'],
 'server_cleanup':[a['cleanup'],b['cleanup']],
 'launch_failure':'integrated-launch-failure.json.txt preserves first Playwright browser-path failure and cleanup; corrected run used handoff environment.',
 'evidence':['integrated-results.json','interaction-extra.json','integrated-server.log','interaction-extra-server.log','integrated-desktop.png'],
}
(out / 'runtime-record.json').write_text(json.dumps(record, indent=2, ensure_ascii=False)+'\n')
print(json.dumps({'matrix':a['summary'],'supplemental':b['summary'],'icons_disabled':record['icon_action_actual_disabled_count'],'icons_enabled':record['icon_action_actual_enabled_count']},indent=2))
