// Pages 810 on, a story each: an article over its sub-pages, with where
// else on the channel it is.

import { type Article, type Child, Component, h, StoryPages } from "neottx-server-ts-ui-components";
import { framingOf } from "../../parts/framing.ts";
import { PAGES } from "../../site/page-numbers.ts";

export interface StoryPageProps {
  readonly article: Article;
}

export class StoryPage extends Component<StoryPageProps> {
  override render(): Child {
    const { article } = this.props;
    return h(StoryPages, {
      ...framingOf(article.page),
      article,
      where: [
        { page: PAGES.news, label: "Headlines and news" },
        { page: PAGES.document, label: "Every article" },
        { page: PAGES.days, label: "A day a sub-page" },
        { page: PAGES.roulette, label: "Article roulette" },
      ],
    });
  }
}
