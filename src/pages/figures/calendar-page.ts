// Page 405, this month's calendar: today marked, the sample articles'
// days marked, and a day to choose.

import { Colour } from "neottx-server-ts-protocol";
import { Calendar, type CalendarDate, type Child, Component, Gap, h, Text } from "neottx-server-ts-ui-components";
import { ARTICLES } from "../../content/articles.ts";
import { DemoFrame } from "../../parts/demo-frame.ts";
import { PAGES } from "../../site/page-numbers.ts";

function dateOfDay(ms: number): CalendarDate {
  const date = new Date(ms);
  return { year: date.getUTCFullYear(), month: date.getUTCMonth(), day: date.getUTCDate() };
}

export class CalendarPage extends Component<object, { readonly chosen: CalendarDate | null }> {
  override state: { readonly chosen: CalendarDate | null } = { chosen: null };

  override render(): Child {
    const today = this.services.epochMs();
    const { year, month } = dateOfDay(today);
    const { chosen } = this.state;
    return h(
      DemoFrame,
      { page: PAGES.calendar, hint: "Arrows move; Page Up/Down a month; Enter" },
      h(Calendar, {
        year,
        month,
        today,
        marked: ARTICLES.map((article) => dateOfDay(article.date)),
        selectable: true,
        autoFocus: true,
        onChoose: (date) => {
          this.setState({ chosen: date });
        },
      }),
      h(Gap, {}),
      h(Text, { text: chosen === null ? "No day chosen" : `Chosen: ${chosen.day}.${chosen.month + 1}.${chosen.year}`, foreground: Colour.Yellow }),
    );
  }
}
