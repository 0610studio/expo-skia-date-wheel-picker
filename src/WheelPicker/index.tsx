import { useCallback, useMemo } from "react";
import { View } from "react-native";

import WheelColumn from "../shared/WheelColumn";
import { styles } from "../shared/styles";
import type { PickerOption } from "../shared/types";
import {
  DEFAULT_ACTIVE_FONT_COLOR,
  DEFAULT_DISABLE_FONT_COLOR,
  DEFAULT_FONT_SIZE,
  DEFAULT_PICKER_BACKGROUND_COLOR,
  getNormalizedEdgeOpacity,
  getNormalizedRowHeight,
  getNormalizedVisibleRows,
} from "../shared/utils";
import type { WheelPickerProps, WheelPickerValue } from "./types";

/**
 * Controlled single-column wheel for any list of options.
 *
 * @remarks
 * Uses the same Skia-guided wheel as {@link DateWheelPicker}, so both pickers
 * look and feel the same. Options can hold string or number values.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { WheelPicker } from "@0610studio/expo-skia-date-wheel-picker";
 *
 * const DAYS = Array.from({ length: 30 }, (_, index) => ({
 *   label: `Day ${index + 1}`,
 *   value: index + 1,
 * }));
 *
 * export function Example() {
 *   const [day, setDay] = useState(1);
 *
 *   return <WheelPicker options={DAYS} value={day} onValueChange={setDay} />;
 * }
 * ```
 */
function WheelPicker<T extends WheelPickerValue>({
  options,
  value,
  onValueChange,
  onStateChange,
  backgroundColor = DEFAULT_PICKER_BACKGROUND_COLOR,
  activeFontColor = DEFAULT_ACTIVE_FONT_COLOR,
  disableFontColor = DEFAULT_DISABLE_FONT_COLOR,
  edgeOpacity,
  allowFontScaling = false,
  fontSize = DEFAULT_FONT_SIZE,
  fontFamily,
  rowHeight,
  visibleRows,
}: WheelPickerProps<T>) {
  const pickerRowHeight = getNormalizedRowHeight(rowHeight);
  const pickerVisibleRows = getNormalizedVisibleRows(visibleRows);
  const wheelHeight = pickerRowHeight * pickerVisibleRows;
  const pickerPadding = pickerRowHeight * Math.floor(pickerVisibleRows / 2);

  // The wheel column works with numbers, so rows are addressed by position and
  // mapped back to the caller's values.
  const columnOptions = useMemo<PickerOption[]>(
    () => options.map((option, index) => ({ label: option.label, value: index })),
    [options],
  );
  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
    [options, value],
  );

  const handleIndexChange = useCallback(
    (index: number) => {
      const option = options[index];

      if (option) {
        onValueChange?.(option.value);
      }
    },
    [onValueChange, options],
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.rowGroup, { height: wheelHeight }]}>
        <WheelColumn
          options={columnOptions}
          selectedValue={selectedIndex}
          onValueChange={handleIndexChange}
          onStateChange={onStateChange}
          backgroundColor={backgroundColor}
          activeFontColor={activeFontColor}
          disableFontColor={disableFontColor}
          edgeOpacity={getNormalizedEdgeOpacity(edgeOpacity)}
          fontSize={fontSize}
          fontFamily={fontFamily}
          allowFontScaling={allowFontScaling}
          rowHeight={pickerRowHeight}
          wheelHeight={wheelHeight}
          pickerPadding={pickerPadding}
        />
      </View>
    </View>
  );
}

export type { WheelPickerProps } from "./types";
export default WheelPicker;
