import {createElement, type ReactNode} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
vi.mock("server-only",()=>({}));
vi.mock("next/image",()=>({default: ({alt, ...props}: {alt:string}) => createElement('img',{alt,...props})}));
vi.mock("@/components/widgets/EnquiryLink/EnquiryLink",()=>({EnquiryLink:({children,subject}: {children:ReactNode;subject:string})=>createElement('button',{disabled:true,'data-subject':subject},children)}));
vi.mock("@/components/widgets/BalloonsBlocks/BalloonsPhoto/BalloonsPhoto",()=>({BalloonsPhoto:({alt,annotation}: {alt:string;annotation:string})=>createElement('img',{alt,'data-sanity':annotation})}));
import {BalloonsCategoriesBlock} from "@/components/widgets/BalloonsBlocks/BalloonsCategoriesBlock/BalloonsCategoriesBlock";
import {WeddingsCategoriesBlock} from "@/components/widgets/WeddingsBlocks/WeddingsCategoriesBlock/WeddingsCategoriesBlock";
import {CategoryCard} from "@/components/shared/CategoryCard/CategoryCard";

describe('category list cards',()=>{
  it('renders list-item structure without extra wrappers and retains a native disabled action',()=>{
    const html=renderToStaticMarkup(<ul><CategoryCard className="card" copyClassName="copy" photo={createElement('img',{alt:'photo'})} title={<h3>Title</h3>} description={<p>Body</p>} action={<button disabled>Ask</button>}/></ul>);
    expect(html).toMatch(/<ul><li[^>]*><img alt="photo"\/><div[^>]*><div><h3>Title<\/h3><p>Body<\/p><\/div><button disabled="">Ask<\/button><\/div><\/li><\/ul>/);
  });
  it.each(['balloons','weddings'] as const)('%s preserves CMS targets and local enquiry subject',kind=>{
    const item={id:kind==='balloons'?'sets':'weddings',title:'CMS title',description:'CMS body',imageAlt:'Photo'};
    const local={...item,title:'Local subject'};
    const editing=(field:string,image=false)=>`${image?'image':'text'}:${field}`;
    const props={items:[item],localItems:[local],label:'Categories',images:{},editing};
    const element=kind==='balloons'?<BalloonsCategoriesBlock {...props as unknown as React.ComponentProps<typeof BalloonsCategoriesBlock>}/>:<WeddingsCategoriesBlock {...props as unknown as React.ComponentProps<typeof WeddingsCategoriesBlock>}/>;
    const html=renderToStaticMarkup(element);
    expect(html).toContain(`image:categories.${item.id}.photo`);
    expect(html).toContain(`text:categories.${item.id}.title`);
    expect(html).toContain(`text:categories.${item.id}.description`);
    expect(html).toContain('data-subject="Local subject"');
    expect(html).toContain('disabled=""');
    expect(html).toContain('CMS title');
    expect(html).toContain('<li ');
  });
});
