// Page 606, feedback: progress bars that fill and change colour, a line
// gauge, spinners that finish, notices of each kind, a status bar and the
// keys' help.

import { Colour } from "neottx-server-ts-protocol";
import { type Child, Component, Gap, h, KeyHelp, type Kind, LineGauge, Notice, ProgressBar, Spinner, StatusBar } from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

const PERCENT = 100;
/** How often the bars move, and how far. */
const STEP_MS = 500;
const STEP = 5;
/** Where the bar turns yellow, then red. */
const WARN_FROM = 60;
const ALARM_FROM = 85;
const LABEL_CELLS = 9;
const KINDS: readonly Kind[] = ["info", "success", "warning", "error"];

export class FeedbackPage extends Component<object, { readonly done: number }> {
  override state = { done: 0 };

  override componentDidMount(): void {
    this.setInterval(() => {
      this.setState({ done: (this.state.done + STEP) % (PERCENT + STEP) });
    }, STEP_MS);
  }

  override render(): Child {
    const { done } = this.state;
    return h(
      DemoFrame,
      { page: PAGES.feedback },
      h(ProgressBar, { label: "Loading", value: done, max: PERCENT, percent: true, labelCells: LABEL_CELLS }),
      h(ProgressBar, {
        label: "Load",
        value: done,
        max: PERCENT,
        separated: true,
        labelCells: LABEL_CELLS,
        thresholds: [
          [0, Colour.Green],
          [WARN_FROM, Colour.Yellow],
          [ALARM_FROM, Colour.Red],
        ],
      }),
      h(LineGauge, { label: "Gauge", value: done, max: PERCENT, foreground: Colour.Cyan, labelCells: LABEL_CELLS }),
      h(Spinner, { label: done >= PERCENT ? "Done" : "Working", style: "dots", done: done >= PERCENT }),
      h(Gap, {}),
      ...KINDS.map((kind) => h(Notice, { key: kind, kind, text: `A notice of kind ${kind}` })),
      h(Gap, {}),
      h(StatusBar, { segments: [{ text: "ONLINE", foreground: Colour.Green }, { text: `${done}%` }], right: "page 606", background: Colour.Blue }),
      h(KeyHelp, {
        keys: [
          ["Enter", "choose"],
          ["Tab", "next control"],
          ["Esc", "back"],
          ["Colours", "Fastext"],
        ],
        columns: 2,
      }),
    );
  }
}
