import { Canvas, Line, vec } from "react-native-skia";
import * as Haptics from "expo-haptics";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ScrollViewInstance,
  View,
} from "react-native";

import { styles } from "./styles";
import type { PickerOption, WheelColumnProps } from "../model/types";
import { getClampedIndex, withHexAlpha } from "../model/utils";

type WheelOptionRowProps = {
  allowFontScaling: boolean;
  dynamicInactiveLabelStyle: { color: string };
  dynamicLabelStyle: {
    color: string;
    fontFamily?: string;
    fontSize: number;
  };
  edgeOpacity: number;
  fadeDistance: number;
  index: number;
  isActive: boolean;
  onPressOption: (index: number) => void;
  option: PickerOption;
  rowHeight: number;
  rowStyle: { height: number };
  scrollY: Animated.Value;
};

const WheelOptionRow = React.memo(function WheelOptionRow({
  allowFontScaling,
  dynamicInactiveLabelStyle,
  dynamicLabelStyle,
  edgeOpacity,
  fadeDistance,
  index,
  isActive,
  onPressOption,
  option,
  rowHeight,
  rowStyle,
  scrollY,
}: WheelOptionRowProps) {
  const handlePress = useCallback(() => {
    onPressOption(index);
  }, [index, onPressOption]);

  // The row is centered when scrollY === index * rowHeight. It stays fully
  // opaque inside the center band and fades to `edgeOpacity` at the wheel edge.
  const fadeStyle = useMemo(() => {
    const centeredOffset = index * rowHeight;

    return {
      opacity: scrollY.interpolate({
        inputRange: [
          centeredOffset - fadeDistance,
          centeredOffset - rowHeight / 2,
          centeredOffset + rowHeight / 2,
          centeredOffset + fadeDistance,
        ],
        outputRange: [edgeOpacity, 1, 1, edgeOpacity],
        extrapolate: "clamp",
      }),
    };
  }, [edgeOpacity, fadeDistance, index, rowHeight, scrollY]);

  return (
    <Pressable
      style={[styles.row, rowStyle]}
      onPress={handlePress}
      accessibilityRole="button"
    >
      <Animated.View style={[styles.labelFade, fadeStyle]}>
        <Text
          allowFontScaling={allowFontScaling}
          style={[
            styles.label,
            dynamicLabelStyle,
            isActive ? styles.activeLabel : styles.inactiveLabel,
            !isActive ? dynamicInactiveLabelStyle : undefined,
          ]}
          numberOfLines={1}
        >
          {option.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
});

function WheelColumn({
  options,
  selectedValue,
  onValueChange,
  onStateChange,
  backgroundColor,
  activeFontColor,
  disableFontColor,
  edgeOpacity,
  fontSize,
  fontFamily,
  allowFontScaling,
  rowHeight,
  wheelHeight,
  pickerPadding,
  flex = 1,
}: WheelColumnProps) {
  const scrollRef = useRef<ScrollViewInstance | null>(null);
  const isScrollingRef = useRef(false);
  const isUserScrollRef = useRef(false);
  const idleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEmittedValueRef = useRef(selectedValue);
  const [wheelWidth, setWheelWidth] = useState(0);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [wheelState, setWheelState] = useState<"spinning" | "idle">("idle");

  const selectedIndex = useMemo(() => {
    const foundIndex = options.findIndex(
      (option) => option.value === selectedValue,
    );

    return foundIndex >= 0 ? foundIndex : 0;
  }, [options, selectedValue]);
  const scrollY = useRef(new Animated.Value(selectedIndex * rowHeight)).current;

  const dynamicLabelStyle = useMemo(
    () => ({ fontSize, color: activeFontColor, fontFamily }),
    [activeFontColor, fontFamily, fontSize],
  );
  const dynamicInactiveLabelStyle = useMemo(
    () => ({ color: disableFontColor }),
    [disableFontColor],
  );
  const wheelColumnStyle = useMemo(
    () => ({ flex, backgroundColor, height: wheelHeight }),
    [backgroundColor, flex, wheelHeight],
  );
  const wheelContentStyle = useMemo(
    () => ({ paddingVertical: pickerPadding }),
    [pickerPadding],
  );
  const rowStyle = useMemo(() => ({ height: rowHeight }), [rowHeight]);
  const snapOffsets = useMemo(
    () => options.map((_, index) => index * rowHeight),
    [options, rowHeight],
  );
  // Distance from the center to the wheel edge, measured to a row's center.
  const fadeDistance = wheelHeight / 2;
  const topGuideY = wheelHeight / 2 - rowHeight / 2;
  const bottomGuideY = wheelHeight / 2 + rowHeight / 2;
  const guideColor = useMemo(
    () => withHexAlpha(activeFontColor, "11", "#00000011"),
    [activeFontColor],
  );

  const getIndexFromOffset = useCallback(
    (offsetY: number) =>
      getClampedIndex(Math.round(offsetY / rowHeight), options.length),
    [options.length, rowHeight],
  );

  const clearIdleTimeout = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = null;
    }
  }, []);

  const handleWheelLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = event.nativeEvent.layout.width;

    setWheelWidth((currentWidth) =>
      currentWidth === nextWidth ? currentWidth : nextWidth,
    );
  }, []);

  const handleScrollToIndex = useCallback(
    (index: number, animated: boolean) => {
      scrollRef.current?.scrollTo({ y: index * rowHeight, animated });

      if (!animated) {
        scrollY.setValue(index * rowHeight);
      }
    },
    [rowHeight, scrollY],
  );

  const syncDisplayedIndex = useCallback(
    (offsetY: number) => {
      const nextIndex = getIndexFromOffset(offsetY);

      setDisplayedIndex((currentIndex) =>
        currentIndex === nextIndex ? currentIndex : nextIndex,
      );
    },
    [getIndexFromOffset],
  );

  const emitValueFromOffset = useCallback(
    (offsetY: number) => {
      if (options.length === 0) {
        return;
      }

      const nextIndex = getIndexFromOffset(offsetY);
      const nextOption = options[nextIndex];

      if (!nextOption) {
        return;
      }

      const nextValue = nextOption.value;

      if (nextValue !== lastEmittedValueRef.current) {
        lastEmittedValueRef.current = nextValue;
        Haptics.selectionAsync().catch(() => undefined);
        onValueChange(nextValue);
      }
    },
    [getIndexFromOffset, onValueChange, options],
  );

  const updateWheelState = useCallback(
    (nextState: "spinning" | "idle") => {
      isScrollingRef.current = nextState === "spinning";
      setWheelState((currentState) => {
        if (currentState === nextState) {
          return currentState;
        }

        onStateChange?.(nextState);
        return nextState;
      });
    },
    [onStateChange],
  );

  const handleIdle = useCallback(
    (offsetY: number) => {
      clearIdleTimeout();
      isUserScrollRef.current = false;

      const nextIndex = getIndexFromOffset(offsetY);
      const snappedOffsetY = nextIndex * rowHeight;

      setDisplayedIndex(nextIndex);
      emitValueFromOffset(snappedOffsetY);

      if (Math.abs(offsetY - snappedOffsetY) > 0.5) {
        handleScrollToIndex(nextIndex, false);
      }

      updateWheelState("idle");
    },
    [
      clearIdleTimeout,
      emitValueFromOffset,
      getIndexFromOffset,
      handleScrollToIndex,
      rowHeight,
      updateWheelState,
    ],
  );

  const scheduleIdle = useCallback(
    (offsetY: number, delay: number) => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }

      idleTimeoutRef.current = setTimeout(() => {
        handleIdle(offsetY);
      }, delay);
    },
    [handleIdle],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;

      updateWheelState("spinning");
      syncDisplayedIndex(offsetY);
      emitValueFromOffset(offsetY);

      if (!isUserScrollRef.current) {
        scheduleIdle(offsetY, 80);
      }
    },
    [emitValueFromOffset, scheduleIdle, syncDisplayedIndex, updateWheelState],
  );

  const handleAnimatedScroll = useMemo(
    () =>
      Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: true,
        listener: handleScroll,
      }),
    [handleScroll, scrollY],
  );

  const handlePressOption = useCallback(
    (index: number) => {
      if (index === selectedIndex) {
        return;
      }

      updateWheelState("spinning");
      handleScrollToIndex(index, true);
      scheduleIdle(index * rowHeight, 260);
    },
    [
      handleScrollToIndex,
      rowHeight,
      scheduleIdle,
      selectedIndex,
      updateWheelState,
    ],
  );

  const handleScrollBegin = useCallback(() => {
    isUserScrollRef.current = true;
    clearIdleTimeout();
    updateWheelState("spinning");
  }, [clearIdleTimeout, updateWheelState]);

  const handleScrollEndDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;

      if (
        !event.nativeEvent.velocity ||
        Math.abs(event.nativeEvent.velocity.y) < 0.05
      ) {
        handleIdle(offsetY);
        return;
      }

      scheduleIdle(offsetY, 320);
    },
    [handleIdle, scheduleIdle],
  );

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      handleIdle(event.nativeEvent.contentOffset.y);
    },
    [handleIdle],
  );

  useEffect(() => {
    setDisplayedIndex(selectedIndex);
  }, [selectedIndex]);

  useEffect(() => {
    lastEmittedValueRef.current = selectedValue;
  }, [selectedValue]);

  useEffect(() => {
    if (isScrollingRef.current) {
      return;
    }

    handleScrollToIndex(selectedIndex, false);
  }, [handleScrollToIndex, selectedIndex]);

  useEffect(() => {
    return () => {
      clearIdleTimeout();
    };
  }, [clearIdleTimeout]);

  return (
    <View
      style={[styles.wheelColumn, wheelColumnStyle]}
      onLayout={handleWheelLayout}
    >
      <Animated.ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        bounces={false}
        nestedScrollEnabled
        snapToOffsets={snapOffsets}
        decelerationRate="fast"
        contentContainerStyle={[styles.wheelContent, wheelContentStyle]}
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollBegin={handleScrollBegin}
        onScroll={handleAnimatedScroll}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        scrollEventThrottle={16}
      >
        {options.map((option, index) => {
          const isActive = wheelState === "idle" && index === displayedIndex;

          return (
            <WheelOptionRow
              key={`${option.value}-${option.label}`}
              allowFontScaling={allowFontScaling}
              dynamicInactiveLabelStyle={dynamicInactiveLabelStyle}
              dynamicLabelStyle={dynamicLabelStyle}
              edgeOpacity={edgeOpacity}
              fadeDistance={fadeDistance}
              index={index}
              isActive={isActive}
              onPressOption={handlePressOption}
              option={option}
              rowHeight={rowHeight}
              rowStyle={rowStyle}
              scrollY={scrollY}
            />
          );
        })}
      </Animated.ScrollView>

      {wheelWidth > 0 && (
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <Canvas style={StyleSheet.absoluteFill}>
            <Line
              p1={vec(0, topGuideY)}
              p2={vec(wheelWidth, topGuideY)}
              color={guideColor}
              strokeWidth={1}
            />
            <Line
              p1={vec(0, bottomGuideY)}
              p2={vec(wheelWidth, bottomGuideY)}
              color={guideColor}
              strokeWidth={1}
            />
          </Canvas>
        </View>
      )}
    </View>
  );
}

export default WheelColumn;
