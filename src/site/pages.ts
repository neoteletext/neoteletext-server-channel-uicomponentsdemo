// The channel's pages, magazine by magazine, in the map's order.

import type { PageSpec } from "neottx-server-ts-ui-components";
import type { Assets } from "../assets/assets.ts";
import { documentPages } from "./magazines/documents.ts";
import { figurePages } from "./magazines/figures.ts";
import { graphicsPages } from "./magazines/graphics.ts";
import { homePages } from "./magazines/home.ts";
import { inputPages } from "./magazines/input.ts";
import { listPages } from "./magazines/lists.ts";
import { playPages } from "./magazines/play.ts";
import { textPages } from "./magazines/text.ts";

export function pages(assets: Assets): PageSpec[] {
  return [...homePages(), ...textPages(), ...listPages(), ...figurePages(), ...graphicsPages(assets), ...inputPages(), ...playPages(), ...documentPages()];
}
