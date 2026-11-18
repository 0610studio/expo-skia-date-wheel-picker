import { Stack } from 'expo-router';
import { useState } from 'react';

import { WheelPicker, type WheelPickerOption } from 'expo-skia-date-wheel-picker';

import { BadgeRow, DemoCard, DemoScreen, ResultCard } from '../../components/showcase';

const REMINDERS: WheelPickerOption<number>[] = [
  { label: '10 minutes before', value: 10 },
  { label: '30 minutes before', value: 30 },
  { label: '1 hour before', value: 60 },
  { label: '3 hours before', value: 180 },
  { label: '6 hours before', value: 360 },
  { label: '12 hours before', value: 720 },
  { label: '24 hours before', value: 1440 },
];

const MONTH_DAYS: WheelPickerOption<number>[] = Array.from({ length: 31 }, (_, index) => ({
  label: `Day ${index + 1}`,
  value: index + 1,
}));

// String values: every 30 minutes across a day.
const SLOTS: WheelPickerOption<string>[] = Array.from({ length: 48 }, (_, index) => {
  const hour = String(Math.floor(index / 2)).padStart(2, '0');
  const value = `${hour}:${index % 2 === 0 ? '00' : '30'}`;

  return { label: value, value };
});

const WHEEL_COLORS = { activeFontColor: '#f8fafc', disableFontColor: '#64748b' } as const;

export default function WheelPickerScreen() {
  const [reminder, setReminder] = useState(30);
  const [day, setDay] = useState(15);
  const [slot, setSlot] = useState('09:00');
  const [state, setState] = useState<'spinning' | 'idle'>('idle');

  return (
    <>
      <Stack.Screen options={{ title: 'WheelPicker' }} />
      <DemoScreen
        title="List wheel"
        description="WheelPicker renders one wheel for any list of options. It shares the look of DateWheelPicker but works with plain number or string values."
      >
        <DemoCard title="Number values" description="Uneven steps that a time wheel cannot express.">
          <BadgeRow
            items={[
              { label: 'options', value: `${REMINDERS.length}` },
              { label: 'value', value: 'number' },
            ]}
          />
          <WheelPicker options={REMINDERS} value={reminder} onValueChange={setReminder} {...WHEEL_COLORS} />
          <ResultCard
            label="Selected reminder"
            value={`${reminder} min`}
            detail={REMINDERS.find((option) => option.value === reminder)?.label}
          />
        </DemoCard>

        <DemoCard title="Long list" description="A day of the month, with a taller row and three visible rows.">
          <WheelPicker
            options={MONTH_DAYS}
            value={day}
            onValueChange={setDay}
            onStateChange={setState}
            rowHeight={48}
            visibleRows={3}
            {...WHEEL_COLORS}
          />
          <ResultCard label="Selected day" value={`#${day}`} detail={`Wheel is ${state}`} />
        </DemoCard>

        <DemoCard title="String values" description="Values come back exactly as given, here as HH:mm strings.">
          <WheelPicker options={SLOTS} value={slot} onValueChange={setSlot} {...WHEEL_COLORS} />
          <ResultCard label="Selected slot" value={JSON.stringify(slot)} detail={`typeof value: ${typeof slot}`} />
        </DemoCard>
      </DemoScreen>
    </>
  );
}
