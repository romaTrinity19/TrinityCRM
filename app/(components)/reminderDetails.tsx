import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const screenHeight = Dimensions.get("window").height;

export default function FollowUpDetailCard() {
  const [followUp, setFollowUp] = useState<any>(null);
  const { id } = useLocalSearchParams();
  const idParam = Array.isArray(id) ? id[0] : id;
  const [loading, setLoading] = useState(false);

  const fetchReminderById = async () => {
    if (!idParam) {
      console.error("Invalid followup ID");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://crmclient.trinitysoftwares.in/crmAppApi/reminder.php?type=getReminderById&reminder_id=${idParam}`
      );
      const json = await response.json();
      console.log("API Response:", json);
      if (json.status === "success") {
        setFollowUp(json.data);
      } else {
        Toast.show({
          type: "error",
          text1: json.message || "Failed to load follow-up",
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      Toast.show({ type: "error", text1: "Error fetching follow-up data" });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchReminderById();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5975D9" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
        <Ionicons
          name="arrow-back"
          size={26}
          color="#fff"
          style={styles.backIcon}
          onPress={() => router.back()}
        />
        <Ionicons name="chatbox-ellipses-outline" size={28} color="#fff" />
        <Text style={styles.header}>Reminder Details</Text>
      </View>

      <View style={styles.card}>
        {/* Profile Section */}
        <View style={styles.profileRow}>
          <Ionicons
            name="person-circle-outline"
            size={64}
            color="#4B65E9"
            style={styles.profileIcon}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{followUp?.lead_name}</Text>
            <Text style={styles.phone}>📞 {followUp?.contact}</Text>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={20} color="#4B65E9" />
          <Text style={styles.infoText}>{followUp?.reminder_date}</Text>

          <Ionicons
            name="time-outline"
            size={20}
            color="#4B65E9"
            style={{ marginLeft: 20 }}
          />
          <Text style={styles.infoText}>{followUp?.reminder_time}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="person-circle-outline" size={20} color="#4B65E9" />
          <Text style={styles.infoText}>
            Created By - {followUp?.created_by}
          </Text>
        </View>
        {/* Service Type */}
        <View style={styles.infoRow}>
          <Ionicons name="briefcase-outline" size={20} color="#4B65E9" />
          <Text style={[styles.infoText, { flex: 1 }]}>
            Opportunity - {followUp?.opportunity_name}
          </Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionTitle}>Reminder Notes</Text>
          <Text style={styles.descriptionText}>{followUp?.description} </Text>
        </View>
      </View>

      {/* Footer Tagline */}
      <Text style={styles.footerText}>Stay connected. Stay informed.</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#e6ecfc",
    padding: 20,
    justifyContent: "center",
    minHeight: screenHeight,
  },
  headerContainer: {
    backgroundColor: "#4B65E9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileIcon: {
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#070557",
  },
  phone: {
    fontSize: 15,
    color: "#444",
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    marginVertical: 12,
    gap: 10,
    alignItems: "flex-start",
  },
  infoText: {
    fontSize: 15,
    color: "#333",
  },
  descriptionBox: {
    marginTop: 24,
    backgroundColor: "#f3f5ff",
    borderRadius: 10,
    padding: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#070557",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: "#666",
  },
  footerText: {
    marginTop: 30,
    textAlign: "center",
    color: "#4B65E9",
    fontWeight: "600",
    fontSize: 14,
  },
  backIcon: {
    position: "absolute",
    left: 16,
    top: 16,
    zIndex: 1,
  },
});
