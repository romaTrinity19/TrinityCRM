import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InfoCardProps {
    icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
}

export function InfoCard({ icon, title, value, subtitle }: InfoCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
         <View  >{icon}</View>
        {/* <Ionicons name={icon} size={20} color="#5975D9" /> */}
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginLeft: 8,
  },
  cardValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    lineHeight: 22,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
