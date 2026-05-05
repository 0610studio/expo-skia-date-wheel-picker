import { Stack } from 'expo-router';
import { useState } from 'react';

import DateWheelPicker from 'expo-skia-date-wheel-picker';

import { BadgeRow, BulletList, DemoCard, DemoScreen, ResultCard, formatDateTime } from '../../components/showcase';

const INITIAL_DATE = new Date('2026-04-22T13:30:00');

export default function DateModeScreen() {
  const [date, setDate] = useState(INITIAL_DATE);

  return (
    <>
      <Stack.Screen options={{ title: 'Date mode' }} />
      <DemoScreen
        title="Date selection"
        description={'Use mode="date" when you want year, month, and day wheels. This example keeps the configuration minimal so the base API is easy to understand.'}
      >
        <DemoCard title="Core props" description="This route demonstrates the smallest useful date picker setup.">
          <BadgeRow
            items={[
              { label: 'mode', value: 'date' },
              { label: 'columns', value: 'year / month / day' },
              { label: 'state', value: 'controlled' },
            ]}
          />
          <DateWheelPicker date={date} mode="date" onDateChange={setDate} />
          <ResultCard label="Selected date" value={formatDateTime(date)} detail={date.toISOString()} />
        </DemoCard>

        <DemoCard title="Why this example exists">
          <BulletList
            items={[
              'Shows the default date wheel without extra styling noise.',
              'Confirms the component is controlled through date + onDateChange.',
              'Gives open-source users the fastest copy-paste starting point.',
            ]}
          />
        </DemoCard>
      </DemoScreen>
    </>
  );
}
