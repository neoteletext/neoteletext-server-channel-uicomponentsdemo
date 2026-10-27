// Page 502, a picture in a box: a converted picture's rows inside the
// frame, at each of its levels as a sub-page.

import { type Child, Component, h, Picture, Placeholder, Rows } from "neottx-server-ts-ui-components";
import type { PictureFile } from "../../assets/pictures.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

export interface PictureProps {
  readonly picture: PictureFile | undefined;
}

/** The picture's first row shown: past the header and the band its file has. */
const FIRST_ROW = 3;

export class PicturePage extends Component<PictureProps> {
  override render(): Child {
    const { picture } = this.props;
    if (picture === undefined) {
      return h(
        DemoFrame,
        { page: PAGES.picture, hint: "Start the channel with --pictures FOLDER" },
        h(Placeholder, { text: "No pictures: no --pictures folder" }),
      );
    }
    return h(
      Rows,
      {},
      ...picture.levels.map(({ level, tti }) =>
        h(
          DemoFrame,
          { key: level, page: PAGES.picture, hint: `${picture.name} at level ${level.slice(1).split("").join(".")}` },
          h(Picture, { tti, firstRow: FIRST_ROW }),
        ),
      ),
    );
  }
}
