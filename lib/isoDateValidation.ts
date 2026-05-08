const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export function parseCalendarDateFromIsoString(value: string): Date | null {
  const trimmed = value.trim();
  const match = ISO_DATE_PATTERN.exec(trimmed);
  if (match === null) {
    return null;
  }
  const year = Number(match[1]);
  const monthIndex = Number(match[2]) - 1;
  const day = Number(match[3]);
  const parsed = new Date(year, monthIndex, day);
  if (
    parsed.getFullYear() !== year ||
    parsed.getMonth() !== monthIndex ||
    parsed.getDate() !== day
  ) {
    return null;
  }
  return parsed;
}

export function calendarDayStartFromClock(clock: Date): Date {
  return new Date(clock.getFullYear(), clock.getMonth(), clock.getDate());
}

export function formatLocalIsoDate(clock: Date): string {
  const year = clock.getFullYear();
  const month = clock.getMonth() + 1;
  const day = clock.getDate();
  const pad = (n: number): string => (n < 10 ? `0${n}` : String(n));
  return `${year}-${pad(month)}-${pad(day)}`;
}

export function validateDateNotAfterToday(
  value: string,
  clock: Date,
  futureMessage: string,
): true | string {
  const trimmed = value.trim();
  if (trimmed === "") {
    return true;
  }
  const parsed = parseCalendarDateFromIsoString(trimmed);
  if (parsed === null) {
    return "Enter a valid date";
  }
  const todayStart = calendarDayStartFromClock(clock);
  if (parsed.getTime() > todayStart.getTime()) {
    return futureMessage;
  }
  return true;
}

export function validateDateNotBeforeToday(
  value: string,
  clock: Date,
  pastMessage: string,
): true | string {
  const trimmed = value.trim();
  if (trimmed === "") {
    return true;
  }
  const parsed = parseCalendarDateFromIsoString(trimmed);
  if (parsed === null) {
    return "Enter a valid date";
  }
  const todayStart = calendarDayStartFromClock(clock);
  if (parsed.getTime() < todayStart.getTime()) {
    return pastMessage;
  }
  return true;
}
