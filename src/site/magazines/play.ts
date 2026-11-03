// Magazine 7, play: a quiz, a poll every viewer shares, roulette, snake,
// sounds.

import { h, type PageSpec, Tally } from "neoteletext-server-ts-ui-components";
import { PollPage } from "../../pages/play/poll-page.ts";
import { QuizPage } from "../../pages/play/quiz-page.ts";
import { RoulettePage } from "../../pages/play/roulette-page.ts";
import { SnakePage } from "../../pages/play/snake-page.ts";
import { SoundsPage } from "../../pages/play/sounds-page.ts";
import { PAGES } from "../page-numbers.ts";
import { OWN, spec } from "../spec.ts";

const POLL_COLOURS = ["Red", "Green", "Yellow", "Blue", "Magenta", "Cyan"];

export function playPages(): PageSpec[] {
  // One tally for the channel: every viewer's copy of the poll counts into it.
  const tally = new Tally("Index colour", POLL_COLOURS);
  return [
    spec(PAGES.quiz, () => h(QuizPage, {}), OWN),
    spec(PAGES.poll, () => h(PollPage, { tally }), OWN),
    spec(PAGES.roulette, () => h(RoulettePage, {}), OWN),
    spec(PAGES.snake, () => h(SnakePage, {}), OWN),
    spec(PAGES.sounds, () => h(SoundsPage, {}), OWN),
  ];
}
