// Magazine 5, graphics: mosaics, the converted pictures, paint, animation.

import { h, type PageSpec } from "neottx-server-ts-ui-components";
import type { Assets } from "../../assets/assets.ts";
import { AnimationPage } from "../../pages/graphics/animation-page.ts";
import { GalleryPage } from "../../pages/graphics/gallery-page.ts";
import { MosaicsPage } from "../../pages/graphics/mosaics-page.ts";
import { PaintPage } from "../../pages/graphics/paint-page.ts";
import { PicturePage } from "../../pages/graphics/picture-page.ts";
import { PAGES } from "../page-numbers.ts";
import { OWN_TYPING, spec } from "../spec.ts";

export function graphicsPages(assets: Assets): PageSpec[] {
  return [
    spec(PAGES.mosaics, () => h(MosaicsPage, {})),
    spec(PAGES.gallery, () => h(GalleryPage, { pictures: assets.pictures })),
    spec(PAGES.picture, () => h(PicturePage, { picture: assets.pictures[0] })),
    // A viewer's painting waits for them while they look at other pages.
    spec(PAGES.paint, () => h(PaintPage, {}), { ...OWN_TYPING, keepWhileAway: true }),
    spec(PAGES.animation, () => h(AnimationPage, {})),
  ];
}
