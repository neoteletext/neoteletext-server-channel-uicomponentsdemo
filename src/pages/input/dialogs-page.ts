// Page 604, dialogs over the page: an alert, a confirmation, a prompt with
// a field, and a wait that closes itself. A dialog keeps the keys until it
// is answered.

import { Colour } from "neoteletext-server-ts-protocol";
import {
  Button,
  type Child,
  Columns,
  Component,
  Dialog,
  type Element,
  Gap,
  h,
  Modal,
  Paragraph,
  Spinner,
  TextField,
} from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { setterOf } from "../../parts/setter.ts";
import { PAGES } from "../../site/page-numbers.ts";

type Open = "none" | "alert" | "confirm" | "prompt" | "busy";

/** How long the wait lasts before it closes itself. */
const BUSY_MS = 4_000;
/** The row of the frame's body the dialog is drawn from. */
const DIALOG_ROW = 4;
const LONGEST_NAME = 20;

interface DialogsState {
  readonly open: Open;
  readonly said: string;
  readonly typed: string;
}

export class DialogsPage extends Component<object, DialogsState> {
  override state: DialogsState = { open: "none", said: "Nothing answered yet", typed: "" };

  #close(said: string): void {
    this.setState({ open: "none", said });
  }

  /** What a dialog's answer does: the first button says `yes`; any other, or Escape, `no`. */
  #answered(yes: string, no: string): (button: number | null) => void {
    return (button) => {
      this.#close(button === 0 ? yes : no);
    };
  }

  #dialog(): Element | null {
    const { open, typed } = this.state;
    if (open === "alert") {
      return h(Dialog, { title: "Saved", kind: "success", message: "The page was saved.", buttons: ["OK"], onAnswer: this.#answered("OK", "Escaped") });
    }
    if (open === "confirm") {
      return h(Dialog, {
        title: "Delete page 304?",
        kind: "warning",
        message: "It cannot be had back.",
        buttons: ["Delete", "Keep it"],
        initial: 1,
        onAnswer: this.#answered("Deleted", "Kept"),
      });
    }
    if (open === "prompt") {
      return h(
        Dialog,
        {
          title: "Rename the page",
          message: "Type its new name, then Enter.",
          buttons: ["Rename", "Cancel"],
          childFirst: true,
          onAnswer: this.#answered(`Renamed to "${typed}"`, "Not renamed"),
        },
        h(TextField, {
          longest: LONGEST_NAME,
          autoFocus: true,
          value: typed,
          onChange: setterOf(this, "typed"),
        }),
      );
    }
    if (open === "busy") {
      return h(
        Dialog,
        { title: "Please wait", kind: "info", message: "Working on it; it closes itself.", onAnswer: this.#answered("Escaped the wait", "Escaped the wait") },
        h(Spinner, { label: "Working", style: "orbit" }),
      );
    }
    return null;
  }

  #opener(open: Open): () => void {
    return () => {
      this.setState({ open });
      if (open === "busy") {
        this.setTimeout(() => {
          this.#close("The work finished");
        }, BUSY_MS);
      }
    };
  }

  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.dialogs, hint: "Enter opens; Escape shuts a dialog" },
      h(
        Modal,
        { dialog: this.#dialog(), row: DIALOG_ROW },
        h(Paragraph, { text: "Each button opens a dialog over the page." }),
        h(Gap, {}),
        h(
          Columns,
          { height: 1 },
          h(Button, { label: "Alert", autoFocus: true, onPress: this.#opener("alert") }),
          h(Button, { label: "Confirm", background: Colour.Red, onPress: this.#opener("confirm") }),
        ),
        h(Gap, {}),
        h(
          Columns,
          { height: 1 },
          h(Button, { label: "Prompt", background: Colour.Green, onPress: this.#opener("prompt") }),
          h(Button, { label: "Busy", background: Colour.Magenta, onPress: this.#opener("busy") }),
        ),
        h(Gap, {}),
        h(Paragraph, { text: `Answer: ${this.state.said}`, foreground: Colour.Yellow }),
      ),
    );
  }
}
