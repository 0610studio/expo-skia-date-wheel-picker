import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import type { DatePickerProps, PickerColumn } from "./model/types";
import { useDateWheelPicker } from "./model/useDateWheelPicker";
import { DEFAULT_FONT_SIZE } from "./model/utils";
import WheelColumn from "./ui/WheelColumn";
import { styles } from "./ui/styles";

const DEFAULT_MODE = "date";
const DEFAULT_IS_24_HOUR_SOURCE = "locale";
const DEFAULT_ALLOW_FONT_SCALING = false;

const renderColumns = ({
  columns,
  pickerBackgroundColor,
  pickerActiveFontColor,
  pickerDisableFontColor,
  fontSize,
  fontFamily,
  allowFontScaling,
  pickerRowHeight,
  wheelHeight,
  pickerPadding,
  onStateChange,
}: {
  columns: PickerColumn[];
  pickerBackgroundColor: `#${string}`;
  pickerActiveFontColor: `#${string}`;
  pickerDisableFontColor: string;
  fontSize: number;
  fontFamily?: string;
  allowFontScaling: boolean;
  pickerRowHeight: number;
  wheelHeight: number;
  pickerPadding: number;
  onStateChange?: DatePickerProps["onStateChange"];
}) => {
  return columns.map((column) => (
    <WheelColumn
      key={column.key}
      options={column.options}
      selectedValue={column.selectedValue}
      onValueChange={column.onValueChange}
      onStateChange={onStateChange}
      backgroundColor={pickerBackgroundColor}
      activeFontColor={pickerActiveFontColor}
      disableFontColor={pickerDisableFontColor}
      fontSize={fontSize}
      fontFamily={fontFamily}
      allowFontScaling={allowFontScaling}
      rowHeight={pickerRowHeight}
      wheelHeight={wheelHeight}
      pickerPadding={pickerPadding}
      flex={column.flex}
    />
  ));
};

type WheelGroupProps = {
  columns: PickerColumn[];
  style: StyleProp<ViewStyle>;
  pickerBackgroundColor: `#${string}`;
  pickerActiveFontColor: `#${string}`;
  pickerDisableFontColor: string;
  fontSize: number;
  fontFamily?: string;
  allowFontScaling: boolean;
  pickerRowHeight: number;
  wheelHeight: number;
  pickerPadding: number;
  onStateChange?: DatePickerProps["onStateChange"];
};

function WheelGroup({ style, ...columnProps }: WheelGroupProps) {
  return <View style={style}>{renderColumns(columnProps)}</View>;
}

/**
 * Controlled date and time wheel picker for Expo and React Native.
 *
 * @remarks
 * Import this component from the package root and keep it controlled with a
 * `date` value plus `onDateChange`.
 *
 * - Use `mode="date"` for year / month / day selection.
 * - Use `mode="time"` for hour / minute selection, with an AM/PM column when
 *   a 12-hour clock is active.
 * - `onDateChange` fires while the wheel is moving so external state can stay
 *   synchronized in real time.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import DateWheelPicker from "@0610studio/expo-skia-date-wheel-picker";
 *
 * export function Example() {
 *   const [date, setDate] = useState(new Date());
 *
 *   return (
 *     <DateWheelPicker
 *       date={date}
 *       mode="date"
 *       onDateChange={setDate}
 *     />
 *   );
 * }
 * ```
 */
function DateWheelPicker({
  mode = DEFAULT_MODE,
  is24hourSource = DEFAULT_IS_24_HOUR_SOURCE,
  allowFontScaling = DEFAULT_ALLOW_FONT_SCALING,
  fontSize = DEFAULT_FONT_SIZE,
  ...props
}: DatePickerProps) {
  const {
    pickerMode,
    pickerBackgroundColor,
    pickerActiveFontColor,
    pickerDisableFontColor,
    pickerRowHeight,
    wheelHeight,
    pickerPadding,
    dateColumns,
    timeColumns,
    fontFamily,
    onStateChange,
  } = useDateWheelPicker({
    ...props,
    mode,
    is24hourSource,
    allowFontScaling,
    fontSize,
  });

  const wheelGroupStyle = [styles.rowGroup, { height: wheelHeight }];
  const columns = pickerMode === "date" ? dateColumns : timeColumns;

  return (
    <View
      style={[styles.container, { backgroundColor: pickerBackgroundColor }]}
    >
      <WheelGroup
        style={wheelGroupStyle}
        columns={columns}
        pickerBackgroundColor={pickerBackgroundColor}
        pickerActiveFontColor={pickerActiveFontColor}
        pickerDisableFontColor={pickerDisableFontColor}
        fontSize={fontSize}
        fontFamily={fontFamily}
        allowFontScaling={allowFontScaling}
        pickerRowHeight={pickerRowHeight}
        wheelHeight={wheelHeight}
        pickerPadding={pickerPadding}
        onStateChange={onStateChange}
      />
    </View>
  );
}

export type { DatePickerProps } from "./model/types";
export default DateWheelPicker;
