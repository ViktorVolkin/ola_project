import json
from pathlib import Path
from collections import Counter

out = Path('docs/qa/quality/interaction-widgets-001')
a = json.loads((out / 'remaining-results.json').read_text())
b = json.loads((out / 'geometry-results.json').read_text())
deltas=[]
for c in b['cases']:
 if c['status'] != 'pass':
  continue
 initial=c['detail']['initial']
 for phase in ['hover','press','after']:
  other=c['detail'][phase]
  if initial['adjacent'] and other['adjacent']:
   delta=max(abs(initial['adjacent'][k]-other['adjacent'][k]) for k in ('x','y','w','h'))
   if delta > .5:
    deltas.append({'locale':c['locale'],'width':c['width'],'family':c['family'],'phase':phase,'delta':delta})
contrasts=[c['detail']['error']['contrast'] for c in a['cases'] if c['name']=='detail tab sequence and error contrast' and c['status']=='pass']
print(json.dumps({'adjacent_changes':deltas,'contrast_min':min(contrasts),'contrast_max':max(contrasts),'geometry_families':dict(Counter(c['family'] for c in b['cases']))},indent=2))
