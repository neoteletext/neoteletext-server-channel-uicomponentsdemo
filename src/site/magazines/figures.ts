// Magazine 4, figures and time.

import { h, type PageSpec } from "neottx-server-ts-ui-components";
import { BarsPage } from "../../pages/figures/bars-page.ts";
import { CalendarPage } from "../../pages/figures/calendar-page.ts";
import { ClockPage } from "../../pages/figures/clock-page.ts";
import { CountdownPage } from "../../pages/figures/countdown-page.ts";
import { HeatPage } from "../../pages/figures/heat-page.ts";
import { LinesPage } from "../../pages/figures/lines-page.ts";
import { PAGES } from "../page-numbers.ts";
import { OWN, spec } from "../spec.ts";

export function figurePages(): PageSpec[] {
  return [
    spec(PAGES.bars, () => h(BarsPage, {}), OWN),
    spec(PAGES.lines, () => h(LinesPage, {})),
    spec(PAGES.heat, () => h(HeatPage, {})),
    spec(PAGES.clock, () => h(ClockPage, {})),
    spec(PAGES.countdown, () => h(CountdownPage, {})),
    spec(PAGES.calendar, () => h(CalendarPage, {}), OWN),
  ];
}
