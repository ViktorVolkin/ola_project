import {afterEach, beforeEach, describe, expect, it, vi} from "vitest";
import type {VisualEditingOptions} from "@sanity/visual-editing";
const state = vi.hoisted(() => ({path:"/en", effects:[] as (() => unknown)[], options:null as VisualEditingOptions | null, push:vi.fn(), replace:vi.fn(), back:vi.fn(), refresh:vi.fn(), disable:vi.fn()}));
vi.mock("react",()=>({useEffect:(fn:()=>unknown)=>state.effects.push(fn),useRef:()=>({current:undefined})}));
vi.mock("next/navigation",()=>({usePathname:()=>state.path,useRouter:()=>({push:state.push,replace:state.replace,back:state.back,refresh:state.refresh})}));
vi.mock("@sanity/visual-editing",()=>({enableVisualEditing:(options:VisualEditingOptions)=>{state.options=options;return state.disable;}}));
import {HomeVisualEditing} from "@/components/widgets/HomeBlocks/HomeCommon/HomeVisualEditing";
const origin="https://preview.example.test";
beforeEach(()=>{
  state.options=null;state.effects=[];vi.clearAllMocks();
  vi.stubGlobal("location",{origin,href:origin+state.path});
  vi.stubGlobal("window",{addEventListener:vi.fn(),removeEventListener:vi.fn(),matchMedia:()=>({matches:false,addEventListener:vi.fn(),removeEventListener:vi.fn()})});
  vi.stubGlobal("document",{body:{},querySelectorAll:()=>[]});
  vi.stubGlobal("MutationObserver",class {observe(){} disconnect(){}});
});
afterEach(()=>vi.unstubAllGlobals());
function mount(path:string){state.path=path;HomeVisualEditing();return state.effects[0]();}
describe("shared SDK exact route lifecycle and history",()=>{
  it.each(["/en","/ru","/sr","/en/about","/ru/about","/sr/about"])("initializes and cleans up %s",path=>{const cleanup=mount(path) as ()=>void;expect(state.options).not.toBeNull();cleanup();expect(state.disable).toHaveBeenCalledOnce();});
  it.each(["/en/contact","/de/about","/en/about/x"])("does not initialize outside %s",path=>{mount(path);expect(state.options).toBeNull();});
  it("permits Home ↔ About while rejecting normalization, origin, query and opaque pop",()=>{
    mount("/en/about");const update=state.options!.history!.update;
    update({type:"push",url:"/ru"});expect(state.push).toHaveBeenLastCalledWith("/ru");
    update({type:"replace",url:origin+"/sr/about"});expect(state.replace).toHaveBeenLastCalledWith("/sr/about");
    state.push.mockClear();state.replace.mockClear();
    for(const url of ["https://evil.test/en/about","//evil.test/en/about","/en/contact","/en/../ru/about","/en/%61bout","/en/about?x=1","/en/about#x","https://preview.example.test\\en/about","https://user@preview.example.test/en/about","https://[",""]){update({type:"push",url});update({type:"replace",url});}
    update({type:"pop",url:"/en/contact"});expect(state.push).not.toHaveBeenCalled();expect(state.replace).not.toHaveBeenCalled();expect(state.back).not.toHaveBeenCalled();
    update({type:"pop",url:"/en/about"});expect(state.replace).toHaveBeenLastCalledWith("/en/about");
  });
});
