// Page 505: the colour around the page is the viewer's to change, and what
// they choose is the Full Screen Colour triplet that opens the page's X/26
// (EN 300 706 Table 28, Annex A.5).

import assert from "node:assert/strict";
import { test } from "node:test";

import { Colour, Key } from "neoteletext-server-ts-protocol";
import { type Harness, shows } from "neoteletext-server-ts-protocol/testing";
import { PAGES } from "../src/site/page-numbers.ts";
import { channel } from "./channel.ts";
import { keptTti } from "./kept-tti.ts";

const VIEWER = 1;
const OTHER = 2;
/** Clause 12.3.1: a triplet's address is its low 6 bits, its mode the next 5, its data the 7 above. */
const MODE_AT = 6;
const DATA_AT = 11;
const FIELD_MASK = 0x3f;
/** A packed line's six bits a character, low first; its first character the designation code. */
const CHARACTER_BITS = 6;
/** Table 28: Full Screen Colour's row mode. Annex A.5 NOTE 1: the address it recommends. */
const FULL_SCREEN_COLOUR = { address: 41, mode: 0 };

/** The first triplet of the local enhancement data `session` is sent for page 505. */
function firstTriplet(harness: Harness, session: number): { readonly address: number; readonly mode: number; readonly data: number } {
  const line = (keptTti(harness, PAGES.screenColour, session) ?? "").split("\n").find((each) => each.startsWith("OL,26,"));
  assert.ok(line !== undefined, "the page has X/26");
  const [low = 0, middle = 0, high = 0] = Array.from(line.slice("OL,26,".length + 1, "OL,26,".length + 4), (each) => (each.codePointAt(0) ?? 0) & FIELD_MASK);
  const value = low | (middle << CHARACTER_BITS) | (high << (2 * CHARACTER_BITS));
  return { address: value & FIELD_MASK, mode: (value >> MODE_AT) & 0x1f, data: value >> DATA_AT };
}

test("page 505 opens in blue, in its Full Screen Colour triplet, and says so", () => {
  const harness = channel();
  harness.join(VIEWER, PAGES.screenColour);
  assert.deepEqual(firstTriplet(harness, VIEWER), { ...FULL_SCREEN_COLOUR, data: Colour.Blue });
  assert.ok(shows(harness.seen(VIEWER, PAGES.screenColour).rows, "Colour Map entry 4: CLUT 0 entry 4"));
  assert.deepEqual(harness.errors, []);
});

test("a viewer changes page 505's colour on their own copy, and their choice is what the page sends", () => {
  const harness = channel();
  harness.join(VIEWER, PAGES.screenColour);
  harness.join(OTHER, PAGES.screenColour);
  harness.press(VIEWER, Key.Right);
  assert.deepEqual(firstTriplet(harness, VIEWER), { ...FULL_SCREEN_COLOUR, data: Colour.Magenta });
  assert.ok(shows(harness.seen(VIEWER, PAGES.screenColour).rows, "Colour Map entry 5: CLUT 0 entry 5"));
  assert.deepEqual(firstTriplet(harness, OTHER), { ...FULL_SCREEN_COLOUR, data: Colour.Blue });
  assert.deepEqual(harness.errors, []);
});

test("the slider reaches the Colour Map past Level 1's colours, and the radios let go until a Level 1 colour is chosen", () => {
  const harness = channel();
  harness.join(VIEWER, PAGES.screenColour);
  // Down leaves the radios for the slider.
  harness.press(VIEWER, Key.Down);
  harness.press(VIEWER, Key.End);
  assert.deepEqual(firstTriplet(harness, VIEWER), { ...FULL_SCREEN_COLOUR, data: 31 });
  assert.ok(shows(harness.seen(VIEWER, PAGES.screenColour).rows, "Colour Map entry 31: CLUT 3 entry 7"));
  assert.ok(!shows(harness.seen(VIEWER, PAGES.screenColour).rows, "(*)"), "no Level 1 colour is chosen");
  assert.deepEqual(harness.errors, []);
});
