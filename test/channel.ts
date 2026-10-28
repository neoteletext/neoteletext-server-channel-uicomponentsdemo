// The channel without pictures, or with the ones given, driven as the
// server drives it.

import { Harness } from "neoteletext-server-ts-protocol/testing";
import { ComponentChannel } from "neoteletext-server-ts-ui-components";
import type { PictureFile } from "../src/assets/pictures.ts";
import { pages } from "../src/site/pages.ts";

/** The channel's start, a fixed day so that dates and countdowns are the same each run. */
export const STARTED = Date.UTC(2026, 9, 28, 12);

export function channel(pictures: readonly PictureFile[] = []): Harness {
  return new Harness([new ComponentChannel(pages({ pictures }))], { epochMs: STARTED });
}
