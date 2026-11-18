import type { HexColor, PickerBackgroundColor } from './types';

// Defaults and normalizers shared by every wheel picker.

export const DEFAULT_ROW_HEIGHT = 40;
export const DEFAULT_VISIBLE_ROWS = 5;
export const DEFAULT_FONT_SIZE = 22;

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

export const DEFAULT_PICKER_BACKGROUND_COLOR: PickerBackgroundColor =
  'transparent';
export const DEFAULT_EDGE_OPACITY = 0;

export const getNormalizedEdgeOpacity = (edgeOpacity?: number) => {
  if (edgeOpacity === undefined || Number.isNaN(edgeOpacity)) {
    return DEFAULT_EDGE_OPACITY;
  }

  return Math.max(0, Math.min(1, edgeOpacity));
};
export const DEFAULT_ACTIVE_FONT_COLOR: HexColor = '#000000';
export const DEFAULT_DISABLE_FONT_COLOR = '#ccc';
