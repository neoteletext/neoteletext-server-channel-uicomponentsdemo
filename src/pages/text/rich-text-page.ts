// Page 201, runs of styled text in one paragraph, badges to click, and
// bylines.

import { Colour } from "neottx-server-ts-protocol";
import { Badges, Byline, type Child, Component, Gap, h, RichText, Text } from "neottx-server-ts-ui-components";
import { ARTICLES } from "../../content/articles.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";

export class RichTextPage extends Component<object, { readonly clicked: string }> {
  override state = { clicked: "none yet" };

  override render(): Child {
    const press = (name: string) => (): void => {
      this.setState({ clicked: name });
    };
    return h(
      DemoFrame,
      { page: PAGES.richText },
      h(RichText, {
        runs: [
          { text: "Rich text mixes " },
          { text: "yellow", foreground: Colour.Yellow },
          { text: ", " },
          { text: "on blue", foreground: Colour.White, background: Colour.Blue },
          { text: ", " },
          { text: "flashing", foreground: Colour.Red, flash: true },
          { text: " and " },
          { text: "hidden until Reveal", foreground: Colour.Green, conceal: true },
          { text: " runs in one paragraph, wrapped as words." },
        ],
        lines: 4,
      }),
      h(Gap, {}),
      h(Note, { text: "Badges: a flashing LIVE, and chips a click acts on.", lines: 1 }),
      h(Badges, {
        badges: [
          { text: "LIVE", background: Colour.Red, flash: true },
          { text: "NEW", background: Colour.Green, foreground: Colour.Black },
        ],
        text: "on air now",
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
