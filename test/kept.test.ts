// What the channel keeps outlasts the program: the poll's votes and each
// viewer's ballot (REQ-1057), and the choosing page's choices, which the
// page keeps for its viewer (REQ-1058), are there when the channel starts
// again on the same database file, as a program the server starts again
// opens it.

import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { Key } from "neoteletext-server-ts-protocol";
import { shows } from "neoteletext-server-ts-protocol/testing";
import { SqliteStateStore } from "neoteletext-server-ts-ui-components";
import { PAGES } from "../src/site/page-numbers.ts";
import { channel } from "./channel.ts";

const VIEWER = 1;
const LATER = 2;

test("REQ-1057, REQ-1058: the poll's votes, the viewer's ballot and their choices are there after the channel starts again", () => {
  const root = join(import.meta.dirname, "..", "tmp");
  mkdirSync(root, { recursive: true });
  const folder = mkdtempSync(join(root, "kept-"));
  try {
    const path = join(folder, "state.sqlite");
    const before = new SqliteStateStore(path);
    const first = channel([], before);
    first.join(VIEWER, PAGES.poll);
    first.press(VIEWER, Key.Enter);
    first.open(VIEWER, PAGES.choosing);
    first.press(VIEWER, Key.Down);
    first.press(VIEWER, Key.Enter);
    assert.ok(shows(first.seen(VIEWER, PAGES.choosing).rows, "Bananas with nothing"));
    before.close();

    const after = new SqliteStateStore(path);
    const second = channel([], after);
    second.join(LATER, PAGES.poll);
    assert.ok(shows(second.seen(LATER, PAGES.poll).rows, "1 votes"), "the poll's vote");
    second.join(VIEWER, PAGES.poll);
    assert.ok(shows(second.seen(VIEWER, PAGES.poll).rows, "* is yours"), "the viewer's own ballot");
    second.open(VIEWER, PAGES.choosing);
    assert.ok(shows(second.seen(VIEWER, PAGES.choosing).rows, "Bananas with nothing"), "the viewer's choice");
    second.open(LATER, PAGES.choosing);
    assert.ok(shows(second.seen(LATER, PAGES.choosing).rows, "none with nothing"), "another viewer's page is their own");
    assert.deepEqual(second.errors, []);
    after.close();
  } finally {
    rmSync(folder, { recursive: true });
  }
});
