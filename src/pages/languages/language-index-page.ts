// Page 820, the languages' index: every language by its English name, with
// a link to its page, in the library's links and grid, over as many
// sub-pages as they take.

import { type Child, Component, Grid, h, PageLink } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";
import { languagePage } from "./language-files.ts";
import { LANGUAGES } from "./language-table.ts";

/** The names across a sub-page. */
const INDEX_COLUMNS = 2;
/** Twenty rows of two, the frame's body whole. */
const NAMES_A_SUB_PAGE = 40;

export class LanguageIndexPage extends Component {
  override render(): Child {
    const links = LANGUAGES.map((language, place) => h(PageLink, { key: place, page: languagePage(place), label: language.name }));
    const sheets = Math.ceil(links.length / NAMES_A_SUB_PAGE);
    return Array.from({ length: sheets }, (_, sheet) =>
      h(
        DemoFrame,
        { key: sheet, page: PAGES.languages, hint: "Key a language's page, or click it" },
        h(Grid, { columns: INDEX_COLUMNS }, ...links.slice(sheet * NAMES_A_SUB_PAGE, (sheet + 1) * NAMES_A_SUB_PAGE)),
      ),
    );
  }
}
