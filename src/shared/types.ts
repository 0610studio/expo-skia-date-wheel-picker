// Types shared by every wheel picker.

/**
 * Hex-style color string.
 */
export type HexColor = `#${string}`;

/**
 * Picker background: a hex color or `"transparent"`.
 */
export type PickerBackgroundColor = HexColor | 'transparent';

/**
 * Selectable row rendered by a wheel column.
 */
export type PickerOption = { label: string; value: number };

/**
 * Look-and-feel props shared by {@link DateWheelPicker} and {@link WheelPicker}.
 */
export type WheelAppearanceProps = {
  /**
   * Reports whether any wheel is currently moving.
   */
  onStateChange?: (state: 'spinning' | 'idle') => void;

  /**
   * Background color behind the wheels.
   *
   * @remarks
   * The edge fade is applied to the row labels themselves, so the picker can
   * sit on translucent surfaces such as iOS sheets.
   *
   * @defaultValue "transparent"
   */
  backgroundColor?: PickerBackgroundColor;

  /**
   * Label opacity at the very top and bottom edge of each wheel.
   *
   * Rows fade linearly from fully opaque next to the center row down to this
   * value at the edge. Clamped to `0`–`1`.
   *
   * @defaultValue 0
   */
  edgeOpacity?: number;

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
   *
   * @defaultValue 22
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
   *
   * @defaultValue 40
   */
  rowHeight?: number;

  /**
   * Number of visible rows in each wheel column.
   *
   * Even values are normalized to an odd count so the active row remains
   * centered. Values below `3` fall back to the default.
   *
   * @defaultValue 5
   */
  visibleRows?: number;
};

/**
 * Low-level props for an individual wheel column.
 *
 * @remarks
 * This is exported mainly for advanced composition and typing. Most consumers
 * should use {@link DateWheelPicker} for dates and times, or
 * {@link WheelPicker} for any other list.
 */
export type WheelColumnProps = {
  options: PickerOption[];
  selectedValue: number;
  onValueChange: (value: number) => void;
  onStateChange?: (state: 'spinning' | 'idle') => void;
  backgroundColor: PickerBackgroundColor;
  activeFontColor: HexColor;
  disableFontColor: string;
  edgeOpacity: number;
  fontSize: number;
  fontFamily?: string;
  allowFontScaling: boolean;
  rowHeight: number;
  wheelHeight: number;
  pickerPadding: number;
  flex?: number;
};
