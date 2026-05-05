import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { THEME } from '../components/showcase';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: THEME.card },
          headerTintColor: THEME.text,
          headerShadowVisible: false,
          contentStyle: { backgroundColor: THEME.background },
          headerBackTitle: 'Examples',
        }}
      />
    </>
  );
}
