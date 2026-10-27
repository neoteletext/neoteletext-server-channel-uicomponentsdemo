// Page 305, tables: a data table to sort and choose from, a table of
// labels and values, and numbered rows of pages.

import { Colour } from "neottx-server-ts-protocol";
import { type Child, Component, DataTable, Gap, h, NumberedRows, Table, type TableColumn } from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";
import { MAGAZINES } from "../../site/site-map.ts";

const COLUMNS: readonly TableColumn[] = [
  { title: "Planet", width: 10 },
  { title: "Moons", width: 6, align: "right", foreground: Colour.Yellow },
  { title: "Day h", width: 7, align: "right" },
  { title: "Ring", width: 5 },
];
/** Moons, the length of a day in hours, and whether it has rings. */
const PLANETS: readonly (readonly string[])[] = [
  ["Mercury", "0", "4223", "no"],
  ["Venus", "0", "2802", "no"],
  ["Earth", "1", "24", "no"],
  ["Mars", "2", "25", "no"],
  ["Jupiter", "95", "10", "yes"],
  ["Saturn", "146", "11", "yes"],
  ["Uranus", "28", "17", "yes"],
  ["Neptune", "16", "16", "yes"],
];
/** The data table's rows shown, under its heading. */
const PLANETS_SHOWN = 5;
/** The magazines the numbered rows list: four, from the one after Home. */
const FIRST_LISTED = 1;
const MAGAZINES_LISTED = 4;

export class TablesPage extends Component<object, { readonly chosen: string }> {
  override state = { chosen: "Earth" };

  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.tables, hint: "Enter chooses; click a heading to sort" },
      h(DataTable, {
        columns: COLUMNS,
        rows: PLANETS,
        shown: PLANETS_SHOWN,
        selectable: true,
        sortable: true,
        striped: true,
        autoFocus: true,
        onChoose: (row) => {
          this.setState({ chosen: row[0] ?? "" });
        },
      }),
      h(Gap, {}),
      h(Table, {
        rows: [
          ["Chosen", this.state.chosen],
          ["Planets", String(PLANETS.length)],
        ],
        labelForeground: Colour.Cyan,
        valueForeground: Colour.White,
      }),
      h(Gap, {}),
      h(NumberedRows, {
        entries: MAGAZINES.slice(FIRST_LISTED, FIRST_LISTED + MAGAZINES_LISTED).map((magazine) => ({
          page: magazine.pages[0]?.page ?? PAGES.index,
          label: magazine.name,
          figure: magazine.pages.length,
        })),
      }),
    );
  }
}
