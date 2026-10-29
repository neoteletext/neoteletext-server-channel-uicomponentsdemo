// Page 501, the gallery: each converted picture whole, as the engine
// converted it, at Level 2.5 and then at Level 1.5, a sub-page each, so the
// two can be stepped between. Every picture is here: a page holds the
// standard's thousands of sub-pages, which the server serves one at a time.
// Without the pictures folder, the page says so.

import { type Child, Component, h, Placeholder, RawSubPage, Rows } from "neoteletext-server-ts-ui-components";
import { type PictureFile, ttiOf } from "../../assets/pictures.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { framingOf } from "../../parts/framing.ts";
import { PAGES } from "../../site/page-numbers.ts";

/** The levels each picture is shown at, in order: the engine's Level 2.5 conversion, then its Level 1.5. */
const GALLERY_LEVELS = ["l25", "l15"] as const;

export interface GalleryProps {
  readonly pictures: readonly PictureFile[];
}

export class GalleryPage extends Component<GalleryProps> {
  override render(): Child {
    const { pictures } = this.props;
    if (pictures.length === 0) {
      return h(
        DemoFrame,
        { page: PAGES.gallery, hint: "Start the channel with --pictures FOLDER" },
        h(Placeholder, { text: "No pictures: no --pictures folder" }),
      );
    }
    const { prompts, index } = framingOf(PAGES.gallery);
    const fastext = [prompts[0]?.[1] ?? null, prompts[1]?.[1] ?? null, prompts[2]?.[1] ?? null, prompts[3]?.[1] ?? null] as const;
    // No title: the library draws a sub-page's title as a band over rows 1
    // and 2, which a picture's own rows fill.
    const subPages = pictures.flatMap((picture) =>
      GALLERY_LEVELS.filter((level) => picture.levels.some((each) => each.level === level)).map((level) =>
        h(RawSubPage, { key: `${picture.name}-${level}`, tti: ttiOf(picture, level), fastext, index }),
      ),
    );
    return h(Rows, {}, ...subPages);
  }
}
