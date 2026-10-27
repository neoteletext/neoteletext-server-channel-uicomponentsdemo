// Every frame's Fastext prompts, from the map: red the page before in its
// magazine, green the page after, yellow the next magazine, cyan the index.
// A viewer can walk the whole channel on the green key.

import type { Prompts } from "neottx-server-ts-ui-components";
import { PAGES } from "./page-numbers.ts";
import { MAGAZINES, type MapEntry, placeOf } from "./site-map.ts";

/** The entry `step` pages along the map from `page`, round from the last to the first. */
function along(page: number, step: number): MapEntry {
  const all = MAGAZINES.flatMap((magazine) => magazine.pages);
  const here = all.findIndex((entry) => entry.page === page);
  const found = all[(here + step + all.length) % all.length];
  if (found === undefined) {
    throw new RangeError(`page ${page.toString(16)} is not on the map`);
  }
  return found;
}

/** The front of the magazine after the one `page` is in. */
function nextMagazine(page: number): { readonly name: string; readonly page: number } {
  const next = MAGAZINES[(placeOf(page).magazine + 1) % MAGAZINES.length];
  const front = next?.pages[0];
  if (next === undefined || front === undefined) {
    throw new RangeError("a magazine with no pages");
  }
  return { name: next.name, page: front.page };
}

export function promptsFor(page: number): Prompts {
  const before = along(page, -1);
  const after = along(page, 1);
  const magazine = nextMagazine(page);
  return [
    [before.short, before.page],
    [after.short, after.page],
    [magazine.name, magazine.page],
    ["Index", PAGES.index],
  ];
}
