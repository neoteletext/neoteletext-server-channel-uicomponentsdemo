// Page 601, controls that choose: a check box with its mixed state, a
// group of them, radios down and across, switches, and a select.

import { Colour } from "neoteletext-server-ts-protocol";
import { type Child, Checkbox, CheckboxGroup, Component, Gap, h, RadioGroup, Select, Switch, Text, type Ticked } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { setterOf } from "../../parts/setter.ts";
import { PAGES } from "../../site/page-numbers.ts";

const SIZES = ["Small", "Medium", "Large"];
const EXTRAS = ["Cheese", "Onion", "Pickle", "Tomato"];
const DRINKS = ["Tea", "Coffee", "Cocoa", "Water", "Juice"];
/** The select's choices shown once it is open. */
const DRINKS_SHOWN = 4;

interface ChoicesState {
  readonly all: Ticked;
  readonly extras: readonly number[];
  readonly size: number;
  readonly drink: number;
  readonly fast: boolean;
}

export class ChoicesPage extends Component<object, ChoicesState> {
  override state: ChoicesState = { all: "mixed", extras: [0], size: 1, drink: 0, fast: true };

  override render(): Child {
    const { all, extras, size, drink, fast } = this.state;
    return h(
      DemoFrame,
      { page: PAGES.choices, hint: "Up and Down move; Enter or Space change" },
      h(Checkbox, {
        label: "Everything (mixed until chosen)",
        value: all,
        autoFocus: true,
        onChange: (value) => {
          this.setState({ all: value, extras: value === true ? EXTRAS.map((_, index) => index) : [] });
        },
      }),
      h(CheckboxGroup, {
        items: EXTRAS,
        columns: 2,
        value: extras,
        disabledItems: [],
        onChange: (value) => {
          this.setState({ extras: value, all: value.length === EXTRAS.length || (value.length === 0 ? false : "mixed") });
        },
      }),
      h(Gap, {}),
      h(RadioGroup, {
        items: SIZES,
        across: true,
        value: size,
        onChange: setterOf(this, "size"),
      }),
      h(RadioGroup, { items: ["Eat in", "Take away"], initial: 0 }),
      h(Gap, {}),
      h(Switch, {
        label: "Fast delivery",
        value: fast,
        onChange: setterOf(this, "fast"),
      }),
      h(Switch, { label: "Locked", initial: false, disabled: true }),
      h(Select, {
        label: "Drink",
        items: DRINKS,
        shown: DRINKS_SHOWN,
        value: drink,
        onChange: setterOf(this, "drink"),
      }),
      h(Gap, {}),
      h(Text, { text: `${SIZES[size] ?? ""}, ${extras.length} extras, ${DRINKS[drink] ?? ""}${fast ? ", fast" : ""}`, foreground: Colour.Yellow }),
    );
  }
}
