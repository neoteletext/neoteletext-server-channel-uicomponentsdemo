// Page 100, the index: the emblem, every magazine to go to, the newest
// article and a ticker of the rest.

import { Colour } from "neoteletext-server-ts-protocol";
import {
  At,
  Band,
  BIG_ROWS,
  type Child,
  Clock,
  Component,
  DoubleWidth,
  Gap,
  Grid,
  h,
  Headline,
  Layers,
  Mosaic,
  Newsflash,
  PageLink,
  Paragraph,
  Ticker,
} from "neoteletext-server-ts-ui-components";
import { ARTICLES } from "../../content/articles.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";
import { MAGAZINES } from "../../site/site-map.ts";
import { EMBLEM, EMBLEM_CELLS, EMBLEM_ROWS } from "./emblem.ts";

/** Where the heading's words start: past the emblem and a cell. */
const HEADING_COLUMN = EMBLEM_CELLS + 3;
/** The clock's first row, under the heading's lines. */
export const CLOCK_ROW = 5;
/** The rows above the magazines: the emblem with a clear row under it, or the clock's large digits whole. */
const TOP_ROWS = Math.max(EMBLEM_ROWS + 1, CLOCK_ROW + BIG_ROWS);
/** The magazines' links, two across. */
const LINK_COLUMNS = 2;
/** How long each ticker item shows. */
const TICKER_MS = 7_000;

export class IndexPage extends Component {
  override render(): Child {
    const [newest] = ARTICLES;
    const links = [
      ...MAGAZINES.flatMap((magazine) => {
        const [front] = magazine.pages;
        // The index's own magazine is linked by its other pages instead.
        return front === undefined || front.page === PAGES.index ? [] : [{ page: front.page, label: magazine.name }];
      }),
      { page: PAGES.components, label: "Components A-Z" },
      { page: PAGES.how, label: "How it works" },
      { page: PAGES.greeting, label: "A greeting" },
    ];
    return h(
      DemoFrame,
      { page: PAGES.index, bare: true, hint: "Type a page number or press a colour" },
      h(
        Layers,
        { height: TOP_ROWS },
        h(At, { row: 0, column: 1 }, h(Mosaic, { bitmap: EMBLEM, foreground: Colour.Cyan })),
        h(At, { row: 0, column: HEADING_COLUMN }, h(DoubleWidth, { text: "UI DEMO", foreground: Colour.Yellow })),
        h(At, { row: 2, column: HEADING_COLUMN }, h(Paragraph, { text: "every component, working", lines: 1 })),
        h(At, { row: 3, column: HEADING_COLUMN }, h(Paragraph, { text: "neoteletext-server-ts-ui-components", foreground: Colour.Cyan, lines: 1 })),
        h(At, { row: CLOCK_ROW, column: HEADING_COLUMN }, h(Clock, { foreground: Colour.Green, seconds: true })),
      ),
      h(Band, { text: "THE MAGAZINES", background: Colour.Blue }),
      h(
        Grid,
        { columns: LINK_COLUMNS, height: Math.ceil(links.length / LINK_COLUMNS) },
        ...links.map(({ page, label }) => h(PageLink, { key: page, page, label })),
      ),
      h(Gap, {}),
      newest === undefined
        ? null
        : [h(Band, { text: "NEWEST ARTICLE", background: Colour.Red, foreground: Colour.Yellow }), h(Headline, { title: newest.title, page: newest.page })],
      h(Gap, { rows: 0, grow: 1 }),
      newest === undefined ? null : h(Newsflash, { text: `${newest.page.toString(16)} ${newest.title}` }),
      h(Ticker, { items: ARTICLES.map((article) => `${article.page.toString(16)} ${article.title}`), everyMs: TICKER_MS }),
    );
  }
}
