// Page 200, the text styles teletext has: colours, double height and
// width, flashing, concealed, bands, wrapped paragraphs.

import { Colour } from "neottx-server-ts-protocol";
import {
  Band,
  type Child,
  Component,
  Concealed,
  DoubleHeight,
  DoubleWidth,
  Flashing,
  Gap,
  h,
  Paragraph,
  Placeholder,
  RichText,
  Text,
} from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

/** The seven colours text can be, black being the background's. */
const INKS: readonly (readonly [string, Colour])[] = [
  ["Red", Colour.Red],
  ["Green", Colour.Green],
  ["Yellow", Colour.Yellow],
  ["Blue", Colour.Blue],
  ["Magenta", Colour.Magenta],
  ["Cyan", Colour.Cyan],
  ["White", Colour.White],
];

export class StylesPage extends Component {
  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.textStyles, hint: "Press Reveal to show the concealed line" },
      h(RichText, { runs: INKS.map(([name, foreground]) => ({ text: `${name} `, foreground })), lines: 1 }),
      h(Gap, {}),
      h(DoubleHeight, { text: "Double height", foreground: Colour.Yellow }),
      h(DoubleWidth, { text: "Double width", foreground: Colour.Cyan }),
      h(Gap, {}),
      h(Flashing, { text: "Flashing: something is new", foreground: Colour.Red }),
      h(Concealed, { text: "Concealed: the answer is 42", foreground: Colour.Green }),
      h(Text, { text: "Centred in its box", foreground: Colour.Magenta, centre: true }),
      h(Gap, {}),
      h(Band, { text: "A BAND, AS SECTIONS ARE HEADED", background: Colour.Blue, foreground: Colour.White }),
      h(Paragraph, {
        text: "A paragraph wraps its words to the box it is given and cuts the last line it may take with an ellipsis, so a long text never runs off the page however much there is of it.",
        lines: 3,
      }),
      h(Gap, {}),
      h(Placeholder, { text: "A placeholder, for what is not there yet" }),
    );
  }
}
