import {afterEach, describe, expect, it, vi} from "vitest";
import {getAboutContent} from "@/content/about";
import {parseAbout, parsePreviewAbout, fetchAbout} from "@/content/sanity/about";
const doc = {_id: "aboutPage", _type: "aboutPage"};
afterEach(() => {vi.unstubAllGlobals(); vi.restoreAllMocks();});
describe("About same-locale independent fields", () => {
  it.each(["en", "ru", "sr"] as const)("empty and partial %s document keeps supplied copy", locale => {
    expect(parseAbout(doc, locale)?.content).toEqual(getAboutContent(locale));
    const result = parseAbout({...doc, hero: {title: {[locale]: "Edited"}, body: {en: "<invalid>",ru:"<invalid>",sr:"<invalid>"}}, story: {paragraph1: {[locale]: "Paragraph"}}, principles: {item1: {label: {[locale]: "Principle"}}}, style: {alt1: {[locale]: "Alt"}}, why: {reason1: {title: {[locale]: "Reason"}}}, labels: {ourStory: {[locale]: "Label"}}}, locale)!;
    expect(result.content.hero.title).toBe("Edited");
    expect(result.content.hero.body).toBe(getAboutContent(locale).hero.body);
    expect(result.content.story.paragraphs[0]).toBe("Paragraph");
    expect(result.content.principles[0].label).toBe("Principle");
    expect(result.content.principles[0].icon).toBe(getAboutContent(locale).principles[0].icon);
    expect(result.content.style.imageAlts[0]).toBe("Alt");
    expect(result.content.why.reasons[0].title).toBe("Reason");
    expect(result.labels.ourStory).toBe("Label");
  });
  it("rejects wrong identities, drafts in public and unsafe field values", () => {
    for (const value of [null, {...doc,_id:"drafts.aboutPage"},{...doc,_type:"homePage"}]) expect(parseAbout(value,"en")).toBeNull();
    for (const title of ["", " ", 5, "<script>", "x".repeat(10001)]) expect(parseAbout({...doc,hero:{title:{en:title}}},"en")?.content.hero.title).toBe(getAboutContent("en").hero.title);
    expect(parseAbout({...doc,hero:{title:{en:"EN only"}}},"ru")?.content.hero.title).toBe(getAboutContent("ru").hero.title);
  });
  it("shares canonical photos, preserving crop/focus and rejecting arbitrary URLs", () => {
    const photo={asset:{_ref:`image-${"a".repeat(40)}-1000x800-jpg`},crop:{left:0.1,right:0.1,top:0,bottom:0},hotspot:{x:0.7,y:0.4,width:0.1,height:0.1}};
    const result=parseAbout({...doc,hero:{photo},story:{photo:{asset:{url:"https://evil.test/photo.jpg"}}}},"en")!;
    expect(new URL(result.images.hero!.src).searchParams.get("rect")).toBe("100,0,800,800");
    expect(result.images.hero?.position).toBe("75% 40%");
    expect(result.images.story).toBeUndefined();
    expect(parseAbout({...doc,hero:{photo}},"ru")?.images).toEqual(result.images);
    for(const bad of [{...photo,url:"x",asset:{...photo.asset,url:"x"}},{...photo,crop:{...photo.crop,left:1}},{...photo,hotspot:{...photo.hotspot,width:0}}]) expect(parseAbout({...doc,hero:{photo:bad}},"en")?.images.hero).toBeUndefined();
  });
  it("draft merges published before local per field with exact diagnostics", () => {
    const published=parseAbout({...doc,hero:{body:{ru:"Published"}}},"ru");
    const result=parsePreviewAbout({...doc,_id:"drafts.aboutPage",hero:{title:{ru:"Draft"}}},"ru",published);
    expect(result.content.hero.title).toBe("Draft");expect(result.content.hero.body).toBe("Published");
    expect(result.fallbackPaths).toContain("hero.body.ru");expect(result.fallbackPaths).toContain("style.photo1");
    expect(()=>parsePreviewAbout({_id:"homePage",_type:"homePage"},"en",null)).toThrow();
  });
  it("fetches published only with ISR60 and safely handles absence/outage",async()=>{
    vi.stubGlobal("fetch",vi.fn().mockResolvedValue(new Response(JSON.stringify({result:doc}))));
    expect(await fetchAbout("en")).not.toBeNull();
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining("perspective=published"),expect.objectContaining({next:{revalidate:60}}));
    vi.mocked(fetch).mockRejectedValue(Error("offline"));vi.spyOn(console,"warn").mockImplementation(()=>{});
    expect(await fetchAbout("en")).toBeNull();
  });
});
