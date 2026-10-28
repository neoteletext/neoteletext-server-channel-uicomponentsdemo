// Page 703, snake: each viewer's own game, on the arrows.

import { type Child, Component, h, Snake } from "neoteletext-server-ts-ui-components";
import { SOUNDS } from "../../assets/sounds.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

/** A step every fifth of a second, on the frame's body less its score line. */
const STEP_MS = 200;
const FIELD_ROWS = 19;

export class SnakePage extends Component {
  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.snake, hint: "Arrows steer; Enter starts again" },
      h(Snake, { everyMs: STEP_MS, rows: FIELD_ROWS, eat: SOUNDS.eat, crash: SOUNDS.crash, autoFocus: true }),
    );
  }
}
