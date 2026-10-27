// Page 301, a menu with submenus, rules and shortcuts, and the breadcrumbs
// of the way down to the last choice.

import { Colour } from "neottx-server-ts-protocol";
import { Breadcrumbs, type Child, Component, Gap, h, Menu, type MenuItem, Text } from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

const ITEMS: readonly MenuItem[] = [
  {
    label: "File",
    items: [
      { label: "New", shortcut: "N" },
      { label: "Open", shortcut: "O" },
      { label: "", rule: true },
      { label: "Close", disabled: true },
    ],
  },
  { label: "View", items: [{ label: "Bigger" }, { label: "Smaller" }, { label: "Colours", items: [{ label: "Bright" }, { label: "Dim" }] }] },
  { label: "", rule: true },
  { label: "Help", shortcut: "F1" },
];
/** The menu's rows. */
const MENU_SHOWN = 8;

export class MenusPage extends Component<object, { readonly path: readonly string[] }> {
  override state: { readonly path: readonly string[] } = { path: [] };

  override render(): Child {
    const trail = [{ label: "Menu", page: PAGES.menus }, ...this.state.path.map((label) => ({ label }))];
    return h(
      DemoFrame,
      { page: PAGES.menus, hint: "Up, Down, Enter; Right opens, Left goes back" },
      h(Breadcrumbs, { trail }),
      h(Gap, {}),
      h(Menu, {
        items: ITEMS,
        title: "Menu",
        numbered: true,
        shown: MENU_SHOWN,
        autoFocus: true,
        onChoose: (path) => {
          this.setState({ path });
        },
      }),
      h(Gap, {}),
      h(Text, { text: this.state.path.length === 0 ? "Nothing chosen yet" : `Chosen: ${this.state.path.join(" > ")}`, foreground: Colour.Yellow }),
    );
  }
}
