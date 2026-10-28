// Page 702, article roulette: spin, and land on an article to read.

import { type Child, Component, h, Roulette } from "neoteletext-server-ts-ui-components";
import { SOUNDS } from "../../assets/sounds.ts";
import { ARTICLES } from "../../content/articles.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

export class RoulettePage extends Component {
  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.roulette, hint: "Enter spins; Enter again reads it" },
      h(Roulette, { articles: ARTICLES, tick: SOUNDS.tick, done: SOUNDS.done, autoFocus: true }),
    );
  }
}
