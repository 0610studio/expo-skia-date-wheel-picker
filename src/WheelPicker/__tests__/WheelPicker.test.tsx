import { act, createElement, type ReactElement } from "react";
import { createRoot, type TestInstance } from "test-renderer";

import type { WheelColumnProps } from "../../shared/types";
import WheelPicker from "..";

// Skia and haptics need a device; these tests only cover how WheelPicker maps
// its options and values onto the wheel column.
jest.mock("../../shared/WheelColumn", () => {
  const react = jest.requireActual<typeof import("react")>("react");

  return {
    __esModule: true,
    default: (props: object) => react.createElement("WheelColumn", props),
  };
});

const REMINDERS = [
  { label: "10 minutes before", value: 10 },
  { label: "30 minutes before", value: 30 },
  { label: "1 hour before", value: 60 },
];

const render = async (element: ReactElement) => {
  const root = createRoot();

  await act(async () => {
    root.render(element);
  });

  const [column] = root.container.queryAll(
    (instance: TestInstance) => instance.type === "WheelColumn",
  );

  return column.props as WheelColumnProps;
};

describe("WheelPicker", () => {
  it("passes rows to the wheel by position and selects the matching one", async () => {
    const column = await render(
      createElement(WheelPicker<number>, { options: REMINDERS, value: 30 }),
    );

    expect(column.options).toEqual([
      { label: "10 minutes before", value: 0 },
      { label: "30 minutes before", value: 1 },
      { label: "1 hour before", value: 2 },
    ]);
    expect(column.selectedValue).toBe(1);
  });

  it("reports the option value, not its position", async () => {
    const onValueChange = jest.fn();
    const column = await render(
      createElement(WheelPicker<number>, {
        options: REMINDERS,
        value: 10,
        onValueChange,
      }),
    );

    column.onValueChange(2);

    expect(onValueChange).toHaveBeenCalledWith(60);
  });

  it("supports string values", async () => {
    const onValueChange = jest.fn();
    const column = await render(
      createElement(WheelPicker<string>, {
        options: [
          { label: "00:00", value: "00:00" },
          { label: "00:30", value: "00:30" },
        ],
        value: "00:30",
        onValueChange,
      }),
    );

    expect(column.selectedValue).toBe(1);

    column.onValueChange(0);

    expect(onValueChange).toHaveBeenCalledWith("00:00");
  });

  it("selects no row when the value is missing and ignores unknown positions", async () => {
    const onValueChange = jest.fn();
    const column = await render(
      createElement(WheelPicker<number>, {
        options: REMINDERS,
        value: 999,
        onValueChange,
      }),
    );

    expect(column.selectedValue).toBe(-1);

    column.onValueChange(7);

    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("uses the same sizing defaults as DateWheelPicker", async () => {
    const column = await render(
      createElement(WheelPicker<number>, {
        options: REMINDERS,
        value: 10,
        rowHeight: 48,
        visibleRows: 4,
      }),
    );

    // Even row counts round up to keep the selected row centered.
    expect(column.rowHeight).toBe(48);
    expect(column.wheelHeight).toBe(48 * 5);
    expect(column.pickerPadding).toBe(48 * 2);
    expect(column.fontSize).toBe(22);
    expect(column.edgeOpacity).toBe(0);
    expect(column.backgroundColor).toBe("transparent");
  });
});
