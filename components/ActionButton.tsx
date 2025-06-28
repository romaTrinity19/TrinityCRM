import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  color?: string;
  onPress: () => void;
}

const screenWidth = Dimensions.get('window').width;
const buttonWidth = (screenWidth - 64) / 4; // 16px padding left/right + gaps between buttons

export const ActionButton = ({ icon, label, color = '#5975D9', onPress }: ActionButtonProps) => {
  return (
    <TouchableOpacity style={[styles.buttonWrapper, { width: buttonWidth }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        {icon}
      </View>
      <Text style={[styles.label, { color }]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    borderRadius: 50,
    padding: 12,
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
