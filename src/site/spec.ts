// A page's spec: its number, its title from the map, its root, and how it
// is shared.
//
// One copy of the channel serves every language (REQ-2218): a page is drawn
// for each viewer in English, its title naming the viewer's language and
// its samples written in it, from the `language` cookie the page on 899
// sets. A language page is in its own language instead (magazines/languages.ts).

import { ENGLISH, type Element, type PageParams, type PageSpec } from "neoteletext-server-ts-ui-components";
import { entryOf } from "./site-map.ts";

/** How a page is shared, beside its root. */
export type Sharing = Omit<PageSpec, "page" | "title" | "root" | "language" | "perViewer">;

/** A page that also takes the digits, for its fields or its own keys. */
export const OWN_TYPING: Sharing = { ownsDigits: true };

export function spec(page: number, root: (params?: PageParams) => Element, sharing: Sharing = {}): PageSpec {
  return { page, title: entryOf(page).title, root, ...sharing, language: ENGLISH, perViewer: true };
}
