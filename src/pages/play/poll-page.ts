// Page 701, a live poll: one tally the whole channel shares, so a vote
// moves the bars on every viewer's screen.

import { type Child, Component, h, Poll, type Tally } from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";

export interface PollPageProps {
  readonly tally: Tally;
}

export class PollPage extends Component<PollPageProps> {
  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.poll, hint: "Up, Down, Enter to vote" },
      h(Note, { text: "Which colour should the index be? Everyone sees the votes as they come in." }),
      h(Poll, { tally: this.props.tally, autoFocus: true }),
    );
  }
}
