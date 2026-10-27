// Page 103, a greeting: each viewer's own copy of the page, which greets
// them by the name they type.

import { Colour } from "neottx-server-ts-protocol";
import { type Child, Component, DoubleHeight, Gap, h, Paragraph, TextField } from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";

/** The longest name taken. */
const LONGEST_NAME = 20;

export class GreetingPage extends Component<object, { readonly name: string }> {
  override state = { name: "" };

  override render(): Child {
    const { name } = this.state;
    return h(
      DemoFrame,
      { page: PAGES.greeting, hint: "Type your name, then Enter" },
      h(Note, { text: "This page is your own: what you type here no other viewer sees." }),
      h(Gap, {}),
      h(TextField, {
        label: "Name",
        longest: LONGEST_NAME,
        placeholder: "your name",
        autoFocus: true,
        onSubmit: (typed) => {
          this.setState({ name: typed.trim() });
        },
      }),
      h(Gap, {}),
      name === ""
        ? h(Paragraph, { text: "Nobody greeted yet.", foreground: Colour.White })
        : h(DoubleHeight, { text: `Hello, ${name}!`, foreground: Colour.Yellow }),
    );
  }
}
