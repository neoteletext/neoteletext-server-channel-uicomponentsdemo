// One site in every language (REQ-2218): the page that chooses a language
// keeps it in the `language` cookie, every page is then drawn for the
// viewer with its samples in that language and its title naming it, and an
// address that names a language chooses it.

import assert from "node:assert/strict";
import { test } from "node:test";

import { ANY_SUB, Key } from "neoteletext-server-ts-protocol";
import { SERVER_LANGUAGES, type Sent } from "neoteletext-server-ts-protocol/testing";
import { PAGES } from "../src/site/page-numbers.ts";
import { channel, contentOf } from "./channel.ts";
import { pages } from "../src/site/pages.ts";

/** The cookies set for `connection`, in order. */
function cookiesSet(sent: readonly Sent[], connection: number): Sent[] {
  return sent.filter((message) => message["type"] === "cookie" && message["connection"] === connection);
}

/** The runs of `page` as `session` sees it, each its language and text. */
function runsSeen(harness: ReturnType<typeof channel>, session: number, page: number): [string, string][] {
  return (contentOf(harness, session, page)?.text ?? []).map((run) => [run.language ?? "", run.text]);
}

test("the picker sets the language cookie, for the whole channel and a year, and a page is then in that language", () => {
  const harness = channel();
  harness.join(1, PAGES.chooseLanguage);
  // English first, then the server's languages in its order.
  const place = SERVER_LANGUAGES.filter((language) => language.tag !== "en").findIndex((language) => language.tag === "ru") + 1;
  for (let step = 0; step < place; step += 1) {
    harness.press(1, Key.Down);
  }
  harness.press(1, Key.Enter);
  const [cookie] = cookiesSet(harness.sent, 1);
  assert.deepEqual(
    [cookie?.["name"], cookie?.["value"], cookie?.["path"], cookie?.["max_age"], cookie?.["same_site"]],
    ["language", "ru", "/", 365 * 24 * 60 * 60, "Lax"],
  );
  harness.open(1, PAGES.textStyles);
  const runs = runsSeen(harness, 1, PAGES.textStyles);
  assert.ok(
    runs.some(([language, text]) => language === "en" && text === "Text styles - Russian"),
    JSON.stringify(runs),
  );
  assert.ok(runs.some(([language]) => language === "ru"));
  assert.deepEqual(harness.errors, []);
});

test("a page is drawn in the language of the viewer's cookie, and in English without one, one viewer's never another's", () => {
  const harness = channel();
  harness.join(1, PAGES.textStyles, [{ name: "language", value: "ar" }]);
  harness.join(2, PAGES.textStyles);
  const arabic = runsSeen(harness, 1, PAGES.textStyles);
  const english = runsSeen(harness, 2, PAGES.textStyles);
  assert.ok(
    arabic.some(([language, text]) => language === "ar" && text === "العربية"),
    "the double-height line is the language's name in itself",
  );
  assert.ok(arabic.some(([, text]) => text === "Text styles - Arabic"));
  assert.deepEqual(
    english.filter(([language]) => language !== "en"),
    [],
  );
  assert.ok(english.some(([, text]) => text === "Text styles - English"));
  assert.equal(contentOf(harness, 1, PAGES.textStyles)?.language, "en", "the page is English, its samples in the viewer's language");
});

test("a cookie naming no language of the server's leaves the site in English", () => {
  const harness = channel();
  harness.join(1, PAGES.textStyles, [{ name: "language", value: "xx" }]);
  assert.ok(runsSeen(harness, 1, PAGES.textStyles).some(([, text]) => text === "Text styles - English"));
});

test("REQ-2218 item 3: the picker's address with ?language=el chooses Greek and goes to the index", () => {
  const harness = channel();
  harness.join(1, PAGES.how);
  harness.open(1, PAGES.chooseLanguage, ANY_SUB, "language=el");
  const [cookie] = cookiesSet(harness.sent, 1);
  assert.deepEqual([cookie?.["name"], cookie?.["value"]], ["language", "el"]);
  assert.equal(harness.redirects(1).at(-1), PAGES.index);
});

test("an address naming no language of the server's chooses none", () => {
  const harness = channel();
  harness.join(1, PAGES.how);
  harness.open(1, PAGES.chooseLanguage, ANY_SUB, "language=klingon");
  assert.deepEqual(cookiesSet(harness.sent, 1), []);
  assert.deepEqual(harness.redirects(1), []);
});

test("every page of the channel is published without a fault in English, Russian, Greek, Arabic, Hebrew, Thai and Japanese kana", () => {
  for (const language of ["en", "ru", "el", "ar", "he", "th", "ja-Hrkt"]) {
    const harness = channel();
    const specs = pages({ pictures: [] });
    harness.join(1, PAGES.index, [{ name: "language", value: language }]);
    for (const spec of specs) {
      harness.open(1, spec.page);
      assert.notEqual(contentOf(harness, 1, spec.page), undefined, `${language} ${spec.page.toString(16)}`);
    }
    assert.deepEqual(harness.errors, [], language);
  }
});

test("a list's items are the language's words, but in Thai, whose line takes three rows, a list row stays English", () => {
  const harness = channel();
  harness.join(1, PAGES.choosing, [{ name: "language", value: "ru" }]);
  harness.join(2, PAGES.choosing, [{ name: "language", value: "th" }]);
  assert.ok(runsSeen(harness, 1, PAGES.choosing).some(([language, text]) => language === "ru" && text.includes("Все")));
  const thai = runsSeen(harness, 2, PAGES.choosing);
  assert.ok(thai.some(([, text]) => text.includes("Apples")));
  assert.deepEqual(
    thai.filter(([language]) => language === "th"),
    [],
  );
  assert.deepEqual(harness.errors, []);
});

test("in Thai, the text styles that hold one row keep their English, and those that give a line three rows are in Thai", () => {
  const harness = channel();
  harness.join(1, PAGES.textStyles, [{ name: "language", value: "th" }]);
  const runs = runsSeen(harness, 1, PAGES.textStyles);
  for (const english of ["Flashing: something is new", "Concealed: the answer is 42"]) {
    assert.ok(
      runs.some(([, text]) => text.includes(english)),
      english,
    );
  }
  assert.ok(
    runs.some(([language, text]) => language === "th" && text === "ภาษาไทย"),
    "the double-height line, single height on three rows",
  );
});
