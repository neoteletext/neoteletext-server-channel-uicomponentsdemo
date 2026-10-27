// Page 203, the layouts: rows, columns with fixed and shared widths, a
// grid, layers with places, centring, and gaps that grow.

import { Colour } from "neottx-server-ts-protocol";
import { At, Band, type Child, Centred, Columns, Component, Gap, Grid, h, Layers, Rows, Text } from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";

/** A fixed column's width in cells; the others share what is left. */
const FIXED_CELLS = 10;
/** The grid: three across, two down. */
const GRID_COLUMNS = 3;
const GRID_ROWS = 2;
const GRID_CELLS = GRID_COLUMNS * GRID_ROWS;
/** The layers' box, and where across it the second and third start. */
const LAYER_ROWS = 3;
const MIDDLE_COLUMN = 15;
const RIGHT_COLUMN = 30;

export class LayoutPage extends Component {
  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.layout },
      h(Band, { text: "Columns: 10 cells, then shared", background: Colour.Blue }),
      h(
        Columns,
        { widths: [FIXED_CELLS, null, null], height: 1 },
        h(Text, { text: "fixed", foreground: Colour.Yellow }),
        h(Text, { text: "shared", foreground: Colour.Green }),
        h(Text, { text: "shared", foreground: Colour.Cyan }),
      ),
      h(Band, { text: "A grid of three by two", background: Colour.Blue }),
      h(
        Grid,
        { columns: GRID_COLUMNS, height: GRID_ROWS },
        ...Array.from({ length: GRID_CELLS }, (_, cell) => h(Text, { key: cell, text: `cell ${cell + 1}`, foreground: Colour.White })),
      ),
      h(Band, { text: "Layers, each at its place", background: Colour.Blue }),
      h(
        Layers,
        { height: LAYER_ROWS },
        h(At, { row: 0, column: 0 }, h(Text, { text: "top left", foreground: Colour.Yellow })),
        h(At, { row: 1, column: MIDDLE_COLUMN }, h(Text, { text: "middle", foreground: Colour.Magenta })),
        h(At, { row: 2, column: RIGHT_COLUMN }, h(Text, { text: "low right", foreground: Colour.Cyan })),
      ),
      h(Band, { text: "Centred", background: Colour.Blue }),
      h(Centred, { height: 1 }, h(Text, { text: "in the middle", foreground: Colour.Green })),
      h(Rows, { grow: 1 }, h(Gap, { rows: 0, grow: 1 }), h(Note, { text: "A gap that grows pushes this line to the foot of the page.", lines: 1 })),
    );
  }
}
