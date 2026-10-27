// Every page on the map is published, with nothing reported, and every
// viewer can open each one.

import assert from "node:assert/strict";
import { test } from "node:test";

import { MAGAZINES } from "../src/site/site-map.ts";
import { channel } from "./channel.ts";

const ALL = MAGAZINES.flatMap((magazine) => magazine.pages);
/** A while on each page: long enough for its timers to fire a few times. */
const A_WHILE_MS = 5_000;
const VIEWER = 1;

test("every page on the map is published at the start and nothing is reported", () => {
  const harness = channel();
  for (const entry of ALL) {
    assert.ok(harness.sharedPages(entry.page).length > 0, `page ${entry.page.toString(16)} is published`);
    assert.equal(harness.title(entry.page), entry.title);
  }
  assert.deepEqual(harness.errors, []);
  assert.deepEqual(
    harness.sent.filter((message) => message["type"] === "log"),
    [],
  );
});

test("a viewer opens every page, stays a while, and nothing is reported", () => {
  const harness = channel();
  harness.join(VIEWER, ALL[0]?.page ?? 0);
  for (const entry of ALL) {
    harness.open(VIEWER, entry.page);
    harness.advance(A_WHILE_MS);
    assert.ok(harness.seen(VIEWER, entry.page).rows.length > 0, entry.page.toString(16));
  }
  assert.deepEqual(harness.errors, []);
});
