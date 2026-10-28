// Page 404, a countdown to the next new year, UTC.

import { Colour } from "neoteletext-server-ts-protocol";
import { type Child, Component, Countdown, Gap, h, Text } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";

export class CountdownPage extends Component {
  override render(): Child {
    const year = new Date(this.services.epochMs()).getUTCFullYear() + 1;
    return h(
      DemoFrame,
      { page: PAGES.countdown },
      h(Note, { text: `The days, hours, minutes and seconds to New Year ${year}, UTC:` }),
      h(Gap, {}),
      h(Countdown, { until: Date.UTC(year, 0, 1), foreground: Colour.Yellow }),
      h(Gap, {}),
      h(Text, { text: "Every viewer sees the one copy tick.", foreground: Colour.White }),
    );
  }
}
