// Page 605, a wizard: steps in turn, each ready only when its part is
// done, and a summary at the end.

import { Colour } from "neoteletext-server-ts-protocol";
import { type Child, Component, h, Paragraph, RadioGroup, Switch, TextField, Wizard } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { setterOf } from "../../parts/setter.ts";
import { PAGES } from "../../site/page-numbers.ts";

const STEPS = ["Name", "Size", "Extras", "Check"];
const SIZES = ["Small", "Medium", "Large"];
const LONGEST_NAME = 20;
/** The step that needs a name before it is ready. */
const NAME_STEP = 0;

interface WizardState {
  readonly name: string;
  readonly size: number;
  readonly wrapped: boolean;
}

export class WizardPage extends Component<object, WizardState> {
  override state: WizardState = { name: "", size: 0, wrapped: false };

  override render(): Child {
    const { name, size, wrapped } = this.state;
    return h(
      DemoFrame,
      { page: PAGES.wizard, hint: "Enter goes on; Escape goes back" },
      h(
        Wizard,
        { steps: STEPS, autoFocus: true, ready: (step) => (step === NAME_STEP && name.trim() === "" ? "Type a name first" : null) },
        h(TextField, {
          label: "Name",
          longest: LONGEST_NAME,
          value: name,
          onChange: setterOf(this, "name"),
        }),
        h(RadioGroup, {
          items: SIZES,
          value: size,
          onChange: setterOf(this, "size"),
        }),
        h(Switch, {
          label: "Gift wrapped",
          value: wrapped,
          onChange: setterOf(this, "wrapped"),
        }),
        h(Paragraph, { text: `${name}: ${SIZES[size] ?? ""}${wrapped ? ", gift wrapped" : ""}. Enter finishes.`, foreground: Colour.Yellow }),
      ),
    );
  }
}
