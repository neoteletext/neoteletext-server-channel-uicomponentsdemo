// A page's look and prompts for the library's components that draw their
// own frame (documents, day pages, stories), from the map as DemoFrame's.

import type { Colour } from "neottx-server-ts-protocol";
import type { Prompts } from "neottx-server-ts-ui-components";
import { PAGES } from "../site/page-numbers.ts";
import { promptsFor } from "../site/prompts.ts";
import { magazineOf } from "../site/site-map.ts";

export interface Framing {
  readonly background: Colour;
  readonly foreground: Colour;
  readonly prompts: Prompts;
  readonly index: number;
}

export function framingOf(page: number): Framing {
  const { look } = magazineOf(page);
  return { background: look.background, foreground: look.foreground, prompts: promptsFor(page), index: PAGES.index };
}
