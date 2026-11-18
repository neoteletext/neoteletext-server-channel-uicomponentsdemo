# neoteletext-server-channel-uicomponentsdemo

The NeoTeletext component library's demo: a teletext channel whose pages
show the components of `neoteletext-server-ts-ui-components` working, a
page or so to each, in eight magazines. It runs on the library's 26.2.0
and the protocol kit 18.3.0 (program protocol 15), with the library's rule
tables off (`ruleTables: "none"`), so that its entry in the server's
channels file says `"default_rules": "send_all"` and it is sent every
input as before (DEC-6525 item 9). Beside the components
it shows the library's languages: a page in each of the 73 languages the
engine has a set for, built of the same components in that language and
scrolling in a scroll view; a language picker on 899 that draws the whole
channel in the viewer's language, kept for them; and five pages on what
the channel knows of the viewer (110 to 114).

It is a channel program: the server starts it and they talk in lines of
JSON on its standard input and output (DOC-1964). It is built on two libraries of the server's,
released into `vendor/`:

- **neoteletext-server-ts-protocol**, the channel protocol;
- **neoteletext-server-ts-ui-components**, the component library its pages
  are made of.

## Running it

It needs Node 22.18 or later, which runs the `.ts` files as they are, and
ffmpeg with libopus on the `PATH`, which encodes its sounds as Opus.

    npm ci --ignore-scripts --no-audit --no-fund
    node src/main.ts [--pictures FOLDER] [--state FILE]

FOLDER holds converted pictures: `captions.tsv` (name, group, caption, a
tab between each) and each picture's `NAME_l15.tti`, `NAME_l25.tti` and
`NAME_l35.tti`, as the engine's levels conversion writes them. The
gallery shows every one of its examples, characters and sci-fi sprites
(groups `e`, `c` and `s`), each at Level 2.5 and then at Level 1.5, a
sub-page each: 502 sub-pages for the 251 pictures. Without it the
picture pages say there are none.

FILE is the SQLite database the channel keeps what outlasts the program
in: the poll's votes and each viewer's ballot, and what each viewer chose
on the choosing page, which keeps its state for them. It is made, with its
folder, when it is not there; without it, this repository's
`tmp/state.sqlite`.

`BUILD.md` has the details and the checks; `DEPLOYMENT.md` is for the
deploy.

## What is in it

The index is page 100. On every page green goes on to the next page and
red back, yellow to the next magazine and cyan to the index, so the whole
demo is one walk on the green key.

One copy of the channel serves every language: 899 keeps your choice for
you, under your viewer handle, and every page is then drawn in your language, its
words (titles, captions, list items, buttons, tabs, tickers) drawn as text
of that language taken from its language page, the Universal Declaration
of Human Rights (`src/pages/languages/sample-text.ts`, the library's
stand-in text). Page numbers and the coloured keys' prompts stay as they
are; 800, 801 and 899 stay English, the way to every language. The
language and viewer pages' files are shared word for word with the demo site;
`test/shared-files.test.ts` fails when they differ.

| Magazine  | Pages                                                                                                                                                                                                                                                                                                                                                                                      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Home      | 100 index, 101 components A to Z, 102 how it works, 103 a greeting; what the channel knows of you: 110 whether it knows you, 111 a visit or remembered, 112 a visit counter kept for you, 113 forget me, 114 what is kept and why                                                                                                                                                          |
| Text      | 200 styles, 201 rich text and badges, 202 news, 203 layout, 204 panels, 205 a document, 206 a day a sub-page, 210 to 214 the sample stories                                                                                                                                                                                                                                                |
| Lists     | 300 tabs, 301 menus, 302 tree, 303 sections, 304 choosing, 305 tables, 306 logs                                                                                                                                                                                                                                                                                                            |
| Figures   | 400 bars, 401 lines, 402 heat map, 403 clock, 404 countdown, 405 calendar                                                                                                                                                                                                                                                                                                                  |
| Graphics  | 500 mosaics and icons, 501 gallery, 502 a picture, 503 paint, 504 animation, 505 screen colour                                                                                                                                                                                                                                                                                             |
| Input     | 600 fields, 601 choices, 602 numbers, 603 a form, 604 dialogs, 605 a wizard, 606 feedback                                                                                                                                                                                                                                                                                                  |
| Play      | 700 quiz, 701 poll, 702 roulette, 703 snake, 704 sound board                                                                                                                                                                                                                                                                                                                               |
| Languages | 800 and 801 the index, 802 to 874 a page in each language the engine has a set for, in alphabetical order, built of the components in its own language: its name in itself over a scrolling view of the Universal Declaration of Human Rights (`CREDITS.md`), its letters and every character of its set; 899 chooses your language for the whole channel (`?language=ru` chooses Russian) |

Every page of magazines 1 to 7 is also drawn as a ReGIS picture 40 on
and as a NAPLPS picture 60 on, in the same magazine (renderer parity
PAR-42): 304 is the choosing page in teletext, 344 in ReGIS and 364 in
NAPLPS; 110 to 114 are 150 to 154 and 170 to 174, and the stories 210
to 214 are 250 to 254 and 270 to 274. They are the same components,
with the same keys and clicks; each copy's frame and prompts are its
teletext page's, so green walks on into the teletext pages. The
languages are not copied, since a picture draws text only in the
renderers' provided sets (`src/site/renderers.ts`).

- `src/main.ts`: the program, which reads its options and the pictures
  and serves the pages.
- `src/site/`: the map (`site-map.ts`: every page's number, title and
  magazine), the page numbers, the looks, the Fastext prompts, the
  page specs, a file to a magazine in `magazines/`, and their ReGIS and
  NAPLPS copies (`renderers.ts`).
- `src/pages/`: the pages, a folder to each magazine, a file to a page.
- `src/parts/`: what the pages share: the frame, its framing, notes, the
  state setter.
- `src/content/`: the sample articles, the catalogue, the figures and the
  quiz's questions.
- `src/assets/`: the pictures, read from the folder given, and the sounds.
- `test/`: the tests, which drive the channel as the server does.
- `scripts/`: `check.sh`, every check, and `deploy.sh`, the deploy of
  this channel to app.neottx.com (`DEPLOYMENT.md`).

## Checks

`scripts/check.sh stage` runs every check: the type check with every
strict option, Prettier, oxlint (type-aware, warnings fail), Knip and the
tests. The git hooks (`core.hooksPath` is `.githooks`) run the gates;
`~/devel/neoteletext-common/DEVELOPMENT.md` section 9 says how the gates and the work branch `livedevelopment` work.

## Licence

MIT: see `LICENSE`.
