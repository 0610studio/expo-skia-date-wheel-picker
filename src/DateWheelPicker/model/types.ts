import type React from 'react';

import type {
  WheelAppearanceProps,
  WheelColumnProps,
} from '../../shared/types';

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
export type DatePickerProps = WheelAppearanceProps & {
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
};

/**
 * Supported top-level picker modes.
 */
export type PickerMode = NonNullable<DatePickerProps['mode']>;

/**
 * Date wheel parts used in `mode="date"`.
 */
export type DatePartKey = 'year' | 'month' | 'day';

/**
 * Time wheel parts used in `mode="time"`.
 */
export type TimePartKey = 'hour' | 'minute' | 'period';

/**
 * Column definition generated for the picker's internal wheel layout.
 */
export type PickerColumn = Pick<
  WheelColumnProps,
  'options' | 'selectedValue' | 'onValueChange' | 'flex'
> & {
  key: React.Key;
};
