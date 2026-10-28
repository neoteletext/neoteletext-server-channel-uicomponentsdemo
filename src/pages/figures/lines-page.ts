// Page 401, a line chart with its area, sparklines in a row, and a
// scatter of points.

import { Colour } from "neoteletext-server-ts-protocol";
import { type Child, Component, Gap, h, LineChart, ScatterPlot, Sparkline } from "neoteletext-server-ts-ui-components";
import { DAYS, VISITORS } from "../../content/figures.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";

const LINE_ROWS = 6;
const SCATTER_ROWS = 5;
const SPARK_LABEL_CELLS = 10;
/** A wave for a sparkline: a sine about its middle, a third of a radian a point, over a sparkline's width. */
const WAVE_POINTS = 30;
const WAVE_MIDDLE = 50;
const WAVE_HEIGHT = 40;
const POINTS_A_RADIAN = 3;
const WAVE = Array.from({ length: WAVE_POINTS }, (_, index) => Math.round(WAVE_MIDDLE + WAVE_HEIGHT * Math.sin(index / POINTS_A_RADIAN)));
/** Points of a rough rising line: twice as high as along, and a scatter from a step through the remainders. */
const SCATTER_POINTS = 20;
const RISE = 2;
const SCATTER_STEP = 7;
const SCATTER_SPREAD = 5;
const POINTS: readonly (readonly [number, number])[] = Array.from({ length: SCATTER_POINTS }, (_, index) => [
  index,
  index * RISE + ((index * SCATTER_STEP) % SCATTER_SPREAD),
]);

export class LinesPage extends Component {
  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.lines },
      h(LineChart, { values: VISITORS, plotRows: LINE_ROWS, area: true, labels: DAYS, foreground: Colour.Green }),
      h(Gap, {}),
      h(Sparkline, { values: VISITORS, label: "Visitors", labelCells: SPARK_LABEL_CELLS, last: true, foreground: Colour.Yellow }),
      h(Sparkline, { values: WAVE, label: "A wave", labelCells: SPARK_LABEL_CELLS, foreground: Colour.Cyan }),
      h(Gap, {}),
      h(Note, { text: "Points, scattered:", lines: 1 }),
      h(ScatterPlot, { points: POINTS, plotRows: SCATTER_ROWS, foreground: Colour.Magenta }),
    );
  }
}
