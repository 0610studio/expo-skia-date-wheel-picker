import { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export const THEME = {
  background: '#020617',
  card: '#0f172a',
  cardBorder: '#1e293b',
  text: '#f8fafc',
  muted: '#cbd5e1',
  subtle: '#94a3b8',
  accent: '#38bdf8',
  success: '#22c55e',
};

export function DemoScreen({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description: string; }>) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.heroCard}>
        <Text style={styles.eyebrow}>expo-skia-date-wheel-picker</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      {children}
    </ScrollView>
  );
}

export function DemoCard({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description?: string }>) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {description ? <Text style={styles.cardDescription}>{description}</Text> : null}
      {children}
    </View>
  );
}

export function ResultCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <View style={styles.resultCard}>
      <Text style={styles.resultLabel}>{label}</Text>
      <Text style={styles.resultValue}>{value}</Text>
      {detail ? <Text style={styles.resultDetail}>{detail}</Text> : null}
    </View>
  );
}

export function BadgeRow({ items }: { items: Array<{ label: string; value: string; tone?: 'default' | 'success' }> }) {
  return (
    <View style={styles.badgeRow}>
      {items.map((item) => (
        <View
          key={`${item.label}-${item.value}`}
          style={[styles.badge, item.tone === 'success' ? styles.badgeSuccess : null]}
        >
          <Text style={styles.badgeLabel}>{item.label}</Text>
          <Text style={styles.badgeValue}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
}

export function BulletList({ items }: { items: string[] }) {
  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item} style={styles.listItem}>
          <Text style={styles.listBullet}>•</Text>
          <Text style={styles.listText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function formatDateTime(date: Date, locale?: string, timeZone?: string) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone,
  }).format(date);
}

export function formatTime(date: Date, locale?: string, timeZone?: string) {
  return new Intl.DateTimeFormat(locale, {
    timeStyle: 'short',
    timeZone,
  }).format(date);
}

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  content: {
    paddingHorizontal: 20,
    gap: 16,
    paddingTop:20,
    paddingBottom: 100,
  },
  heroCard: {
    borderRadius: 24,
    padding: 20,
    gap: 10,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  eyebrow: {
    color: THEME.accent,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  title: {
    color: THEME.text,
    fontSize: 28,
    fontWeight: '800',
  },
  description: {
    color: THEME.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    gap: 14,
    backgroundColor: THEME.card,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  cardTitle: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '700',
  },
  cardDescription: {
    color: THEME.muted,
    fontSize: 14,
    lineHeight: 21,
  },
  resultCard: {
    gap: 8,
    padding: 16,
    borderRadius: 18,
    backgroundColor: '#111827',
  },
  resultLabel: {
    color: THEME.subtle,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultValue: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '700',
  },
  resultDetail: {
    color: THEME.muted,
    fontSize: 13,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    gap: 2,
    backgroundColor: '#111827',
  },
  badgeSuccess: {
    backgroundColor: '#052e16',
  },
  badgeLabel: {
    color: THEME.subtle,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  badgeValue: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    gap: 8,
  },
  listBullet: {
    color: THEME.accent,
    fontSize: 16,
    lineHeight: 22,
  },
  listText: {
    flex: 1,
    color: THEME.muted,
    fontSize: 14,
    lineHeight: 22,
  },
});
