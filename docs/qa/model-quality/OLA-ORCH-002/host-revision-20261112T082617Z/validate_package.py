"""Executor structural checks for OLA-ORCH-002; not independent review or acceptance."""
from pathlib import Path
import json,hashlib,re,difflib,subprocess,os,datetime
from ruamel.yaml import YAML
REV=Path(__file__).resolve().parent
PACKET=REV.parent
BASE=PACKET.parent
PROJECT=REV.parents[4]
checks=[]
def check(name,ok,details=None):
    checks.append({'name':name,'ok':bool(ok),'details':details})
def sha(data):return hashlib.sha256(data).hexdigest()
manifest=json.loads((REV/'originals-manifest.json').read_text())
check('authorized_target_count',len(manifest)==11,len(manifest))
check('unique_target_paths',len({e['path'] for e in manifest})==len(manifest))
changed=[]
for e in manifest:
    p=Path(e['path']);old=(PACKET/e['original']).read_bytes();new=p.read_bytes()
    snapshot=REV/'after'/e['label'];diffpath=REV/'diffs'/(e['label']+'.diff')
    check('original_hash:'+e['label'],sha(old)==e['before_sha256'])
    check('after_readback:'+e['label'],snapshot.read_bytes()==new)
    expected=''.join(difflib.unified_diff(old.decode().splitlines(keepends=True),new.decode().splitlines(keepends=True),fromfile='before/'+e['label'],tofile='after/'+e['label']))
    check('exact_targeted_diff:'+e['label'],diffpath.read_text()==expected)
    check('text_whitespace:'+e['label'],all(line==line.rstrip() for line in new.decode().splitlines()))
    if old!=new:changed.append(e['path'])
check('all_eleven_targets_updated',len(changed)==11,len(changed))
yaml=YAML(typ='safe');yaml.allow_duplicate_keys=False
skills=[e for e in manifest if e['path'].endswith('/SKILL.md')]
check('five_skill_frontmatters',len(skills)==5)
for e in skills:
    p=Path(e['path']);text=p.read_text();parts=text.split('---',2)
    fm=yaml.load(parts[1]) if text.startswith('---\n') and len(parts)==3 else {}
    check('frontmatter:'+p.parent.name,isinstance(fm,dict) and fm.get('name')==p.parent.name and isinstance(fm.get('description'),str) and len(fm['description'])<=60 and bool(parts[-1].strip()))
    for ref in re.findall(r'`(references/[\w./-]+\.md)`',text):
        check('skill_reference:'+p.parent.name+'/'+ref,(p.parent/ref).is_file())
    for ref in (fm.get('metadata',{}).get('hermes',{}).get('related_skills') or []):
        available=(p.parents[1].parent/ref/'SKILL.md').is_file() or any(p.parents[1].parent.glob('*/'+ref+'/SKILL.md')) or any(Path('/home/viktor/.hermes/skills').glob('*/'+ref+'/SKILL.md')) or any(Path('/home/viktor/.hermes/skills').glob(ref+'/SKILL.md'))
        check('related_skill:'+p.parent.name+'/'+ref,available)
oldledger=json.loads((REV/'originals/docs/qa/model-quality/ledger.json').read_text())
ledger=json.loads((BASE/'ledger.json').read_text())
check('schema_version_preserved',ledger['schema_version']==oldledger['schema_version']==1)
check('coverage_preserved',ledger['coverage']==oldledger['coverage'])
allids=[]
for kind in ('units','attempts','corrections'):
    old=oldledger[kind];new=ledger[kind]
    check('history_preserved:'+kind,new[:len(old)]==old)
    ids=[o['id'] for o in new];allids+=ids
    check('unique_ids:'+kind,len(ids)==len(set(ids)))
check('unique_ids_across_record_kinds',len(allids)==len(set(allids)))
units={u['id']:u for u in ledger['units']};attempts={a['id']:a for a in ledger['attempts']}
for a in ledger['attempts']:check('attempt_unit:'+a['id'],a['unit_id'] in units)
for c in ledger['corrections']:check('correction_binding:'+c['id'],c['attempt_id'] in attempts and c['unit_id']==attempts[c['attempt_id']]['unit_id'])
for u in ledger['units']:check('parent_unit:'+u['id'],u.get('parent_id') is None or u['parent_id'] in units)
unit=units['OLA-ORCH-002']
check('explicit_review_gate_pending',unit['review_required'] is True and unit['delivery_state']=='awaiting_review' and unit['supervisor']['status']=='pending' and unit['supervisor']['actual_model'] is None)
check('ola_wf_001_not_waived',units['OLA-WF-001']==next(u for u in oldledger['units'] if u['id']=='OLA-WF-001'))
path_re=re.compile(r'^(?:\.{1,2}/)?[\w./-]+\.(?:md|json|log|diff|txt|py)$')
for kind in ('units','attempts','corrections'):
    for obj in ledger[kind]:
        for ref in obj.get('evidence',[]):
            if isinstance(ref,str) and path_re.fullmatch(ref):
                # checks.json is written by this run after every check completes.
                exists=(BASE/ref).exists() or (BASE/ref).resolve()==(REV/'checks.json').resolve()
                check('evidence_path:'+obj['id']+':'+ref,exists)
check('historical_benchmark_reference',(BASE/ledger['coverage']['historical_benchmarks']).exists())
for md in (BASE/'README.md',PACKET/'evidence-packet.md'):
    for ref in re.findall(r'\]\(([^)]+)\)',md.read_text()):
        if '://' in ref or ref.startswith('#'):continue
        target=(md.parent/ref.split('#')[0]).resolve()
        check('markdown_link:'+md.name+':'+ref,target.exists() or target==(REV/'checks.json').resolve())
for e in manifest:
    if not ('/profiles/' in e['path']):continue
    text=Path(e['path']).read_text()
    forbidden=['#### Step 2: Dispatch Spec Compliance Reviewer','#### Step 3: Dispatch Code Quality Reviewer','Two-stage review every time','parent-run the full suite','git add -A && git commit','stash changes, run, pop','delegate one final bookkeeping update','Every implementation task requires independent final review']
    hits=[s for s in forbidden if s in text]
    check('obsolete_positive_examples_removed:'+e['label'],not hits,hits)
    check('risk_and_explicit_gate_present:'+e['label'],'risk' in text.lower() and 'OLA-ORCH-002' in text and 'OLA-WF-001' in text)
lead=Path(next(e['path'] for e in manifest if e['label']=='profiles/lead/SOUL.md')).read_text()
sup=Path(next(e['path'] for e in manifest if e['label']=='profiles/supervisor/SOUL.md')).read_text()
check('lead_no_artifact_checks_or_code_review','Never write project files' in lead and 'perform code review' in lead and 'artifact-producing checks' in lead)
check('supervisor_explicit_own_review_write_permission','ONLY after explicit authorization' in sup and 'not write permission' in sup and "implementation accounting" in sup)
check('activation_limit_recorded','already injected' in lead and 'already injected' in sup and 'already injected' in (PACKET/'evidence-packet.md').read_text())
env={**os.environ,'GIT_OPTIONAL_LOCKS':'0'}
r=subprocess.run(['git','-C',str(PROJECT),'diff','--check'],capture_output=True,text=True,env=env)
(REV/'git-diff-check.txt').write_text('command: git diff --check\nexit_code: '+str(r.returncode)+'\n'+r.stdout+r.stderr)
check('git_diff_check',r.returncode==0,{'exit_code':r.returncode,'output_file':'git-diff-check.txt'})
index=subprocess.check_output(['git','-C',str(PROJECT),'diff','--cached','--binary'],env=env)
check('staged_git_state_unchanged',sha(index)==(REV/'git-index-before.sha256').read_text().strip())
noindex=[]
for e in manifest:
    r=subprocess.run(['git','diff','--no-index','--check',str(PACKET/e['original']),str(REV/'after'/e['label'])],capture_output=True,text=True,env=env)
    noindex.append({'path':e['path'],'exit_code':r.returncode,'output':r.stdout+r.stderr})
check('targeted_no_index_whitespace_checks',all(x['exit_code'] in (0,1) and not x['output'].strip() for x in noindex),noindex)
result={'task_id':'OLA-ORCH-002','kind':'executor_structural_checks_not_independent_review','checked_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'all_checks_ok':all(c['ok'] for c in checks),'check_count':len(checks),'failed':[c for c in checks if not c['ok']],'checks':checks,'changed_paths':changed,'website_build_tests':{'status':'not_run','reason':'Not applicable: docs/rules-only; no website source/tests/dependencies changed.'},'review':{'status':'pending','required_actual_profile':'supervisor','required_model':'gpt-6.1-sol','initiated_by_executor':False}}
(REV/'checks.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:result[k] for k in ('task_id','all_checks_ok','check_count','failed')},ensure_ascii=False,indent=2))
if not result['all_checks_ok']:raise SystemExit(1)
