from pathlib import Path
import json,hashlib,re,shutil
R=Path('/workspace'); E=R/'docs/qa/quality/home-structure-001'; H=R/'src/components/widgets/HomeBlocks'
for rel, info in json.loads((E/'before-sources/manifest.json').read_text()).items():
 assert hashlib.sha256((R/rel).read_bytes()).hexdigest()==info['sha256']
common=H/'HomeCommon'; common.mkdir(); shutil.move(H/'HomeCommon.module.css',common/'HomeCommon.module.css')
ids={'Hero':'home-hero-title','Mood':'home-mood-title','CustomExtras':'home-custom-title','Meet':'home-meet-title','Events':'home-events-title'}
(common/'headingIds.ts').write_text('export const homeHeadingIds = {\n'+''.join(f'  {name[0].lower()+name[1:]}: "{value}",\n' for name,value in ids.items())+'} as const;\n')
for part in ['Hero','Mood','Services','Events','Meet','CustomExtras']:
 name=f'Home{part}Block'; original=H/(name+'.tsx'); text=original.read_text(); match=re.search(r'type '+name+r'Props = \{.*?\n\};',text,re.S); assert match
 target=H/name; target.mkdir(); (target/(name+'.types.ts')).write_text('import type { HomeContent } from "../types";\n\nexport '+match.group()+'\n')
 text=text.replace('import type { HomeContent } from "./types";',f'import type {{ {name}Props }} from "./{name}.types";').replace('./imageSizes','../imageSizes').replace('./HomeCommon.module.css','../HomeCommon/HomeCommon.module.css')
 text=text.replace(match.group()+'\n\n','')
 if part in ids:
  marker='import common from "../HomeCommon/HomeCommon.module.css";'; text=text.replace(marker,marker+'\nimport { homeHeadingIds } from "../HomeCommon/headingIds";')
  text=text.replace('"'+ids[part]+'"','{homeHeadingIds.'+part[0].lower()+part[1:]+'}')
 (target/(name+'.tsx')).write_text(text); original.unlink(); shutil.move(H/('Home'+part+'.module.css'),target/('Home'+part+'.module.css'))
 (target/'index.ts').write_text(f'export {{ {name} }} from "./{name}";\nexport type {{ {name}Props }} from "./{name}.types";\n')
