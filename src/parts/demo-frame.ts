// The frame every page of the channel is drawn in: its title from the map,
// its magazine's band, and the prompts that walk the map.

import { type Child, Component, Frame, h } from "neoteletext-server-ts-ui-components";
import { PAGES } from "../site/page-numbers.ts";
import { promptsFor } from "../site/prompts.ts";
import { entryOf, magazineOf } from "../site/site-map.ts";

export interface DemoFrameProps {
  readonly page: number;
  /** What the keys do; the focused control's own hint when absent. */
  readonly hint?: string;
  /** No title band, for a page with its own heading. */
  readonly bare?: boolean;
}

export class DemoFrame extends Component<DemoFrameProps> {
  override render(): Child {
    const { page, hint, bare } = this.props;
    const { look } = magazineOf(page);
    return h(
      Frame,
      {
        title: entryOf(page).title,
        background: look.background,
        foreground: look.foreground,
        prompts: promptsFor(page),
        index: PAGES.index,
        ...(hint === undefined ? {} : { hint }),
        ...(bare === undefined ? {} : { bare }),
      },
      ...(this.props.children ?? []),
    );
  }
}
