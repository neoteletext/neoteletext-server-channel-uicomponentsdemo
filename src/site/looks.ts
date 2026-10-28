// Each magazine's band and the ink on it, as the browser colours magazines.

import { Colour } from "neoteletext-server-ts-protocol";

/** A magazine's title band. */
export interface Look {
  readonly background: Colour;
  readonly foreground: Colour;
}

export const LOOKS = {
  home: { background: Colour.Red, foreground: Colour.Yellow },
  text: { background: Colour.Green, foreground: Colour.Black },
  lists: { background: Colour.Yellow, foreground: Colour.Blue },
  figures: { background: Colour.Cyan, foreground: Colour.Blue },
  graphics: { background: Colour.Magenta, foreground: Colour.White },
  input: { background: Colour.Blue, foreground: Colour.White },
  play: { background: Colour.White, foreground: Colour.Blue },
  documents: { background: Colour.Red, foreground: Colour.White },
} as const satisfies Record<string, Look>;
