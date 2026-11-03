// The cookies, on magazine 1 after the home pages: a page for each thing a
// cookie does (pages/cookies), the same pages as the demo site's.

import { type Component, h, type PageSpec } from "neoteletext-server-ts-ui-components";
import { CookieAttributes } from "../../pages/cookies/cookie-attributes.ts";
import { CookieList } from "../../pages/cookies/cookie-list.ts";
import { Lifetimes } from "../../pages/cookies/lifetimes.ts";
import { MinuteCookie } from "../../pages/cookies/minute-cookie.ts";
import { VisitCounter } from "../../pages/cookies/visit-counter.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../page-numbers.ts";
import { spec } from "../spec.ts";

/** Each cookie page and its body. */
const COOKIE_PAGES: readonly (readonly [page: number, body: new (props: object) => Component])[] = [
  [PAGES.visits, VisitCounter],
  [PAGES.lifetimes, Lifetimes],
  [PAGES.minute, MinuteCookie],
  [PAGES.cookieList, CookieList],
  [PAGES.attributes, CookieAttributes],
];

export function cookiePages(): PageSpec[] {
  return COOKIE_PAGES.map(([page, body]) => spec(page, () => h(DemoFrame, { page }, h(body, {}))));
}
