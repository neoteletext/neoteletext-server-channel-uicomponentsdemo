// Every page's number, by magazine: a teletext service keeps a subject to
// its hundred, so each magazine is one area of the library.

/** The pages, by name. */
export const PAGES = {
  index: 0x100,
  components: 0x101,
  how: 0x102,
  greeting: 0x103,

  textStyles: 0x200,
  richText: 0x201,
  news: 0x202,
  layout: 0x203,
  panels: 0x204,

  tabs: 0x300,
  menus: 0x301,
  tree: 0x302,
  sections: 0x303,
  choosing: 0x304,
  tables: 0x305,
  logs: 0x306,

  bars: 0x400,
  lines: 0x401,
  heat: 0x402,
  clock: 0x403,
  countdown: 0x404,
  calendar: 0x405,

  mosaics: 0x500,
  gallery: 0x501,
  picture: 0x502,
  paint: 0x503,
  animation: 0x504,

  fields: 0x600,
  choices: 0x601,
  numbers: 0x602,
  form: 0x603,
  dialogs: 0x604,
  wizard: 0x605,
  feedback: 0x606,

  quiz: 0x700,
  poll: 0x701,
  roulette: 0x702,
  snake: 0x703,
  sounds: 0x704,

  document: 0x800,
  days: 0x801,
  /** The sample articles' pages start here, one page each (content/articles.ts). */
  firstStory: 0x810,
} as const;
