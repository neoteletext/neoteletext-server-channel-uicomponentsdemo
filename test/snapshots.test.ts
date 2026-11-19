// Every page on the map is pictured for a tab's thumbnail as a stranger
// sees it (neoteletext-common's docs/tab-thumbnails.md section 7.4;
// REQ-6903): the kit draws it for no one on a connection of its own and
// answers with one sub-page, and nothing is reported. A snapshot taken
// after a viewer has used a page shows none of what they did.

import assert from "node:assert/strict";
import { test } from "node:test";

import { text } from "neoteletext-server-ts-protocol/testing";
import { MAGAZINES } from "../src/site/site-map.ts";
import { channel } from "./channel.ts";

const ALL = MAGAZINES.flatMap((magazine) => magazine.pages);
const VIEWER = 1;
/** A while on each page: long enough for its timers to fire a few times. */
const A_WHILE_MS = 5_000;

/** The rows of a snapshot's page as text, as the server writes its rows (base64, null for a blank row). */
function rowsText(page: unknown): string {
  const rows: unknown = typeof page === "object" && page !== null && "rows" in page ? page.rows : [];
  return (Array.isArray(rows) ? rows : []).map((row: unknown) => (typeof row === "string" ? Buffer.from(row, "base64").toString("latin1") : "")).join("\n");
}

test("DEC-6875: every page on the map answers a snapshot with its page, and nothing is reported", () => {
  const harness = channel();
  for (const entry of ALL) {
    const answer = harness.snapshot(entry.page);
    assert.equal(answer["type"], "snapshot_page", `page ${entry.page.toString(16)} is pictured`);
  }
  assert.deepEqual(harness.errors, []);
  assert.deepEqual(
    harness.sent.filter((message) => message["type"] === "log"),
    [],
  );
});

test("DEC-6875: a snapshot after a viewer used every page is what a stranger arriving then is shown", () => {
  const harness = channel();
  harness.join(VIEWER, ALL[0]?.page ?? 0);
  let stranger = VIEWER;
  for (const entry of ALL) {
    harness.open(VIEWER, entry.page);
    harness.advance(A_WHILE_MS);
    const answer = harness.snapshot(entry.page);
    assert.equal(answer["type"], "snapshot_page", entry.page.toString(16));
    stranger += 1;
    harness.join(stranger, entry.page);
    const shown = harness.ownPages(stranger, entry.page) ?? harness.sharedPages(entry.page);
    const first = shown[0];
    assert.ok(first !== undefined);
    const strangers = first.rows.map((_, row) => text(first.rows, row)).join("\n");
    assert.equal(rowsText(answer["page"]).length > 0, true);
    // The header row carries the clock, which moves between the two; every other row is the stranger's.
    assert.deepEqual(
      rowsText(answer["page"])
        .split("\n")
        .slice(1)
        .map((row) => row.trimEnd()),
      strangers
        .split("\n")
        .slice(1)
        .map((row) => row.trimEnd()),
      entry.page.toString(16),
    );
  }
  assert.deepEqual(harness.errors, []);
});
