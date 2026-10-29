// The converted pictures, from a folder given on the command line and read
// once at the start: the engine's levels conversion, NAME_l15.tti,
// NAME_l25.tti and NAME_l35.tti, with captions.tsv giving each name's group
// (its caption is not shown). Only the groups in GROUPS are taken, every
// picture of each: a page holds the standard's thousands of sub-pages
// (the server's start says how many), so none is left out for room.
// Everything in the folder is untrusted: names are checked, each file's
// size and all the files' bytes together bounded.

import { readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/** The levels each picture is converted at, by the names the folder gives them. */
const LEVELS = ["l15", "l25", "l35"] as const;
type Level = (typeof LEVELS)[number];

/**
 * The groups shown, in the order shown, by the letters the engine's levels
 * page gives them: "Your examples", "Characters" and "Sci-fi sprites".
 */
const GROUPS = ["e", "c", "s"] as const;

/** A converted picture: its name (such as e01) and its TTI at each level converted. */
export interface PictureFile {
  readonly name: string;
  readonly levels: readonly { readonly level: Level; readonly tti: string }[];
}

/** A page of TTI with every enhancement packet is a few kilobytes, so anything far larger is not a picture. */
const LONGEST_PICTURE = 256 * 1024;
/** A few thousand pictures' lines of a few hundred characters. */
const LONGEST_CAPTIONS = 4 * 1024 * 1024;
/** The most bytes of pictures read in all: the channel's memory for them, room for thousands of pictures at three levels. */
const MOST_PICTURE_BYTES = 64 * 1024 * 1024;
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

/** The picture `name` with whichever of its levels' files the folder has, or undefined with none. */
function readPicture(folder: string, name: string): PictureFile | undefined {
  const levels = LEVELS.flatMap((level) => {
    // TTI is seven-bit text; latin1 keeps any other byte as one character,
    // for the library's TTI reader to refuse.
    const tti = readSmall(join(folder, `${name}_${level}.tti`), "latin1", LONGEST_PICTURE);
    return tti === undefined ? [] : [{ level, tti }];
  });
  return levels.length === 0 ? undefined : { name, levels };
}

/** The pictures of GROUPS in `folder`; a picture without its files is left out, and no folder is no pictures. */
export function loadPictures(folder?: string): readonly PictureFile[] {
  if (folder === undefined) {
    return [];
  }
  const captions = readSmall(join(folder, "captions.tsv"), "utf8", LONGEST_CAPTIONS);
  if (captions === undefined) {
    return [];
  }
  const byGroup = GROUPS.map((): PictureFile[] => []);
  let bytes = 0;
  for (const line of captions.split("\n")) {
    const fields = line.split("\t");
    const [name = "", group = ""] = fields;
    const found = byGroup[GROUPS.findIndex((each) => each === group)];
    if (fields.length < CAPTION_FIELDS || !NAME.test(name) || found === undefined) {
      continue;
    }
    const picture = readPicture(folder, name);
    if (picture === undefined) {
      continue;
    }
    bytes += picture.levels.reduce((sum, { tti }) => sum + tti.length, 0);
    if (bytes > MOST_PICTURE_BYTES) {
      break;
    }
    found.push(picture);
  }
  return byGroup.flat();
}

/** The picture's TTI at `level`, or at the first level it has. */
export function ttiOf(picture: PictureFile, level: Level): string {
  return picture.levels.find((each) => each.level === level)?.tti ?? picture.levels[0]?.tti ?? "";
}
