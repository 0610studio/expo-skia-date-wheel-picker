import { Stack } from 'expo-router';
import { useState } from 'react';

import DateWheelPicker from 'expo-skia-date-wheel-picker';

import { BadgeRow, BulletList, DemoCard, DemoScreen, ResultCard, formatDateTime } from '../../components/showcase';

const MIN_DATE = new Date('2026-04-10T00:00:00');
const MAX_DATE = new Date('2026-05-05T23:59:00');
const INITIAL_DATE = new Date('2026-04-22T13:30:00');

export default function LimitsScreen() {
  const [date, setDate] = useState(INITIAL_DATE);

  return (
    <>
      <Stack.Screen options={{ title: 'Limits' }} />
      <DemoScreen
        title="Range limits"
        description="minimumDate and maximumDate clamp the current value and trim wheel options so users can only reach valid combinations."
      >
        <DemoCard title="Constrained date picker" description="This is the example most people need for booking flows, schedules, and bounded forms.">
          <BadgeRow
            items={[
              { label: 'minimumDate', value: '2026-04-10' },
              { label: 'maximumDate', value: '2026-05-05' },
              { label: 'mode', value: 'date' },
            ]}
          />
          <DateWheelPicker
            date={date}
            mode="date"
            minimumDate={MIN_DATE}
            maximumDate={MAX_DATE}
            onDateChange={setDate}
          />
          <ResultCard
            label="Clamped selection"
            value={formatDateTime(date)}
            detail={`Allowed range: ${MIN_DATE.toISOString()} → ${MAX_DATE.toISOString()}`}
          />
        </DemoCard>

        <DemoCard title="Behavior notes">
          <BulletList
            items={[
              'Changing year or month also trims the day wheel when some dates are out of range.',
              'If the incoming value is outside the allowed range, the picker clamps it back into range.',
              'This keeps invalid combinations from flashing in the UI.',
            ]}
          />
        </DemoCard>
      </DemoScreen>
    </>
  );
}
