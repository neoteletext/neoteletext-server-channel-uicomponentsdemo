// The languages' index: every language by its English name, with a link to
// its page, in the library's links and grid, on two pages. Not sub-pages: a
// channel is not told which sub-page a viewer has up, so a click would land on
// the first sub-page's link.

import { type Child, Component, Grid, h, PageLink } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { languagePage, NAMES_AN_INDEX } from "./language-files.ts";
import { LANGUAGES } from "./language-table.ts";

/** The names across an index page. */
const INDEX_COLUMNS = 2;

export interface LanguageIndexPageProps {
  readonly page: number;
  /** The first language it lists, by place in the table. */
  readonly from: number;
}

export class LanguageIndexPage extends Component<LanguageIndexPageProps> {
  override render(): Child {
    const { page, from } = this.props;
    const links = LANGUAGES.slice(from, from + NAMES_AN_INDEX).map((language, place) =>
      h(PageLink, { key: place, page: languagePage(from + place), label: language.name }),
    );
    return h(DemoFrame, { page, hint: "Key a language's page, or click it" }, h(Grid, { columns: INDEX_COLUMNS }, ...links));
  }
}
