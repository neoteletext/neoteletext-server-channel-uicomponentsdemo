// A page's spec: its number, its title from the map, its root, and how it
// is shared.
//
// One copy of the channel serves every language (REQ-2218): a page names no
// language of its own, so the library draws it in each viewer's, from the
// `language` cookie the page on 899 sets, the channel's words as text of that
// language (main.ts, the library's stand-in). A language page is in its own
// language instead (magazines/languages.ts).

import type { Element, PageParams, PageSpec } from "neoteletext-server-ts-ui-components";
import { entryOf } from "./site-map.ts";

/** How a page is shared, beside its root. */
export type Sharing = Omit<PageSpec, "page" | "title" | "root">;

/** A page with controls a viewer changes: their own copy, since one viewer's choices are not another's. */
export const OWN: Sharing = { perViewer: true };
/** A page that also takes the digits, for its fields or its own keys. */
export const OWN_TYPING: Sharing = { perViewer: true, ownsDigits: true };

export function spec(page: number, root: (params?: PageParams) => Element, sharing: Sharing = {}): PageSpec {
  return { page, title: entryOf(page).title, root, ...sharing };
}
