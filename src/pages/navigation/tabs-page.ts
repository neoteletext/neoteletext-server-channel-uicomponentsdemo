// Page 300, tabs in each of their styles, each showing its views.

import { Colour } from "neoteletext-server-ts-protocol";
import { type Child, Component, Gap, h, Paragraph, TabView } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";
import { type Sampler, samplerFor } from "../languages/sample-text.ts";

const TABS = ["News", "Sport", "Weather"];
const VIEWS = ["The headlines, as they come in.", "The scores, live from the ground.", "Sun later; rain by the evening."];
/** Each tab view's height: the strip, its rule, and a line of its view. */
const VIEW_ROWS = 3;

/** A view for each tab, made again for each strip: an element is one place in the tree. */
function views(sampler: Sampler): Child[] {
  return sampler
    .controlList(VIEWS, (sample) => sample.sentences)
    .map((text, place) => h(Paragraph, { key: place, text, foreground: Colour.White, lines: 1, ...sampler.control }));
}

export class TabsPage extends Component {
  override render(): Child {
    // In the viewer's language, the tabs are words of the Declaration and the views its sentences (REQ-2218 item 2); a view is one line, so Thai and Lao keep the English.
    const sampler = samplerFor(this.services);
    const tabs = sampler.controlList(TABS, (sample) => sample.words);
    const tabLanguage = sampler.control;
    return h(
      DemoFrame,
      { page: PAGES.tabs, hint: "Left and Right choose a tab; Tab moves on" },
      h(Note, { text: "Chips:", lines: 1 }),
      h(TabView, { tabs, style: "chips", autoFocus: true, height: VIEW_ROWS, ...tabLanguage }, ...views(sampler)),
      h(Gap, {}),
      h(Note, { text: "Underlined:", lines: 1 }),
      h(TabView, { tabs, style: "underline", height: VIEW_ROWS, ...tabLanguage }, ...views(sampler)),
      h(Gap, {}),
      h(Note, { text: "Numbered, which digits choose:", lines: 1 }),
      h(TabView, { tabs, style: "numbered", height: VIEW_ROWS, ...tabLanguage }, ...views(sampler)),
    );
  }
}
