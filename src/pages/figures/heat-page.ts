// Page 402, a heat map of the week by the hour, in colours and then in
// density, each with its legend.

import { type Child, Component, Gap, h, Heatmap } from "neoteletext-server-ts-ui-components";
import { HEAT, HEAT_HOURS } from "../../content/figures.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";

const LABEL_CELLS = 5;

export class HeatPage extends Component {
  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.heat },
      h(Note, { text: `Visitors by day and hour, from ${HEAT_HOURS.join(" ")}:`, lines: 2 }),
      h(Heatmap, { rows: HEAT, labelCells: LABEL_CELLS, legend: true }),
      h(Gap, {}),
      h(Heatmap, { rows: HEAT, labelCells: LABEL_CELLS, scale: "density", legend: true }),
    );
  }
}
