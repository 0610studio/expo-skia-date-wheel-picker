import type { DatePickerProps, HexColor, PickerOption } from './types';

export const DEFAULT_ROW_HEIGHT = 40;
export const DEFAULT_VISIBLE_ROWS = 5;
export const DEFAULT_FONT_SIZE = 22;
export const DEFAULT_YEAR_SPAN = 100;
export const DEFAULT_MINUTE_INTERVAL = 1;
export const HOUR_OPTIONS_24 = Array.from({ length: 24 }, (_, index) => index);
export const HOUR_OPTIONS_12 = Array.from(
  { length: 12 },
  (_, index) => index + 1,
);

const HEX_COLOR_REGEX = /^#[0-9A-Fa-f]{6}$/;
const HEX_COLOR_WITH_ALPHA_REGEX = /^#[0-9A-Fa-f]{8}$/;

export const getClampedIndex = (index: number, totalCount: number) => {
  if (totalCount <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(totalCount - 1, index));
};

export const withHexAlpha = (
  color: string,
  alpha: string,
  fallbackColor: string,
) => {
  if (HEX_COLOR_WITH_ALPHA_REGEX.test(color)) {
    return `${color.slice(0, 7)}${alpha}`;
  }

  if (HEX_COLOR_REGEX.test(color)) {
    return `${color}${alpha}`;
  }

  return fallbackColor;
};

export const getNormalizedRowHeight = (rowHeight?: number) => {
  if (!rowHeight || rowHeight <= 0) {
    return DEFAULT_ROW_HEIGHT;
  }

  return Math.round(rowHeight);
};

export const getNormalizedVisibleRows = (visibleRows?: number) => {
  const baseVisibleRows =
    !visibleRows || visibleRows < 3
      ? DEFAULT_VISIBLE_ROWS
      : Math.floor(visibleRows);

  return baseVisibleRows % 2 === 0 ? baseVisibleRows + 1 : baseVisibleRows;
};

export const getClampedDate = (
  date: Date,
  minimumDate?: Date,
  maximumDate?: Date,
): Date => {
  const minimumTime = minimumDate?.getTime();
  const maximumTime = maximumDate?.getTime();
  const nextTime = date.getTime();

  if (minimumTime !== undefined && nextTime < minimumTime) {
    return new Date(minimumTime);
  }

  if (maximumTime !== undefined && nextTime > maximumTime) {
    return new Date(maximumTime);
  }

  return new Date(nextTime);
};

export const getMinuteStep = (
  minuteInterval?: DatePickerProps['minuteInterval'],
) => minuteInterval ?? DEFAULT_MINUTE_INTERVAL;

export const getRoundedDate = (
  date: Date,
  minuteInterval?: DatePickerProps['minuteInterval'],
): Date => {
  const minuteStep = getMinuteStep(minuteInterval);
  const roundedDate = new Date(date.getTime());
  const roundedMinutes =
    Math.round(roundedDate.getMinutes() / minuteStep) * minuteStep;

  roundedDate.setMinutes(roundedMinutes, 0, 0);

  if (roundedDate.getMinutes() === 60) {
    roundedDate.setHours(roundedDate.getHours() + 1, 0, 0, 0);
  }

  return roundedDate;
};

export const toPickerDate = (
  date: Date,
  timeZoneOffsetInMinutes?: number,
): Date => {
  if (timeZoneOffsetInMinutes === undefined) {
    return new Date(date.getTime());
  }

  return new Date(
    date.getTime() +
      (timeZoneOffsetInMinutes + date.getTimezoneOffset()) * 60000,
  );
};

export const fromPickerDate = (
  date: Date,
  timeZoneOffsetInMinutes?: number,
): Date => {
  if (timeZoneOffsetInMinutes === undefined) {
    return new Date(date.getTime());
  }

  return new Date(
    date.getTime() -
      (timeZoneOffsetInMinutes + date.getTimezoneOffset()) * 60000,
  );
};

export const getDaysInMonth = (year: number, month: number) =>
  new Date(year, month, 0).getDate();

export const getResolvedLocale = (locale?: string) =>
  locale ?? Intl.DateTimeFormat().resolvedOptions().locale;

export const uses24HourClock = (
  locale: string,
  source?: DatePickerProps['is24hourSource'],
) => {
  const targetLocale = source === 'device' ? undefined : locale;
  const parts = new Intl.DateTimeFormat(targetLocale, {
    hour: 'numeric',
  }).formatToParts(new Date(2024, 0, 1, 13, 0));

  return !parts.some(part => part.type === 'dayPeriod');
};

export const getMinuteOptions = (
  minuteInterval?: DatePickerProps['minuteInterval'],
): PickerOption[] => {
  const minuteStep = getMinuteStep(minuteInterval);

  return Array.from({ length: Math.floor(60 / minuteStep) }, (_, index) => {
    const value = index * minuteStep;

    return {
      value,
      label: value.toString().padStart(2, '0'),
    };
  });
};

export const formatMonthLabel = (month: number, locale: string) =>
  new Intl.DateTimeFormat(locale, { month: 'short' }).format(
    new Date(2024, month - 1, 1),
  );

export const formatDayLabel = (
  year: number,
  month: number,
  day: number,
  locale: string,
) =>
  new Intl.DateTimeFormat(locale, { day: 'numeric' }).format(
    new Date(year, month - 1, day),
  );

export const formatYearLabel = (year: number, locale: string) =>
  new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(
    new Date(year, 0, 1),
  );

export const formatHourLabel = (hour: number) =>
  hour.toString().padStart(2, '0');

export const getPeriodLabel = (period: 'am' | 'pm', locale: string) => {
  const hour = period === 'am' ? 9 : 21;
  const parts = new Intl.DateTimeFormat(locale, {
    hour: 'numeric',
    hour12: true,
  }).formatToParts(new Date(2024, 0, 1, hour, 0));

  return (
    parts.find(part => part.type === 'dayPeriod')?.value ??
    (period === 'am' ? 'AM' : 'PM')
  );
};

export const getPeriodFromHour = (hour: number): 'am' | 'pm' =>
  hour >= 12 ? 'pm' : 'am';

export const to12Hour = (hour: number) => {
  const normalizedHour = hour % 12;

  return normalizedHour === 0 ? 12 : normalizedHour;
};

export const to24Hour = (hour: number, period: 'am' | 'pm') => {
  if (period === 'am') {
    return hour === 12 ? 0 : hour;
  }

  return hour === 12 ? 12 : hour + 12;
};

export const getYearRange = (
  date: Date,
  minimumDate?: Date,
  maximumDate?: Date,
): number[] => {
  const selectedYear = date.getFullYear();
  const minimumYear =
    minimumDate?.getFullYear() ?? selectedYear - DEFAULT_YEAR_SPAN;
  const maximumYear =
    maximumDate?.getFullYear() ?? selectedYear + DEFAULT_YEAR_SPAN;
  const totalYears = Math.max(maximumYear - minimumYear + 1, 1);

  return Array.from({ length: totalYears }, (_, index) => minimumYear + index);
};

export const buildDateFromParts = (
  baseDate: Date,
  updates: Partial<{
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
  }>,
  timeZoneOffsetInMinutes?: number,
) => {
  const pickerDate = toPickerDate(baseDate, timeZoneOffsetInMinutes);
  const year = updates.year ?? pickerDate.getFullYear();
  const month = updates.month ?? pickerDate.getMonth() + 1;
  const day = Math.min(
    updates.day ?? pickerDate.getDate(),
    getDaysInMonth(year, month),
  );
  const hour = updates.hour ?? pickerDate.getHours();
  const minute = updates.minute ?? pickerDate.getMinutes();
  const nextPickerDate = new Date(year, month - 1, day, hour, minute, 0, 0);

  return fromPickerDate(nextPickerDate, timeZoneOffsetInMinutes);
};

export const DEFAULT_PICKER_BACKGROUND_COLOR: HexColor = '#ffffff';
export const DEFAULT_ACTIVE_FONT_COLOR: HexColor = '#000000';
export const DEFAULT_DISABLE_FONT_COLOR = '#ccc';
