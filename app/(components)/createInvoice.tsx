import { getServiceDetails, getUserDetails } from "@/components/utils/api";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { withDrawer } from "./drawer";

const themeColor = "#5975D9";

interface Product {
  id: number;
  particular: string;
  serviceType: string;
  charges: number;
}
type RootDrawerParamList = {
  InvoiceFrom: undefined;
};

const InvoiceFrom = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [contact, setContact] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [quotationDate, setQuotationDate] = useState(new Date());
  const [serviceDate, setServiceDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDatePicker2, setShowDatePicker2] = useState(false);
  const [particular, setParticular] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [charges, setCharges] = useState("");
  const [discount, setDiscount] = useState("");
  const [notes, setNotes] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [sameAsContact, setSameAsContact] = useState(false);
  const [customer, setCustomer] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [service, setService] = useState<any[]>([]);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [savingQuotation, setSavingQuotation] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);

  const totalAmount = products.reduce((sum, item) => sum + item.charges, 0);
  const discountAmount = parseFloat(discount) || 0;
  const netTotal = totalAmount - discountAmount;
  const { id: _id, type: _type } = useLocalSearchParams();
  const id = Array.isArray(_id) ? _id[0] : _id;
  const type = Array.isArray(_type) ? _type[0] : _type;

  const formatDate = (date: Date): string => {
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  useEffect(() => {
    if (sameAsContact) {
      setWhatsapp(contact);
    }
  }, [sameAsContact, contact]);

  useEffect(() => {
    if (user?.userid) {
      fetchLeads();
    }
  }, [user]);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(
        `http://crmclient.trinitysoftwares.in/crmAppApi/customerProfile.php?type=getAllCustomers&loginid=${user.userid}`
      );

      if (response.data.status === "success") {
        const leads = response.data.customers;
        setCustomer(leads);
      } else {
        setError("Failed to load leads");
      }
    } catch (err) {
      console.error("❌ Error fetching leads:", err);
      setError("Error fetching leads");
    }
  };

  useEffect(() => {
    const fetchUserIdAndDetails = async () => {
      try {
        const id = await AsyncStorage.getItem("userId");
        if (id) {
          const result = await getUserDetails(id);
          if (result.success) {
            setUser(result.user);
          } else {
            setError(result.message);
          }
        } else {
          setError("No user ID found in storage.");
        }
      } catch (err: any) {
        setError("Failed to load user data.");
      }
    };

    fetchUserIdAndDetails();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      const result = await getServiceDetails();
      if (result.status === "success") {
        setService(result.data);
      } else {
        console.error("Error:", result.message);
      }
      setLoading(false);
    };

    fetchServices();
  }, []);

  const handleSaveQuotation = async () => {
    if (!selectedCustomer || !contact || !whatsapp || !quotationDate) {
      Toast.show({ type: "error", text1: "Please fill all required fields." });
      return;
    }
    if (products.length === 0) {
      Toast.show({ type: "error", text1: "Please add at least one product." });
      return;
    }

    try {
      setSavingQuotation(true);
      const payload = {
        lead_id: selectedCustomer,
        mobile_no: contact,
        whatsapp_no: whatsapp,
        billdate: quotationDate.toISOString().split("T")[0],
        service_date: serviceDate.toISOString().split("T")[0],
        total: totalAmount.toFixed(2),
        discount: discountAmount.toFixed(2),
        net_amt: netTotal.toFixed(2),
        other_note: notes,
      };

      if (type === "update" && id) {
        const response = await axios.patch(
          `http://crmclient.trinitysoftwares.in/crmAppApi/quatation.php?type=updateInvoice`,
          { ...payload, bill_id: id },
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.status === "success") {
          Toast.show({
            type: "success",
            text1: "Invoce updated successfully!",
          });
          router.push("/(components)/invoiceList");
        } else {
          Toast.show({
            type: "error",
            text1: response.data.message || "Failed to update",
          });
        }
      } else {
        // Create API (as before)
        const response = await axios.post(
          `http://crmclient.trinitysoftwares.in/crmAppApi/quatation.php?type=createInvoice&loginid=${user.userid}`,
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        if (response.data.status === "success") {
          Toast.show({
            type: "success",
            text1: "Invoice created successfully!",
          });
          router.push("/(components)/invoiceList");
          setProducts([]);
        } else {
          Toast.show({
            type: "error",
            text1: response.data.message || "Failed to create",
          });
        }
      }
    } catch (err) {
      console.error(err);
      Toast.show({ type: "error", text1: "Error saving quotation" });
    } finally {
      setSavingQuotation(false);
    }
  };

  const addProduct = async () => {
    if (!particular || !serviceType || !charges) {
      Toast.show({ type: "error", text1: "All product fields are required." });
      return;
    }
    setAddingProduct(true);
    try {
      const payload = {
        particular: particular,
        service_id: serviceType,
        charges: charges,
        type: "invoice",
      };

      const response = await axios.post(
        "http://crmclient.trinitysoftwares.in/crmAppApi/quatation.php?type=addProduct",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status === "success") {
        const newProduct: Product = {
          id: response.data.product_id,
          particular,
          serviceType,
          charges: parseFloat(charges),
        };
        setProducts([...products, newProduct]);
        setParticular("");
        setServiceType("");
        setCharges("");
      } else {
        Toast.show({ type: "error", text1: "Failed to add product" });
      }
    } catch (error) {
      console.error(error);
      Toast.show({ type: "error", text1: "Error adding product" });
    } finally {
      setAddingProduct(false);
    }
  };

  const fetchDraftProductsByBillId = async (billId: string) => {
    try {
      const response = await axios.post(
        "http://crmclient.trinitysoftwares.in/crmAppApi/quatation.php?type=fetchProducts",
        { type: "invoice", bill_id: billId }, // Pass bill_id here
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status === "success") {
        const productList = response.data.products.map((item: any) => ({
          id: item.billing_details_id,
          particular: item.particular,
          serviceType: item.service_id,
          charges: parseFloat(item.charges),
        }));
        setProducts(productList);
      }
    } catch (error) {
      console.error("Failed to fetch products by bill_id:", error);
    }
  };

  useEffect(() => {
    if (user?.userid) {
      fetchLeads();
    }
  }, [user]);

  const editProduct = (product: any) => {
    setParticular(product.particular);
    setServiceType(product.serviceType);
    setCharges(product.charges.toString());
    setEditingProductId(product.id);
  };

  const updateProduct = async () => {
    if (!editingProductId) return;

    try {
      const payload = {
        billing_details_id: editingProductId,
        type: "invoice",
        particular: particular,
        service_id: serviceType,
        charges: parseFloat(charges),
      };

      const response = await axios.patch(
        "http://crmclient.trinitysoftwares.in/crmAppApi/quatation.php?type=updateProduct",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.status === "success") {
        Toast.show({
          type: "success",
          text1: "Product updated successfully",
        });

        // Refresh product list after update
        const billId = type === "update" && id ? id : "0";
        fetchDraftProductsByBillId(billId);

        setParticular("");
        setServiceType("");
        setCharges("");
        setEditingProductId(null);
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message,
        });
      }
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const removeProduct = async (id: any) => {
    try {
      const response = await axios.delete(
        "http://crmclient.trinitysoftwares.in/crmAppApi/quatation.php?type=deleteProduct",
        {
          data: { billing_details_id: id },
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.status === "success") {
        Toast.show({
          type: "success",
          text1: "Product deleted",
        });

        setProducts(products.filter((item) => item.id !== id));
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message,
        });
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
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
          setSelectedCustomer(q.lead_id);
          setContact(q.mobile_no);
          setWhatsapp(q.whatsapp_no);
          setQuotationDate(new Date(q.billdate));
          setServiceDate(new Date(q.service_date));
          setDiscount(q.discount);
          setNotes(q.other_note);
        } else {
          console.log("Quotation not found");
        }
      } catch (err) {
        console.error("Error fetching quotation:", err);
      }
    };

    const billId = type === "update" && id ? id : "0";
    fetchDraftProductsByBillId(billId);

    if (type === "update" && id) {
      fetchInvoiceById();
    }
  }, [id, type]);

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
            Invoice Form
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
                onValueChange={(itemValue) => {
                  setSelectedCustomer(itemValue);
                  const selected = customer.find(
                    (cust) => cust.lead_id === itemValue
                  );
                  if (selected) {
                    setContact(selected.contact_no);
                    setWhatsapp(selected.whatsapp_no);
                  } else {
                    setContact("");
                    setWhatsapp("");
                  }
                }}
                style={styles.picker}
              >
                <Picker.Item label="---Select Customer---" value="" />
                {customer.map((cust) => (
                  <Picker.Item
                    key={cust.lead_id}
                    label={`${cust.name || "N/A"} / 000${cust.lead_id}`}
                    value={cust.lead_id}
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

            {/* Date Picker */}
            <Text style={styles.label}>
              Invoice Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.inputFull}
            >
              <Text style={{ color: "#333" }}>{formatDate(quotationDate)}</Text>
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

            <Text style={styles.label}>
              Service Date <Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker2(true)}
              style={styles.inputFull}
            >
              <Text style={{ color: "#333" }}>{formatDate(serviceDate)}</Text>
            </TouchableOpacity>
            {showDatePicker2 && (
              <DateTimePicker
                value={serviceDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker2(false);
                  if (selectedDate) {
                    setServiceDate(selectedDate);
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
                <Picker.Item label="---Select Service Type---" value="" />
                {service?.map((cust) => (
                  <Picker.Item
                    key={cust.service_id}
                    label={`${cust.service_name} [${cust.service_days} Days] `}
                    value={cust.service_id}
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
            <TouchableOpacity
              style={[styles.addButton, addingProduct && { opacity: 0.7 }]}
              onPress={editingProductId ? updateProduct : addProduct}
              disabled={addingProduct}
            >
              {addingProduct ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.addBtnText}>
                  {editingProductId ? "Update Product" : "+ Add Product"}
                </Text>
              )}
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
                      Service:{" "}
                      {service.find((s) => s.service_id == item.serviceType)
                        ?.service_name || item.serviceType}
                    </Text>
                    <Text style={styles.cardAmount}>
                      Charges: ₹{item.charges.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => editProduct(item)}
                      style={styles.editBtn}
                    >
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color="#4B65E9"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => removeProduct(item.id)}
                      style={styles.deleteBtn}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#e74c3c"
                      />
                    </TouchableOpacity>
                  </View>
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
            value={notes}
            onChangeText={setNotes}
          />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.saveBtn, savingQuotation && { opacity: 0.7 }]}
              onPress={handleSaveQuotation}
              disabled={savingQuotation}
            >
              {savingQuotation ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Save</Text>
              )}
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

export default withDrawer(InvoiceFrom, "InvoiceFrom");

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

  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  editBtn: {
    padding: 8,
    backgroundColor: "#eaf0ff",
    borderRadius: 50,
    marginRight: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  deleteBtn: {
    padding: 8,
    backgroundColor: "#ffecec",
    borderRadius: 50,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  deleteText: {
    fontSize: 16,
    color: "#e74c3c",
    fontWeight: "bold",
  },
});
