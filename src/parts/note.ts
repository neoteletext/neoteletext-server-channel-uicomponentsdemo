// A line or two saying what a part of a page shows, in the channel's
// caption colour.

import { Colour } from "neoteletext-server-ts-protocol";
import { type Child, Component, h, Paragraph } from "neoteletext-server-ts-ui-components";

export interface NoteProps {
  readonly text: string;
  /** At most this many lines; two when absent. */
  readonly lines?: number;
}

/** The lines a note takes when not told. */
const NOTE_LINES = 2;

export class Note extends Component<NoteProps> {
  override render(): Child {
    return h(Paragraph, { text: this.props.text, foreground: Colour.Cyan, lines: this.props.lines ?? NOTE_LINES });
  }
}
