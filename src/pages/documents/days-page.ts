// Page 801, a day a sub-page: the articles grouped by the day they were
// written, newest first.

import { type Child, Component, DATE_FORMATS, type Day, DayPages, formatDate, h } from "neottx-server-ts-ui-components";
import { ARTICLES } from "../../content/articles.ts";
import { framingOf } from "../../parts/framing.ts";
import { PAGES } from "../../site/page-numbers.ts";

function days(): Day[] {
  const byDay = Map.groupBy(ARTICLES, (article) => formatDate(article.date, DATE_FORMATS.weekday));
  return [...byDay].map(([name, articles]) => ({ name, articles }));
}

export class DaysPage extends Component {
  override render(): Child {
    return h(DayPages, { ...framingOf(PAGES.days), days: days() });
  }
}
