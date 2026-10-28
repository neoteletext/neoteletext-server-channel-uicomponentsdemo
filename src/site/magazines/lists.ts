// Magazine 3, navigation and lists.

import { h, type PageSpec } from "neoteletext-server-ts-ui-components";
import { ChoosingPage } from "../../pages/lists/choosing-page.ts";
import { LogsPage } from "../../pages/lists/logs-page.ts";
import { TablesPage } from "../../pages/lists/tables-page.ts";
import { MenusPage } from "../../pages/navigation/menus-page.ts";
import { SectionsPage } from "../../pages/navigation/sections-page.ts";
import { TabsPage } from "../../pages/navigation/tabs-page.ts";
import { TreePage } from "../../pages/navigation/tree-page.ts";
import { PAGES } from "../page-numbers.ts";
import { OWN, OWN_TYPING, spec } from "../spec.ts";

export function listPages(): PageSpec[] {
  return [
    spec(PAGES.tabs, () => h(TabsPage, {}), OWN_TYPING),
    spec(PAGES.menus, () => h(MenusPage, {}), OWN_TYPING),
    spec(PAGES.tree, () => h(TreePage, {}), OWN),
    spec(PAGES.sections, () => h(SectionsPage, {}), OWN),
    spec(PAGES.choosing, () => h(ChoosingPage, {}), OWN),
    spec(PAGES.tables, () => h(TablesPage, {}), OWN),
    spec(PAGES.logs, () => h(LogsPage, {}), OWN),
  ];
}
