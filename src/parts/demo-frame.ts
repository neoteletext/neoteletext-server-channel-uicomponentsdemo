// The frame every page of the channel is drawn in: its title from the map,
// naming the viewer's language after it, its magazine's band, and the
// prompts that walk the map. Its captions are the channel's own English
// (REQ-2218): only what a page shows as a sample is in the viewer's language.

import { type Child, Component, ENGLISH, Frame, h } from "neoteletext-server-ts-ui-components";
import { titleIn } from "../pages/languages/sample-text.ts";
import { PAGES } from "../site/page-numbers.ts";
import { promptsFor } from "../site/prompts.ts";
import { entryOf, magazineOf } from "../site/site-map.ts";

export interface DemoFrameProps {
  readonly page: number;
  /** What the keys do; the focused control's own hint when absent. */
  readonly hint?: string;
  /** No title band, for a page with its own heading. */
  readonly bare?: boolean;
  /** The colour of the screen around the page, a Colour Map entry; the decoder's default when absent. */
  readonly screenColour?: number;
}

export class DemoFrame extends Component<DemoFrameProps> {
  override render(): Child {
    const { page, hint, bare, screenColour } = this.props;
    const { look } = magazineOf(page);
    const { title } = entryOf(page);
    return h(
      Frame,
      {
        // Unmounted, as the library's probe of what a page needs renders it, there is no viewer: the title alone, and the probe goes on to the body.
        title: this.mounted ? titleIn(title, this.services.language(this.services.session), this.services.languages()) : title,
        background: look.background,
        foreground: look.foreground,
        prompts: promptsFor(page),
        index: PAGES.index,
        language: ENGLISH,
        ...(hint === undefined ? {} : { hint }),
        ...(bare === undefined ? {} : { bare }),
        ...(screenColour === undefined ? {} : { screenColour }),
      },
      ...(this.props.children ?? []),
    );
  }
}
