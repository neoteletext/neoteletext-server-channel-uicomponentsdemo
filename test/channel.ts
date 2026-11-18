// The channel without pictures, or with the ones given, driven as the
// server drives it.

import type { SubPageContent } from "neoteletext-server-ts-protocol";
import { Harness, fakeOpus } from "neoteletext-server-ts-protocol/testing";
import { ComponentChannel, IN_MEMORY, SqliteStateStore } from "neoteletext-server-ts-ui-components";
import type { PictureFile } from "../src/assets/pictures.ts";
import { standInText } from "../src/pages/languages/sample-text.ts";
import { pages } from "../src/site/pages.ts";

/** The channel's start, a fixed day so that dates and countdowns are the same each run. */
export const STARTED = Date.UTC(2026, 9, 28, 12);

/** The channel, its sounds encoded by the protocol's fake encoder, which runs nothing, keeping what lasts in `store`: a database in memory of its own when none is given. */
export function channel(pictures: readonly PictureFile[] = [], store: SqliteStateStore = new SqliteStateStore(IN_MEMORY)): Harness {
  return new Harness([new ComponentChannel(pages({ pictures }, store), { opus: fakeOpus(), standIn: standInText, state: store })], { epochMs: STARTED });
}

/** The latest sub-page `connection` was sent of `page`: its own copy, else the channel's. */
export function contentOf(harness: Harness, connection: number, page: number): SubPageContent | undefined {
  return (harness.channel.copy(connection, page) ?? harness.channel.copy("channel", page))?.at(-1)?.content;
}

/** Every text run of `content`, joined by line breaks: what the server encodes for the page. */
export function runsText(content: SubPageContent | undefined): string {
  return (content?.text ?? []).map((run) => run.text).join("\n");
}
