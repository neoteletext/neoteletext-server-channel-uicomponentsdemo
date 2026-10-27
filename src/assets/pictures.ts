// The converted pictures, from a folder given on the command line and read
// once at the start: the engine's levels conversion, NAME_l15.tti,
// NAME_l25.tti and NAME_l35.tti, with captions.tsv giving each name's group
// and caption. Everything in the folder is untrusted: names are checked,
// sizes and counts bounded.

import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/** The levels each picture is converted at, by the names the folder gives them. */
const LEVELS = ["l15", "l25", "l35"] as const;
type Level = (typeof LEVELS)[number];

/** A converted picture: its name (such as e01), its caption, and its TTI at each level converted. */
export interface PictureFile {
  readonly name: string;
  readonly caption: string;
  readonly levels: readonly { readonly level: Level; readonly tti: string }[];
}

/** A page of TTI with every enhancement packet is a few kilobytes, so anything far larger is not a picture. */
const LONGEST_PICTURE = 256 * 1024;
/** A few thousand pictures' lines of a few hundred characters. */
const LONGEST_CAPTIONS = 4 * 1024 * 1024;
/** The most pictures kept: the gallery shows each as a sub-page, and a page has a bounded number of them. */
const MOST_PICTURES = 50;
/** The longest caption kept, in characters: a title band's width is forty. */
const LONGEST_CAPTION = 120;
/** A captions.tsv line: name, group, caption. */
const CAPTION_FIELDS = 3;
/** A name is a file name's stem, never a path. */
const NAME = /^[A-Za-z0-9_-]{1,64}$/u;

/** A file as text, or undefined when it is missing, not a file, or too large. */
function readSmall(path: string, encoding: "utf8" | "latin1", longest: number): string | undefined {
  try {
    const found = statSync(path);
    if (!found.isFile() || found.size > longest) {
      return undefined;
    }
    return readFileSync(path, encoding);
  } catch {
    return undefined;
  }
}

/** The pictures in `folder`; a picture without its files is left out, and no folder is no pictures. */
export function loadPictures(folder?: string): readonly PictureFile[] {
  if (folder === undefined) {
    return [];
  }
  const captions = readSmall(join(folder, "captions.tsv"), "utf8", LONGEST_CAPTIONS);
  if (captions === undefined) {
    return [];
  }
  const pictures: PictureFile[] = [];
  for (const line of captions.split("\n")) {
    if (pictures.length >= MOST_PICTURES) {
      break;
    }
    const fields = line.split("\t");
    const [name = "", , ...caption] = fields;
    if (fields.length < CAPTION_FIELDS || !NAME.test(name)) {
      continue;
    }
    const levels = LEVELS.flatMap((level) => {
      // TTI is seven-bit text; latin1 keeps any other byte as one character,
      // for the library's TTI reader to refuse.
      const tti = readSmall(join(folder, `${name}_${level}.tti`), "latin1", LONGEST_PICTURE);
      return tti === undefined ? [] : [{ level, tti }];
    });
    if (levels.length > 0) {
      pictures.push({ name, caption: caption.join(" ").trim().slice(0, LONGEST_CAPTION), levels });
    }
  }
  return pictures;
}

/** The picture's TTI at `level`, or at the first level it has. */
export function ttiOf(picture: PictureFile, level: Level): string {
  return picture.levels.find((each) => each.level === level)?.tti ?? picture.levels[0]?.tti ?? "";
}
