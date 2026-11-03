// Page 203, the layouts: rows, columns with fixed and shared widths, a
// grid, layers with places, centring, and gaps that grow.

import { Colour } from "neoteletext-server-ts-protocol";
import { At, Band, type Child, Centred, Columns, Component, Gap, Grid, h, Layers, Rows, Text } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";
import { samplerFor } from "../languages/sample-text.ts";

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
    // In the viewer's language, each box holds a word of the Declaration (REQ-2218 item 2); a box is one row, so Thai and Lao keep the English.
    const sampler = samplerFor(this.services);
    const [fixed = "", shared = "", alsoShared = "", topLeft = "", middle = "", lowRight = "", centred = ""] = sampler.controlList(
      ["fixed", "shared", "shared", "top left", "middle", "low right", "in the middle"],
      (sample) => sample.words,
    );
    const cells = sampler.controlList(
      Array.from({ length: GRID_CELLS }, (_, cell) => `cell ${cell + 1}`),
      (sample) => sample.words.slice(GRID_CELLS),
    );
    const inLanguage = sampler.control;
    return h(
      DemoFrame,
      { page: PAGES.layout },
      h(Band, { text: "Columns: 10 cells, then shared", background: Colour.Blue }),
      h(
        Columns,
        { widths: [FIXED_CELLS, null, null], height: 1 },
        h(Text, { text: fixed, foreground: Colour.Yellow, ...inLanguage }),
        h(Text, { text: shared, foreground: Colour.Green, ...inLanguage }),
        h(Text, { text: alsoShared, foreground: Colour.Cyan, ...inLanguage }),
      ),
      h(Band, { text: "A grid of three by two", background: Colour.Blue }),
      h(
        Grid,
        { columns: GRID_COLUMNS, height: GRID_ROWS },
        ...cells.map((text, cell) => h(Text, { key: cell, text, foreground: Colour.White, ...inLanguage })),
      ),
      h(Band, { text: "Layers, each at its place", background: Colour.Blue }),
      h(
        Layers,
        { height: LAYER_ROWS },
        h(At, { row: 0, column: 0 }, h(Text, { text: topLeft, foreground: Colour.Yellow, ...inLanguage })),
        h(At, { row: 1, column: MIDDLE_COLUMN }, h(Text, { text: middle, foreground: Colour.Magenta, ...inLanguage })),
        h(At, { row: 2, column: RIGHT_COLUMN }, h(Text, { text: lowRight, foreground: Colour.Cyan, ...inLanguage })),
      ),
      h(Band, { text: "Centred", background: Colour.Blue }),
      h(Centred, { height: 1 }, h(Text, { text: centred, foreground: Colour.Green, ...inLanguage })),
      h(Rows, { grow: 1 }, h(Gap, { rows: 0, grow: 1 }), h(Note, { text: "A gap that grows pushes this line to the foot of the page.", lines: 1 })),
    );
  }
}
