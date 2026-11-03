// Page 201, runs of styled text in one paragraph, badges to click, and
// bylines.

import { Colour } from "neoteletext-server-ts-protocol";
import { Badges, Byline, type Child, Component, Gap, h, RichText, type Run, Text } from "neoteletext-server-ts-ui-components";
import { ARTICLES } from "../../content/articles.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";
import { type Sampler, samplerFor } from "../languages/sample-text.ts";

/** The rich text's runs: in the viewer's language, words of the Declaration in each style; rich text gives a line one row, so Thai and Lao keep the English. */
function richRuns(sampler: Sampler): Run[] {
  const [mixes = "", yellow = "", blue = "", flashing = "", hidden = "", rest = ""] = sampler.controlList(
    ["Rich text mixes", "yellow", "on blue", "flashing", "hidden until Reveal", "runs in one paragraph, wrapped as words."],
    (sample) => sample.words,
  );
  return [
    { text: `${mixes} ` },
    { text: yellow, foreground: Colour.Yellow },
    { text: ", " },
    { text: blue, foreground: Colour.White, background: Colour.Blue },
    { text: ", " },
    { text: flashing, foreground: Colour.Red, flash: true },
    { text: sampler.sample === null ? " and " : " " },
    { text: hidden, foreground: Colour.Green, conceal: true },
    { text: ` ${rest}` },
  ];
}

export class RichTextPage extends Component<object, { readonly clicked: string }> {
  override state = { clicked: "none yet" };

  override render(): Child {
    const press = (name: string) => (): void => {
      this.setState({ clicked: name });
    };
    // In the viewer's language, the styled runs are words of the Declaration and the badge's text its title (REQ-2218 item 2).
    const sampler = samplerFor(this.services);
    return h(
      DemoFrame,
      { page: PAGES.richText },
      h(RichText, {
        runs: richRuns(sampler),
        lines: 4,
        ...sampler.control,
      }),
      h(Gap, {}),
      h(Note, { text: "Badges: a flashing LIVE, and chips a click acts on.", lines: 1 }),
      h(Badges, {
        badges: [
          { text: "LIVE", background: Colour.Red, flash: true },
          { text: "NEW", background: Colour.Green, foreground: Colour.Black },
        ],
        text: sampler.controlText("on air now", (sample) => sample.headline),
        ...sampler.control,
      }),
      h(Badges, {
        badges: [
          { text: "Red", background: Colour.Red, onPress: press("Red") },
          { text: "Green", background: Colour.Green, foreground: Colour.Black, onPress: press("Green") },
          { text: "Blue", background: Colour.Blue, onPress: press("Blue") },
        ],
      }),
      h(Text, { text: `Badge clicked: ${this.state.clicked}`, foreground: Colour.Yellow }),
      h(Gap, {}),
      h(Note, { text: "Bylines: writer, date and labels.", lines: 1 }),
      ...ARTICLES.slice(0, 3).map((article) => h(Byline, { key: article.page, writer: article.writer, date: article.date, labels: article.tags })),
    );
  }
}
