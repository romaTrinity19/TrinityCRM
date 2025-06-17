
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const interactionData: {
  label: string;
  value: number;
  gradient: [string, string];
}[] = [
  { label: "New", value: 50, gradient: ["#034D9C", "#A2CDF5"] },
  { label: "Proposal Sent", value: 35, gradient: ["#048221", "#96FAB6"] },
  { label: "Deal Done", value: 10, gradient: ["#FF8707", "#ffe066"] },
  { label: "Lost", value: 5, gradient: ["#E01025", "#f8838c"] },
  { label: "Not Serviceable", value: 15, gradient: ["#8B28ED", "#e0c3fc"] },
  { label: "Blocked", value: 10, gradient: ["#054099", "#85B1F2"] },
];

 
const max = Math.max(...interactionData.map((item) => item.value));

const CustomerInteractionStats = () => {
  const total = interactionData.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Interactions</Text>
      {/* Bar Graph Section */}
      <View style={styles.graph}>
        {interactionData.map((item, idx) => (
          <View key={idx} style={styles.bar}>
            <View
              style={[
                styles.fill,
                { height: (item.value / max) * 100 },
                { backgroundColor: item.gradient[0] },
              ]}
            />
            <Text style={styles.barLabel}>{item.value}</Text>
            <Text style={styles.barText}>{item.label}</Text>
          </View>
        ))}
      </View>

      {/* Circle Section */}
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

       {/* <View style={styles.statRow2}>
        {interactionData.map((item, idx) => {
          const percent = (item.value / total) * 100;
          // We'll use percent to create a "conic-like" view by coloring a portion.
          // But without SVG, we can approximate by adding a "half circle".

          return (
            <View key={idx} style={styles.circle}>
             
              <LinearGradient
                colors={item.gradient}
                style={styles.outer}>
              
                <View style={styles.inner}>
              
                   <Text style={styles.percent}>
                     {percent.toFixed(1)}%
                   </Text>
                   <Text style={styles.statLabel2}>
                     {item.label}
                   </Text>
                </View>
              </LinearGradient>
            </View>
          )
        })}
      </View> */}
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
    marginBottom: 24,
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
  graph: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: 180,
    borderRadius: 10,
    backgroundColor: "#edf1ff",
    padding: 10,
    marginVertical:20
  },
  bar: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  fill: {
    width:13,
    borderRadius: 10,
    marginBottom: 5,
  },
  barLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  barText: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
  },
  statRow2: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 24,
  },
  circle: {
    alignItems: "center",
    justifyContent: "center",
  },
  outer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    // To show progress, we could control padding or masking here
  },
  inner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  percent: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  statLabel2: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
    textAlign: "center",
    maxWidth: 80,
  },
});
