// Page 501, the gallery: each converted picture as a sub-page of its own,
// as the engine converted it, with its caption on the band. Without the
// pictures folder, the page says so.

import { type Child, Component, h, Placeholder, RawSubPage, Rows } from "neottx-server-ts-ui-components";
import { type PictureFile, ttiOf } from "../../assets/pictures.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { framingOf } from "../../parts/framing.ts";
import { PAGES } from "../../site/page-numbers.ts";

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
    const { background, foreground, prompts, index } = framingOf(PAGES.gallery);
    const fastext = [prompts[0]?.[1] ?? null, prompts[1]?.[1] ?? null, prompts[2]?.[1] ?? null, prompts[3]?.[1] ?? null] as const;
    return h(
      Rows,
      {},
      ...pictures.map((picture) =>
        h(RawSubPage, { key: picture.name, tti: ttiOf(picture, "l25"), title: picture.caption, background, foreground, fastext, index }),
      ),
    );
  }
}
