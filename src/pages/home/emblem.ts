// The channel's emblem, a sink with its tap, drawn with Mosaic: 24 by 18
// sixels, 12 cells by 6 rows.

import type { Bitmap } from "neottx-server-ts-ui-components";

export const EMBLEM: Bitmap = [
  "............####........",
  "...........######.......",
  "..........##....##......",
  "..........##....##......",
  "..........##............",
  "..........##............",
  "########################",
  "########################",
  "##....................##",
  "##....................##",
  ".##..................##.",
  ".##..................##.",
  "..##................##..",
  "...##......##......##...",
  "....################....",
  "......############......",
  "..........####..........",
  "..........####..........",
];

/** The rows the emblem takes: three sixels down a cell. */
export const EMBLEM_ROWS = 6;
/** The cells it takes across: two sixels a cell. */
export const EMBLEM_CELLS = 12;
