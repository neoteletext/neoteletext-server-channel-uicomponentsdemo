// The catalogue in all three renderers (renderer parity PAR-42, REQ-6774,
// renderers.ts): every page of magazines 1 to 7 has a ReGIS copy 40 on and
// a NAPLPS copy 60 on, each published under its teletext page's title with
// its renderer's name, drawn as a picture of its language, and opened by a
// viewer with nothing reported.

import assert from "node:assert/strict";
import { test } from "node:test";

import { IN_MEMORY, SqliteStateStore } from "neoteletext-server-ts-ui-components";
import { PAGES } from "../src/site/page-numbers.ts";
import { pages } from "../src/site/pages.ts";
import { channelPages, PICTURE_COPIES } from "../src/site/renderers.ts";
import { MAGAZINES } from "../src/site/site-map.ts";
import { channel } from "./channel.ts";

const COPIED = MAGAZINES.flatMap((magazine) => magazine.pages).filter((entry) => entry.page < PAGES.languages);
/** A while on each page: long enough for its timers to fire a few times. */
const A_WHILE_MS = 5_000;
const VIEWER = 1;
const PAGE_RADIX = 16;

/** The pictures' messages of `page`, by type. */
function pictureTypes(sent: readonly Record<string, unknown>[], page: number): Set<string> {
  const wanted = page.toString(PAGE_RADIX);
  return new Set(
    sent.filter((message) => message["page"] === wanted && /^(regis|naplps)/u.test(String(message["type"]))).map((message) => String(message["type"])),
  );
}

test("the copies are numbered 40 and 60 on from every page of magazines 1 to 7, and none other", () => {
  const all = pages({ pictures: [] }, new SqliteStateStore(IN_MEMORY)).map((spec) => spec.page);
  const served = new Set(channelPages({ pictures: [] }, new SqliteStateStore(IN_MEMORY)).map((spec) => spec.page));
  const expected = new Set([...all, ...PICTURE_COPIES.flatMap(({ step }) => COPIED.map((entry) => entry.page + step))]);
  assert.deepEqual(served, expected);
  assert.deepEqual(
    [...served].map((page) => page.toString(PAGE_RADIX)).filter((page) => /[a-f]/u.test(page)),
    [],
    "every page is typed with decimal digits",
  );
});

test("each copy is published under its page's title and drawn as a picture of its language", () => {
  const harness = channel();
  for (const { renderer, name, step } of PICTURE_COPIES) {
    for (const entry of COPIED) {
      const copy = entry.page + step;
      assert.equal(harness.title(copy), `${entry.title} (${name})`);
      assert.ok(pictureTypes(harness.sent, copy).has(renderer), `page ${copy.toString(PAGE_RADIX)} sends ${renderer}`);
    }
  }
  assert.deepEqual(harness.errors, []);
});

test("a viewer opens every copy, stays a while, and nothing is reported", () => {
  const harness = channel();
  harness.join(VIEWER, PAGES.index);
  for (const { step } of PICTURE_COPIES) {
    for (const entry of COPIED) {
      harness.open(VIEWER, entry.page + step);
      harness.advance(A_WHILE_MS);
    }
  }
  assert.deepEqual(harness.errors, []);
  assert.deepEqual(
    harness.sent.filter((message) => message["type"] === "log"),
    [],
  );
});
