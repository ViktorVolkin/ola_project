import {afterEach,beforeEach,describe,expect,it,vi} from "vitest";
import {getAboutContent} from "@/content/about";
vi.mock("server-only",()=>({}));
const state=vi.hoisted(()=>({draft:false,configured:true,fetch:vi.fn()}));
vi.mock("next/headers",()=>({draftMode:async()=>({isEnabled:state.draft})}));
vi.mock("@/content/sanity/preview-client",()=>({previewClient:()=>state.configured?{fetch:state.fetch}:null}));
import {resolveAboutContent} from "@/content/resolver/about";
beforeEach(()=>{state.draft=false;state.configured=true;state.fetch.mockReset();vi.stubGlobal("fetch",vi.fn());vi.stubEnv("CONTENT_SOURCE",undefined);});
afterEach(()=>{vi.unstubAllGlobals();vi.unstubAllEnvs();vi.restoreAllMocks();});
describe("About unified source boundary",()=>{
  it.each(["en","ru","sr"] as const)("%s default has zero requests and no preview",async locale=>{expect(await resolveAboutContent(locale)).toMatchObject({source:"default",content:getAboutContent(locale),preview:null});expect(fetch).not.toHaveBeenCalled();expect(state.fetch).not.toHaveBeenCalled();});
  for(const source of ["default","sanity"])for(const locale of ["en","ru","sr"] as const){
    it(`${locale} draft beats ${source} and falls back published then local`,async()=>{
      vi.stubEnv("CONTENT_SOURCE",source);state.draft=true;
      vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({result:{_id:"aboutPage",_type:"aboutPage",hero:{body:{[locale]:"Published"}}}})));
      state.fetch.mockResolvedValue({_id:"drafts.aboutPage",_type:"aboutPage",hero:{title:{[locale]:"Draft"}}});
      const result=await resolveAboutContent(locale);expect(result.source).toBe("preview");expect(result.content.hero.title).toBe("Draft");expect(result.content.hero.body).toBe("Published");expect(result.content.story).toEqual(getAboutContent(locale).story);expect(result.preview?.fallbackPaths).toContain(`hero.body.${locale}`);
      expect(state.fetch).toHaveBeenCalledWith(expect.stringContaining('"aboutPage"'),{},expect.objectContaining({perspective:"drafts",cache:"no-store",stega:false}));
    });
  }
  it.each([null, {_id:"drafts.aboutPage",_type:"aboutPage",hero:{title:{en:"Leaked draft"}}}])("public never consumes draft identities %j",async doc=>{vi.stubEnv("CONTENT_SOURCE","sanity");vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({result:doc})));expect(await resolveAboutContent("en")).toMatchObject({content:getAboutContent("en"),preview:null});expect(state.fetch).not.toHaveBeenCalled();});
  it("empty editable singleton uses full local fallback",async()=>{state.draft=true;vi.mocked(fetch).mockResolvedValue(new Response('{"result":null}'));state.fetch.mockResolvedValue(null);const result=await resolveAboutContent("sr");expect(result.content).toEqual(getAboutContent("sr"));expect(result.preview?.error).toBeNull();expect(result.preview?.fallbackPaths).toContain("hero.title.sr");});
  it.each(["configuration","unavailable"])("safe preview %s diagnostic",async error=>{state.draft=true;vi.mocked(fetch).mockResolvedValue(new Response('{"result":null}'));state.configured=error!=="configuration";state.fetch.mockRejectedValue(Error("do not expose token"));expect(await resolveAboutContent("ru")).toMatchObject({content:getAboutContent("ru"),preview:{error}});});
});
