import { Stack, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BadgeRow, BulletList, DemoCard, DemoScreen, THEME } from '../../components/showcase';

const EXAMPLES = [
  {
    href: '/date',
    title: 'Date mode',
    description: 'Year / month / day columns with a single shared date state.',
  },
  {
    href: '/time',
    title: 'Time mode',
    description: '12/24-hour formatting and minute intervals.',
  },
  {
    href: '/limits',
    title: 'Minimum + maximum date',
    description: 'Clamp the selectable range and keep wheel options valid.',
  },
  {
    href: '/locale-timezone',
    title: 'Locale + timezone',
    description: 'Show locale-driven hour cycles and remote timezone selection.',
  },
  {
    href: '/styling',
    title: 'Styling',
    description: 'Tune colors, row height, visible rows, and typography.',
  },
  {
    href: '/callbacks',
    title: 'Callbacks',
    description: 'Watch onDateChange and onStateChange in real time.',
  },
] as const;

export default function HomeScreen() {
  const router = useRouter();

  const handleNavigate = useCallback(
    (href: (typeof EXAMPLES)[number]['href']) => {
      router.navigate(href);
    },
    [router],
  );

  return (
    <>
      <Stack.Screen options={{ title: 'Examples' }} />
      <DemoScreen
        title="Expo Router example app"
        description="Browse focused demo pages instead of one long screen. Each route isolates a DateWheelPicker feature so open-source users can copy the exact setup they need."
      >
        <DemoCard title="What this example covers">
          <BadgeRow
            items={[
              { label: 'Routes', value: `${EXAMPLES.length}` },
              { label: 'Modes', value: 'date + time' },
              { label: 'Focus', value: 'copyable demos', tone: 'success' },
            ]}
          />
          <BulletList
            items={[
              'Basic date selection',
              'Time selection with minuteInterval',
              'Range limits with minimumDate / maximumDate',
              'Locale and timeZoneOffsetInMinutes behavior',
              'Visual customization props and interaction callbacks',
            ]}
          />
        </DemoCard>

        <View style={styles.grid}>
          {EXAMPLES.map((example) => (
            <TouchableOpacity
              key={example.href}
              onPress={() => {
                handleNavigate(example.href);
              }}
              style={styles.linkCard}
            >
              <Text style={styles.linkTitle}>{example.title}</Text>
              <Text style={styles.linkDescription}>{example.description}</Text>
              <Text style={styles.linkAction}>
                {'Open example →'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </DemoScreen>
    </>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: 12,
  },
  linkCard: {
    borderRadius: 20,
    padding: 18,
    gap: 8,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  linkCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  linkTitle: {
    color: THEME.text,
    fontSize: 17,
    fontWeight: '700',
  },
  linkDescription: {
    color: THEME.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  linkAction: {
    color: THEME.accent,
    fontSize: 14,
    fontWeight: '700',
  },
});
