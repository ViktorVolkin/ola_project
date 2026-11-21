// EXECUTION ENTRY POINT: never run before dedicated observer Supervisor approval.
import {readFile,writeFile,lstat} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {hash,requireThat,safeSerialize} from '../deploy-candidate/core.mjs';
import {loadCredential} from './credential.mjs';
import {observe,PATH,API_VERSION} from './observer.mjs';
const root='/workspace',qa=fileURLToPath(new URL('.',import.meta.url)).replace(/\/$/,'');
async function regular(path){requireThat((await lstat(path)).isFile(),'Regular bound file required');return readFile(path);}
let token;
try{
 const bindingBytes=await regular(`${qa}/observer-binding.json`),binding=JSON.parse(bindingBytes),approval=JSON.parse(await regular(`${qa}/supervisor-approved.json`));
 requireThat(approval.verdict==='PASS'&&approval.reviewer_profile==='supervisor'&&approval.reviewer_model==='gpt-6.1-sol'&&approval.provider==='openai-codex'&&approval.operation==='single-activation-metadata-GET'&&approval.observerBindingSha256===hash(bindingBytes),'Dedicated binding-specific observer approval required');
 requireThat(approval.path===PATH&&approval.apiVersion===API_VERSION,'Approval operation mismatch');
 for(const f of binding.files)requireThat(hash(await regular(`${root}/${f.path}`))===f.sha256,'Observer/dependency byte changed');
 // Exclusive permanent reservation prevents a second invocation from consuming another query.
 await writeFile(`${qa}/one-shot-reservation`,'',{flag:'wx'});
 token=await loadCredential();
 const require=createRequire(`${root}/studio/package.json`),{createClient}=require('@sanity/client');
 const result=await observe({createClient,fetchImpl:globalThis.fetch,token});
 const text=safeSerialize(result,token);await writeFile(`${qa}/observation.json`,text,{flag:'wx'});
 if(text==='null'||result.status!=='metadata_observed')throw Error('Observation unavailable');
 console.log('Single read-only metadata observation recorded; no hosting/content write.');
}catch{if(token){try{await writeFile(`${qa}/failure.json`,safeSerialize({observedAt:new Date().toISOString(),status:'NOT_VERIFIED'},token),{flag:'wx'});}catch{}}console.error('Observer blocked or NOT_VERIFIED. No retry, redirect followup or other operation.');process.exitCode=1;}
