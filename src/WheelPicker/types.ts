import type { WheelAppearanceProps } from '../shared/types';

/**
 * Value a {@link WheelPicker} option can hold.
 */
export type WheelPickerValue = string | number;

/**
 * One row of a {@link WheelPicker}.
 */
export type WheelPickerOption<T extends WheelPickerValue = WheelPickerValue> = {
  /**
   * Text shown in the row.
   */
  label: string;

  /**
   * Value reported through `onValueChange`.
   *
   * Values are compared with `===`, so keep them unique within `options`.
   */
  value: T;
};

/**
 * Props for {@link WheelPicker}.
 *
 * @remarks
 * This component is controlled. Pass the current value through `value` and
 * update it from `onValueChange`.
 *
 * @example
 * ```tsx
 * const [minutes, setMinutes] = useState(30);
 *
 * <WheelPicker
 *   options={[
 *     { label: "10 minutes before", value: 10 },
 *     { label: "30 minutes before", value: 30 },
 *     { label: "1 hour before", value: 60 },
 *   ]}
 *   value={minutes}
 *   onValueChange={setMinutes}
 * />
 * ```
 */
export type WheelPickerProps<T extends WheelPickerValue = WheelPickerValue> =
  WheelAppearanceProps & {
    /**
     * Rows in display order.
     */
    options: readonly WheelPickerOption<T>[];

    /**
     * Controlled selected value.
     *
     * When no option matches, the wheel shows the first row.
     */
    value: T;

    /**
     * Called whenever the centered row changes.
     *
     * @remarks
     * This callback fires live while the wheel is moving, not only after it
     * settles.
     */
    onValueChange?: (value: T) => void;
  };
