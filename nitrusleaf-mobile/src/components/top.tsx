import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width } = Dimensions.get('window');

const Top = () => {
  return (
    <View style={styles.container}>
      <Svg
        height="100%"
        width="100%"
        viewBox="0 0 428 246"
        preserveAspectRatio="none"
        style={styles.svg}
      >
        <Defs>
          <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFB534" />
            <Stop offset="100%" stopColor="#E88239" />
          </LinearGradient>
        </Defs>
        <Path
          d="M0,246 
             C20,216 100,146 230,192 
             C400,276 400,226 940,-4 
             L430,0 L0,0 Z"
          fill="url(#grad)"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 246,
    position: 'absolute',
    bottom: 0,
  },
  svg: {
    width: '100%',
    height: '100%',
  },
});

export default Top;