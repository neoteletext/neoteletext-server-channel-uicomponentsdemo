// The channel's map: its magazines, in order, and each one's pages with
// their titles. The index, every frame's Fastext prompts and the tests read
// it, so a page is named once.

import { ARTICLES } from "../content/articles.ts";
import { type Look, LOOKS } from "./looks.ts";
import { PAGES } from "./page-numbers.ts";

/** A page of the map: its number, its title, and the short name its Fastext prompt shows. */
export interface MapEntry {
  readonly page: number;
  readonly title: string;
  readonly short: string;
}

export interface Magazine {
  readonly name: string;
  readonly look: Look;
  readonly pages: readonly MapEntry[];
}

export const MAGAZINES: readonly Magazine[] = [
  {
    name: "Home",
    look: LOOKS.home,
    pages: [
      { page: PAGES.index, title: "UI components demo", short: "Index" },
      { page: PAGES.components, title: "Components A to Z", short: "A to Z" },
      { page: PAGES.how, title: "How it works", short: "How" },
      { page: PAGES.greeting, title: "A greeting", short: "Greeting" },
    ],
  },
  {
    name: "Text",
    look: LOOKS.text,
    pages: [
      { page: PAGES.textStyles, title: "Text styles", short: "Styles" },
      { page: PAGES.richText, title: "Rich text and badges", short: "Rich" },
      { page: PAGES.news, title: "Headlines and news", short: "News" },
      { page: PAGES.layout, title: "Layout", short: "Layout" },
      { page: PAGES.panels, title: "Panels and rules", short: "Panels" },
    ],
  },
  {
    name: "Lists",
    look: LOOKS.lists,
    pages: [
      { page: PAGES.tabs, title: "Tabs", short: "Tabs" },
      { page: PAGES.menus, title: "Menus and breadcrumbs", short: "Menus" },
      { page: PAGES.tree, title: "A tree", short: "Tree" },
      { page: PAGES.sections, title: "Sections and pages", short: "Sections" },
      { page: PAGES.choosing, title: "Choosing from a list", short: "Choosing" },
      { page: PAGES.tables, title: "Tables", short: "Tables" },
      { page: PAGES.logs, title: "Logs and scrolling", short: "Logs" },
    ],
  },
  {
    name: "Figures",
    look: LOOKS.figures,
    pages: [
      { page: PAGES.bars, title: "Bars and columns", short: "Bars" },
      { page: PAGES.lines, title: "Lines and points", short: "Lines" },
      { page: PAGES.heat, title: "A heat map", short: "Heat" },
      { page: PAGES.clock, title: "Clock and dates", short: "Clock" },
      { page: PAGES.countdown, title: "Countdown", short: "Countdown" },
      { page: PAGES.calendar, title: "Calendar", short: "Calendar" },
    ],
  },
  {
    name: "Graphics",
    look: LOOKS.graphics,
    pages: [
      { page: PAGES.mosaics, title: "Mosaics and icons", short: "Mosaics" },
      { page: PAGES.gallery, title: "Gallery", short: "Gallery" },
      { page: PAGES.picture, title: "A picture in a box", short: "Picture" },
      { page: PAGES.paint, title: "Paint", short: "Paint" },
      { page: PAGES.animation, title: "Animation", short: "Animation" },
    ],
  },
  {
    name: "Input",
    look: LOOKS.input,
    pages: [
      { page: PAGES.fields, title: "Text fields", short: "Fields" },
      { page: PAGES.choices, title: "Boxes, radios, switches", short: "Choices" },
      { page: PAGES.numbers, title: "Sliders and numbers", short: "Numbers" },
      { page: PAGES.form, title: "A form", short: "Form" },
      { page: PAGES.dialogs, title: "Dialogs", short: "Dialogs" },
      { page: PAGES.wizard, title: "A wizard", short: "Wizard" },
      { page: PAGES.feedback, title: "Feedback", short: "Feedback" },
    ],
  },
  {
    name: "Play",
    look: LOOKS.play,
    pages: [
      { page: PAGES.quiz, title: "Quiz", short: "Quiz" },
      { page: PAGES.poll, title: "Live poll", short: "Poll" },
      { page: PAGES.roulette, title: "Article roulette", short: "Roulette" },
      { page: PAGES.snake, title: "Snake", short: "Snake" },
      { page: PAGES.sounds, title: "Sound board", short: "Sounds" },
    ],
  },
  {
    name: "Documents",
    look: LOOKS.documents,
    pages: [
      { page: PAGES.document, title: "A document", short: "Document" },
      { page: PAGES.days, title: "A day a sub-page", short: "Days" },
      ...ARTICLES.map((article, place) => ({ page: article.page, title: article.title, short: `Story ${place + 1}` })),
    ],
  },
];

/** The magazine `page` is in, and its place there. */
export function placeOf(page: number): { readonly magazine: number; readonly entry: number } {
  for (const [magazine, { pages }] of MAGAZINES.entries()) {
    const entry = pages.findIndex((each) => each.page === page);
    if (entry !== -1) {
      return { magazine, entry };
    }
  }
  throw new RangeError(`page ${page.toString(16)} is not on the map`);
}

/** The magazine `page` is in. */
export function magazineOf(page: number): Magazine {
  const found = MAGAZINES[placeOf(page).magazine];
  if (found === undefined) {
    throw new RangeError(`page ${page.toString(16)} is not on the map`);
  }
  return found;
}

/** The map's entry for `page`. */
export function entryOf(page: number): MapEntry {
  const found = magazineOf(page).pages[placeOf(page).entry];
  if (found === undefined) {
    throw new RangeError(`page ${page.toString(16)} is not on the map`);
  }
  return found;
}
