import base from 'expo-module-scripts/oxlint.config.base';

export default {
  ...base,
  ignorePatterns: [...base.ignorePatterns, 'example/ios/**', 'example/android/**'],
};
