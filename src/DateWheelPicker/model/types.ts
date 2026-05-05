import type React from 'react';

/**
 * Props for {@link DateWheelPicker}.
 *
 * @remarks
 * This component is controlled. Pass the current {@link Date} through `date`
 * and update that value from `onDateChange`.
 *
 * @example
 * ```tsx
 * const [date, setDate] = useState(new Date());
 *
 * <DateWheelPicker
 *   date={date}
 *   mode="date"
 *   onDateChange={setDate}
 * />
 * ```
 */
export type DatePickerProps = {
  /**
   * Controlled selected value.
   *
   * The picker always renders from this date, so keep it in sync with
   * `onDateChange`.
   */
  date: Date;

  /**
   * Locale used to format month, day, and period labels.
   *
   * When omitted, the runtime locale is used.
   */
  locale?: string;

  /**
   * Maximum selectable value.
   *
   * Restricts both the visible wheel options and the emitted date.
   */
  maximumDate?: Date;

  /**
   * Minimum selectable value.
   *
   * Restricts both the visible wheel options and the emitted date.
   */
  minimumDate?: Date;

  /**
   * Minute step used in time mode.
   *
   * @remarks
   * Incoming values are rounded to the nearest valid minute before the picker
   * renders and before `onDateChange` fires.
   */
  minuteInterval?: 1 | 2 | 3 | 4 | 5 | 6 | 10 | 12 | 15 | 20 | 30;

  /**
   * Controls whether the wheel edits a calendar date or a clock time.
   *
   * @defaultValue "date"
   */
  mode?: 'date' | 'time';

  /**
   * Called whenever the centered wheel selection changes.
   *
   * @remarks
   * This callback fires live while the wheel is moving, not only after it
   * settles.
   */
  onDateChange?: (date: Date) => void;

  /**
   * Reports whether any wheel is currently moving.
   */
  onStateChange?: (state: 'spinning' | 'idle') => void;

  /**
   * Edits the value using a specific timezone offset.
   *
   * @remarks
   * Useful when the stored `Date` should be presented as another timezone's
   * local clock without changing the public API shape.
   */
  timeZoneOffsetInMinutes?: number;

  /**
   * Chooses whether 12/24-hour behavior follows the locale or device setting.
   *
   * @defaultValue "locale"
   */
  is24hourSource?: 'locale' | 'device';

  /**
   * Background color for the wheel surface and Skia overlay.
   */
  backgroundColor?: HexColor;

  /**
   * Color for the active centered row and guide accents.
   */
  activeFontColor?: HexColor;

  /**
   * Color for inactive rows outside the center selection area.
   */
  disableFontColor?: string;

  /**
   * Enables React Native font scaling for row labels.
   *
   * @defaultValue false
   */
  allowFontScaling?: boolean;

  /**
   * Font size used for wheel labels.
   */
  fontSize?: number;

  /**
   * Optional font family applied to wheel labels.
   */
  fontFamily?: string;

  /**
   * Height of each selectable row.
   *
   * Values less than or equal to zero fall back to the internal default.
   */
  rowHeight?: number;

  /**
   * Number of visible rows in each wheel column.
   *
   * Even values are normalized to an odd count so the active row remains
   * centered.
   */
  visibleRows?: number;
};

/**
 * Hex-style color string.
 */
export type HexColor = `#${string}`;

/**
 * Supported top-level picker modes.
 */
export type PickerMode = NonNullable<DatePickerProps['mode']>;

/**
 * Selectable row rendered by a wheel column.
 */
export type PickerOption = { label: string; value: number };

/**
 * Date wheel parts used in `mode="date"`.
 */
export type DatePartKey = 'year' | 'month' | 'day';

/**
 * Time wheel parts used in `mode="time"`.
 */
export type TimePartKey = 'hour' | 'minute' | 'period';

/**
 * Low-level props for an individual wheel column.
 *
 * @remarks
 * This is exported mainly for advanced composition and typing. Most consumers
 * should use {@link DatePickerProps} with {@link DateWheelPicker} instead.
 */
export type WheelColumnProps = {
  options: PickerOption[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  onStateChange?: (state: 'spinning' | 'idle') => void;
  backgroundColor: HexColor;
  activeFontColor: HexColor;
  disableFontColor: string;
  fontSize: number;
  fontFamily?: string;
  allowFontScaling: boolean;
  rowHeight: number;
  wheelHeight: number;
  pickerPadding: number;
  flex?: number;
};

/**
 * Column definition generated for the picker's internal wheel layout.
 */
export type PickerColumn = Pick<
  WheelColumnProps,
  'options' | 'selectedValue' | 'onValueChange' | 'flex'
> & {
  key: React.Key;
};
