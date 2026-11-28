import {createElement, type ReactNode} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {describe, expect, it, vi} from "vitest";
vi.mock("next/image", () => ({default: ({alt, ...props}: {alt: string}) => createElement("img", {alt, ...props})}));
vi.mock("@/i18n/navigation", () => ({Link: ({children, href, ...props}: {children: ReactNode; href: string}) => createElement("a", {href, ...props}, children)}));
vi.mock("@/components/widgets/HomeBlocks/HomeCommon/homeEditing", () => ({homeEditing: async () => (path: string, image = false) => `${image ? 'image' : 'text'}:${path}`, HomeEditable: ({children}: {children: ReactNode}) => children}));
import {HomeMoodBlock} from "@/components/widgets/HomeBlocks/HomeMoodBlock/HomeMoodBlock";
import {BouquetsInspiration} from "@/components/widgets/BouquetBlocks/BouquetsInspiration/BouquetsInspiration";

describe("actual card consumer CMS targets", () => {
  it("places Home image annotation on photo container and title on h3", async () => {
    const block = await HomeMoodBlock({content:{eyebrow:'E',title:'T',description:'D'},moods:{romantic:{title:'R',alt:'RA'},bright:{title:'B',alt:'BA'},natural:{title:'N',alt:'NA'}},labels:{shopBouquets:'S',viewAllBouquets:'V',viewBouquet:'View',moodRailLabel:'Rail',moodNames:{romantic:'R',bright:'B',natural:'N'}}});
    const html=renderToStaticMarkup(block);
    expect(html).toMatch(/<div[^>]*data-sanity="image:moods\.romantic\.photo"[^>]*><img/);
    expect(html).toContain('<h3 data-sanity="text:moods.romantic.title">R</h3>');
  });
  it("places catalogue annotations on image, h3 and disabled native action", () => {
    const html=renderToStaticMarkup(<BouquetsInspiration heading="H" selectors={[]} cards={[{id:'target',title:'Rose',image:{src:'/x.jpg',alt:'X',width:10,height:10},actionLabel:'Ask',imageEdit:'image-key',titleEdit:'title-key',actionEdit:'action-key'}]} cardActionPendingReason="Pending"/>);
    expect(html).toMatch(/<img[^>]*data-sanity="image-key"/);
    expect(html).toMatch(/<h3[^>]*data-sanity="title-key"/);
    expect(html).toMatch(/<button[^>]*disabled=""[^>]*data-sanity="action-key"/);
    expect(html).toContain('aria-describedby="bouquet-card-action-pending"');
    expect(html).toContain('id="target"');
  });
});
