// A sound the server refuses is written to its log with the path, the rule
// and the detail (typescript.md TS-25).

import assert from "node:assert/strict";
import { test } from "node:test";

import { Key } from "neoteletext-server-ts-protocol";
import { fakeOpus, Harness } from "neoteletext-server-ts-protocol/testing";
import { ComponentChannel, IN_MEMORY, SqliteStateStore } from "neoteletext-server-ts-ui-components";
import { REFUSALS } from "../src/refusals.ts";
import { PAGES } from "../src/site/page-numbers.ts";
import { pages } from "../src/site/pages.ts";

test("TS-25: a refused sound is logged with its path, rule and detail", () => {
  const store = new SqliteStateStore(IN_MEMORY);
  const harness = new Harness([new ComponentChannel(pages({ pictures: [] }, store), { opus: fakeOpus(), ruleTables: "none", state: store }), REFUSALS]);
  harness.join(1, PAGES.sounds);
  harness.press(1, Key.Enter);
  const [sound] = harness.sounds(1);
  assert.ok(sound !== undefined, "the sound board sent a sound");
  harness.refuse(sound, "packets", "unknown_field", "a test's refusal");
  const logged = harness.sent.filter((message) => message["type"] === "log").map((message) => message["text"]);
  assert.deepEqual(logged.slice(-1), ["refused sound at packets: unknown_field: a test's refusal"]);
});
