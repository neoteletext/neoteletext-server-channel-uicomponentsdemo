// The languages: an index, then a page in every language the engine has a
// set for. The library's components write English alone: its text folds to
// that set, and a page with controls carries an English designation. So
// each language page is ready-made TTI in one RawSubPage, the library's own
// way of taking a page whole, with a window of every character of its sets
// (language-page.ts), and only the index is built of components.

import { readFileSync, statSync } from "node:fs";

import type { FastextLinks } from "neoteletext-server-ts-protocol";
import { h, type PageSpec } from "neoteletext-server-ts-ui-components";
import { languageFile, languagePage, NAMES_AN_INDEX } from "../../pages/languages/language-files.ts";
import { LanguageIndexPage } from "../../pages/languages/language-index-page.ts";
import { LanguagePage } from "../../pages/languages/language-page.ts";
import { LANGUAGES } from "../../pages/languages/language-table.ts";
import { PAGES } from "../page-numbers.ts";
import { spec } from "../spec.ts";

/** A page of TTI with every enhancement packet is a few kilobytes. */
const LONGEST_PAGE = 16 * 1024;

/** A page's coloured keys, as its row 24 says: the language before, the one after, the languages' index and the channel's. */
function linksOf(place: number): FastextLinks {
  const before = place === 0 ? PAGES.languages : languagePage(place - 1);
  const after = place === LANGUAGES.length - 1 ? PAGES.index : languagePage(place + 1);
  return [before, after, PAGES.languages, PAGES.index];
}

/** The ready-made page of the language at `place`. One that is missing stops the channel: the pages are part of the program. */
function readPage(place: number): string {
  const file = languageFile(place);
  if (statSync(file).size > LONGEST_PAGE) {
    throw new RangeError(`${file} is too long for a page`);
  }
  return readFileSync(file, "latin1");
}

export function languagePages(): PageSpec[] {
  return [
    spec(PAGES.languages, () => h(LanguageIndexPage, { page: PAGES.languages, from: 0 })),
    spec(PAGES.moreLanguages, () => h(LanguageIndexPage, { page: PAGES.moreLanguages, from: NAMES_AN_INDEX })),
    ...LANGUAGES.map((language, place) => {
      const tti = readPage(place);
      return spec(languagePage(place), () => h(LanguagePage, { tti, set: language.set, fastext: linksOf(place), index: PAGES.index }));
    }),
  ];
}
