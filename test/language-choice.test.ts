// One site in every language (REQ-2218, DEC-2232): the page that chooses a
// language keeps it for the viewer (viewer-state.md VS-408), every page is
// then drawn in that language, the channel's words as text of it (the
// library's stand-in, DEC-2233), and an address that names a language
// chooses it.

import assert from "node:assert/strict";
import { test } from "node:test";

import { ANY_SUB, Key } from "neoteletext-server-ts-protocol";
import { SERVER_LANGUAGES } from "neoteletext-server-ts-protocol/testing";
import { IN_MEMORY, SqliteStateStore } from "neoteletext-server-ts-ui-components";
import { PAGES } from "../src/site/page-numbers.ts";
import { channel, contentOf } from "./channel.ts";
import { pages } from "../src/site/pages.ts";

/** A connection, `connection`, that chose `language` by the picker's address and is on `page`. */
function inLanguage(harness: ReturnType<typeof channel>, connection: number, language: string, page: number): void {
  harness.join(connection, PAGES.how);
  harness.open(connection, PAGES.chooseLanguage, ANY_SUB, `language=${language}`);
  harness.open(connection, page);
}

/** The Fastext row. */
const FASTEXT_ROW = 24;

/** Latin letters, which a page in a language whose sets lack them shows none of but on its Fastext row. */
const LATIN = /[A-Za-z]/u;

/** The runs of `page` as `connection` sees it, each its language and text, but the Fastext row's, which stay the channel's words (DEC-1987 item 6). */
function bodyRuns(harness: ReturnType<typeof channel>, connection: number, page: number): [string, string][] {
  return (contentOf(harness, connection, page)?.text ?? []).filter((run) => run.row < FASTEXT_ROW).map((run) => [run.language ?? "", run.text]);
}

/** The runs of `page` as `connection` sees it, each its language and text. */
function runsSeen(harness: ReturnType<typeof channel>, connection: number, page: number): [string, string][] {
  return (contentOf(harness, connection, page)?.text ?? []).map((run) => [run.language ?? "", run.text]);
}

test("the picker sets the viewer's language, and a page is then in that language", () => {
  const harness = channel();
  harness.join(1, PAGES.chooseLanguage);
  // English first, then the server's languages in its order.
  const place = SERVER_LANGUAGES.filter((language) => language.tag !== "en").findIndex((language) => language.tag === "ru") + 1;
  for (let step = 0; step < place; step += 1) {
    harness.press(1, Key.Down);
  }
  harness.press(1, Key.Enter);
  assert.equal(harness.sent.filter((message) => message["type"] === "cookie").length, 0, "no cookie: there is none (VS-408)");
  harness.open(1, PAGES.textStyles);
  assert.equal(contentOf(harness, 1, PAGES.textStyles)?.language, "ru");
  const runs = bodyRuns(harness, 1, PAGES.textStyles);
  assert.ok(
    runs.some(([language, text]) => language === "ru" && /[а-яА-Я]/u.test(text)),
    JSON.stringify(runs),
  );
  assert.deepEqual(
    runs.filter(([, text]) => LATIN.test(text)),
    [],
    "every word of the page in Russian",
  );
  assert.deepEqual(harness.errors, []);
});

test("a page is drawn in the viewer's language, and in English without one, one viewer's never another's", () => {
  const harness = channel();
  inLanguage(harness, 1, "ar", PAGES.textStyles);
  harness.join(2, PAGES.textStyles);
  assert.equal(contentOf(harness, 1, PAGES.textStyles)?.language, "ar", "the page is in the viewer's language");
  const arabic = bodyRuns(harness, 1, PAGES.textStyles);
  assert.ok(arabic.some(([language, text]) => language === "ar" && /[\u0600-\u06FF]/u.test(text)));
  assert.deepEqual(
    arabic.filter(([, text]) => LATIN.test(text)),
    [],
    "every word in Arabic",
  );
  assert.ok(runsSeen(harness, 2, PAGES.textStyles).some(([, text]) => text === "Text styles"));
});

test("a language the server does not list leaves the site in English", () => {
  const harness = channel();
  inLanguage(harness, 1, "xx", PAGES.textStyles);
  assert.ok(runsSeen(harness, 1, PAGES.textStyles).some(([, text]) => text === "Text styles"));
});

test("REQ-2218 item 3: the picker's address with ?language=el chooses Greek and goes to the index", () => {
  const harness = channel();
  harness.join(1, PAGES.how);
  harness.open(1, PAGES.chooseLanguage, ANY_SUB, "language=el");
  assert.equal(harness.redirects(1).at(-1), PAGES.index);
  harness.open(1, PAGES.textStyles);
  assert.equal(contentOf(harness, 1, PAGES.textStyles)?.language, "el");
});

test("an address naming no language of the server's chooses none", () => {
  const harness = channel();
  harness.join(1, PAGES.how);
  harness.open(1, PAGES.chooseLanguage, ANY_SUB, "language=klingon");
  assert.deepEqual(harness.redirects(1), []);
  harness.open(1, PAGES.textStyles);
  assert.equal(contentOf(harness, 1, PAGES.textStyles)?.language ?? "en", "en");
});

test("every page of the channel is published without a fault in English, Russian, Greek, Arabic, Hebrew, Vietnamese and Japanese kana", () => {
  for (const language of ["en", "ru", "el", "ar", "he", "vi", "ja-Hrkt"]) {
    const harness = channel();
    const specs = pages({ pictures: [] }, new SqliteStateStore(IN_MEMORY));
    inLanguage(harness, 1, language, PAGES.index);
    for (const spec of specs) {
      harness.open(1, spec.page);
      assert.notEqual(contentOf(harness, 1, spec.page), undefined, `${language} ${spec.page.toString(16)}`);
    }
    assert.deepEqual(harness.errors, [], language);
  }
});

test("DEC-2226: a list's items are in the viewer's language, a row each", () => {
  const harness = channel();
  inLanguage(harness, 1, "ru", PAGES.choosing);
  assert.deepEqual(
    bodyRuns(harness, 1, PAGES.choosing).filter(([, text]) => LATIN.test(text)),
    [],
  );
  const russian = (contentOf(harness, 1, PAGES.choosing)?.text ?? []).filter((run) => run.language === "ru" && run.row < FASTEXT_ROW).map((run) => run.row);
  assert.ok(russian.length >= 4, JSON.stringify(russian));
  assert.ok(
    russian.some((row, place) => russian[place + 1] === row + 1),
    "consecutive items a row apart",
  );
  assert.deepEqual(harness.errors, []);
});

test("DEC-2226: in Russian, the text styles are in Russian", () => {
  const harness = channel();
  inLanguage(harness, 1, "ru", PAGES.textStyles);
  const russian = bodyRuns(harness, 1, PAGES.textStyles).filter(([language, text]) => language === "ru" && /[\u0400-\u04FF]/u.test(text));
  assert.ok(russian.length >= 6, JSON.stringify(russian));
  assert.deepEqual(harness.errors, []);
});
