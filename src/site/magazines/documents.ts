// Magazine 8, documents: one long document, a day a sub-page, and a page
// for each sample article.

import { h, type PageSpec } from "neoteletext-server-ts-ui-components";
import { ARTICLES } from "../../content/articles.ts";
import { DaysPage } from "../../pages/documents/days-page.ts";
import { DocumentPage } from "../../pages/documents/document-page.ts";
import { StoryPage } from "../../pages/documents/story-page.ts";
import { PAGES } from "../page-numbers.ts";
import { spec } from "../spec.ts";

export function documentPages(): PageSpec[] {
  return [
    spec(PAGES.document, () => h(DocumentPage, {})),
    spec(PAGES.days, () => h(DaysPage, {})),
    ...ARTICLES.map((article) => spec(article.page, () => h(StoryPage, { article }))),
  ];
}
