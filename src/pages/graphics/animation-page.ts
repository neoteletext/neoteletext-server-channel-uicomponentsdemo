// Page 504, things that move: a bouncer every viewer shares, a wheel that
// turns, and spinners in each style.

import { Colour } from "neottx-server-ts-protocol";
import { At, Bouncer, type Child, Component, h, Layers, Spinner, type SpinnerStyle, Wheel } from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

/** Five frames a second. */
const FRAME_MS = 200;
/** The wheel's segments. */
const SEGMENTS = 12;
/** Where the wheel sits, and the spinners beside it. */
const WHEEL_ROWS = 11;
const SPINNER_COLUMN = 24;
const BOUNCER_ROWS = 8;
const STYLES: readonly SpinnerStyle[] = ["orbit", "bounce", "fill", "dots"];
const INKS = [Colour.Yellow, Colour.Green, Colour.Cyan, Colour.Magenta];

export class AnimationPage extends Component<object, { readonly lit: number }> {
  override state = { lit: 0 };

  override componentDidMount(): void {
    this.setInterval(() => {
      this.setState({ lit: (this.state.lit + 1) % SEGMENTS });
    }, FRAME_MS);
  }

  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.animation },
      h(Bouncer, { everyMs: FRAME_MS, height: BOUNCER_ROWS }),
      h(
        Layers,
        { height: WHEEL_ROWS },
        h(At, { row: 0, column: 1, rows: WHEEL_ROWS }, h(Wheel, { lit: this.state.lit, segments: SEGMENTS })),
        ...STYLES.map((style, place) =>
          h(At, { key: style, row: place * 2, column: SPINNER_COLUMN, rows: 1 }, h(Spinner, { label: style, style, foreground: INKS[place] ?? Colour.White })),
        ),
      ),
    );
  }
}
