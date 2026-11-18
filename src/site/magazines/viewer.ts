// What the channel knows of the viewer (viewer-state.md VS-401 to VS-409),
// on magazine 1 after the home pages: a page each (pages/viewer), the same
// pages as the demo site's.

import { type Component, h, type PageSpec } from "neoteletext-server-ts-ui-components";
import { ForgetMe } from "../../pages/viewer/forget-me.ts";
import { KeptHere } from "../../pages/viewer/kept-here.ts";
import { RememberMe } from "../../pages/viewer/remember-me.ts";
import { VisitCounter } from "../../pages/viewer/visit-counter.ts";
import { WhatWeKnow } from "../../pages/viewer/what-we-know.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../page-numbers.ts";
import { OWN, spec } from "../spec.ts";

/** Each viewer page and its body. */
const VIEWER_PAGES: readonly (readonly [page: number, body: new (props: object) => Component])[] = [
  [PAGES.known, WhatWeKnow],
  [PAGES.remembered, RememberMe],
  [PAGES.counter, VisitCounter],
  [PAGES.forget, ForgetMe],
  [PAGES.kept, KeptHere],
];

export function viewerPages(): PageSpec[] {
  return VIEWER_PAGES.map(([page, body]) => spec(page, () => h(DemoFrame, { page }, h(body, {})), OWN));
}
