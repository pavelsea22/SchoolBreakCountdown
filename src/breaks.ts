export type BreakType = "break" | "holiday" | "conference" | "early_dismissal";

export interface SchoolBreak {
  name: string;
  type: BreakType;
  start: string; // ISO 8601 date (YYYY-MM-DD)
  end: string;   // ISO 8601 date (YYYY-MM-DD), same as start for single-day events
  notes?: string;
}

export const schoolBreaks: SchoolBreak[] = [
  // --- Multi-day Breaks ---
  {
    name: "Winter Break",
    type: "break",
    start: "2025-12-22",
    end: "2026-01-02",
  },
  {
    name: "Mid-Winter Break",
    type: "break",
    start: "2026-02-16",
    end: "2026-02-20",
    notes: "Includes Presidents Day",
  },
  {
    name: "Spring Break",
    type: "break",
    start: "2026-04-13",
    end: "2026-04-17",
  },

  // --- Holidays (single-day, no school) ---
  {
    name: "State In-Service Day",
    type: "holiday",
    start: "2025-10-10",
    end: "2025-10-10",
  },
  {
    name: "Veterans Day Observed",
    type: "holiday",
    start: "2025-11-11",
    end: "2025-11-11",
  },
  {
    name: "Thanksgiving & Native American Heritage Day",
    type: "holiday",
    start: "2025-11-27",
    end: "2025-11-28",
  },
  {
    name: "Martin Luther King, Jr. Day",
    type: "holiday",
    start: "2026-01-19",
    end: "2026-01-19",
  },
  {
    name: "Memorial Day",
    type: "holiday",
    start: "2026-05-25",
    end: "2026-05-25",
  },
  {
    name: "Juneteenth",
    type: "holiday",
    start: "2026-06-19",
    end: "2026-06-19",
  },

  // --- Conference Days ---
  {
    name: "Family-Teacher Conference Days",
    type: "conference",
    start: "2025-11-24",
    end: "2025-11-26",
    notes: "Elementary and K-8 schools only; most middle schools remain open",
  },

  // --- Early Dismissal Days ---
  {
    name: "Early Dismissal",
    type: "early_dismissal",
    start: "2025-12-19",
    end: "2025-12-19",
    notes: "1-hour early dismissal",
  },
  {
    name: "Last Day of School Early Dismissal",
    type: "early_dismissal",
    start: "2026-06-17",
    end: "2026-06-17",
    notes: "60-minute early dismissal",
  },
];
