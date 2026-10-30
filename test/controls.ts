// The controls a viewer's copy of a page declares in its TTI, to point at
// and click as the browser does.

import assert from "node:assert/strict";

import { type Harness, text } from "neoteletext-server-ts-protocol/testing";
import { readControls } from "neoteletext-server-ts-ui-components";
import { keptTti } from "./kept-tti.ts";

interface Place {
  readonly row: number;
  readonly column: number;
}

/** The TTI of `page` that `session` sees: their own copy while they have one, else the channel's (kept-tti.ts). */
function ttiSeen(harness: Harness, session: number, page: number): string {
  return keptTti(harness, page, session) ?? "";
}

/** The control on the row of `page` that shows `words`. */
export function controlShowing(harness: Harness, session: number, page: number, words: RegExp): Place {
  const { rows } = harness.seen(session, page);
  const found = (readControls(ttiSeen(harness, session, page))[0] ?? []).find((control) => words.test(text(rows, control.row)));
  assert.ok(found !== undefined, `a control showing ${String(words)}`);
  return found;
}
