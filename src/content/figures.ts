// The made-up figures the charts draw: a week of visitors to the channel,
// and the hours of a week they came in.

import { Colour } from "neoteletext-server-ts-protocol";
import type { ChartRow, HeatRow } from "neoteletext-server-ts-ui-components";

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Visitors on each day of a week. */
export const VISITORS = [320, 410, 380, 520, 610, 890, 760];

export const VISITOR_BARS: readonly ChartRow[] = DAYS.map((label, index) => ({
  label,
  value: VISITORS[index] ?? 0,
  ...(index >= DAYS.length - 2 ? { foreground: Colour.Yellow } : {}),
}));

/** The channel's pages by visitors, a figure each. */
export const PAGE_BARS: readonly ChartRow[] = [
  { label: "Index", value: 980, foreground: Colour.Red },
  { label: "Snake", value: 610, foreground: Colour.Green },
  { label: "Quiz", value: 450, foreground: Colour.Yellow },
  { label: "Poll", value: 300, foreground: Colour.Cyan },
  { label: "Paint", value: 240, foreground: Colour.Magenta },
];

/** The hours of the day the heat map has, every three hours. */
const HOURS_SHOWN = 8;
/** The busiest stretch's index, the evening's. */
const BUSIEST = 6;
/** A stretch's share of the day's visitors at its busiest, and what each stretch from it takes off. */
const BUSIEST_SHARE = 1 / 10;
const FALL_A_STRETCH = 12;

/** Visitors by day and three-hour stretch: busiest in the evening and at the weekend. */
export const HEAT: readonly HeatRow[] = DAYS.map((label, day) => ({
  label,
  values: Array.from({ length: HOURS_SHOWN }, (_, hour) => Math.max(0, (VISITORS[day] ?? 0) * BUSIEST_SHARE - Math.abs(hour - BUSIEST) * FALL_A_STRETCH)),
}));

export const HEAT_HOURS = Array.from({ length: HOURS_SHOWN }, (_, index) => String(index * 3).padStart(2, "0"));
