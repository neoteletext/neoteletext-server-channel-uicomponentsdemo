// Page 503, paint: each viewer's own canvas of sixels to draw on with the
// pointer, kept while they are away.

import { type Child, Component, h, PaintCanvas } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

/** The canvas: the screen's width and the frame's body. */
const CANVAS_COLUMNS = 40;
const CANVAS_ROWS = 20;

export class PaintPage extends Component {
  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.paint, hint: "Drag to draw; 1-7 colour; Backspace clears" },
      h(PaintCanvas, { columns: CANVAS_COLUMNS, rows: CANVAS_ROWS, brush: true, autoFocus: true }),
    );
  }
}
