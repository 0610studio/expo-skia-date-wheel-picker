import { Stack } from 'expo-router';
import { useState } from 'react';

import DateWheelPicker from 'expo-skia-date-wheel-picker';

import { BadgeRow, BulletList, DemoCard, DemoScreen, ResultCard, formatTime } from '../../components/showcase';

const BASE_DATE = new Date('2026-04-22T13:30:00Z');

export default function LocaleTimezoneScreen() {
  const [usTime, setUsTime] = useState(BASE_DATE);
  const [deTime, setDeTime] = useState(BASE_DATE);
  const [seoulTime, setSeoulTime] = useState(BASE_DATE);

  return (
    <>
      <Stack.Screen options={{ title: 'Locale + timezone' }} />
      <DemoScreen
        title="Locale and timezone behavior"
        description="The picker can localize labels and adjust the editable timezone without requiring a different component."
      >
        <DemoCard title="Locale-driven 12/24-hour clock" description="These two pickers use the same instant but different locales.">
          <BadgeRow
            items={[
              { label: 'en-US', value: formatTime(usTime, 'en-US') },
              { label: 'de-DE', value: formatTime(deTime, 'de-DE') },
            ]}
          />
          <DateWheelPicker date={usTime} mode="time" locale="en-US" onDateChange={setUsTime} />
          <DateWheelPicker date={deTime} mode="time" locale="de-DE" onDateChange={setDeTime} />
        </DemoCard>

        <DemoCard title="Timezone offset" description="This picker edits the value as Korea Standard Time by applying a fixed offset.">
          <BadgeRow items={[{ label: 'timeZoneOffsetInMinutes', value: '540' }, { label: 'locale', value: 'ko-KR' }]} />
          <DateWheelPicker
            date={seoulTime}
            mode="time"
            locale="ko-KR"
            timeZoneOffsetInMinutes={540}
            onDateChange={setSeoulTime}
          />
          <ResultCard label="KST selection" value={formatTime(seoulTime, 'ko-KR', 'Asia/Seoul')} detail={seoulTime.toISOString()} />
        </DemoCard>

        <DemoCard title="Why separate this from the basic time example">
          <BulletList
            items={[
              'Locale affects labels and whether a period column is rendered.',
              'timeZoneOffsetInMinutes changes the editable clock without changing your storage format.',
              'Keeping this isolated makes timezone-related regressions easier to spot.',
            ]}
          />
        </DemoCard>
      </DemoScreen>
    </>
  );
}
