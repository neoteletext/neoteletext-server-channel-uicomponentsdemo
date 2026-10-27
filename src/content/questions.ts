// The quiz's questions, about teletext.

import type { Question } from "neottx-server-ts-ui-components";

export const QUESTIONS: readonly Question[] = [
  { question: "How many rows has a teletext page?", answers: ["20", "24", "25", "40"], right: 2 },
  { question: "How many characters across?", answers: ["32", "40", "64", "80"], right: 1 },
  { question: "How many colours can text be?", answers: ["Four", "Seven", "Sixteen", "256"], right: 1 },
  { question: "Which key colour is not Fastext?", answers: ["Red", "Green", "Purple", "Cyan"], right: 2 },
  { question: "A mosaic cell holds how many sixels?", answers: ["Four", "Six", "Eight", "Nine"], right: 1 },
];
