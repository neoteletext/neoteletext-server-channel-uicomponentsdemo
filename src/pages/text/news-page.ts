// Page 202, the parts of a news page: headlines with their pages, links,
// a newsflash and a ticker.

import { Colour } from "neoteletext-server-ts-protocol";
import { Band, type Child, Component, Gap, Grid, h, Headline, Newsflash, PageLink, Ticker } from "neoteletext-server-ts-ui-components";
import { ARTICLES } from "../../content/articles.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

/** How long each ticker item shows. */
const TICKER_MS = 5_000;
/** The links' grid: two across, two down. */
const LINK_COLUMNS = 2;
const LINK_ROWS = 2;

export class NewsPage extends Component {
  override render(): Child {
    const [lead, ...rest] = ARTICLES;
    return h(
      DemoFrame,
      { page: PAGES.news, hint: "Click a headline to read it" },
      lead === undefined ? null : h(Headline, { title: lead.title, page: lead.page, foreground: Colour.Yellow, lines: 2 }),
      h(Gap, {}),
      ...rest.map((article) => h(Headline, { key: article.page, title: article.title, page: article.page })),
      h(Gap, {}),
      h(Band, { text: "SEE ALSO", background: Colour.Blue }),
      h(
        Grid,
        { columns: LINK_COLUMNS, height: LINK_ROWS },
        h(PageLink, { page: PAGES.document, label: "A document" }),
        h(PageLink, { page: PAGES.days, label: "A day a page" }),
        h(PageLink, { page: PAGES.roulette, label: "Roulette" }),
        h(PageLink, { page: PAGES.poll, label: "The poll" }),
      ),
      h(Gap, { rows: 0, grow: 1 }),
      h(Newsflash, { text: "Newsflash: every component works" }),
      h(Ticker, { items: ARTICLES.map((article) => article.summary), everyMs: TICKER_MS, background: Colour.Blue }),
    );
  }
}
