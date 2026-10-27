// Page 101, every component A to Z: a list to choose from, and a choice
// goes to the page that shows it.

import { type Child, ChoiceList, Component, h, pageNumber } from "neottx-server-ts-ui-components";
import { CATALOGUE, type CatalogueEntry } from "../../content/catalogue.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

/** The rows the list shows: the frame's body less the line under it. */
const SHOWN = 18;
/** The name's column, wide enough for the longest name. */
const NAME_CELLS = 14;

export class CataloguePage extends Component {
  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.components, hint: "Up, Down, Enter: go to its page" },
      h(ChoiceList<CatalogueEntry>, {
        items: CATALOGUE,
        shown: SHOWN,
        autoFocus: true,
        text: (entry) => `${entry.name.padEnd(NAME_CELLS)}${pageNumber(entry.page)} ${entry.what}`,
        onChoose: (index, session) => {
          const chosen = CATALOGUE[index];
          if (chosen !== undefined) {
            this.services.goto(session, chosen.page);
          }
        },
      }),
    );
  }
}
