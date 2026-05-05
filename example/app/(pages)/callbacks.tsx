import { Stack } from 'expo-router';
import { useState } from 'react';

import DateWheelPicker from 'expo-skia-date-wheel-picker';

import { BadgeRow, DemoCard, DemoScreen, ResultCard, formatDateTime } from '../../components/showcase';

const INITIAL_DATE = new Date('2026-04-22T13:30:00');

export default function CallbacksScreen() {
  const [date, setDate] = useState(INITIAL_DATE);
  const [pickerState, setPickerState] = useState<'spinning' | 'idle'>('idle');
  const [changeCount, setChangeCount] = useState(0);

  return (
    <>
      <Stack.Screen options={{ title: 'Callbacks' }} />
      <DemoScreen
        title="Interaction callbacks"
        description="Use the callbacks to sync form state and react to wheel motion. This route makes those signals visible while you scroll."
      >
        <DemoCard title="Live callback state" description="Spin the wheel and watch the status chip and change counter update.">
          <BadgeRow
            items={[
              { label: 'onDateChange', value: `${changeCount} updates` },
              { label: 'onStateChange', value: pickerState, tone: pickerState === 'idle' ? 'success' : 'default' },
            ]}
          />
          <DateWheelPicker
            date={date}
            mode="time"
            minuteInterval={10}
            onDateChange={(nextDate) => {
              setDate(nextDate);
              setChangeCount((count) => count + 1);
            }}
            onStateChange={setPickerState}
          />
          <ResultCard label="Current value" value={formatDateTime(date)} detail={date.toISOString()} />
        </DemoCard>
      </DemoScreen>
    </>
  );
}
