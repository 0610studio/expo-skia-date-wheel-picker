import { useCallback, useEffect, useMemo, useState } from "react";

import type {
  DatePartKey,
  DatePickerProps,
  PickerColumn,
  PickerMode,
  TimePartKey,
} from "./types";
import {
  buildDateFromParts,
  DEFAULT_ACTIVE_FONT_COLOR,
  DEFAULT_DISABLE_FONT_COLOR,
  DEFAULT_PICKER_BACKGROUND_COLOR,
  DEFAULT_YEAR_SPAN,
  formatHourLabel,
  getClampedDate,
  getDaysInMonth,
  getMinuteOptions,
  getNormalizedRowHeight,
  getNormalizedVisibleRows,
  getPeriodFromHour,
  getPeriodLabel,
  getResolvedLocale,
  getRoundedDate,
  getYearRange,
  HOUR_OPTIONS_12,
  HOUR_OPTIONS_24,
  to12Hour,
  to24Hour,
  toPickerDate,
  uses24HourClock,
} from "./utils";

type UseDateWheelPickerParams = Required<
  Pick<
    DatePickerProps,
    "allowFontScaling" | "is24hourSource" | "mode" | "fontSize"
  >
> &
  Omit<
    DatePickerProps,
    "allowFontScaling" | "is24hourSource" | "mode" | "fontSize"
  >;

export type UseDateWheelPickerResult = {
  allowFontScaling: boolean;
  fontFamily?: string;
  fontSize: number;
  onStateChange?: DatePickerProps["onStateChange"];
  pickerActiveFontColor: NonNullable<DatePickerProps["activeFontColor"]>;
  pickerBackgroundColor: NonNullable<DatePickerProps["backgroundColor"]>;
  pickerDisableFontColor: string;
  pickerMode: PickerMode;
  pickerPadding: number;
  pickerRowHeight: number;
  pickerVisibleRows: number;
  wheelHeight: number;
  dateColumns: PickerColumn[];
  timeColumns: PickerColumn[];
};

const getDateColumns = ({
  yearOptions,
  year,
  monthOptions,
  month,
  dayOptions,
  day,
  handleDatePartChange,
}: {
  yearOptions: PickerColumn["options"];
  year: number;
  monthOptions: PickerColumn["options"];
  month: number;
  dayOptions: PickerColumn["options"];
  day: number;
  handleDatePartChange: (part: DatePartKey, value: number) => void;
}): PickerColumn[] => [
  {
    key: "year",
    options: yearOptions,
    selectedValue: year,
    onValueChange: (value) => {
      handleDatePartChange("year", value);
    },
    flex: 1.2,
  },
  {
    key: "month",
    options: monthOptions,
    selectedValue: month,
    onValueChange: (value) => {
      handleDatePartChange("month", value);
    },
  },
  {
    key: "day",
    options: dayOptions,
    selectedValue: day,
    onValueChange: (value) => {
      handleDatePartChange("day", value);
    },
  },
];

const getTimeColumns = ({
  is24Hour,
  periodOptions,
  period,
  hourOptions,
  hour,
  minuteOptions,
  minute,
  handleTimePartChange,
}: {
  is24Hour: boolean;
  periodOptions: PickerColumn["options"];
  period: "am" | "pm";
  hourOptions: PickerColumn["options"];
  hour: number;
  minuteOptions: PickerColumn["options"];
  minute: number;
  handleTimePartChange: (part: TimePartKey, value: number) => void;
}): PickerColumn[] => {
  const nextColumns: PickerColumn[] = [];

  if (!is24Hour) {
    nextColumns.push({
      key: "period",
      options: periodOptions,
      selectedValue: period === "am" ? 0 : 1,
      onValueChange: (value) => {
        handleTimePartChange("period", value);
      },
      flex: 0.9,
    });
  }

  nextColumns.push(
    {
      key: "hour",
      options: hourOptions,
      selectedValue: is24Hour ? hour : to12Hour(hour),
      onValueChange: (value) => {
        handleTimePartChange("hour", value);
      },
    },
    {
      key: "minute",
      options: minuteOptions,
      selectedValue: minute,
      onValueChange: (value) => {
        handleTimePartChange("minute", value);
      },
    },
  );

  return nextColumns;
};

export const useDateWheelPicker = ({
  date,
  locale,
  maximumDate,
  minimumDate,
  minuteInterval,
  mode,
  onDateChange,
  onStateChange,
  timeZoneOffsetInMinutes,
  is24hourSource,
  backgroundColor,
  activeFontColor,
  disableFontColor,
  allowFontScaling,
  fontSize,
  fontFamily,
  rowHeight,
  visibleRows,
}: UseDateWheelPickerParams): UseDateWheelPickerResult => {
  const resolvedLocale = useMemo(() => getResolvedLocale(locale), [locale]);
  const pickerMode: PickerMode = mode;
  const pickerBackgroundColor =
    backgroundColor ?? DEFAULT_PICKER_BACKGROUND_COLOR;
  const pickerActiveFontColor = activeFontColor ?? DEFAULT_ACTIVE_FONT_COLOR;
  const pickerDisableFontColor = disableFontColor ?? DEFAULT_DISABLE_FONT_COLOR;
  const pickerRowHeight = useMemo(
    () => getNormalizedRowHeight(rowHeight),
    [rowHeight],
  );
  const pickerVisibleRows = useMemo(
    () => getNormalizedVisibleRows(visibleRows),
    [visibleRows],
  );
  const wheelHeight = useMemo(
    () => pickerRowHeight * pickerVisibleRows,
    [pickerRowHeight, pickerVisibleRows],
  );
  const pickerPadding = useMemo(
    () => pickerRowHeight * Math.floor(pickerVisibleRows / 2),
    [pickerRowHeight, pickerVisibleRows],
  );
  const is24Hour = useMemo(
    () => uses24HourClock(resolvedLocale, is24hourSource),
    [is24hourSource, resolvedLocale],
  );

  const normalizedExternalDate = useMemo(() => {
    const roundedDate = getRoundedDate(date, minuteInterval);

    return getClampedDate(roundedDate, minimumDate, maximumDate);
  }, [date, maximumDate, minimumDate, minuteInterval]);

  const [selectedDate, setSelectedDate] = useState<Date>(
    normalizedExternalDate,
  );
  const [yearRangeAnchor, setYearRangeAnchor] = useState(
    normalizedExternalDate.getFullYear(),
  );

  useEffect(() => {
    setSelectedDate(normalizedExternalDate);
  }, [normalizedExternalDate]);

  useEffect(() => {
    if (minimumDate || maximumDate) {
      return;
    }

    const nextExternalYear = normalizedExternalDate.getFullYear();
    const minimumYear = yearRangeAnchor - DEFAULT_YEAR_SPAN;
    const maximumYear = yearRangeAnchor + DEFAULT_YEAR_SPAN;

    if (nextExternalYear < minimumYear || nextExternalYear > maximumYear) {
      setYearRangeAnchor(nextExternalYear);
    }
  }, [maximumDate, minimumDate, normalizedExternalDate, yearRangeAnchor]);

  const pickerDate = useMemo(
    () => toPickerDate(selectedDate, timeZoneOffsetInMinutes),
    [selectedDate, timeZoneOffsetInMinutes],
  );
  const year = pickerDate.getFullYear();
  const month = pickerDate.getMonth() + 1;
  const day = pickerDate.getDate();
  const hour = pickerDate.getHours();
  const minute = pickerDate.getMinutes();
  const period = getPeriodFromHour(hour);

  const minimumPickerDate = useMemo(
    () =>
      minimumDate
        ? toPickerDate(minimumDate, timeZoneOffsetInMinutes)
        : undefined,
    [minimumDate, timeZoneOffsetInMinutes],
  );
  const maximumPickerDate = useMemo(
    () =>
      maximumDate
        ? toPickerDate(maximumDate, timeZoneOffsetInMinutes)
        : undefined,
    [maximumDate, timeZoneOffsetInMinutes],
  );

  const yearOptions = useMemo(() => {
    const yearFormatter = new Intl.DateTimeFormat(resolvedLocale, {
      year: "numeric",
    });

    return getYearRange(
      new Date(yearRangeAnchor, 0, 1),
      minimumPickerDate,
      maximumPickerDate,
    ).map((value) => ({
      value,
      label: yearFormatter.format(new Date(value, 0, 1)),
    }));
  }, [maximumPickerDate, minimumPickerDate, resolvedLocale, yearRangeAnchor]);

  const monthOptions = useMemo(() => {
    const monthFormatter = new Intl.DateTimeFormat(resolvedLocale, {
      month: "short",
    });
    const minimumMonth =
      minimumPickerDate?.getFullYear() === year
        ? minimumPickerDate.getMonth() + 1
        : 1;
    const maximumMonth =
      maximumPickerDate?.getFullYear() === year
        ? maximumPickerDate.getMonth() + 1
        : 12;

    return Array.from(
      { length: maximumMonth - minimumMonth + 1 },
      (_, index) => {
        const value = minimumMonth + index;

        return {
          value,
          label: monthFormatter.format(new Date(2024, value - 1, 1)),
        };
      },
    );
  }, [maximumPickerDate, minimumPickerDate, resolvedLocale, year]);

  const dayOptions = useMemo(() => {
    const dayFormatter = new Intl.DateTimeFormat(resolvedLocale, {
      day: "numeric",
    });
    const totalDays = getDaysInMonth(year, month);
    const minimumDay =
      minimumPickerDate?.getFullYear() === year &&
      minimumPickerDate.getMonth() + 1 === month
        ? minimumPickerDate.getDate()
        : 1;
    const maximumDay =
      maximumPickerDate?.getFullYear() === year &&
      maximumPickerDate.getMonth() + 1 === month
        ? maximumPickerDate.getDate()
        : totalDays;

    return Array.from({ length: maximumDay - minimumDay + 1 }, (_, index) => {
      const value = minimumDay + index;

      return {
        value,
        label: dayFormatter.format(new Date(year, month - 1, value)),
      };
    });
  }, [maximumPickerDate, minimumPickerDate, month, resolvedLocale, year]);

  const hourOptions = useMemo(
    () =>
      (is24Hour ? HOUR_OPTIONS_24 : HOUR_OPTIONS_12).map((value) => ({
        value,
        label: formatHourLabel(value),
      })),
    [is24Hour],
  );

  const minuteOptions = useMemo(
    () => getMinuteOptions(minuteInterval),
    [minuteInterval],
  );

  const periodOptions = useMemo(
    () => [
      { value: 0, label: getPeriodLabel("am", resolvedLocale) },
      { value: 1, label: getPeriodLabel("pm", resolvedLocale) },
    ],
    [resolvedLocale],
  );

  const updateDate = useCallback(
    (nextDate: Date) => {
      const roundedDate = getRoundedDate(nextDate, minuteInterval);
      const clampedDate = getClampedDate(roundedDate, minimumDate, maximumDate);

      setSelectedDate(clampedDate);
      onDateChange?.(clampedDate);
    },
    [maximumDate, minimumDate, minuteInterval, onDateChange],
  );

  const handleDatePartChange = useCallback(
    (part: DatePartKey, value: number) => {
      updateDate(
        buildDateFromParts(
          selectedDate,
          { [part]: value },
          timeZoneOffsetInMinutes,
        ),
      );
    },
    [selectedDate, timeZoneOffsetInMinutes, updateDate],
  );

  const handleTimePartChange = useCallback(
    (part: TimePartKey, value: number) => {
      if (part === "minute") {
        updateDate(
          buildDateFromParts(
            selectedDate,
            { minute: value },
            timeZoneOffsetInMinutes,
          ),
        );
        return;
      }

      if (part === "hour") {
        const nextHour = is24Hour ? value : to24Hour(value, period);
        updateDate(
          buildDateFromParts(
            selectedDate,
            { hour: nextHour },
            timeZoneOffsetInMinutes,
          ),
        );
        return;
      }

      const nextHour = to24Hour(to12Hour(hour), value === 0 ? "am" : "pm");
      updateDate(
        buildDateFromParts(
          selectedDate,
          { hour: nextHour },
          timeZoneOffsetInMinutes,
        ),
      );
    },
    [hour, is24Hour, period, selectedDate, timeZoneOffsetInMinutes, updateDate],
  );

  const dateColumns = useMemo(
    () =>
      getDateColumns({
        yearOptions,
        year,
        monthOptions,
        month,
        dayOptions,
        day,
        handleDatePartChange,
      }),
    [
      day,
      dayOptions,
      handleDatePartChange,
      month,
      monthOptions,
      year,
      yearOptions,
    ],
  );

  const timeColumns = useMemo(
    () =>
      getTimeColumns({
        is24Hour,
        periodOptions,
        period,
        hourOptions,
        hour,
        minuteOptions,
        minute,
        handleTimePartChange,
      }),
    [
      handleTimePartChange,
      hour,
      hourOptions,
      is24Hour,
      minute,
      minuteOptions,
      period,
      periodOptions,
    ],
  );

  return {
    allowFontScaling,
    fontFamily,
    fontSize,
    onStateChange,
    pickerActiveFontColor,
    pickerBackgroundColor,
    pickerDisableFontColor,
    pickerMode,
    pickerPadding,
    pickerRowHeight,
    pickerVisibleRows,
    wheelHeight,
    dateColumns,
    timeColumns,
  };
};
