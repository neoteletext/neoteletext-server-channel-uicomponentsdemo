// Page 300, tabs in each of their styles, each showing its views.

import { Colour } from "neottx-server-ts-protocol";
import { type Child, Component, Gap, h, Paragraph, TabView } from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";

const TABS = ["News", "Sport", "Weather"];
const VIEWS = ["The headlines, as they come in.", "The scores, live from the ground.", "Sun later; rain by the evening."];
/** Each tab view's height: the strip, its rule, and a line of its view. */
const VIEW_ROWS = 3;

/** A view for each tab, made again for each strip: an element is one place in the tree. */
function views(): Child[] {
  return VIEWS.map((text) => h(Paragraph, { key: text, text, foreground: Colour.White, lines: 1 }));
}

export class TabsPage extends Component {
  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.tabs, hint: "Left and Right choose a tab; Tab moves on" },
      h(Note, { text: "Chips:", lines: 1 }),
      h(TabView, { tabs: TABS, style: "chips", autoFocus: true, height: VIEW_ROWS }, ...views()),
      h(Gap, {}),
      h(Note, { text: "Underlined:", lines: 1 }),
      h(TabView, { tabs: TABS, style: "underline", height: VIEW_ROWS }, ...views()),
      h(Gap, {}),
      h(Note, { text: "Numbered, which digits choose:", lines: 1 }),
      h(TabView, { tabs: TABS, style: "numbered", height: VIEW_ROWS }, ...views()),
    );
  }
}
