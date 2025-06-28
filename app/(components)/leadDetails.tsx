import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Ionicons,
  Feather,
  FontAwesome5,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";

import { StatusBadge } from "@/components/StatausBadge";
import { ActionButton } from "@/components/ActionButton";
import { InfoCard } from "@/components/InfoCard";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";

// Sample lead data - replace with actual data from your API/state
const leadData = {
  id: "LD001",
  opportunity: "Website Development Project for E-commerce Platform",
  leadName: "John Smith",
  email: "john.smith@example.com",
  contact: "+1 (555) 123-4567",
  whatsapp: "+1 (555) 123-4567",
  leadDate: "2024-01-15",
  leadSource: "Website",
  leadAgent: "Sarah Johnson",
  state: "California",
  amount: "$15,000",
  notes:
    "Client is interested in a complete e-commerce solution with custom features. Follow up scheduled for next week to discuss technical requirements.",
  status: "Active",
  priority: "High",
  lastContact: "2024-01-10",
  nextFollowUp: "2024-01-20",
  sendWhatsApp: true,
  sendMail: true,
};

export default function LeadDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("lead id", id);

  const handleCall = () => {
    if (Platform.OS !== "web") {
      Linking.openURL(`tel:${leadData.contact}`);
    } else {
      Alert.alert(
        "Call Feature",
        "Calling functionality is not available on web platform"
      );
    }
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${leadData.email}`);
  };

  const handleWhatsApp = () => {
    const message = `Hi ${leadData.leadName}, regarding your inquiry about ${leadData.opportunity}`;
    const url = `whatsapp://send?phone=${leadData.whatsapp}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("WhatsApp Error", "WhatsApp is not installed on this device");
    });
  };

  const handleShare = () => {
    Alert.alert("Share Lead", "Share functionality will be implemented here");
  };

  const handleEdit = () => {
    router.push("/(pages)/newLeads");
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "#10B981";
      case "pending":
        return "#F59E0B";
      case "closed":
        return "#EF4444";
      case "converted":
        return "#8B5CF6";
      default:
        return "#6B7280";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "#EF4444";
      case "medium":
        return "#F59E0B";
      case "low":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  useEffect(() => {
    if (id) {
      fetchLeadDetails(id);
    }
  }, [id]);

  const fetchLeadDetails = async (leadId: string | string[]) => {
    try {
      const response = await axios.get(
        `http://crmclient.trinitysoftwares.in/crmAppApi/leads.php?type=getLeadById&id=${leadId}`
      );
      if (response.data && response.data.length > 0) {
        setLead(response.data[0]); // assuming it's an array
      } else {
        console.warn("No lead data found.");
      }
    } catch (error) {
      console.error("Error fetching lead:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log("individual lead data ", lead);

  if (loading) {
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#5975D9" />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.headerButton}
          >
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Lead Details</Text>
            <Text style={styles.headerSubtitle}>ID: {leadData.id}</Text>
          </View>

          <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
            <Feather name="share-2" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{leadData.amount}</Text>
            <Text style={styles.statLabel}>Est. Value</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>15</Text>
            <Text style={styles.statLabel}>Days Old</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Follow-ups</Text>
          </View>
        </View> */}
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Contact Actions */}
        <View style={styles.actionsContainer}>
          <ActionButton
            icon={<Feather name="phone" size={20} color="#10B981" />}
            label="Call"
            color="#10B981"
            onPress={handleCall}
          />
          <ActionButton
            icon={<Feather name="mail" size={20} color="#3B82F6" />}
            label="Email"
            color="#3B82F6"
            onPress={handleEmail}
          />
          <ActionButton
            icon={<Feather name="message-circle" size={20} color="#22C55E" />}
            label="WhatsApp"
            color="#22C55E"
            onPress={handleWhatsApp}
          />
          <ActionButton
            icon={<Feather name="edit" size={20} color="#8B5CF6" />}
            label="Edit"
            color="#8B5CF6"
            onPress={handleEdit}
          />
        </View>

        {/* Lead Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lead Information</Text>

          <InfoCard
            icon={<Feather name="target" size={20} color="#5975D9" />}
            title="Opportunity"
            value={leadData.opportunity}
          />

          <InfoCard
            icon={<Feather name="user" size={20} color="#5975D9" />}
            title="Lead Name"
            value={leadData.leadName}
            subtitle="Primary Contact"
          />

          <InfoCard
            icon={<Feather name="mail" size={20} color="#3B82F6" />}
            title="Email Address"
            value={leadData.email}
          />

          <InfoCard
            icon={<Feather name="phone" size={20} color="#10B981" />}
            title="Contact Number"
            value={leadData.contact}
          />

          <InfoCard
            icon={
              <FontAwesome
                name="whatsapp"
                size={24}
                color={leadData.sendWhatsApp ? "#22C55E" : "#9CA3AF"}
              />
            }
            title="WhatsApp Number"
            value={leadData.whatsapp}
          />
        </View>

        {/* Lead Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lead Details</Text>

          <InfoCard
            icon={<Feather name="calendar" size={20} color="#5975D9" />}
            title="Lead Date"
            value={new Date(leadData.leadDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          />

          <InfoCard
            icon={<FontAwesome5 name="building" size={20} color="#5975D9" />}
            title="Lead Source"
            value={leadData.leadSource}
          />

          <InfoCard
            icon={<Feather name="user" size={20} color="#5975D9" />}
            title="Assigned Agent"
            value={leadData.leadAgent}
          />

          <InfoCard
            icon={<Feather name="map-pin" size={20} color="#5975D9" />}
            title="State"
            value={leadData.state}
          />

          <InfoCard
            icon={<Feather name="dollar-sign" size={20} color="#5975D9" />}
            title="Estimate Amount"
            value={leadData.amount}
            subtitle="Expected project value"
          />
        </View>

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>

          <InfoCard
            icon={<Feather name="clock" size={20} color="#5975D9" />}
            title="Last Contact"
            value={new Date(leadData.lastContact).toLocaleDateString()}
          />

          <InfoCard
            icon={<Feather name="calendar" size={20} color="#5975D9" />}
            title="Next Follow-up"
            value={new Date(leadData.nextFollowUp).toLocaleDateString()}
            subtitle="Scheduled follow-up date"
          />
        </View>

        {/* Communication Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Communication Preferences</Text>

          <View style={styles.preferencesContainer}>
            <View style={styles.preferenceItem}>
              <FontAwesome
                name="whatsapp"
                size={24}
                color={leadData.sendWhatsApp ? "#22C55E" : "#9CA3AF"}
              />

              {/* <MessageCircle size={20} color={leadData.sendWhatsApp ? '#22C55E' : '#9CA3AF'} /> */}
              <Text
                style={[
                  styles.preferenceText,
                  { color: leadData.sendWhatsApp ? "#22C55E" : "#9CA3AF" },
                ]}
              >
                WhatsApp Enabled
              </Text>
            </View>

            <View style={styles.preferenceItem}>
              <Feather
                name="mail"
                size={20}
                color={leadData.sendMail ? "#3B82F6" : "#9CA3AF"}
              />
              {/* <Mail size={20} color={leadData.sendMail ? '#3B82F6' : '#9CA3AF'} /> */}
              <Text
                style={[
                  styles.preferenceText,
                  { color: leadData.sendMail ? "#3B82F6" : "#9CA3AF" },
                ]}
              >
                Email Enabled
              </Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Internal Notes</Text>

          <View style={styles.notesContainer}>
            <Feather name="file-text" size={20} color="#6B7280" />
            {/* <FileText size={20} color="#6B7280" /> */}
            <Text style={styles.notesText}>{leadData.notes}</Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerButton: {
    padding: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 2,
  },
  headerStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  statusContainer: {
    flexDirection: "row",
    paddingVertical: 16,
    gap: 8,
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 24,
    gap: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },
  preferencesContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  preferenceText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
  },
  notesContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notesText: {
    flex: 1,
    fontSize: 16,
    color: "#374151",
    lineHeight: 24,
    marginLeft: 12,
  },
  bottomSpacing: {
    height: 80,
  },
});
