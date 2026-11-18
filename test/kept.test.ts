// What the channel keeps outlasts the program: the poll's votes and each
// viewer's ballot (REQ-1057), and the choosing page's choices, which the
// page keeps for its viewer (REQ-1058), are there when the channel starts
// again on the same database file, as a program the server starts again
// opens it. What is kept for a viewer is under their handle
// (viewer-state.md VS-405), never a connection's number (TODO-6463).

import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";

import { Key } from "neoteletext-server-ts-protocol";
import { shows } from "neoteletext-server-ts-protocol/testing";
import { SqliteStateStore } from "neoteletext-server-ts-ui-components";
import { PAGES } from "../src/site/page-numbers.ts";
import { channel } from "./channel.ts";

test("REQ-1057, REQ-1058: the poll's votes, the viewer's ballot and their choices are there after the channel starts again", () => {
  const root = join(import.meta.dirname, "..", "tmp");
  mkdirSync(root, { recursive: true });
  const folder = mkdtempSync(join(root, "kept-"));
  try {
    const path = join(folder, "state.sqlite");
    const before = new SqliteStateStore(path);
    const first = channel([], before);
    const tab = first.join(first.viewer("alice"), PAGES.poll);
    first.press(tab, Key.Enter);
    first.open(tab, PAGES.choosing);
    first.press(tab, Key.Down);
    first.press(tab, Key.Enter);
    assert.ok(shows(first.seen(tab, PAGES.choosing).rows, "Bananas with nothing"));
    before.close();

    const after = new SqliteStateStore(path);
    const second = channel([], after);
    const bob = second.join(second.viewer("bob"), PAGES.poll);
    assert.equal(bob, tab, "the server gave bob the number alice's tab had");
    assert.ok(shows(second.seen(bob, PAGES.poll).rows, "1 votes"), "the poll's vote");
    assert.ok(!shows(second.seen(bob, PAGES.poll).rows, "* is yours"), "bob is not given alice's ballot");
    const alice = second.join(second.viewer("alice"), PAGES.poll);
    assert.ok(shows(second.seen(alice, PAGES.poll).rows, "* is yours"), "the viewer's own ballot");
    second.open(alice, PAGES.choosing);
    assert.ok(shows(second.seen(alice, PAGES.choosing).rows, "Bananas with nothing"), "the viewer's choice");
    second.open(bob, PAGES.choosing);
    assert.ok(shows(second.seen(bob, PAGES.choosing).rows, "none with nothing"), "another viewer's page is their own");
    assert.deepEqual(second.errors, []);
    after.close();
  } finally {
    rmSync(folder, { recursive: true });
  }
});
