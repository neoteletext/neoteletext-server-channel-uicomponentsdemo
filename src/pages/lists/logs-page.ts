// Page 306, a log that fills as the page runs, and text to scroll.

import { Colour } from "neoteletext-server-ts-protocol";
import { type Child, Component, Gap, h, type Line, type LogEntry, type LogLevel, LogView, ScrollingText } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";

/** How often a line is logged. */
const LOG_EVERY_MS = 3_000;
/** The lines kept: the log is bounded however long the page runs. */
const MOST_ENTRIES = 50;
const LOG_SHOWN = 6;
const TEXT_SHOWN = 7;
/** Enough lines to scroll through several times over. */
const TEXT_LINES = 30;
const SAID: readonly (readonly [LogLevel, string])[] = [
  ["info", "page 100 published"],
  ["debug", "viewer pressed Down"],
  ["warning", "a picture is missing"],
  ["info", "viewer joined"],
  ["error", "a clip did not decode"],
];
const LINES: readonly Line[] = Array.from({ length: TEXT_LINES }, (_, index) => ({
  foreground: index % 2 === 0 ? Colour.White : Colour.Cyan,
  text: `Line ${index + 1} of the scrolling text`,
}));

export class LogsPage extends Component<object, { readonly entries: readonly LogEntry[] }> {
  override state: { readonly entries: readonly LogEntry[] } = { entries: [] };

  override componentDidMount(): void {
    this.setInterval(() => {
      const [level, text] = SAID[this.state.entries.length % SAID.length] ?? ["info", ""];
      this.setState({ entries: [...this.state.entries, { at: this.services.epochMs(), level, text }].slice(-MOST_ENTRIES) });
    }, LOG_EVERY_MS);
  }

  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.logs, hint: "Up and Down scroll; Tab to the other" },
      h(Note, { text: "A log, a line every three seconds:", lines: 1 }),
      h(LogView, { entries: this.state.entries, shown: LOG_SHOWN, empty: "Nothing logged yet" }),
      h(Gap, {}),
      h(Note, { text: "Text to scroll, with its bar:", lines: 1 }),
      h(ScrollingText, { lines: LINES, shown: TEXT_SHOWN, autoFocus: true }),
    );
  }
}
