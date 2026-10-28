// A viewer's keys and clicks on the pages that answer them.

import assert from "node:assert/strict";
import { test } from "node:test";

import { Key } from "neoteletext-server-ts-protocol";
import { shows } from "neoteletext-server-ts-protocol/testing";
import { DATE_FORMATS, formatDate } from "neoteletext-server-ts-ui-components";
import { CATALOGUE } from "../src/content/catalogue.ts";
import { PAGES } from "../src/site/page-numbers.ts";
import { channel, STARTED } from "./channel.ts";
import { controlShowing } from "./controls.ts";

const VIEWER = 1;
const OTHER = 2;

test("the catalogue goes to the page of the component chosen", () => {
  const harness = channel();
  harness.join(VIEWER, PAGES.components);
  harness.press(VIEWER, Key.Down);
  harness.press(VIEWER, Key.Enter);
  assert.deepEqual(harness.gotos(VIEWER), [CATALOGUE[1]?.page]);
  assert.deepEqual(harness.errors, []);
});

test("the greeting greets the name typed, on the viewer's own copy only", () => {
  const harness = channel();
  harness.join(VIEWER, PAGES.greeting);
  harness.join(OTHER, PAGES.greeting);
  harness.typeText(VIEWER, "Ada");
  harness.press(VIEWER, Key.Enter);
  assert.ok(shows(harness.seen(VIEWER, PAGES.greeting).rows, "Hello, Ada!"));
  assert.ok(shows(harness.seen(OTHER, PAGES.greeting).rows, "Nobody greeted yet."));
  assert.deepEqual(harness.errors, []);
});

test("a click on a bar says its figure", () => {
  const harness = channel();
  harness.join(VIEWER, PAGES.bars);
  const bar = controlShowing(harness, VIEWER, PAGES.bars, /Snake/u);
  harness.clickLeft(VIEWER, bar.column, bar.row);
  assert.ok(shows(harness.seen(VIEWER, PAGES.bars).rows, "Snake: 610"));
  assert.deepEqual(harness.errors, []);
});

test("a vote on the poll is counted on every viewer's screen", () => {
  const harness = channel();
  harness.join(VIEWER, PAGES.poll);
  harness.join(OTHER, PAGES.poll);
  harness.press(VIEWER, Key.Enter);
  assert.ok(shows(harness.seen(OTHER, PAGES.poll).rows, "1 vote"));
  assert.deepEqual(harness.errors, []);
});

test("a dialog opens over the page and its answer is said", () => {
  const harness = channel();
  harness.join(VIEWER, PAGES.dialogs);
  harness.press(VIEWER, Key.Enter);
  assert.ok(shows(harness.seen(VIEWER, PAGES.dialogs).rows, "The page was saved."));
  harness.press(VIEWER, Key.Enter);
  assert.ok(shows(harness.seen(VIEWER, PAGES.dialogs).rows, "Answer: OK"));
  assert.deepEqual(harness.errors, []);
});

test("the form's Send button toasts a thank you", () => {
  const harness = channel();
  harness.join(VIEWER, PAGES.form);
  harness.typeText(VIEWER, "Ada");
  const send = controlShowing(harness, VIEWER, PAGES.form, /Send\W+Clear/u);
  harness.clickLeft(VIEWER, send.column, send.row);
  assert.ok(shows(harness.seen(VIEWER, PAGES.form).rows, "Thank you, Ada"));
  assert.ok(shows(harness.seen(VIEWER, PAGES.form).rows, "Sent 1 times"));
  assert.deepEqual(harness.errors, []);
});

test("the right answer to the quiz scores", () => {
  const harness = channel();
  harness.join(VIEWER, PAGES.quiz);
  // The first question's answer is the third, on the yellow key.
  harness.press(VIEWER, Key.Yellow);
  assert.ok(shows(harness.seen(VIEWER, PAGES.quiz).rows, "score 1"));
  assert.deepEqual(harness.errors, []);
});

test("the clock page shows the channel's day", () => {
  const harness = channel();
  harness.join(VIEWER, PAGES.clock);
  assert.ok(shows(harness.seen(VIEWER, PAGES.clock).rows, formatDate(STARTED, DATE_FORMATS.long)));
  assert.deepEqual(harness.errors, []);
});
