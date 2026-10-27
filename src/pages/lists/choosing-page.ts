// Page 304, lists to choose from: one item (ChoiceList), or several
// (ToggleList).

import { Colour } from "neottx-server-ts-protocol";
import { type Child, ChoiceList, Component, Gap, h, Text, ToggleList } from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { setterOf } from "../../parts/setter.ts";
import { PAGES } from "../../site/page-numbers.ts";

const FRUIT = ["Apples", "Bananas", "Cherries", "Dates", "Elderberries", "Figs", "Grapes", "Honeydew", "Kiwis", "Lemons"];
const TOPPINGS = ["Cream", "Custard", "Ice cream", "Honey", "Nuts"];
/** The rows each list shows. */
const FRUIT_SHOWN = 6;
const TOPPINGS_SHOWN = 5;

export class ChoosingPage extends Component<object, { readonly fruit: number | null; readonly toppings: readonly number[] }> {
  override state: { readonly fruit: number | null; readonly toppings: readonly number[] } = { fruit: null, toppings: [] };

  override render(): Child {
    const { fruit, toppings } = this.state;
    const chosen = fruit === null ? "none" : (FRUIT[fruit] ?? "none");
    return h(
      DemoFrame,
      { page: PAGES.choosing, hint: "Up, Down, Enter; Tab to the next list" },
      h(Note, { text: "Choose one: it scrolls.", lines: 1 }),
      h(ChoiceList, {
        items: FRUIT,
        shown: FRUIT_SHOWN,
        autoFocus: true,
        onChoose: (index) => {
          this.setState({ fruit: index });
        },
      }),
      h(Gap, {}),
      h(Note, { text: "Choose several: Enter ticks.", lines: 1 }),
      h(ToggleList, {
        items: TOPPINGS,
        height: TOPPINGS_SHOWN,
        value: toppings,
        onChange: setterOf(this, "toppings"),
      }),
      h(Gap, {}),
      h(Text, {
        text: `${chosen} with ${toppings.length === 0 ? "nothing" : toppings.map((index) => TOPPINGS[index] ?? "").join(", ")}`,
        foreground: Colour.Yellow,
      }),
    );
  }
}
