// The sample magazine's articles: a few stories about teletext and this
// library, for the components that show articles (headlines, documents,
// stories, the roulette), each on a page of its own from PAGES.firstStory.

import type { Article } from "neoteletext-server-ts-ui-components";
import { PAGES } from "../site/page-numbers.ts";

/** An article with the line the front page's ticker runs. */
export interface SampleArticle extends Article {
  readonly summary: string;
}

export const ARTICLES: readonly SampleArticle[] = [
  {
    page: PAGES.firstStory + 0,
    title: "Teletext lives on in the browser",
    writer: "Ada Ceefax",
    date: Date.UTC(2026, 9, 27),
    summary: "Twenty-five rows of forty characters, eight colours and mosaics: the old screen, served live to anyone with a browser.",
    tags: ["teletext", "web"],
    blocks: [
      {
        kind: "paragraph",
        text: "The pages arrive as TTI, the same format the broadcasters kept their magazines in, and the browser draws them cell by cell.",
      },
      { kind: "heading", text: "What changed" },
      {
        kind: "paragraph",
        text: "The pages are no longer a carousel. A viewer types a number and the page is there at once; a click on a link goes to its page.",
      },
      { kind: "quote", text: "It is the same screen, but it answers you now." },
      { kind: "paragraph", text: "Channels are programs: they publish pages and hear the keys and the pointer, over standard input and output." },
    ],
  },
  {
    page: PAGES.firstStory + 1,
    title: "Components come to teletext",
    writer: "Bill Oracle",
    date: Date.UTC(2026, 9, 26),
    summary: "A page is a tree of class components, as on the web: each renders elements, and the library lays them out and routes the keys.",
    tags: ["library", "components"],
    blocks: [
      { kind: "paragraph", text: "Every component is a class with props and state. setState draws the page again, and only what changed is published." },
      { kind: "heading", text: "In the box" },
      { kind: "item", text: "Layout: rows, columns, grids, layers, panels." },
      { kind: "item", text: "Input: fields, buttons, boxes, radios, sliders." },
      { kind: "item", text: "Figures: bars, columns, lines, heat maps." },
      { kind: "item", text: "Play: quizzes, polls, roulette, snake." },
      { kind: "paragraph", text: "A viewer's own copy of a page is published only while it differs from everyone's." },
    ],
  },
  {
    page: PAGES.firstStory + 2,
    title: "Mosaics: a picture in sixels",
    writer: "Ada Ceefax",
    date: Date.UTC(2026, 9, 24),
    summary: "Each cell is two sixels across and three down. A bitmap of hashes becomes a mosaic, in the colour of the cell before it.",
    tags: ["graphics"],
    blocks: [
      { kind: "paragraph", text: "Mosaic graphics were teletext's pictures: blocky, bright, and cheap to send. The library draws them from rows of text." },
      { kind: "paragraph", text: "Converted pictures go further, with the enhancement levels' extra colours where a decoder has them." },
    ],
  },
  {
    page: PAGES.firstStory + 3,
    title: "Vote now: the best page colour",
    writer: "Pat Prestel",
    date: Date.UTC(2026, 9, 21),
    summary: "The live poll counts every viewer's vote and shows the tally to all of them as it changes.",
    tags: ["poll", "play"],
    blocks: [
      { kind: "paragraph", text: "A poll's tally is shared: one viewer's vote moves the bars on every screen with the page open." },
      { kind: "paragraph", text: "A vote is kept while the viewer is on the channel, so coming back to the page does not cast it again." },
    ],
  },
  {
    page: PAGES.firstStory + 4,
    title: "Fastext: four keys to anywhere",
    writer: "Bill Oracle",
    date: Date.UTC(2026, 9, 19),
    summary: "Red, green, yellow and cyan: the four prompts at the foot of the page, and the keys on the remote that follow them.",
    tags: ["navigation"],
    blocks: [
      { kind: "paragraph", text: "On this channel green always goes on to the next page, so a viewer can walk every page of the demo on one key." },
      { kind: "paragraph", text: "Red goes back, yellow to the next magazine, and cyan to the index." },
    ],
  },
];
