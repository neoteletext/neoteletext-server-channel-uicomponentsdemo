// Page 704, the sound board: every sound the channel makes, to play.

import { type Child, Component, h, SoundList } from "neottx-server-ts-ui-components";
import { SOUNDS } from "../../assets/sounds.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { Note } from "../../parts/note.ts";
import { PAGES } from "../../site/page-numbers.ts";

const SHOWN = 10;

export class SoundsPage extends Component {
  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.sounds, hint: "Up, Down, Enter plays" },
      h(Note, { text: "Tones and noise, made by the program and played by the browser." }),
      h(SoundList, { sounds: Object.values(SOUNDS), shown: SHOWN }),
    );
  }
}
