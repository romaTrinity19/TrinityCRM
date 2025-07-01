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
import { useNavigation, useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { withDrawer } from "./drawer";

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

type Lead = {
  cust_no: string;
  name: string; // Maps to leadName
  email_id: string;
  contact_no: string;
  whatsapp_no: string;
  walkin_date: string; // Maps to leadDate
  lead_source_id: string; // Maps to leadSource
  agent_id: string; // Maps to leadAgent
  opportunity: string;
  state_id: string;
  estimate_amt: string; // Maps to amount
  address: string; // Maps to notes
  type: string; // Will be "lead"
  lead_status: string;
  lead_owner: string;
  lead_id: string;
  agent_name: string;
  lead_source_name: string;
  state_name: string;
  internal_notes: string;
};
type RootDrawerParamList = {
  LeadDetailsScreen: undefined;
};

const LeadDetailsScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);



  const handleCall = () => {
    if (Platform.OS !== "web") {
      Linking.openURL(`tel:${lead?.contact_no}`);
    } else {
      Alert.alert(
        "Call Feature",
        "Calling functionality is not available on web platform"
      );
    }
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${lead?.email_id}`);
  };

  const handleWhatsApp = () => {
    const message = `Hi ${lead?.name}, regarding your inquiry about ${lead?.opportunity}`;
    const url = `whatsapp://send?phone=${lead?.whatsapp_no}&text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert("WhatsApp Error", "WhatsApp is not installed on this device");
    });
  };
 
  const handleEdit = () => {
    router.push({ pathname: "/(pages)/newLeads", params: { type: "update", id:id } });
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

      if (response.data) {
        setLead(response.data.lead); // assuming it's an array
      } else {
        console.warn("No lead data found.");
      }
    } catch (error) {
      console.error("Error fetching lead:", error);
    } finally {
      setLoading(false);
    }
  };

  

  if (loading) {
    return (
      <ActivityIndicator style={{ flex: 1 }} size="large" color="#5975D9" />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#5975D9", "#1F40B5"]}
        style={{ paddingVertical: 16, paddingHorizontal: 12 }}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Lost Lead</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
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
            icon={<FontAwesome name="whatsapp" size={20} color="#22C55E" />}
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
            value={lead?.opportunity || ""}
          />

          <InfoCard
            icon={<Feather name="user" size={20} color="#5975D9" />}
            title="Lead Name"
            value={lead?.name || ""}
            subtitle={`ID : #000${lead?.cust_no}`}
          />

          <InfoCard
            icon={<Feather name="mail" size={20} color="#3B82F6" />}
            title="Email Address"
            value={lead?.email_id || ""}
          />

          <InfoCard
            icon={<Feather name="phone" size={20} color="#10B981" />}
            title="Contact Number"
            value={lead?.contact_no || ""}
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
            value={lead?.whatsapp_no || ""}
          />
        </View>

        {/* Lead Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lead Details</Text>

          <InfoCard
            icon={<Feather name="calendar" size={20} color="#5975D9" />}
            title="Lead Date"
            value={
              lead?.walkin_date
                ? new Date(lead.walkin_date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Not Available"
            }
          />

          <InfoCard
            icon={<FontAwesome5 name="building" size={20} color="#5975D9" />}
            title="Lead Source"
            value={lead?.lead_source_name || ""}
          />

          <InfoCard
            icon={<Feather name="user" size={20} color="#5975D9" />}
            title="Assigned Agent"
            value={lead?.agent_name || ""}
          />

          <InfoCard
            icon={<Feather name="map-pin" size={20} color="#5975D9" />}
            title="State"
            value={lead?.state_name || ""}
          />

          <InfoCard
            icon={<Feather name="dollar-sign" size={20} color="#5975D9" />}
            title="Estimate Amount"
            value={lead?.estimate_amt || ""}
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
            <Text style={styles.notesText}>{lead?.internal_notes}</Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};
export default withDrawer(LeadDetailsScreen, "LeadDetailsScreen");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },

  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    textAlign: "center",
    flex: 1,
    marginHorizontal: 12,
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
