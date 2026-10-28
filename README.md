# neoteletext-server-channel-uicomponentsdemo

The NeoTeletext component library's demo: a teletext channel whose pages
show the components of `neoteletext-server-ts-ui-components` working, a
page or so to each, in eight magazines. It is the kitchensink, made again
on the library's 2.0.0, and runs on its 4.0.0: it shows every component
2.0.0 had, and not yet the 34 that 3.0.0 added.

It is a channel program: the server starts it and they talk in lines of
JSON on its standard input and output (teletext-server's
`docs/applications.md`). It is built on two libraries of the server's,
released into `vendor/`:

- **neoteletext-server-ts-protocol**, the channel protocol;
- **neoteletext-server-ts-ui-components**, the component library its pages
  are made of.

## Running it

It needs Node 22.18 or later, which runs the `.ts` files as they are, and
ffmpeg with libopus on the `PATH`, which encodes its sounds as Opus.

    npm ci --ignore-scripts --no-audit --no-fund
    node src/main.ts [--pictures FOLDER]

FOLDER holds converted pictures: `captions.tsv` (name, group, caption, a
tab between each) and each picture's `NAME_l15.tti`, `NAME_l25.tti` and
`NAME_l35.tti`, as the engine's levels conversion writes them. The
gallery shows its examples, characters and sci-fi sprites (groups `e`,
`c` and `s`), sharing its 64 sub-pages between them. Without it the
picture pages say there are none. `BUILD.md` has the details and the
checks; `DEPLOYMENT.md` is for the deploy.

## What is in it

The index is page 100. On every page green goes on to the next page and
red back, yellow to the next magazine and cyan to the index, so the whole
demo is one walk on the green key.

| Magazine  | Pages                                                                 |
| --------- | --------------------------------------------------------------------- |
| Home      | 100 index, 101 components A to Z, 102 how it works, 103 a greeting    |
| Text      | 200 styles, 201 rich text and badges, 202 news, 203 layout, 204 panels |
| Lists     | 300 tabs, 301 menus, 302 tree, 303 sections, 304 choosing, 305 tables, 306 logs |
| Figures   | 400 bars, 401 lines, 402 heat map, 403 clock, 404 countdown, 405 calendar |
| Graphics  | 500 mosaics and icons, 501 gallery, 502 a picture, 503 paint, 504 animation |
| Input     | 600 fields, 601 choices, 602 numbers, 603 a form, 604 dialogs, 605 a wizard, 606 feedback |
| Play      | 700 quiz, 701 poll, 702 roulette, 703 snake, 704 sound board          |
| Documents | 800 a document, 801 a day a sub-page, 810 to 814 the sample stories   |

- `src/main.ts`: the program, which reads its options and the pictures
  and serves the pages.
- `src/site/`: the map (`site-map.ts`: every page's number, title and
  magazine), the page numbers, the looks, the Fastext prompts, and the
  page specs, a file to a magazine in `magazines/`.
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
tests. The git hooks (`core.hooksPath` is `.githooks`) run it on every
commit and push.

## Licence

MIT: see `LICENSE`.
