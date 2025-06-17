import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { withDrawer } from "./drawer";

type RootDrawerParamList = {
  CustomerDetails: undefined;
};

const CustomerDetails = () => {
      const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const customer = {
    customerName: "John David",
    contactNumber: "1231231234",
    email: "john@example.com",
    whatsappNumber: "1231231234",
    state: "Maharashtra",
    companyName: "Tech Solutions Pvt Ltd",
    gstin: "27AAEPM1234J1Z9",
    pan: "ABCDE1234F",
    billingAddress: "123 Main Street, Mumbai",
    shippingAddress: "500 Market Road, Mumbai",
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f6ff" }}>
      {/* Header */}

      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Customer List</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Title Card */}
        <View style={styles.card}>
          <Text style={styles.name}>{customer.customerName}</Text>
          <View style={styles.contact}>
            <Ionicons name="call" color="#5975D9" size={18} />
            <Text style={{ marginLeft: 8, color: "#5975D9", fontSize: 16 }}>
              {customer.contactNumber}
            </Text>
          </View>

          <View style={styles.contact}>
            <Ionicons name="mail" color="#5975D9" size={18} />
            <Text style={{ marginLeft: 8, color: "#5975D9", fontSize: 16 }}>
              {customer.email}
            </Text>
          </View>
        </View>

        {/* Details Section */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Company Details</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Company Name</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}> {customer.companyName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>GSTIN</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}>{customer.gstin}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>PAN</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}>{customer.pan}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Addresses</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Billing</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}>{customer.billingAddress}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Shipping</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}>{customer.shippingAddress}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Additional</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>WhatsApp Number</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}>{customer.whatsappNumber}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>State</Text>
            <Text style={styles.rowValue2}>:</Text>
            <Text style={styles.rowValue}>{customer.state}</Text>
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
});
