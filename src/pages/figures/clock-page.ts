// Page 403, the time: a clock, the date in each of the library's formats,
// and the time in large digits that move each second.

import { Colour } from "neottx-server-ts-protocol";
import { BigDigits, type Child, Clock, Component, DATE_FORMATS, DateText, Gap, h, Table, formatDate } from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

const SECOND_MS = 1_000;
/** The label column of the formats' table. */
const LABEL_CELLS = 10;

export class ClockPage extends Component<object, { readonly now: number }> {
  override state = { now: 0 };

  override componentDidMount(): void {
    this.setState({ now: this.services.epochMs() });
    this.setInterval(() => {
      this.setState({ now: this.services.epochMs() });
    }, SECOND_MS);
  }

  override render(): Child {
    const { now } = this.state;
    return h(
      DemoFrame,
      { page: PAGES.clock },
      h(Clock, { foreground: Colour.Yellow, seconds: true }),
      h(Gap, {}),
      h(BigDigits, { text: formatDate(now, DATE_FORMATS.time), foreground: Colour.Cyan }),
      h(Gap, {}),
      h(Table, {
        rows: Object.entries(DATE_FORMATS).map(([name, pattern]) => [name, formatDate(now, pattern)] as const),
        labelCells: LABEL_CELLS,
        labelForeground: Colour.Cyan,
      }),
      h(Gap, {}),
      h(DateText, { value: now, pattern: DATE_FORMATS.weekday, foreground: Colour.Green, centre: true }),
    );
  }
}
