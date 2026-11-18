// The catalogue in all three renderers (renderer parity PAR-42, REQ-6774):
// every page of magazines 1 to 7 is drawn in teletext at its own number,
// and again as a ReGIS picture and as a NAPLPS picture at a number of the
// same magazine a fixed step on, so 304 is teletext, 344 ReGIS and 364
// NAPLPS. The copies are the same components with the same props, state
// and keys; only the language the page is drawn in differs. They are off
// the map: the green key walks the teletext pages, and each copy's frame
// is its teletext page's, its prompts leading back into them.
//
// The languages' magazine is not copied: its pages are drawn in 73
// languages' sets, and a picture draws text only in the sets the
// renderers provide (DEC-6669), so most of it would draw nothing.

import type { PageSpec, Renderer, StateStore } from "neoteletext-server-ts-ui-components";
import type { Assets } from "../assets/assets.ts";
import { PAGES } from "./page-numbers.ts";
import { pages } from "./pages.ts";

/** A picture language, and the step its copies are numbered on by. */
interface PictureCopies {
  readonly renderer: Exclude<Renderer, "teletext">;
  /** What the copy's title names it by. */
  readonly name: string;
  /** Added to a teletext page's number: within its magazine, its tens digit still a decimal one. */
  readonly step: number;
}

export const PICTURE_COPIES: readonly PictureCopies[] = [
  { renderer: "regis", name: "ReGIS", step: 0x40 },
  { renderer: "naplps", name: "NAPLPS", step: 0x60 },
];

/** A page number's magazine (its hundreds digit) and its tens digit, as hexadecimal digits. */
const MAGAZINE_DIGIT = 0x100;
const TENS_DIGIT = 0x10;
/** The highest decimal digit: a page whose digits are all decimal is one a viewer types. */
const HIGHEST_DECIMAL = 9;

/** Whether `page` is copied: every page before the languages' magazine. */
function isCopied(spec: PageSpec): boolean {
  return spec.page < PAGES.languages;
}

/** `spec` drawn in `renderer` at `page`, its title naming the renderer: nothing else of it changes. */
function copyOf(spec: PageSpec, page: number, name: string, renderer: PictureCopies["renderer"]): PageSpec {
  return { ...spec, page, title: `${spec.title} (${name})`, renderer };
}

/** `specs` and, after them, the ReGIS and NAPLPS copies of every page that is copied. */
function inEveryRenderer(specs: readonly PageSpec[]): PageSpec[] {
  const taken = new Set(specs.map((spec) => spec.page));
  const copies = PICTURE_COPIES.flatMap(({ renderer, name, step }) =>
    specs
      .filter((spec) => isCopied(spec))
      .map((spec): PageSpec => {
        const page = spec.page + step;
        const tens = Math.floor((page % MAGAZINE_DIGIT) / TENS_DIGIT);
        if (taken.has(page) || Math.floor(page / MAGAZINE_DIGIT) !== Math.floor(spec.page / MAGAZINE_DIGIT) || tens > HIGHEST_DECIMAL) {
          throw new RangeError(
            `page ${spec.page.toString(16)}'s ${name} copy, ${page.toString(16)}, is taken, in another magazine or not typed with decimal digits`,
          );
        }
        taken.add(page);
        return copyOf(spec, page, name, renderer);
      }),
  );
  return [...specs, ...copies];
}

/** Every page the channel serves: the map's, and their copies drawn as ReGIS and NAPLPS pictures. */
export function channelPages(assets: Assets, store: StateStore): PageSpec[] {
  return inEveryRenderer(pages(assets, store));
}
