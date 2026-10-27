// What the pages take from outside the program, read once at its start.

import type { PictureFile } from "./pictures.ts";

export interface Assets {
  readonly pictures: readonly PictureFile[];
}
