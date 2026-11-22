import {readFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='/workspace',packet=`${root}/docs/qa/quality/cms-about-001`;
let prefix=(await readFile(`${packet}/verify.mjs`,'utf8')).split('\ntry{')[0];
prefix=prefix.replace('qa=`${root}/docs/qa/quality/cms-about-001`','qa=`${root}/docs/qa/quality/cms-about-001/resume`').replace('`${qa}/custom-server.mjs`','`${root}/docs/qa/quality/cms-about-001/custom-server.mjs`').replace("server.listen(0,'127.0.0.1',resolve)","server.listen(name==='api'?36397:name==='proxy'?34367:0,'127.0.0.1',resolve)");
prefix=prefix.replaceAll("from '/workspace/", "from 'file:///workspace/");
const publicOnly=process.argv[2]==='public',outageOnly=process.argv[2]==='outage';
const folder=outageOnly?'resume-outage':publicOnly?'resume-public':'resume';
prefix=prefix.replace('cms-about-001/resume`',`cms-about-001/${folder}\``);
await mkdir(`${packet}/${folder}`,{recursive:true});
let steps=await readFile(`${packet}/${publicOnly||outageOnly?'resume-public-steps.txt':'resume-steps.txt'}`,'utf8');
if(outageOnly){
 const start=steps.indexOf(" await eventually('en',published.hero.title.en);");
 const end=steps.indexOf(" assert(out.requests.some(r=>r.kind==='outage')");
 if(start<0||end<0)throw Error('Outage harness seam absent');
 steps=steps.slice(0,start)+` apiMode='outage';\n const editor=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:900}}),ep=await editor.newPage();\n await ep.goto(\`\${origin}/api/draft-mode/enable?sanity-preview-secret=\${secret}&sanity-preview-pathname=/en/about\`,{waitUntil:'networkidle'});\n for(const locale of locales){await ep.goto(\`\${origin}/\${locale}/about\`,{waitUntil:'networkidle'});const diagnostic=ep.locator('[data-about-preview] [role="alert"]');out.cases.push({kind:'outage-draft',locale,heading:await ep.locator('h1').innerText(),alerts:await ep.locator('[role="alert"]').count(),statusAlerts:await diagnostic.count(),status:await ep.locator('[data-about-preview]').innerText()});await ep.screenshot({path:qa+'/outage-draft-'+locale+'.png',fullPage:true});await record();assert(await ep.locator('h1').innerText()===getAboutContent(locale).hero.title,'Outage draft fallback');assert(await diagnostic.count()===1,'Outage localized diagnostic');}\n`+steps.slice(end);
}
await import(`data:text/javascript;base64,${Buffer.from(prefix+steps).toString('base64')}`);
console.log('Shared QA prefix SHA256',createHash('sha256').update(prefix).digest('hex'));
