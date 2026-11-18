import collections
import json
from pathlib import Path
import re

root = Path(__file__).parent
files = sorted((root / 'raw').glob('*.json'))
results = [json.loads(p.read_text()) for p in files]
findings = {}
incomplete = collections.Counter()
for item in results:
    axe = item.get('axe', {}).get('results', {})
    for rule in axe.get('incomplete', []):
        incomplete[rule['id']] += len(rule['nodes'])
    for rule in axe.get('violations', []):
        for node in rule['nodes']:
            selector = ' '.join(node['target'])
            selector = re.sub(r'_R_[\w-]+', 'REACT_ID', selector)
            selector = re.sub(r'/\b(en|ru|sr)\b', '/LOCALE', selector)
            if rule['id'] == 'label-content-name-mismatch' and 'hWdmrG_trigger' in node['html']:
                selector = 'LanguageSwitcher trigger (all instances; original target retained per occurrence)'
            key = (rule['id'], selector)
            if key not in findings:
                findings[key] = {'rule': rule['id'], 'impact': node['impact'], 'selector': selector, 'html': node['html'], 'help': rule['help'], 'helpUrl': rule['helpUrl'], 'occurrences': []}
            findings[key]['occurrences'].append({'route': item['route'], 'project': item['project'], 'state': item['state'], 'target': node['target']})
summary = {'cases': len(results), 'scanned': sum('axe' in r for r in results), 'states': dict(collections.Counter(r['state'] for r in results)), 'errors': [{'route': r['route'], 'project': r['project'], 'state': r['state'], 'errors': r['errors']} for r in results if r['errors']], 'missingScan': [{'route': r['route'], 'project': r['project'], 'state': r['state'], 'failure': r.get('failure')} for r in results if 'axe' not in r], 'incompleteNodesByRule': dict(incomplete), 'findings': list(findings.values())}
(root / 'summary.json').write_text(json.dumps(summary, indent=2, ensure_ascii=False))
print('cases', summary['cases'], 'scanned', summary['scanned'], 'states', summary['states'])
print('missingScan', summary['missingScan'])
print('console/page errors', summary['errors'])
print('incomplete', summary['incompleteNodesByRule'])
for f in summary['findings']:
    print(f['impact'], f['rule'], f['selector'], len(f['occurrences']), f['html'][:200])
