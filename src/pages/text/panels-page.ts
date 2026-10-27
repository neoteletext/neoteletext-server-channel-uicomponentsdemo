// Page 204, boxes and lines: panels with a line or a band, and every
// style of rule.

import { Colour } from "neottx-server-ts-protocol";
import { type Child, Columns, Component, Gap, h, Panel, Paragraph, Rule, type RuleStyle } from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

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
    return h(
      DemoFrame,
      { page: PAGES.panels },
      h(
        Columns,
        { height: PANEL_ROWS },
        h(Panel, { title: "A line", foreground: Colour.Cyan }, h(Paragraph, { text: "A panel drawn round in mosaic lines." })),
        h(
          Panel,
          { title: "A band", style: "band", foreground: Colour.Blue, titleForeground: Colour.Yellow },
          h(Paragraph, { text: "A panel on a band of colour." }),
        ),
      ),
      h(Gap, {}),
      ...RULES.map(([style, foreground]) => [
        h(Rule, { key: style, style, foreground, title: style, titleForeground: Colour.White }),
        h(Gap, { key: `${style} gap` }),
      ]),
    );
  }
}
