import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  rowGroup: {
    width: '100%',
    flexDirection: 'row',
  },
  wheelColumn: {
    overflow: 'hidden',
  },
  wheelContent: {
    width: '100%',
  },
  row: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  label: {
    textAlign: 'center',
    includeFontPadding: false,
  },
  activeLabel: {
    opacity: 1,
    fontWeight: '600',
  },
  inactiveLabel: {
    opacity: 0.58,
    fontWeight: '400',
  },
});
