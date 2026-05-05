import { Stack } from 'expo-router';
import { useState } from 'react';

import DateWheelPicker from 'expo-skia-date-wheel-picker';

import { BadgeRow, DemoCard, DemoScreen, ResultCard, formatDateTime, formatTime } from '../../components/showcase';

const INITIAL_DATE = new Date('2026-04-22T13:37:00');

export default function TimeModeScreen() {
  const [time, setTime] = useState(INITIAL_DATE);

  return (
    <>
      <Stack.Screen options={{ title: 'Time mode' }} />
      <DemoScreen
        title="Time selection"
        description={'Use mode="time" to render hour and minute columns, plus a period column when the locale prefers 12-hour time.'}
      >
        <DemoCard title="5-minute interval" description="minuteInterval snaps values to valid steps and keeps updates consistent.">
          <BadgeRow
            items={[
              { label: 'mode', value: 'time' },
              { label: 'minuteInterval', value: '5' },
              { label: 'locale', value: 'device default' },
            ]}
          />
          <DateWheelPicker date={time} mode="time" minuteInterval={5} onDateChange={setTime} />
          <ResultCard label="Selected time" value={formatTime(time)} detail={formatDateTime(time)} />
        </DemoCard>

        <DemoCard
          title="What to verify"
          description="If your locale uses a 12-hour clock, you will see an AM/PM column. In 24-hour locales, the period column disappears automatically."
        />
      </DemoScreen>
    </>
  );
}
