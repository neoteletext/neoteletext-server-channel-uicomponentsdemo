// Page 303, sections that open and shut (an accordion), and pagination in
// its three styles over one count.

import { Colour } from "neoteletext-server-ts-protocol";
import { type Child, Collapsible, Component, Gap, h, Pagination, Paragraph, Text } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";

const SECTIONS: readonly (readonly [title: string, text: string])[] = [
  ["What is teletext?", "Pages of text and mosaics, sent with the television picture and chosen by number."],
  ["What is Fastext?", "Four coloured prompts at the foot of a page, and the four keys that follow them."],
  ["What is a sub-page?", "One of the pages a page number rotates through, or that the viewer steps to."],
];
/** The pages the pagination counts. */
const PAGE_COUNT = 7;
/** The accordion's rows: each heading, and the open one's text. */
const ACCORDION_ROWS = 7;

export class SectionsPage extends Component<object, { readonly page: number }> {
  override state = { page: 0 };

  override render(): Child {
    const change = (page: number): void => {
      this.setState({ page });
    };
    return h(
      DemoFrame,
      { page: PAGES.sections, hint: "Enter opens a section; Left and Right turn the pages" },
      h(
        Collapsible,
        { titles: SECTIONS.map(([title]) => title), accordion: true, initial: [0], autoFocus: true, height: ACCORDION_ROWS },
        ...SECTIONS.map(([title, text]) => h(Paragraph, { key: title, text, lines: 2 })),
      ),
      h(Gap, {}),
      h(Note, { text: "Pagination, as numbers, a count and dots: the three follow one another.", lines: 2 }),
      h(Pagination, { count: PAGE_COUNT, style: "numbers", value: this.state.page, onChange: change }),
      h(Pagination, { count: PAGE_COUNT, style: "count", value: this.state.page, onChange: change }),
      h(Pagination, { count: PAGE_COUNT, style: "dots", value: this.state.page, onChange: change }),
      h(Text, { text: `On page ${this.state.page + 1} of ${PAGE_COUNT}`, foreground: Colour.Yellow }),
    );
  }
}
