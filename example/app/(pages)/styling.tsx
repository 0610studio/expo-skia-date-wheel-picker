import { Stack } from 'expo-router';
import { useState } from 'react';

import DateWheelPicker from 'expo-skia-date-wheel-picker';

import { BadgeRow, BulletList, DemoCard, DemoScreen, ResultCard, formatDateTime } from '../../components/showcase';

const INITIAL_DATE = new Date('2026-04-22T13:30:00');

export default function StylingScreen() {
  const [date, setDate] = useState(INITIAL_DATE);

  return (
    <>
      <Stack.Screen options={{ title: 'Styling' }} />
      <DemoScreen
        title="Styling and layout"
        description="DateWheelPicker lets you theme the wheel without wrapping it in a custom native view. This route focuses on the visual props."
      >
        <DemoCard title="Custom palette + spacing" description="Colors, rowHeight, visibleRows, and typography all flow through the same component API.">
          <BadgeRow
            items={[
              { label: 'rowHeight', value: '48' },
              { label: 'visibleRows', value: '7' },
              { label: 'fontSize', value: '24' },
            ]}
          />
          <DateWheelPicker
            date={date}
            mode="date"
            onDateChange={setDate}
            backgroundColor="#111827"
            activeFontColor="#fef08a"
            disableFontColor="#64748b"
            fontSize={24}
            rowHeight={48}
            visibleRows={7}
          />
          <ResultCard label="Styled selection" value={formatDateTime(date)} detail="Visual props can be mixed with locale, limits, and callbacks." />
        </DemoCard>

        <DemoCard title="Styling props worth trying">
          <BulletList
            items={[
              'backgroundColor changes the wheel body and the Skia overlays together.',
              'activeFontColor also influences the center guide line tint.',
              'visibleRows is normalized to an odd number so the active row stays centered.',
            ]}
          />
        </DemoCard>
      </DemoScreen>
    </>
  );
}
