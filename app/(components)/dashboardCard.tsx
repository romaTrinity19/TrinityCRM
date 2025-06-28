// import React from "react";
// import { View, Text, StyleSheet } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";

// const interactionData: {
//   label: string;
//   value: number;
//   gradient: [string, string];
// }[] = [
//   { label: "New", value: 50, gradient: ["#034D9C", "#A2CDF5"] },
//   { label: "Proposal Sent", value: 35, gradient: ["#048221", "#96FAB6"] },
//   { label: "Deal Done", value: 10, gradient: ["#FF8707", "#ffe066"] },
//   { label: "Lost", value: 5, gradient: ["#E01025", "#f8838c"] },
//   { label: "Not Serviceable", value: 15, gradient: ["#8B28ED", "#e0c3fc"] },
//   { label: "Blocked", value: 10, gradient: ["#054099", "#85B1F2"] },
// ];

// const max = Math.max(...interactionData.map((item) => item.value));

// const CustomerInteractionStats = () => {
//   const total = interactionData.reduce((sum, item) => sum + item.value, 0);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Customer Interactions</Text>
//       {/* Bar Graph Section */}
//       <View style={styles.graph}>
//         {interactionData.map((item, idx) => (
//           <View key={idx} style={styles.bar}>
//             <View
//               style={[
//                 styles.fill,
//                 { height: (item.value / max) * 100 },
//                 { backgroundColor: item.gradient[0] },
//               ]}
//             />
//             <Text style={styles.barLabel}>{item.value}</Text>
//             <Text style={styles.barText}>{item.label}</Text>
//           </View>
//         ))}
//       </View>

//       {/* Circle Section */}
//       <View style={styles.statRow}>
//         {interactionData.map((item, index) => (
//           <LinearGradient
//             key={index}
//             colors={item.gradient}
//             style={styles.statCircle}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//           >
//             <Text style={styles.statNumber}>
//               {((item.value / total) * 100).toFixed(1)}%
//             </Text>
//             <Text style={styles.statLabel}>{item.label}</Text>
//           </LinearGradient>
//         ))}
//       </View>

//        {/* <View style={styles.statRow2}>
//         {interactionData.map((item, idx) => {
//           const percent = (item.value / total) * 100;
//           // We'll use percent to create a "conic-like" view by coloring a portion.
//           // But without SVG, we can approximate by adding a "half circle".

//           return (
//             <View key={idx} style={styles.circle}>

//               <LinearGradient
//                 colors={item.gradient}
//                 style={styles.outer}>

//                 <View style={styles.inner}>

//                    <Text style={styles.percent}>
//                      {percent.toFixed(1)}%
//                    </Text>
//                    <Text style={styles.statLabel2}>
//                      {item.label}
//                    </Text>
//                 </View>
//               </LinearGradient>
//             </View>
//           )
//         })}
//       </View> */}
//     </View>
//   );
// };

// export default CustomerInteractionStats;

// const styles = StyleSheet.create({
//   container: {
//     margin: 16,
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: "600",
//     marginBottom: 12,
//   },
//   statRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     gap: 8,
//     marginBottom: 24,
//   },
//   statCircle: {
//     width: 110,
//     height: 110,
//     borderRadius: 60,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 16,
//     elevation: 2,
//   },
//   statNumber: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   statLabel: {
//     fontSize: 12,
//     color: "#fff",
//     marginTop: 4,
//     textAlign: "center",
//   },
//   graph: {
//     flexDirection: "row",
//     alignItems: "flex-end",
//     justifyContent: "space-between",
//     paddingHorizontal: 10,
//     height: 180,
//     borderRadius: 10,
//     backgroundColor: "#edf1ff",
//     padding: 10,
//     marginVertical:20
//   },
//   bar: {
//     alignItems: "center",
//     flex: 1,
//     marginHorizontal: 5,
//   },
//   fill: {
//     width:13,
//     borderRadius: 10,
//     marginBottom: 5,
//   },
//   barLabel: {
//     fontSize: 14,
//     fontWeight: "bold",
//     marginBottom: 4,
//   },
//   barText: {
//     fontSize: 11,
//     color: "#666",
//     textAlign: "center",
//   },
//   statRow2: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     gap: 20,
//     marginBottom: 24,
//   },
//   circle: {
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   outer: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//     // To show progress, we could control padding or masking here
//   },
//   inner: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     backgroundColor: "#ffffff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   percent: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#000",
//   },
//   statLabel2: {
//     fontSize: 12,
//     color: "#666",
//     marginTop: 4,
//     textAlign: "center",
//     maxWidth: 80,
//   },
// });

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const interactionData: {
  label: string;
  value: number;
  gradient: [string, string];
  icon: string;
}[] = [
  { label: "New", value: 50, gradient: ["#667eea", "#764ba2"], icon: "✨" },
  {
    label: "Proposal Sent",
    value: 35,
    gradient: ["#f093fb", "#f5576c"],
    icon: "📋",
  },
  {
    label: "Deal Done",
    value: 10,
    gradient: ["#4facfe", "#00f2fe"],
    icon: "🎉",
  },
  { label: "Lost", value: 5, gradient: ["#fa709a", "#fee140"], icon: "❌" },
  {
    label: "Not Serviceable",
    value: 15,
    gradient: ["#a8edea", "#fed6e3"],
    icon: "⚠️",
  },
  { label: "Blocked", value: 10, gradient: ["#ff9a9e", "#fecfef"], icon: "🚫" },
];

const max = Math.max(...interactionData.map((item) => item.value));

const CustomerInteractionStats = () => {
  const total = interactionData.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Customer Interactions</Text>
        <Text style={styles.subtitle}>Overview of current pipeline status</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{total}</Text>
          <Text style={styles.summaryLabel}>Total Interactions</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryNumber}>{interactionData.length}</Text>
          <Text style={styles.summaryLabel}>Categories</Text>
        </View>
      </View>

      {/* Bar Chart Section */}
      <View style={styles.chartSection}>
        <Text style={styles.sectionTitle}>Distribution Overview</Text>
        <View style={styles.chartContainer}>
          <View style={styles.yAxisLabels}>
            <Text style={styles.axisLabel}>{max}</Text>
            <Text style={styles.axisLabel}>{Math.round(max * 0.75)}</Text>
            <Text style={styles.axisLabel}>{Math.round(max * 0.5)}</Text>
            <Text style={styles.axisLabel}>{Math.round(max * 0.25)}</Text>
            <Text style={styles.axisLabel}>0</Text>
          </View>
          <View style={styles.chartArea}>
            <View style={styles.gridLines}>
              {[...Array(5)].map((_, i) => (
                <View key={i} style={styles.gridLine} />
              ))}
            </View>

            <View style={styles.barsContainer}>
              {interactionData.map((item, idx) => (
                <View key={idx} style={styles.barColumn}>
                  {/* Value above */}

                  {/* Bar aligned bottom */}
                  <View style={styles.barWrapper}>
                    <Text style={styles.barValue}>{item.value}</Text>
                    <LinearGradient
                      colors={item.gradient}
                      style={[
                        styles.bar,
                        { height: (item.value / max) * 120 }, // Bar grows from 0 to max height
                      ]}
                      start={{ x: 0, y: 1 }}
                      end={{ x: 0, y: 0 }}
                    />
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Percentage Cards */}
      <View style={styles.cardsSection}>
        <Text style={styles.sectionTitle}>Detailed Breakdown</Text>
        <View style={styles.cardsGrid}>
          {interactionData.map((item, index) => {
            const percentage = (item.value / total) * 100;
            return (
              <View key={index} style={styles.cardWrapper}>
                <LinearGradient
                  colors={[...item.gradient, item.gradient[1] + "10"]}
                  style={styles.card}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardIcon}>{item.icon}</Text>
                      <View style={styles.cardProgress}>
                        <View
                          style={[
                            styles.progressBar,
                            { width: `${Math.min(percentage, 100)}%` },
                          ]}
                        />
                      </View>
                    </View>
                    <Text style={styles.cardPercentage}>
                      {percentage.toFixed(1)}%
                    </Text>
                    <Text style={styles.cardLabel}>{item.label}</Text>
                    <Text style={styles.cardValue}>{item.value} items</Text>
                  </View>
                </LinearGradient>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default CustomerInteractionStats;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#f8fafc",
  },
  barColumn: {
    alignItems: "center",
    width: 48,
  },

  barWrapper: {
    height: 100, // height of the vertical bar space
    justifyContent: "flex-end",
  },

  bar: {
    width: 20,
    borderRadius: 6,
  },

  barValue: {
    fontSize: 10,
    fontWeight: "600",
    color: "#334155",
    marginBottom: 6,
  },

  barLabel: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
    marginTop: 6,
    width: 60,
  },

  barContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 6,
  },

  header: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "400",
  },
  summaryContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 32,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryNumber: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
  },
  chartSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  chartContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  yAxisLabels: {
    justifyContent: "space-between",
    height: 140,
    marginRight: 12,
  },
  axisLabel: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
  chartArea: {
    flex: 1,
    height: 140,
  },
  gridLines: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: "space-between",
  },
  gridLine: {
    height: 1,
    backgroundColor: "#f1f5f9",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: 120,
    paddingTop: 10,
  },

  barValueContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    paddingHorizontal: 2,
    paddingVertical: 2,
  },

  cardsSection: {
    marginBottom: 32,
  },
  cardsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 16,
  },
  cardWrapper: {
    width: "47%",
  },
  card: {
    borderRadius: 20,
    padding: 1.5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  cardContent: {
    backgroundColor: "#ffffff",
    borderRadius: 19,
    padding: 20,
    minHeight: 100,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardProgress: {
    flex: 1,
    height: 4,
    backgroundColor: "#f1f5f9",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 2,
  },
  cardPercentage: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "500",
  },
});
