// Page 602, numbers: sliders, filled and with a unit, and a number to step.

import { Colour } from "neoteletext-server-ts-protocol";
import { type Child, Component, Gap, h, NumberInput, Slider, Text } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { setterOf } from "../../parts/setter.ts";
import { PAGES } from "../../site/page-numbers.ts";

const PERCENT = 100;
const VOLUME_STEP = 5;
/** Degrees Celsius a room is kept between. */
const COLDEST = 10;
const WARMEST = 30;
const MOST_TICKETS = 9;

interface NumbersState {
  readonly volume: number;
  readonly warmth: number;
  readonly tickets: number;
}

export class NumbersPage extends Component<object, NumbersState> {
  override state: NumbersState = { volume: 40, warmth: 20, tickets: 2 };

  override render(): Child {
    const { volume, warmth, tickets } = this.state;
    return h(
      DemoFrame,
      { page: PAGES.numbers, hint: "Left and Right change; Up and Down move" },
      h(Slider, {
        label: "Volume",
        min: 0,
        max: PERCENT,
        step: VOLUME_STEP,
        value: volume,
        filled: true,
        unit: "%",
        autoFocus: true,
        onChange: setterOf(this, "volume"),
      }),
      h(Slider, {
        label: "Warmth",
        min: COLDEST,
        max: WARMEST,
        value: warmth,
        unit: "C",
        foreground: Colour.Red,
        onChange: setterOf(this, "warmth"),
      }),
      h(Slider, { label: "Locked", min: 0, max: PERCENT, initial: PERCENT / 2, disabled: true }),
      h(Gap, {}),
      h(NumberInput, {
        label: "Tickets",
        min: 1,
        max: MOST_TICKETS,
        value: tickets,
        onChange: setterOf(this, "tickets"),
      }),
      h(Gap, {}),
      h(Text, { text: `Volume ${volume}%, ${warmth} C, ${tickets} tickets`, foreground: Colour.Yellow }),
    );
  }
}
