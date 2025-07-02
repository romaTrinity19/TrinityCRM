import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { withDrawer } from "./drawer";
import axios from "axios";
import { ActionButton } from "@/components/ActionButton";

type RootDrawerParamList = {
  CustomerDetails: undefined;
};

const CustomerDetails = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const [customer, setCustomer] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(
          `http://crmclient.trinitysoftwares.in/crmAppApi/customerProfile.php?type=getCustomerById&id=${id}`
        );

        if (response.data.status === "success") {
          setCustomer(response.data.customer);
        } else {
          setError(response.data.message || "Customer not found");
        }
      } catch (err) {
        console.error("API error:", err);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleCall = () => {
    if (Platform.OS !== "web") {
      Linking.openURL(`tel:${customer?.contact_no}`);
    } else {
      Alert.alert(
        "Call Feature",
        "Calling functionality is not available on web platform"
      );
    }
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${customer?.email_id}`);
  };

  const handleWhatsApp = () => {
    if (!customer?.whatsapp_no) {
      Alert.alert("Error", "Customer WhatsApp number not available");
      return;
    }

    const message = `
👋 Hello ${customer?.name},
Thank you for connecting with us. Here are your details as per our records:

🔹 Name: ${customer?.name}
🔹 Contact No: ${customer?.contact_no}
🔹 Email: ${customer?.email_id}
🔹 WhatsApp No: ${customer?.whatsapp_no}
🔹 Company Name: ${customer?.company_name}
🔹 State: ${customer?.state_name}
🔹 GSTIN: ${customer?.gstin}
🔹 PAN No: ${customer?.pan_no}
🔹 Address: ${customer?.address}
🔹 Billing Address: ${customer?.billing_address}

If there is any correction required, please let us know.

Warm regards,
Team Trinity Softwares
`;

    const url = `whatsapp://send?phone=${customer?.whatsapp_no}&text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() => {
      Alert.alert("WhatsApp Error", "WhatsApp is not installed on this device");
    });
  };

  const handleEdit = () => {
    router.push({
      pathname: "/(components)/customerProfile",
      params: { type: "update", id: id },
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5975D9" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f6ff" }}>
      {/* Header */}

      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Customer Details</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.container}>
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
        {/* Title Card */}
        <View style={styles.card}>
          <Text style={styles.name}>{customer?.name}</Text>
          <View style={styles.contact}>
            <Ionicons name="call" color="#5975D9" size={18} />
            <Text style={{ marginLeft: 8, color: "#5975D9", fontSize: 16 }}>
              {customer?.contact_no}
            </Text>
          </View>

          <View style={styles.contact}>
            <Ionicons name="mail" color="#5975D9" size={18} />
            <Text style={{ marginLeft: 8, color: "#5975D9", fontSize: 16 }}>
              {customer?.email_id}
            </Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Company Details</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Company Name</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}> {customer?.company_name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>GSTIN</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}>{customer?.gstin}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>PAN</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}>{customer?.pan_no}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Addresses</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Billing</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}>{customer?.billing_address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Shipping</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}>{customer?.address}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Additional</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>WhatsApp Number</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}>{customer?.whatsapp_no}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>State</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}>{customer?.state_name}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default withDrawer(CustomerDetails, "CustomerDetails");

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#004c91",
    marginBottom: 8,
  },
  contact: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  cardHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#004c91",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#5975D9",
    paddingBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    flexWrap: "wrap",
  },
  rowLabel: {
    color: "#2D4491",
    fontWeight: "600",
    fontSize: 15,
    width: "43%",
  },
  rowValue: {
    color: "#5975D9",
    fontSize: 15,
    width: "50%",
  },
  rowValue2: {
    color: "#2D4491",
    fontWeight: "600",
    fontSize: 15,
    width: "7%",
  },
  actionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 24,
    gap: 4,
  },
});
