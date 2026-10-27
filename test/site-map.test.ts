// The map: every page has a spec, every spec is on the map, and the green
// key walks the whole channel from the index back to it.

import assert from "node:assert/strict";
import { test } from "node:test";

import { PAGES } from "../src/site/page-numbers.ts";
import { pages } from "../src/site/pages.ts";
import { promptsFor } from "../src/site/prompts.ts";
import { MAGAZINES } from "../src/site/site-map.ts";

/** The green prompt's place among a frame's four. */
const GREEN = 1;

test("the specs are the map's pages, in its order", () => {
  assert.deepEqual(
    pages({ pictures: [] }).map((spec) => spec.page),
    MAGAZINES.flatMap((magazine) => magazine.pages.map((entry) => entry.page)),
  );
});

test("green walks every page of the map once and comes back to the index", () => {
  const walked: number[] = [];
  let page: number = PAGES.index;
  do {
    walked.push(page);
    page = promptsFor(page)[GREEN]?.[1] ?? PAGES.index;
  } while (page !== PAGES.index && walked.length <= MAGAZINES.flatMap((magazine) => magazine.pages).length);
  assert.deepEqual(
    walked,
    MAGAZINES.flatMap((magazine) => magazine.pages.map((entry) => entry.page)),
  );
});
