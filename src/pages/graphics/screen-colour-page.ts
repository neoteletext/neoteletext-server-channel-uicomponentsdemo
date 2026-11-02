// Page 505, the screen colour: the colour around the page, which a viewer
// changes here on their own copy. It is a Frame's `screenColour`: a Full
// Screen Colour triplet in the page's X/26 (EN 300 706 Table 28), which
// any of the Colour Map's 32 entries (Table 30) can fill.

import { Colour } from "neoteletext-server-ts-protocol";
import { type Child, Component, Gap, h, RadioGroup, Slider, Text } from "neoteletext-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { setterOf } from "../../parts/setter.ts";
import { PAGES } from "../../site/page-numbers.ts";

/** Level 1's colours, in their numbers: CLUT 0's entries in the Colour Map (Table 30). */
const LEVEL_1_COLOURS = ["Black", "Red", "Green", "Yellow", "Blue", "Magenta", "Cyan", "White"];
/** The entries of a CLUT (Table 30). */
const CLUT_ENTRIES = LEVEL_1_COLOURS.length;
/** The Colour Map's last entry (Table 30). */
const LAST_ENTRY = 31;
/** CLUT 1's entry 0, which is transparent (Table 30). */
const TRANSPARENT = 8;
/** Where a viewer starts: a colour that shows at once around a black page. */
const FIRST_COLOUR = Colour.Blue;
/** The note's lines. */
const NOTE_LINES = 4;

interface ScreenColourState {
  readonly colour: number;
}

export class ScreenColourPage extends Component<object, ScreenColourState> {
  override state: ScreenColourState = { colour: FIRST_COLOUR };

  override render(): Child {
    const { colour } = this.state;
    const clut = Math.floor(colour / CLUT_ENTRIES);
    return h(
      DemoFrame,
      { page: PAGES.screenColour, screenColour: colour, hint: "Left and Right change; Up and Down move" },
      h(Note, {
        text: "The colour around this page is its screen colour: above, below and beside the rows. The page sets it, from Level 2.5.",
        lines: NOTE_LINES,
      }),
      h(Gap, {}),
      h(RadioGroup, {
        label: "Level 1",
        items: LEVEL_1_COLOURS,
        across: true,
        autoFocus: true,
        value: colour < CLUT_ENTRIES ? colour : -1,
        onChange: setterOf(this, "colour"),
      }),
      h(Gap, {}),
      h(Slider, { label: "All 32", min: 0, max: LAST_ENTRY, value: colour, onChange: setterOf(this, "colour") }),
      h(Gap, {}),
      h(Text, {
        text: `Colour Map entry ${colour}: CLUT ${clut} entry ${colour % CLUT_ENTRIES}${colour === TRANSPARENT ? ", transparent" : ""}`,
        foreground: Colour.Yellow,
      }),
    );
  }
}
