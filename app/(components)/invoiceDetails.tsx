import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Share,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import { Modal } from "react-native";

const quotationData = {
  customer: "John Doe",
  contact: "9876543210",
  whatsapp: "9876543210",
  invoiceNumber: "2024-25/QU000003",
  invoiceDate: "05/06/2025",
  serviceDate: "05/06/2025",
  products: [
    {
      id: 1,
      particular: "Web Design",
      serviceType: "Service Type 1",
      charges: 5000,
    },
    {
      id: 2,
      particular: "SEO",
      serviceType: "Service Type 2",
      charges: 2000,
    },
  ],
  discount: 500,
  notes: "Quotation valid for 30 days.",
};

const total = quotationData.products.reduce(
  (sum, item) => sum + item.charges,
  0
);
const netTotal = total - quotationData.discount;

const QuotationDetails = () => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const menuButtonRef = React.useRef<View>(null);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f6ff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Invoice Details</Text>
          <View ref={menuButtonRef}>
            <TouchableOpacity
              onPress={() => {
                if (menuButtonRef.current) {
                  menuButtonRef.current.measureInWindow(
                    (x, y, width, height) => {
                      setMenuPosition({ x, y: y + height });
                      setMenuVisible(true);
                    }
                  );
                }
              }}
            >
              <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        {menuVisible && (
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9999,
              }}
            >
              <View
                style={{
                  position: "absolute",
                  top: menuPosition.y,
                  left: menuPosition.x - 130,
                  width: 160,
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  paddingVertical: 8,
                  elevation: 10,
                  shadowColor: "#000",
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                }}
              >
                <TouchableOpacity
                  style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                  onPress={() => {
                    setMenuVisible(false);
                    console.log("Download tapped");
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#333" }}>Download</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                  onPress={async () => {
                    setMenuVisible(false);
                    await Share.share({
                      message: `Quotation from ${quotationData.customer}, Total ₹${netTotal}`,
                    });
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#333" }}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          pointerEvents={menuVisible ? "box-none" : "auto"}
        >
          {/* Info Card */}
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>Customer</Text>
              <Text style={styles.value}>
                :{"  "} {quotationData.customer}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contact Number</Text>
              <Text style={styles.value}>
                :{"  "} {quotationData.contact}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>WhatsApp Number</Text>
              <Text style={styles.value}>
                :{"  "} {quotationData.whatsapp}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Invoice Number</Text>
              <Text style={styles.value}>
                :{"  "} {quotationData.invoiceNumber}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Invoice Date</Text>
              <Text style={styles.value}>
                :{"  "} {quotationData.invoiceDate}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Service Date</Text>
              <Text style={styles.value}>
                :{"  "} {quotationData.serviceDate}
              </Text>
            </View>
          </View>

          {/* Products */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            {quotationData.products.map((item, index) => (
              <View key={item.id} style={styles.productItem}>
                <Text style={styles.productTitle}>
                  {index + 1}. {item.particular}
                </Text>
                <Text style={styles.productInfo}>
                  Service Type: {item.serviceType}
                </Text>
                <Text style={styles.productInfo}>
                  Charges: ₹{item.charges.toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={styles.totalValue}>
                ₹{quotationData.discount.toFixed(2)}
              </Text>
            </View>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Net Total:</Text>
              <Text style={styles.totalValue}>₹{netTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.value}>{quotationData.notes}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default QuotationDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6ff",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 4,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  row: { flexDirection: "row", marginBottom: 10 },
  label: {
    width: "40%",
    fontWeight: "600",
    color: "#555",
  },
  value: {
    width: "60%",
    color: "#111",
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#5975D9",
    marginBottom: 12,
  },
  productItem: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: "#e0e0e0",
  },
  productTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  productInfo: {
    fontSize: 14,
    color: "#555",
  },
  totalBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  totalValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
});
