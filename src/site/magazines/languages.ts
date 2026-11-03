// The languages: an index, then a page in every language the engine has a
// set for, each built of the library's components in its own language
// (language-page.ts), then the page that chooses the viewer's language for
// the rest of the channel (language-choice.ts).

import { h, type PageSpec, type Prompts } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { LanguageChoice } from "../../pages/languages/language-choice.ts";
import { languagePage, NAMES_AN_INDEX } from "../../pages/languages/language-files.ts";
import { LanguageIndexPage } from "../../pages/languages/language-index-page.ts";
import { LanguagePage } from "../../pages/languages/language-page.ts";
import { LANGUAGES } from "../../pages/languages/language-table.ts";
import { LOOKS } from "../looks.ts";
import { PAGES } from "../page-numbers.ts";
import { spec } from "../spec.ts";

/** A page's coloured keys: the language before, the one after, the languages' index and the channel's. */
function promptsOf(place: number): Prompts {
  const before = place === 0 ? PAGES.languages : languagePage(place - 1);
  const after = place === LANGUAGES.length - 1 ? PAGES.chooseLanguage : languagePage(place + 1);
  return [
    ["Before", before],
    ["Next", after],
    ["Languages", PAGES.languages],
    ["Index", PAGES.index],
  ];
}

export function languagePages(): PageSpec[] {
  return [
    spec(PAGES.languages, () => h(LanguageIndexPage, { page: PAGES.languages, from: 0 })),
    spec(PAGES.moreLanguages, () => h(LanguageIndexPage, { page: PAGES.moreLanguages, from: NAMES_AN_INDEX })),
    ...LANGUAGES.map((language, place): PageSpec => ({
      page: languagePage(place),
      title: language.name,
      language: language.tag,
      root: () =>
        h(LanguagePage, {
          entry: language,
          background: LOOKS.languages.background,
          foreground: LOOKS.languages.foreground,
          prompts: promptsOf(place),
          index: PAGES.index,
        }),
    })),
    spec(PAGES.chooseLanguage, (params) =>
      h(DemoFrame, { page: PAGES.chooseLanguage }, h(LanguageChoice, { home: PAGES.index, ...(params === undefined ? {} : { params }) })),
    ),
  ];
}
