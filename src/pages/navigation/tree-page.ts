// Page 302, a tree of the library's own parts, joined by mosaic guides;
// an item with a page goes there.

import { Colour } from "neottx-server-ts-protocol";
import { type Child, Component, Gap, h, Text, Tree, type TreeNode } from "neottx-server-ts-ui-components";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

const NODES: readonly TreeNode[] = [
  {
    label: "Text",
    children: [
      { label: "Styles", page: PAGES.textStyles },
      { label: "Rich text", page: PAGES.richText },
      { label: "News", page: PAGES.news },
    ],
  },
  {
    label: "Navigation",
    children: [
      { label: "Tabs", page: PAGES.tabs },
      { label: "Menus", page: PAGES.menus },
      { label: "Sections", page: PAGES.sections },
    ],
  },
  {
    label: "Figures",
    children: [
      {
        label: "Charts",
        children: [
          { label: "Bars", page: PAGES.bars },
          { label: "Lines", page: PAGES.lines },
          { label: "Heat", page: PAGES.heat },
        ],
      },
      {
        label: "Time",
        children: [
          { label: "Clock", page: PAGES.clock },
          { label: "Calendar", page: PAGES.calendar },
        ],
      },
    ],
  },
  {
    label: "Play",
    children: [
      { label: "Quiz", page: PAGES.quiz },
      { label: "Snake", page: PAGES.snake },
    ],
  },
];
/** The tree's rows. */
const TREE_SHOWN = 15;

export class TreePage extends Component<object, { readonly over: string }> {
  override state = { over: "" };

  override render(): Child {
    return h(
      DemoFrame,
      { page: PAGES.tree, hint: "Enter opens or goes; Left shuts" },
      h(Tree, {
        nodes: NODES,
        guides: true,
        shown: TREE_SHOWN,
        open: ["Text"],
        autoFocus: true,
        onChoose: (node, session) => {
          if (node.page !== undefined) {
            this.services.goto(session, node.page);
          }
        },
        onHover: (node) => {
          this.setState({ over: node?.label ?? "" });
        },
      }),
      h(Gap, {}),
      h(Text, { text: this.state.over === "" ? "Point at an item" : `Pointing at ${this.state.over}`, foreground: Colour.Yellow }),
    );
  }
}
