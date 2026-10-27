// Page 700, a quiz: four answers to each question, chosen by colour key or
// click, with a sound for right and wrong. Each viewer's own.

import { type Child, Component, h, Quiz } from "neottx-server-ts-ui-components";
import { SOUNDS } from "../../assets/sounds.ts";
import { QUESTIONS } from "../../content/questions.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

export class QuizPage extends Component {
  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.quiz, hint: "Up, Down, Enter, or click an answer" },
      h(Quiz, { questions: QUESTIONS, right: SOUNDS.right, wrong: SOUNDS.wrong, autoFocus: true }),
    );
  }
}
