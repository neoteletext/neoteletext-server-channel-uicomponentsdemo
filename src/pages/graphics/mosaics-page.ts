// Page 500, mosaics: the emblem in three colours, and every icon.

import { Colour } from "neottx-server-ts-protocol";
import { type Child, Columns, Component, Gap, Grid, h, Icon, type IconName, Mosaic, Paragraph } from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";
import { EMBLEM, EMBLEM_CELLS, EMBLEM_ROWS } from "../home/emblem.ts";

/** The icons' grid, seven across; an icon is three cells by two rows (graphics/icon.ts). */
const ICON_COLUMNS = 7;
const ICON_ROWS = 2;
/** The lines the icons' names take. */
const NAME_LINES = 3;
const INKS = [Colour.Cyan, Colour.Yellow, Colour.Green];
/** Every icon the library draws (graphics/icon.ts), in its order. */
const NAMES: readonly IconName[] = ["sun", "cloud", "rain", "snow", "storm", "tick", "cross", "warning", "info", "heart", "star", "home", "mail", "music"];

export class MosaicsPage extends Component {
  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.mosaics },
      h(
        Columns,
        { widths: INKS.map(() => EMBLEM_CELLS + 1), height: EMBLEM_ROWS },
        ...INKS.map((foreground) => h(Mosaic, { key: foreground, bitmap: EMBLEM, foreground })),
      ),
      h(Note, { text: "Bitmaps of sixels: two across and three down a cell.", lines: 1 }),
      h(Gap, {}),
      h(
        Grid,
        { columns: ICON_COLUMNS, height: ICON_ROWS * Math.ceil(NAMES.length / ICON_COLUMNS) },
        ...NAMES.map((name) => h(Icon, { key: name, name, foreground: Colour.White })),
      ),
      h(Paragraph, { text: NAMES.join(" "), foreground: Colour.Cyan, lines: NAME_LINES }),
    );
  }
}
