// The UI components demo, the component library's own channel: every
// component of neottx-server-ts-ui-components working, a page each, in
// eight magazines. It is its own program (teletext-server's
// docs/applications.md), which the server starts from its channels.json
// and talks to over standard input and output.
//
//   node src/main.ts [--pictures FOLDER]
//
// FOLDER holds converted pictures, captions.tsv and NAME_l15.tti, _l25 and
// _l35; without it the picture pages say so.

import { parseArgs } from "node:util";

import { runChannel } from "neottx-server-ts-protocol";
import { ComponentChannel } from "neottx-server-ts-ui-components";
import { loadPictures } from "./assets/pictures.ts";
import { pages } from "./site/pages.ts";

const { values } = parseArgs({ options: { pictures: { type: "string" } }, strict: true });
const pictures = loadPictures(values.pictures);
const specs = pages({ pictures });
process.stderr.write(`uicomponentsdemo: ${specs.length} pages, ${pictures.length} pictures\n`);

await runChannel([new ComponentChannel(specs)]);
