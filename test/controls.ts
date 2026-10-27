// The controls a viewer's copy of a page declares in its TTI, to point at
// and click as the browser does.

import assert from "node:assert/strict";

import { type Harness, text } from "neottx-server-ts-protocol/testing";
import { readControls } from "neottx-server-ts-ui-components";

interface Place {
  readonly row: number;
  readonly column: number;
}

/** The newest TTI of `page` that `session` sees: their own copy while they have one, else the channel's. */
function ttiSeen(harness: Harness, session: number, page: number): string {
  const ofPage = harness.sent.filter((message) => Number.parseInt(String(message["page"]), 16) === page);
  const own = ofPage.findLast(
    (message) => (message["type"] === "publish" && message["owner"] === session) || (message["type"] === "release" && message["session"] === session),
  );
  const seen = own?.["type"] === "publish" ? own : ofPage.findLast((message) => message["type"] === "publish" && message["owner"] === "channel");
  return String(seen?.["tti"]);
}

/** The control on the row of `page` that shows `words`. */
export function controlShowing(harness: Harness, session: number, page: number, words: RegExp): Place {
  const { rows } = harness.seen(session, page);
  const found = (readControls(ttiSeen(harness, session, page))[0] ?? []).find((control) => words.test(text(rows, control.row)));
  assert.ok(found !== undefined, `a control showing ${String(words)}`);
  return found;
}
