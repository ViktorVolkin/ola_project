import {createHash} from 'node:crypto';
export const TARGET=Object.freeze({id:'xxpedejjvg9va6r4u8t4llzw',projectId:'zhn2ddaj',dataset:'production',appHost:'ola-studio-zhn2ddaj',type:'studio',urlType:'internal'});
export const ORIGIN='https://olaproject-chi.vercel.app';
export const NODE='/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node';
export const WORK='/workspace/.local-tools/ola-qa/sanity-home-click-null-production-deploy';
export const CONFIG=`import {defineCliConfig} from 'sanity/cli';\nexport default defineCliConfig({api:{projectId:'zhn2ddaj',dataset:'production'},deployment:{appId:'xxpedejjvg9va6r4u8t4llzw'}});\n`;
export const ARGS=Object.freeze(['node_modules/sanity/bin/sanity','deploy','dist','--no-build','--no-auto-updates','--schema-required','--yes','--json']);
export const hash=b=>createHash('sha256').update(b).digest('hex');
export const requireThat=(v,m)=>{if(!v)throw Error(m);};
export function redact(text,token){if(!token)return 'Operation failed before credential consumption';for(const value of [token,encodeURIComponent(token),Buffer.from(token).toString('base64'),JSON.stringify(token).slice(1,-1)])text=String(text).split(value).join('[REDACTED]');return text;}
// Sanitize string values BEFORE JSON escapes; also sanitize serialized property keys.
// A cyclic/toJSON/getter/encoding failure produces JSON null, never raw fallback details.
export function safeSerialize(value,token){try{const text=JSON.stringify(value,(_key,item)=>typeof item==='string'?redact(item,token):item instanceof Error?{name:item.name,message:item.message}:item,2);if(typeof text!=='string')return 'null';let safe=text;for(const secret of [token,encodeURIComponent(token),Buffer.from(token).toString('base64'),JSON.stringify(token).slice(1,-1)]){if(secret)safe=safe.split(JSON.stringify(secret).slice(1,-1)).join('[REDACTED]');}return safe;}catch{return 'null';}}
export function safeErrorMessage(error){try{return error instanceof Error?error.message:String(error);}catch{return undefined;}}
export function exactApp(data){const apps=Array.isArray(data)?data:Array.isArray(data?.applications)?data.applications:Array.isArray(data?.userApplications)?data.userApplications:data?[data]:[];requireThat(apps.length===1,'Expected exactly one existing application');const app=apps[0];for(const k of ['id','projectId','appHost','type','urlType'])requireThat(app[k]===TARGET[k],`Application ${k} mismatch`);return Object.fromEntries(['id','projectId','appHost','type','urlType'].map(k=>[k,app[k]]));}
export async function run({validate,readApp,writeOnce,persist,token}){
 let attempted=false;
 const save=async(name,value)=>persist(name,safeSerialize(value,token));
 try{
  await validate();const before=exactApp(await readApp());await save('app-before.json',before);
  await validate();attempted=true;
  const result=await writeOnce({node:NODE,args:[...ARGS],cwd:WORK,config:CONFIG});
  await save('deploy-result.json',result);requireThat(result.code===0,'Installed CLI deployment failed; no retry');
  const after=exactApp(await readApp());await save('app-after.json',after);
  return {status:'write_succeeded_readback_required',attempted:true,application:after};
 }catch(error){await save('operation-error.json',{status:'blocked',writeAttempted:attempted,message:safeErrorMessage(error),noRetry:true});throw Error('Hosting operation blocked; sanitized own evidence retained');}
}
export function verifyBytes(rows,actual){requireThat(rows.length===actual.length,'Artifact path count mismatch');const expected=new Map(rows.map(f=>[f.path,f]));requireThat(expected.size===rows.length,'Duplicate artifact path');for(const f of actual){requireThat(!f.path.split('/').some(p=>p.startsWith('.')||['docs','node_modules','secrets'].includes(p))&&!f.path.includes('\\'),'Forbidden public artifact path');const e=expected.get(f.path);requireThat(e&&e.sha256===hash(f.bytes)&&e.bytes===f.bytes.length,'Artifact identity mismatch');}}
