// Page 102, how the channel works: a Document, which flows its lines over
// as many sub-pages as they need.

import { Colour } from "neoteletext-server-ts-protocol";
import { type Child, Component, Document, h, type Line, TEXT_WIDTH, wrap } from "neoteletext-server-ts-ui-components";
import { framingOf } from "../../parts/framing.ts";
import { PAGES } from "../../site/page-numbers.ts";
import { entryOf } from "../../site/site-map.ts";

/** The text, a heading then its paragraphs. */
const SECTIONS: readonly (readonly [heading: string, ...paragraphs: string[]])[] = [
  [
    "A page is a tree of components",
    "Each component is a class: props from its parent, state of its own, and a render that answers elements. h(Class, props, ...children) makes an element; there is no JSX, since Node runs the TypeScript as it is.",
    "setState draws the component again. The library lays the tree out on the 40 by 25 screen and publishes the page as TTI, only when it has changed.",
  ],
  [
    "Keys and the pointer",
    "The focused control hears the keys first; what it does not use goes up to its parents. A click goes to the control under the pointer, which the page's TTI declares.",
    "The four colour keys follow the Fastext prompts. On this channel green goes on to the next page, so the whole demo is one walk.",
  ],
  [
    "Shared and own copies",
    "A page is one copy for every viewer unless its spec says perViewer. Then each viewer's copy is published only while it differs from everyone's.",
  ],
  ["The bus", "Components on different pages talk over the bus: a poll's votes, a toast, the server's figures, and ended when a viewer goes."],
];

function howLines(): Line[] {
  const lines: Line[] = [];
  for (const [heading, ...paragraphs] of SECTIONS) {
    lines.push({ foreground: Colour.Yellow, text: heading });
    for (const paragraph of paragraphs) {
      lines.push(...wrap(paragraph, TEXT_WIDTH).map((text) => ({ foreground: Colour.White, text })), { foreground: Colour.White, text: "" });
    }
  }
  return lines;
}

export class HowPage extends Component {
  override render(): Child {
    return h(Document, { title: entryOf(PAGES.how).title, ...framingOf(PAGES.how), lines: howLines() });
  }
}
