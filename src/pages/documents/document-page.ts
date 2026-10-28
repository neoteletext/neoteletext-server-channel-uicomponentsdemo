// Page 800, a document: every article's text, flowed over as many
// sub-pages as it takes.

import { Colour } from "neoteletext-server-ts-protocol";
import { articleLines, type Child, Component, Document, h, type Line, TEXT_WIDTH } from "neoteletext-server-ts-ui-components";
import { ARTICLES } from "../../content/articles.ts";
import { framingOf } from "../../parts/framing.ts";
import { PAGES } from "../../site/page-numbers.ts";
import { entryOf } from "../../site/site-map.ts";

function documentLines(): Line[] {
  const lines: Line[] = [];
  for (const article of ARTICLES) {
    lines.push({ foreground: Colour.Yellow, text: article.title.slice(0, TEXT_WIDTH) }, ...articleLines(article.blocks, TEXT_WIDTH), {
      foreground: Colour.White,
      text: "",
    });
  }
  return lines;
}

export class DocumentPage extends Component {
  override render(): Child {
    return h(Document, { title: entryOf(PAGES.document).title, ...framingOf(PAGES.document), lines: documentLines() });
  }
}
