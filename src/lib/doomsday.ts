// doomsday.ts

const DAYS = {
  de: ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
};

const MONTHS = {
  de: ["", "Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  en: ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
};

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function getCenturyAnchor(year: number): number {
  const century = Math.floor(year / 100);
  return (5 * (century % 4) + 2) % 7;
}

export function getYearCode(year: number): number {
  const y = year % 100;
  return (y + Math.floor(y / 4)) % 7;
}

export function getMonthAnchor(month: number, isLeap: boolean): number {
  const anchors = [
    0, // padding (1-based index)
    isLeap ? 4 : 3, // Jan (4th in leap, 3rd in non-leap)
    isLeap ? 29 : 28, // Feb (last day of month)
    14, // Mar (Pi day)
    4, // Apr (4/4)
    9, // May (9-to-5)
    6, // Jun (6/6)
    11, // Jul (7-11)
    8, // Aug (8/8)
    5, // Sep (9-to-5)
    10, // Oct (10/10)
    7, // Nov (7-11)
    12, // Dec (12/12)
  ];
  return anchors[month];
}

export function calculateDoomsday(year: number, month: number, day: number): number {
  const centuryAnchor = getCenturyAnchor(year);
  const yearCode = getYearCode(year);
  const leap = isLeapYear(year);
  const monthAnchor = getMonthAnchor(month, leap);

  const yearDoomsday = (centuryAnchor + yearCode) % 7;
  const diff = day - monthAnchor;

  const dayOfWeek = (yearDoomsday + diff) % 7;
  return (dayOfWeek + 7) % 7;
}

export function getDayName(dayIndex: number, locale: 'de' | 'en' = 'de'): string {
  return DAYS[locale][dayIndex];
}

export function getMonthName(monthIndex: number, locale: 'de' | 'en' = 'de'): string {
  return MONTHS[locale][monthIndex];
}

export function generateRandomDate(startYear = 1800, endYear = 2199): { year: number, month: number, day: number } {
  const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
  const month = Math.floor(Math.random() * 12) + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  return { year, month, day };
}

export function generateRandomDateFromEpochs(epochs: number[]): { year: number, month: number, day: number } {
  if (epochs.length === 0) return generateRandomDate();
  const epoch = epochs[Math.floor(Math.random() * epochs.length)];
  const yearOffset = Math.floor(Math.random() * 100);
  const year = epoch + yearOffset;
  const month = Math.floor(Math.random() * 12) + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  return { year, month, day };
}
