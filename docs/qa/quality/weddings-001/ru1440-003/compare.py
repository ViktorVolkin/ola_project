import json, hashlib
from pathlib import Path
from PIL import Image, ImageChops
P=Path(__file__).parent
w={k:json.loads((P/k/'captures/witness.json').read_text()) for k in ('before','after')}
result={'limitation':'All frames unstable; equality is literal observation only, not accepted stable-frame comparison or proof of prior discrepancy cause. Canvas is a decoded DOM-image sample, not compositor paint.','frames':{}}
for phase,x in w.items():
 rows=[]
 for f in x['frames']:
  pre=f['pre']; post=f['post']; selected=[]
  for img in pre['imgs']:
   matches=[r for r in x['responses'] if r['url']==img['currentSrc'] and r['type']=='image']
   selected.append({'url':img['currentSrc'],'matching_responses':[{'status':r['status'],'contentType':r['contentType'],'sha256':r['sha256'],'decoded':r.get('decoded')} for r in matches],'canvas':img['canvas']})
  rows.append({'attempt':f['attempt'],'stable':f['stable'],'transitions':f['transitions'],'candidate_changes':[(a['currentSrc'],b['currentSrc']) for a,b in zip(pre['imgs'],post['imgs']) if a['currentSrc']!=b['currentSrc']],'mapping':{'dpr':pre['dpr'],'viewport':pre['viewport'],'visualViewport':pre['visualViewport'],'scroll':pre['scroll'],'document':pre['document'],'screenshot':f['screenshot']},'all_selected_response_present':all(s['matching_responses'] for s in selected),'selected':selected})
 result['frames'][phase]=rows
pairs=[]
for attempt in (1,2):
 b=w['before']['frames'][attempt-1]; a=w['after']['frames'][attempt-1]
 bp=P/'before/captures'/f'frame-{attempt}.png'; ap=P/'after/captures'/f'frame-{attempt}.png'
 bi=Image.open(bp).convert('RGBA'); ai=Image.open(ap).convert('RGBA')
 same_size=bi.size==ai.size
 if same_size:
  diff=ImageChops.difference(bi,ai); mask=diff.getchannel('R').point(lambda x:255 if x else 0)
  for ch in ('G','B','A'): mask=ImageChops.lighter(mask,diff.getchannel(ch).point(lambda x:255 if x else 0))
  count=sum(mask.histogram()[1:]); bbox=mask.getbbox()
 else: count=None; bbox=None
 pairs.append({'attempt':attempt,'both_stable':b['stable'] and a['stable'],'rgba_equal':same_size and bi.tobytes()==ai.tobytes(),'png_equal':bp.read_bytes()==ap.read_bytes(),'size_before':bi.size,'size_after':ai.size,'changed_pixels':count,'diff_bbox':bbox,'pre_main_dom_literal_equal':b['pre']['main']==a['pre']['main'],'post_main_dom_literal_equal':b['post']['main']==a['post']['main'],'pre_image_live_literal_equal':b['pre']['imgs']==a['pre']['imgs'],'post_image_live_literal_equal':b['post']['imgs']==a['post']['imgs']})
result['comparisons']=pairs
(P/'comparison.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({'comparisons':pairs,'selected_coverage':{p:[(r['attempt'],r['all_selected_response_present']) for r in rows] for p,rows in result['frames'].items()}},indent=2))
