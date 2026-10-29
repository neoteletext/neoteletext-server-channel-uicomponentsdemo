// The pictures folder is read as untrusted: only names that are file
// stems are taken, and the gallery and the picture page show what was
// found, or say there is nothing.

import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";

import { shows, text } from "neoteletext-server-ts-protocol/testing";
import { loadPictures } from "../src/assets/pictures.ts";
import { PAGES } from "../src/site/page-numbers.ts";
import { channel } from "./channel.ts";

const VIEWER = 1;
/** The rows the library draws a sub-page's title band over. */
const BAND_ROWS = [1, 2];
/** Row 0 of a converted picture: its columns 8 to 39 are the picture's own (the server's requirement 11.1). */
const PICTURE_ROW_0 = "OL,0,        The top row of the picture";
/** More characters than the 64 sub-pages the gallery once held, with room left in the server's maximum. */
const MANY = 300;

/** A page of TTI to stand for a converted picture: the channel's own text styles page, as it publishes it, with a row 0 of its own. */
function someTti(): string {
  const harness = channel();
  const published = harness.sent.find((message) => message["type"] === "publish" && Number.parseInt(String(message["page"]), 16) === PAGES.textStyles);
  return `${PICTURE_ROW_0}\n${String(published?.["tti"]).replace(/^OL,0,.*\n/mu, "")}`;
}

/** A pictures folder holding `files`, removed after `use`. */
function withFolder(files: Readonly<Record<string, string>>, use: (folder: string) => void): void {
  const folder = mkdtempSync(join(tmpdir(), "uicomponentsdemo-pictures-"));
  try {
    for (const [name, content] of Object.entries(files)) {
      writeFileSync(join(folder, name), content, "latin1");
    }
    use(folder);
  } finally {
    rmSync(folder, { recursive: true, force: true });
  }
}

test("each picture is shown at Level 2.5 and then Level 1.5, a sub-page each", () => {
  const tti = someTti();
  const atLevel15 = tti.replace("The top row of the picture", "The top row at Level 1.5 ");
  withFolder(
    { "captions.tsv": "e01\te\tA sink\ne02\te\tOnly 2.5\n", "e01_l25.tti": tti, "e01_l15.tti": atLevel15, "e01_l35.tti": tti, "e02_l25.tti": tti },
    (folder) => {
      const harness = channel(loadPictures(folder));
      harness.join(VIEWER, PAGES.gallery);
      const shown = harness.sharedPages(PAGES.gallery).map((subPage) => text(subPage.rows, 0));
      assert.equal(shown.length, 3, "e01 at two levels, e02 at the one it has; never Level 3.5");
      assert.match(shown[0] ?? "", /The top row of the picture/u);
      assert.match(shown[1] ?? "", /The top row at Level 1\.5/u);
      assert.match(shown[2] ?? "", /The top row of the picture/u);
      assert.deepEqual(harness.errors, []);
    },
  );
});

test("the pictures are read by their captions and shown whole, row 0 too, with no title band, and a name that is a path is refused", () => {
  const tti = someTti();
  withFolder(
    { "captions.tsv": "e01\te\tA sink, by hand\n../e02\te\tOutside\ne03\te\tNo files\nshort line\n", "e01_l25.tti": tti, "e02_l25.tti": tti },
    (folder) => {
      const pictures = loadPictures(folder);
      assert.deepEqual(
        pictures.map((picture) => [picture.name, picture.levels.map((level) => level.level)]),
        [["e01", ["l25"]]],
      );
      const harness = channel(pictures);
      harness.join(VIEWER, PAGES.gallery);
      assert.equal(harness.sharedPages(PAGES.gallery).length, 1);
      const shown = harness.seen(VIEWER, PAGES.gallery).rows;
      assert.ok(!shows(shown, "A sink, by hand"));
      assert.match(text(shown, 0), /The top row of the picture/u, "the picture's own row 0");
      // The rows a title band would cover are the picture's own.
      harness.join(VIEWER, PAGES.textStyles);
      const picture = harness.seen(VIEWER, PAGES.textStyles).rows;
      for (const row of BAND_ROWS) {
        assert.equal(text(shown, row), text(picture, row), `row ${row}`);
      }
      assert.deepEqual(harness.errors, []);
    },
  );
});

test("only the examples, characters and sci-fi sprites are taken, in that order, every one of them", () => {
  const tti = someTti();
  const lines = [
    ["a001", "a", "Art"],
    ["s01", "s", "Sprite 1"],
    ...Array.from({ length: MANY }, (_, index) => [`c${index}`, "c", `Character ${index}`]),
    ["s02", "s", "Sprite 2"],
    ["e01", "e", "Example 1"],
    ["p001", "p", "People"],
  ];
  const files: Record<string, string> = { "captions.tsv": `${lines.map((fields) => fields.join("\t")).join("\n")}\n` };
  for (const [name = ""] of lines) {
    files[`${name}_l25.tti`] = tti;
  }
  withFolder(files, (folder) => {
    const pictures = loadPictures(folder);
    assert.deepEqual(
      pictures.map((picture) => picture.name),
      ["e01", ...Array.from({ length: MANY }, (_, index) => `c${index}`), "s01", "s02"],
    );
    const harness = channel(pictures);
    harness.join(VIEWER, PAGES.gallery);
    assert.equal(harness.sharedPages(PAGES.gallery).length, MANY + 3, "every picture is a sub-page of the gallery");
    assert.deepEqual(harness.errors, []);
  });
});

test("with no pictures folder the picture pages say so", () => {
  assert.deepEqual(loadPictures(), []);
  const harness = channel();
  for (const page of [PAGES.gallery, PAGES.picture]) {
    harness.join(VIEWER, page);
    assert.ok(shows(harness.seen(VIEWER, page).rows, "No pictures: no --pictures folder"), page.toString(16));
  }
});
