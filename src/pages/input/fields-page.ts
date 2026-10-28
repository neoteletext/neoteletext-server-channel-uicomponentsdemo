// Page 600, typing: text fields with placeholders, a mask, a check and a
// colour of their own, and an autocomplete over the components' names.

import { Colour } from "neoteletext-server-ts-protocol";
import { Autocomplete, type Child, Component, Gap, h, Text, TextField } from "neoteletext-server-ts-ui-components";
import { CATALOGUE } from "../../content/catalogue.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";

const NAMES = CATALOGUE.map((entry) => entry.name);
/** The longest each field takes. */
const LONGEST_NAME = 24;
const LONGEST_PASSWORD = 16;
const LONGEST_SEARCH = 16;
/** The suggestions shown at once. */
const SUGGESTIONS = 5;
/** An address: something, an at, something, a dot, something. */
const ADDRESS = /^[^@\s]+@[^@\s]+\.[^@\s]+$/u;

export class FieldsPage extends Component<object, { readonly submitted: string }> {
  override state = { submitted: "" };

  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.fields, hint: "Type; Tab or Down to the next field" },
      h(TextField, {
        label: "Name",
        longest: LONGEST_NAME,
        placeholder: "type your name",
        autoFocus: true,
        onSubmit: (submitted) => {
          this.setState({ submitted });
        },
      }),
      h(TextField, { label: "Password", longest: LONGEST_PASSWORD, masked: true, placeholder: "shown as *" }),
      h(TextField, { label: "Email", longest: LONGEST_NAME, validate: (text) => (text === "" || ADDRESS.test(text) ? null : "not an address yet") }),
      h(TextField, { label: "Locked", longest: LONGEST_PASSWORD, disabled: true, initial: "cannot change" }),
      h(TextField, { label: "Magenta", longest: LONGEST_NAME, background: Colour.Magenta, initial: "given to begin with" }),
      h(Text, { text: this.state.submitted === "" ? "Enter in the name submits it" : `Submitted: ${this.state.submitted}`, foreground: Colour.Yellow }),
      h(Gap, {}),
      h(Note, { text: "Autocomplete, over every component's name:", lines: 1 }),
      h(Autocomplete, { label: "Find", items: NAMES, shown: SUGGESTIONS, anywhere: true, longest: LONGEST_SEARCH, placeholder: "type part of a name" }),
    );
  }
}
