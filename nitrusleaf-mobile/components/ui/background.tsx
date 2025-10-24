// components/Background.tsx
import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';

export const Background = ({ children }: { children: ReactNode }) => {
  return <View style={styles.background}>{children}</View>;
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#FAF1E5',
    alignItems: 'center',
    justifyContent: 'center',
    width: 'auto',
    height: 'auto',
  },
});
