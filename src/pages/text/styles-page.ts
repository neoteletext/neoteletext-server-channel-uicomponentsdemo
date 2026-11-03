// Page 200, the text styles teletext has: colours, double height and
// width, flashing, concealed, bands, wrapped paragraphs.

import { Colour } from "neoteletext-server-ts-protocol";
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
} from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";
import { samplerFor } from "../languages/sample-text.ts";

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
    // In the viewer's language, each style shows a word of the Declaration, its sentences and its title (REQ-2218 item 2).
    const sampler = samplerFor(this.services);
    const { display } = sampler;
    const word = (english: string, place: number): string => sampler.text(english, (sample) => sample.words[place % sample.words.length] ?? sample.own);
    return h(
      DemoFrame,
      { page: PAGES.textStyles, hint: "Press Reveal to show the concealed line" },
      h(RichText, {
        runs: sampler
          .list(
            INKS.map(([name]) => name),
            (sample) => sample.words,
          )
          .map((text, place) => ({ text: `${text} `, foreground: INKS[place]?.[1] ?? Colour.White })),
        lines: 1,
        ...display,
      }),
      h(Gap, {}),
      h(DoubleHeight, { text: sampler.text("Double height", (sample) => sample.own), foreground: Colour.Yellow, ...display }),
      h(DoubleWidth, { text: word("Double width", 0), foreground: Colour.Cyan, ...display }),
      h(Gap, {}),
      h(Flashing, { text: sampler.text("Flashing: something is new", (sample) => sample.headline), foreground: Colour.Red, ...display }),
      h(Concealed, { text: sampler.text("Concealed: the answer is 42", (sample) => sample.letters.join(" ")), foreground: Colour.Green, ...display }),
      h(Text, { text: word("Centred in its box", 1), foreground: Colour.Magenta, centre: true, ...display }),
      h(Gap, {}),
      h(Band, {
        text: sampler.text("A BAND, AS SECTIONS ARE HEADED", (sample) => sample.headline),
        background: Colour.Blue,
        foreground: Colour.White,
        ...display,
      }),
      h(Paragraph, {
        text: sampler.text(
          "A paragraph wraps its words to the box it is given and cuts the last line it may take with an ellipsis, so a long text never runs off the page however much there is of it.",
          (sample) => sample.sentences.join(" "),
        ),
        lines: 3,
        ...display,
      }),
      h(Gap, {}),
      h(Placeholder, { text: sampler.text("A placeholder, for what is not there yet", (sample) => sample.sentences.at(-1) ?? sample.own), ...display }),
    );
  }
}
