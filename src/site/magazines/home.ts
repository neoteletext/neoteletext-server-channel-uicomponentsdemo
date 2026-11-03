// Magazine 1, home: the index, every component A to Z, how it works, a
// greeting, then the cookies (cookies.ts).

import { h, type PageSpec } from "neoteletext-server-ts-ui-components";
import { CataloguePage } from "../../pages/home/catalogue-page.ts";
import { GreetingPage } from "../../pages/home/greeting-page.ts";
import { HowPage } from "../../pages/home/how-page.ts";
import { IndexPage } from "../../pages/home/index-page.ts";
import { PAGES } from "../page-numbers.ts";
import { cookiePages } from "./cookies.ts";
import { OWN_TYPING, spec } from "../spec.ts";

export function homePages(): PageSpec[] {
  return [
    spec(PAGES.index, () => h(IndexPage, {})),
    spec(PAGES.components, () => h(CataloguePage, {})),
    spec(PAGES.how, () => h(HowPage, {})),
    spec(PAGES.greeting, () => h(GreetingPage, {}), OWN_TYPING),
    ...cookiePages(),
  ];
}
