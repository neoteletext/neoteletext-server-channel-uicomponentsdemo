// The UI components demo, the component library's own channel: every
// component of neoteletext-server-ts-ui-components working, a page each, in
// eight magazines. It is its own program (teletext-server's
// DOC-1964), which the server starts from its channels.json
// and talks to over standard input and output.
//
//   node src/main.ts [--pictures FOLDER] [--state FILE]
//
// FOLDER holds converted pictures, captions.tsv and NAME_l15.tti, _l25 and
// _l35; without it the picture pages say so.
//
// FILE is the SQLite database the channel keeps what outlasts it in
// (REQ-1057, REQ-1058): the poll's votes, and each viewer's ballot, the
// choosing page's choices, visit count and language, under the viewer's
// handle. It is made, with its folder, when it is not there. Without it,
// tmp/state.sqlite in this repository, which no deploy copies; a live
// channel names a file outside the folder a deploy replaces.

import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

import { runChannel } from "neoteletext-server-ts-protocol";
import { ComponentChannel, SqliteStateStore } from "neoteletext-server-ts-ui-components";
import { loadPictures } from "./assets/pictures.ts";
import { standInText } from "./pages/languages/sample-text.ts";
import { REFUSALS } from "./refusals.ts";
import { pages } from "./site/pages.ts";

/** Where the channel keeps what outlasts it when no file is named: this repository's ignored tmp/. */
const LOCAL_STATE = fileURLToPath(new URL("../tmp/state.sqlite", import.meta.url));

const { values } = parseArgs({ options: { pictures: { type: "string" }, state: { type: "string" } }, strict: true });
const pictures = loadPictures(values.pictures);
const statePath = values.state ?? LOCAL_STATE;
const store = new SqliteStateStore(statePath);
const specs = pages({ pictures }, store);
process.stderr.write(`uicomponentsdemo: ${specs.length} pages, ${pictures.length} pictures, kept in ${statePath}\n`);

// Every page is drawn in each viewer's language, the channel's words as text of it (REQ-2218, DEC-2233).
// The library writes no rule table (`ruleTables: "none"`): every page has the
// server's default table, by `"default_rules": "send_all"` in the channel's
// entry of channels.json, and is sent every input as before protocol 14
// (DEC-6525 item 9; page-rules.md RULE-53). TODO-6544 gives the pages their own tables.
await runChannel([new ComponentChannel(specs, { ruleTables: "none", standIn: standInText, state: store }), REFUSALS]);
