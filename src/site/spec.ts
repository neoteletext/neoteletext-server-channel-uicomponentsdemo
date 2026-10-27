// A page's spec: its number, its title from the map, its root, and how it
// is shared.

import type { Element, PageSpec } from "neottx-server-ts-ui-components";
import { entryOf } from "./site-map.ts";

/** How a page is shared, beside its root. */
export type Sharing = Omit<PageSpec, "page" | "title" | "root">;

/** A page with controls a viewer changes: their own copy, since one viewer's choices are not another's. */
export const OWN: Sharing = { perViewer: true };
/** A page that also takes the digits, for its fields or its own keys. */
export const OWN_TYPING: Sharing = { perViewer: true, ownsDigits: true };

export function spec(page: number, root: () => Element, sharing: Sharing = {}): PageSpec {
  return { page, title: entryOf(page).title, root, ...sharing };
}
