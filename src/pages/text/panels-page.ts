// Page 204, boxes and lines: panels with a line or a band, and every
// style of rule.

import { Colour } from "neoteletext-server-ts-protocol";
import { type Child, Columns, Component, Gap, h, Panel, Paragraph, Rule, type RuleStyle } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";
import { samplerFor } from "../languages/sample-text.ts";

const RULES: readonly (readonly [RuleStyle, Colour])[] = [
  ["thin", Colour.White],
  ["bold", Colour.Yellow],
  ["double", Colour.Green],
  ["dotted", Colour.Cyan],
  ["dashed", Colour.Magenta],
];
/** The panels' height: a frame line, three lines inside, a frame line. */
const PANEL_ROWS = 6;

export class PanelsPage extends Component {
  override render(): Child {
    // In the viewer's language, each panel holds a sentence of the Declaration (REQ-2218 item 2).
    const sampler = samplerFor(this.services);
    const [line = "", band = ""] = sampler.list(["A panel drawn round in mosaic lines.", "A panel on a band of colour."], (sample) => sample.sentences);
    return h(
      DemoFrame,
      { page: PAGES.panels },
      h(
        Columns,
        { height: PANEL_ROWS },
        h(Panel, { title: "A line", foreground: Colour.Cyan }, h(Paragraph, { text: line, ...sampler.display })),
        h(Panel, { title: "A band", style: "band", foreground: Colour.Blue, titleForeground: Colour.Yellow }, h(Paragraph, { text: band, ...sampler.display })),
      ),
      h(Gap, {}),
      ...RULES.map(([style, foreground]) => [
        h(Rule, { key: style, style, foreground, title: style, titleForeground: Colour.White }),
        h(Gap, { key: `${style} gap` }),
      ]),
    );
  }
}
