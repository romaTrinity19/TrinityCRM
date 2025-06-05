import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { withDrawer } from "./drawer";

const themeColor = "#5975D9";

interface Product {
  id: number;
  particular: string;
  serviceType: string;
  charges: number;
}
type RootDrawerParamList = {
  QuotationForm: undefined;
};

const QuotationForm = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [contact, setContact] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [quotationDate, setQuotationDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [particular, setParticular] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [charges, setCharges] = useState("");
  const [discount, setDiscount] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [sameAsContact, setSameAsContact] = useState(false);

  const customers = [
    { label: "Select Customer", value: "" },
    { label: "John Doe", value: "John Doe" },
    { label: "Jane Smith", value: "Jane Smith" },
    { label: "Acme Corp", value: "Acme Corp" },
  ];

  const serviceTypes = [
    { label: "Select Service Type", value: "" },
    { label: "Service Type1", value: "Service Type 1" },
    { label: "Service Type2", value: "Service Type 2" },
    { label: "Service Type3", value: "Service Type 3" },
  ];

  const addProduct = () => {
    if (particular && serviceType && charges) {
      const newProduct: Product = {
        id: Date.now(),
        particular,
        serviceType,
        charges: parseFloat(charges),
      };
      setProducts([...products, newProduct]);
      setParticular("");
      setServiceType("");
      setCharges("");
    }
  };

  const totalAmount = products.reduce((sum, item) => sum + item.charges, 0);
  const discountAmount = parseFloat(discount) || 0;
  const netTotal = totalAmount - discountAmount;

  const formatDate = (date: Date): string => {
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const removeProduct = (id: number) => {
    setProducts(products.filter((item) => item.id !== id));
  };

  useEffect(() => {
    if (sameAsContact) {
      setWhatsapp(contact);
    }
  }, [sameAsContact, contact]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f6ff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <LinearGradient
          colors={["#5975D9", "#1F40B5"]}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            backgroundColor: "#004c91",
            padding: 15,
          }}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
            Quotation Form
          </Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
        <ScrollView contentContainerStyle={styles.container}>
          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 20,
              elevation: 2,
            }}
          >
            {/* Customer Picker */}
            <Text style={styles.label}>
              Select Customer <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCustomer}
                onValueChange={(itemValue) => setSelectedCustomer(itemValue)}
                style={styles.picker}
              >
                {customers.map((item) => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>
            <Text style={styles.label}>
              Contact Number <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.inputFull}
              placeholder="Enter Contact Number"
              keyboardType="phone-pad"
              value={contact}
              onChangeText={setContact}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={styles.label}>
                WhatsApp Number <Text style={styles.required}>*</Text>
              </Text>

              {/* Checkbox toggle */}
              <TouchableOpacity
                onPress={() => setSameAsContact(!sameAsContact)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <Ionicons
                  name={sameAsContact ? "checkbox" : "square-outline"}
                  size={20}
                  color="#5975D9"
                />
                <Text
                  style={{ marginLeft: 6, color: "#5975D9", fontWeight: "600" }}
                >
                  Same as Contact
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.inputFull}
              placeholder="Enter WhatsApp No."
              keyboardType="phone-pad"
              value={whatsapp}
              editable={!sameAsContact}
              onChangeText={setWhatsapp}
            />

            {/* Quotation Number */}
            <Text style={styles.label}>
              Quotation Number <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.inputFull, { backgroundColor: "#eaeaea" }]}
              value="2024-25/QU000003"
              editable={false}
            />

            {/* Date Picker */}
            <Text style={styles.label}>
              Quotation Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.inputFull}
            >
              <Text style={{ color: "#333" }}>
                Quotation Date: {formatDate(quotationDate)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={quotationDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setQuotationDate(selectedDate);
                  }
                }}
              />
            )}
          </View>

          <View
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 20,
              elevation: 2,
              marginTop: 20,
            }}
          >
            {/* Add Product */}
            <Text style={styles.section}>Add Product</Text>
            <TextInput
              style={styles.inputFull}
              placeholder="Particular"
              value={particular}
              onChangeText={setParticular}
            />
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={serviceType}
                onValueChange={(itemValue) => setServiceType(itemValue)}
                style={styles.picker}
              >
                {serviceTypes.map((item) => (
                  <Picker.Item
                    key={item.value}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>

            <TextInput
              style={styles.inputFull}
              placeholder="Charges (Rs.)"
              keyboardType="numeric"
              value={charges}
              onChangeText={setCharges}
            />
            <TouchableOpacity style={styles.addButton} onPress={addProduct}>
              <Text style={styles.addBtnText}>+ Add Product</Text>
            </TouchableOpacity>
          </View>

          {/* Product List */}
          {products.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.section}>Product Details</Text>
              {products.map((item, index) => (
                <View key={item.id} style={styles.card}>
                  <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>
                      {index + 1}. {item.particular}
                    </Text>
                    <Text style={styles.cardSubtitle}>
                      Service: {item.serviceType}
                    </Text>
                    <Text style={styles.cardAmount}>
                      Charges: ₹{item.charges.toFixed(2)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => removeProduct(item.id)}
                    style={styles.deleteBtn}
                  >
                    <Text style={styles.deleteText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {/* Totals */}
          <TextInput
            style={[styles.inputFull, { marginTop: 20 }]}
            placeholder="Discount (In Rs.)"
            keyboardType="numeric"
            value={discount}
            onChangeText={setDiscount}
          />
          <Text style={styles.total}>Total: ₹{totalAmount.toFixed(2)}</Text>
          <Text style={styles.total}>Net Total: ₹{netTotal.toFixed(2)}</Text>

          {/* Notes */}
          <Text style={styles.section}>Other Notes</Text>
          <TextInput
            style={[styles.inputFull, { height: 100 }]}
            multiline
            textAlignVertical="top"
            placeholder="Enter notes"
          />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetBtn}>
              <Text style={styles.btnText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default withDrawer(QuotationForm, "QuotationForm");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f6ff",
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
    color: "#333",
  },
  required: {
    color: "red",
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: themeColor,
    marginBottom: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 6,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    margin: -5,
  },
  inputFull: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#fff",
    elevation: 1,
  },
  section: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },
  addButton: {
    backgroundColor: themeColor,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  addBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  productCard: {
    backgroundColor: "#f0f4ff",
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
    elevation: 1,
  },
  productText: {
    fontSize: 14,
    color: "#333",
  },
  total: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 4,
    color: themeColor,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  saveBtn: {
    backgroundColor: themeColor,
    padding: 12,
    borderRadius: 6,
    width: "47%",
  },
  resetBtn: {
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 6,
    width: "47%",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardContent: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },

  cardAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: themeColor,
    marginTop: 4,
  },

  deleteBtn: {
    padding: 6,
    backgroundColor: "#ffe6e6",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },

  deleteText: {
    fontSize: 16,
    color: "#e74c3c",
    fontWeight: "bold",
  },
});
