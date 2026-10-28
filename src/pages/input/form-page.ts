// Page 603, a form: labelled fields, a button that sends it and a toast
// that says so, and actions a click acts on. Each viewer's own copy.

import { Colour } from "neoteletext-server-ts-protocol";
import {
  Action,
  Button,
  type Child,
  Checkbox,
  Columns,
  Component,
  Field,
  Gap,
  h,
  RadioGroup,
  Text,
  TextField,
  type Ticked,
  ToastShelf,
} from "neoteletext-server-ts-ui-components";
import { SOUNDS } from "../../assets/sounds.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { setterOf } from "../../parts/setter.ts";
import { PAGES } from "../../site/page-numbers.ts";

const PLANS = ["Free", "Club", "Gold"];
const LONGEST_NAME = 20;
/** How long the toast stays. */
const TOAST_MS = 4_000;

interface FormState {
  readonly name: string;
  readonly plan: number;
  readonly news: boolean;
  readonly sent: number;
}

export class FormPage extends Component<object, FormState> {
  override state: FormState = { name: "", plan: 0, news: false, sent: 0 };

  readonly #send = (session: number): void => {
    const { name, plan } = this.state;
    if (name.trim() === "") {
      this.services.bus.emit("toast", { kind: "error", text: "A name, please" }, { session });
      return;
    }
    this.setState({ sent: this.state.sent + 1 });
    this.services.bus.emit("toast", { kind: "success", text: `Thank you, ${name.trim()}: ${PLANS[plan] ?? ""}` }, { session });
  };

  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.form, hint: "Tab moves; Enter on Send sends" },
      this.#fields(),
      h(Gap, {}),
      this.#buttons(),
      h(Gap, {}),
      h(Action, { text: "> Or click here to send", foreground: Colour.Cyan, onPress: this.#send }),
      h(Text, { text: `Sent ${this.state.sent} times`, foreground: Colour.Yellow }),
      h(Gap, { rows: 0, grow: 1 }),
      h(ToastShelf, { maxShown: 1, forMs: TOAST_MS }),
    );
  }

  #fields(): Child {
    const { name, plan, news } = this.state;
    return [
      h(
        Field,
        { label: "Name" },
        h(TextField, { longest: LONGEST_NAME, value: name, placeholder: "your name", autoFocus: true, onChange: setterOf(this, "name") }),
      ),
      h(Field, { label: "Plan" }, h(RadioGroup, { items: PLANS, across: true, value: plan, onChange: setterOf(this, "plan") })),
      h(Field, { label: "", note: "once a month" }, h(Checkbox, { label: "Send me the newsletter", value: news, onChange: this.#newsletter })),
    ];
  }

  #buttons(): Child {
    return h(
      Columns,
      { height: 1 },
      h(Button, { label: "Send", sounds: { choose: SOUNDS.click }, onPress: this.#send }),
      h(Button, { label: "Clear", background: Colour.Red, onPress: this.#clear }),
    );
  }

  readonly #newsletter = (ticked: Ticked): void => {
    this.setState({ news: ticked === true });
  };

  readonly #clear = (): void => {
    this.setState({ name: "", plan: 0, news: false });
  };
}
