// Magazine 1, home: the index, every component A to Z, how it works, a greeting.

import { h, type PageSpec } from "neottx-server-ts-ui-components";
import { CataloguePage } from "../../pages/home/catalogue-page.ts";
import { GreetingPage } from "../../pages/home/greeting-page.ts";
import { HowPage } from "../../pages/home/how-page.ts";
import { IndexPage } from "../../pages/home/index-page.ts";
import { PAGES } from "../page-numbers.ts";
import { OWN, OWN_TYPING, spec } from "../spec.ts";

export function homePages(): PageSpec[] {
  return [
    spec(PAGES.index, () => h(IndexPage, {})),
    spec(PAGES.components, () => h(CataloguePage, {}), OWN),
    spec(PAGES.how, () => h(HowPage, {})),
    spec(PAGES.greeting, () => h(GreetingPage, {}), OWN_TYPING),
  ];
}
