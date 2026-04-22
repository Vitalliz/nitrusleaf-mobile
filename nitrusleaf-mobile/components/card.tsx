// components/CustomCard.tsx
import { Colors } from '@/constants/theme';
import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';

type CardVariant = 'yellow' | 'gray' | 'white' | 'red' | 'red-large';

interface CustomCardProps {
  variant: CardVariant;
  children?: React.ReactNode;
  bottomContent?: React.ReactNode;
  onPress?: () => void;
}

const variantConfig = {
  yellow: { height: 134, color: '#FFD700', textColor: '#000000' },
  gray: { height: 178, color: '#9CA3AF', textColor: '#FFFFFF' },
  white: { height: 274, color: '#FFFFFF', textColor: '#000000', borderWidth: 1, borderColor: '#E5E5E5' },
  red: { height: 10, color: '#EF4444', textColor: '#FFFFFF' },
  'red-large': { height: 1200, color: '#EF4444', textColor: '#FFFFFF', alignItems: 'center'},
  'yellow-large': { height: 260, color: '#FFD700', textColor: '#000000' },
  'white-large': { height: 500, color: '#FFFFFF', textColor: '#000000', borderWidth: 1, borderColor: '#E5E5E5' },
  'white-large-feet': { height: 900, color: '#FFFFFF', textColor: '#000000', borderWidth: 1, borderColor: '#E5E5E5' },
  
};

export const CustomCard = ({ variant, children, bottomContent, onPress }: CustomCardProps) => {
  const { height: topHeight, color: backgroundColor, textColor  } = variantConfig[variant];
  
  const CardContainer = onPress ? TouchableOpacity : View;
  
  return (
    <CardContainer 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Parte Superior */}
      <View style={[
        styles.topSection, 
        { 
          height: topHeight, 
          backgroundColor: backgroundColor,

        }
      ]}>
        {(
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {children ? children : (
            <>
              {variant === 'yellow' && <Text style={{ color: '#000' }}></Text>}
              {variant === 'gray' && <Text style={{ color: '#FFF' }}></Text>}
              {variant === 'white' && <Text style={{ color: '#000' }}></Text>}
              {variant === 'red' && <Text style={{ color: '#FFF' }}></Text>}
              {variant === 'red-large' && <Text style={{ color: '#FFF' }}></Text>}
            </>
          )}
        </View>

        )}
      </View>
      
      {/* Parte Inferior */}
      {bottomContent && (
        <View style={styles.bottomSection}>
          {bottomContent}
        </View>
      )}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 385,
    backgroundColor: '#fff',
    // borderRadius: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: 'hidden',
    marginVertical: 12,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topSection: {
    width: '100%',
    maxHeight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  bottomSection: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  defaultText: {
    fontSize: 18,
    fontWeight: '600',
  },
});