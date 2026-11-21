import {readFile,writeFile,copyFile} from 'node:fs/promises';
const qa='/workspace/docs/qa/quality/sanity-home-visual-editing-001/takeover';
await copyFile(`${qa}/browser-results.json`,`${qa}/browser-mapping-green-1.json`);
let s=await readFile(`${qa}/browser-final.mjs`,'utf8');
s=s.replace("const listeners=new Set();",`const listeners=new Set();
for(const [name,studioUrl,age]of [['valid','http://localhost:3333',0],['expired','http://localhost:3333',7200000],['origin','https://evil.example.test',0]]){const value=name==='valid'?secret:'synthetic-'+name;docs.set('sanity-preview-url-secret.'+name,{_id:'sanity-preview-url-secret.'+name,_type:'sanity.previewUrlSecret',secret:value,studioUrl,_updatedAt:new Date(Date.now()-age).toISOString()});}`);
const a=s.indexOf("  if(query?.includes('sanity.previewUrlSecret'))"),b=s.indexOf('\n',a);
s=s.slice(0,a)+`  if(query?.includes('sanity.previewUrlSecret'))return {result:await (await evaluate(parse(query),{dataset:[...docs.values()],params})).get()};`+s.slice(b);
s=s.replace("const target=frame.locator('[data-sanity*=\"path='+path+';\"]').first();", "const target=frame.locator('[data-sanity*=\"path='+path+';\"]:visible').first();");
s=s.replace(" const editor=await browser.newContext",` const attacks=[
 ['absent','sanity-preview-pathname=/en',400],
 ['malformed','sanity-preview-secret=x&sanity-preview-pathname=%252Fen',400],
 ['arbitrary-host','sanity-preview-secret=x&sanity-preview-pathname=https%3A%2F%2Fevil.test%2Fen',400],
 ['protocol-relative','sanity-preview-secret=x&sanity-preview-pathname=%2F%2Fevil.test',400],
 ['encoded-relative','sanity-preview-secret=x&sanity-preview-pathname=%252F%252Fevil.test',400],
 ['duplicate','sanity-preview-secret=x&sanity-preview-pathname=/en&sanity-preview-pathname=/ru',400],
 ['wrong-project','sanity-preview-secret=synthetic-wrong-project&sanity-preview-pathname=/en',401],
 ['expired','sanity-preview-secret=synthetic-expired&sanity-preview-pathname=/en',401],
 ['untrusted-Studio','sanity-preview-secret=synthetic-origin&sanity-preview-pathname=/en',401],
 ['arbitrary-project','sanity-preview-secret=x&sanity-preview-pathname=/en&projectId=evil',400],
 ];
 for(const [name,query,status]of attacks){const isolated=await browser.newContext();const res=await isolated.request.get('http://localhost:42242/api/draft-mode/enable?'+query,{maxRedirects:0});assert(res.status()===status,'Attack status '+name);assert(!res.headers()['set-cookie'],'Attack enabled cookie '+name);assert(!(await res.text()).includes(token),'Error leaked read token');results.checks.push({kind:'security-control',name,status:res.status(),cache:res.headers()['cache-control']});await isolated.close();}
 const chips=await browser.newContext();const chipsRes=await chips.request.get('http://localhost:42242/api/draft-mode/enable?sanity-preview-secret='+secret+'&sanity-preview-pathname=/sr',{maxRedirects:0,headers:{'sec-fetch-dest':'iframe','sec-fetch-site':'cross-site'}});assert(chipsRes.status()===307,'CHIPS helper redirect');const cookie=chipsRes.headers()['set-cookie'];assert(cookie.includes('HttpOnly')&&cookie.includes('Secure')&&cookie.includes('SameSite=none')&&cookie.includes('Partitioned'),'official CHIPS cookie missing');results.checks.push({kind:'official-CHIPS',status:chipsRes.status(),location:chipsRes.headers().location,attributes:{httpOnly:true,secure:true,sameSite:'none',partitioned:true}});await chips.close();
 const protectedFrame=studioPage.frames().find(f=>f.url().startsWith('http://localhost:42242'));
 const guard=await protectedFrame.evaluate(()=>{let passed=false;const listener=()=>{passed=true;};window.addEventListener('message',listener);window.dispatchEvent(new MessageEvent('message',{origin:'https://evil.example.test',source:window.parent,data:{domain:'sanity/channels',type:'presentation/navigate',from:'presentation',to:'overlays',data:{type:'push',url:'/ru'}}}));window.removeEventListener('message',listener);return {blocked:!passed};});assert(guard.blocked,'untrusted parent message bypassed capture guard');results.checks.push({kind:'untrusted-parent-origin',...guard});
 const editor=await browser.newContext`);
// The only remaining EventSource warning is unrelated Studio agent stream; handle it explicitly as empty SSE, not JSON.
s=s.replace("url.pathname.includes('/data/listen/')||url.pathname.includes('/live/events')", "url.pathname.includes('/data/listen/')||url.pathname.includes('/live/events')||url.pathname.endsWith('/listen')");
s=s.replace(" assert(results.activation.heading", " assert(results.activation.heading");
s=s.replace(" const another=await publicContext.request.get",` for(const script of await page.locator('script[src]').evaluateAll(nodes=>nodes.map(n=>n.src))){const response=await page.request.get(script);const bytes=await response.text();assert(!bytes.includes(token),'server read token in served browser script');}results.checks.push({kind:'served-client-token-scan',found:false});
 const another=await publicContext.request.get`);
await writeFile(`${qa}/browser-final.mjs`,s);console.log('Added adversarial official-helper controls, actual GROQ TTL evaluation, parent-origin capture check, visible alternate caption coverage.');
