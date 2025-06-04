// components/CustomerInteractionStats.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const interactionData: {
  label: string;
  value: number;
  gradient: [string, string];
}[] = [
  { label: "New", value: 40, gradient: ["#034D9C", "#A2CDF5"] },
  { label: "Proposal Sent", value: 20, gradient: ["#048221", "#96FAB6"] },
  { label: "Deal Done", value: 10, gradient: ["#FF8707", "#ffe066"] },
  { label: "Lost", value: 5, gradient: ["#E01025", "#f8838c"] },
  { label: "Not Serviceable", value: 15, gradient: ["#8B28ED", "#e0c3fc"] },
  { label: "Blocked", value: 10, gradient: ["#054099", "#85B1F2"] },
];



const CustomerInteractionStats = () => {
  const total = interactionData.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Interactions</Text>
      <View style={styles.statRow}>
        {interactionData.map((item, index) => (
          <LinearGradient
            key={index}
            colors={item.gradient}
            style={styles.statCircle}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.statNumber}>
              {((item.value / total) * 100).toFixed(1)}%
            </Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </LinearGradient>
        ))}
      </View>
    </View>
  );
};

export default CustomerInteractionStats;

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  statRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  statCircle: {
    width: 110,
    height: 110,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    elevation: 2,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  statLabel: {
    fontSize: 12,
    color: "#fff",
    marginTop: 4,
    textAlign: "center",
  },
});
