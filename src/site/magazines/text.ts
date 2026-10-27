// Magazine 2, text and layout.

import { h, type PageSpec } from "neottx-server-ts-ui-components";
import { LayoutPage } from "../../pages/text/layout-page.ts";
import { NewsPage } from "../../pages/text/news-page.ts";
import { PanelsPage } from "../../pages/text/panels-page.ts";
import { RichTextPage } from "../../pages/text/rich-text-page.ts";
import { StylesPage } from "../../pages/text/styles-page.ts";
import { PAGES } from "../page-numbers.ts";
import { OWN, spec } from "../spec.ts";

export function textPages(): PageSpec[] {
  return [
    spec(PAGES.textStyles, () => h(StylesPage, {})),
    spec(PAGES.richText, () => h(RichTextPage, {}), OWN),
    spec(PAGES.news, () => h(NewsPage, {})),
    spec(PAGES.layout, () => h(LayoutPage, {})),
    spec(PAGES.panels, () => h(PanelsPage, {})),
  ];
}
