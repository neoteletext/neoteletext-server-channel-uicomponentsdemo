// Magazine 6, input and feedback.

import { h, type PageSpec } from "neoteletext-server-ts-ui-components";
import { ChoicesPage } from "../../pages/input/choices-page.ts";
import { DialogsPage } from "../../pages/input/dialogs-page.ts";
import { FeedbackPage } from "../../pages/input/feedback-page.ts";
import { FieldsPage } from "../../pages/input/fields-page.ts";
import { FormPage } from "../../pages/input/form-page.ts";
import { NumbersPage } from "../../pages/input/numbers-page.ts";
import { WizardPage } from "../../pages/input/wizard-page.ts";
import { PAGES } from "../page-numbers.ts";
import { OWN, OWN_TYPING, spec } from "../spec.ts";

export function inputPages(): PageSpec[] {
  return [
    spec(PAGES.fields, () => h(FieldsPage, {}), OWN_TYPING),
    spec(PAGES.choices, () => h(ChoicesPage, {}), OWN),
    spec(PAGES.numbers, () => h(NumbersPage, {}), OWN_TYPING),
    spec(PAGES.form, () => h(FormPage, {}), OWN_TYPING),
    spec(PAGES.dialogs, () => h(DialogsPage, {}), OWN_TYPING),
    spec(PAGES.wizard, () => h(WizardPage, {}), OWN_TYPING),
    spec(PAGES.feedback, () => h(FeedbackPage, {})),
  ];
}
