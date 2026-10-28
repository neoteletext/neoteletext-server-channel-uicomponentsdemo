// Page 400, bars across and columns up, from the week's figures; a bar
// chosen is said under them.

import { Colour } from "neoteletext-server-ts-protocol";
import { Bar, BarChart, type Child, Columns, ColumnChart, Component, Gap, h, Text } from "neoteletext-server-ts-ui-components";
import { PAGE_BARS, VISITOR_BARS } from "../../content/figures.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";

/** The column chart's plot. */
const PLOT_ROWS = 7;
const COLUMN_CELLS = 4;
/** The pages' names' column: the longest name, five letters, and two cells before the bar. */
const PAGE_LABEL_CELLS = 7;
/** The single bar's label column. */
const LABEL_CELLS = 12;
/** The single bar's value, of a hundred. */
const PROGRESS = 62;
const OF = 100;

export class BarsPage extends Component<object, { readonly chosen: string }> {
  override state = { chosen: "" };

  override render(): Child {
    const say =
      (rows: typeof PAGE_BARS) =>
      (index: number): void => {
        const row = rows[index];
        this.setState({ chosen: row === undefined ? "" : `${row.label}: ${row.value}` });
      };
    return h(
      DemoFrame,
      { page: PAGES.bars, hint: "Click a bar to read it" },
      h(BarChart, { bars: PAGE_BARS, labelCells: PAGE_LABEL_CELLS, onChoose: say(PAGE_BARS) }),
      h(Gap, {}),
      h(Note, { text: "Visitors this week, the weekend in yellow:", lines: 1 }),
      h(ColumnChart, {
        bars: VISITOR_BARS,
        plotRows: PLOT_ROWS,
        columnCells: COLUMN_CELLS,
        figures: true,
        foreground: Colour.Cyan,
        onChoose: say(VISITOR_BARS),
      }),
      h(Gap, {}),
      h(
        Columns,
        { widths: [LABEL_CELLS, null], height: 1 },
        h(Text, { text: "One bar:", foreground: Colour.Cyan }),
        h(Bar, { value: PROGRESS, max: OF, foreground: Colour.Green }),
      ),
      h(Text, { text: this.state.chosen === "" ? "Nothing chosen" : this.state.chosen, foreground: Colour.Yellow }),
    );
  }
}
