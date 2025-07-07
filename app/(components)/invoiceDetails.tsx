import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import Toast from "react-native-toast-message";

const InvoiceDetails = () => {
  const [menuVisible, setMenuVisible] = React.useState(false);
  const menuButtonRef = React.useRef<View>(null);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });
  const [products, setProducts] = useState<any[]>([]);
  const [Invoice, setInvoice] = useState<any>({});
  const { id: _id, type: _type } = useLocalSearchParams();
  const id = Array.isArray(_id) ? _id[0] : _id;

  const total = products?.reduce(
    (sum, item) => sum + parseFloat(item.charges || 0),
    0
  );
  const discount = parseFloat(Invoice?.discount || 0);
  const netTotal = total - discount;

  const downloadPDF = async (billId: string) => {
    try {
      const downloadUrl = `http://crmclient.trinitysoftwares.in/admin/pdf_invoice.php?bill_id=${billId}`;
      const fileUri = FileSystem.documentDirectory + `invoice_${billId}.pdf`;

      const downloadResumable = FileSystem.createDownloadResumable(
        downloadUrl,
        fileUri
      );

      const result = await downloadResumable.downloadAsync();

      if (result && result.uri) {
        const cUri = await FileSystem.getContentUriAsync(result.uri);
        IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: cUri,
          flags: 1,
          type: "application/pdf",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Failed to download PDF.",
        });
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      Toast.show({
        type: "error",
        text1: "Failed to download PDF.",
      });
    }
  };

  const fetchDraftProductsByBillId = async (billId: string) => {
    try {
      const response = await axios.post(
        "http://crmclient.trinitysoftwares.in/crmAppApi/quatation.php?type=fetchProducts",
        { type: "invoice", bill_id: billId },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status === "success") {
        setProducts(response.data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products by bill_id:", error);
    }
  };

  useEffect(() => {
    const fetchInvoiceById = async () => {
      try {
        const response = await axios.get(
          `http://crmclient.trinitysoftwares.in/crmAppApi/quatation.php?type=getInvoiceById&bill_id=${id}`
        );

        if (response.data.status === "success") {
          const q = response.data.invoice;
          setInvoice(q);
        } else {
          console.log("Invoice not found");
        }
      } catch (err) {
        console.error("Error fetching Invoice:", err);
      }
    };

    fetchDraftProductsByBillId(id);

    fetchInvoiceById();
  }, [id]);

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
                    downloadPDF(id);
                  }}
                >
                  <Text style={{ fontSize: 16, color: "#333" }}>Download</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                  onPress={async () => {
                    setMenuVisible(false);
                    await Share.share({
                      message: `Invoice from ${Invoice?.customer_name}, Total ₹${netTotal}`,
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
                :{"  "} {Invoice?.customer_name}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Contact Number</Text>
              <Text style={styles.value}>
                :{"  "} {Invoice?.mobile_no}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>WhatsApp Number</Text>
              <Text style={styles.value}>
                :{"  "} {Invoice?.whatsapp_no}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Invoice Number</Text>
              <Text style={styles.value}>
                :{"  "} {Invoice?.billno}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Invoice Date</Text>
              <Text style={styles.value}>
                :{"  "} {Invoice?.billdate}
              </Text>
            </View>
             <View style={styles.row}>
              <Text style={styles.label}>Service Date</Text>
              <Text style={styles.value}>
                :{"  "} {Invoice?.service_date}
              </Text>
            </View>
          </View>

          {/* Products */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            {products?.map((item, index) => (
              <View key={item.billing_details_id} style={styles.productItem}>
                <Text style={styles.productTitle}>
                  {index + 1}. {item.particular}
                </Text>
                <Text style={styles.productInfo}>
                  Service Type: {item.service_name}
                </Text>
                <Text style={styles.productInfo}>Charges: ₹{item.charges}</Text>
              </View>
            ))}

            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toFixed(2)}</Text>
            </View>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Discount</Text>
              <Text style={styles.totalValue}>₹{discount.toFixed(2)}</Text>
            </View>
            <View style={styles.totalBox}>
              <Text style={styles.totalLabel}>Net Total</Text>
              <Text style={styles.totalValue}>₹{netTotal.toFixed(2)}</Text>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.value}>{Invoice?.other_note}</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default InvoiceDetails;

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
