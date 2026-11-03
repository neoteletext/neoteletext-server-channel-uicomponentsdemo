// The channel's pages, magazine by magazine, in the map's order.

import type { PageSpec, StateStore } from "neoteletext-server-ts-ui-components";
import type { Assets } from "../assets/assets.ts";
import { figurePages } from "./magazines/figures.ts";
import { graphicsPages } from "./magazines/graphics.ts";
import { homePages } from "./magazines/home.ts";
import { inputPages } from "./magazines/input.ts";
import { languagePages } from "./magazines/languages.ts";
import { listPages } from "./magazines/lists.ts";
import { playPages } from "./magazines/play.ts";
import { textPages } from "./magazines/text.ts";

/** Every page, the poll's votes kept in `store` (REQ-1057). */
export function pages(assets: Assets, store: StateStore): PageSpec[] {
  return [...homePages(), ...textPages(), ...listPages(), ...figurePages(), ...graphicsPages(assets), ...inputPages(), ...playPages(store), ...languagePages()];
}
