import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { withDrawer } from "./drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStateDetails, getUserDetails } from "@/components/utils/api";
import Toast from "react-native-toast-message";

const states = [
  "Select State",
  "Delhi",
  "Maharashtra",
  "Uttar Pradesh",
  "Gujarat",
];

type RootDrawerParamList = {
  CustomerForm: undefined;
};
const CustomerForm = () => {
  const [customerName, setCustomerName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [sameAsContact, setSameAsContact] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);
  const [states, setStates] = useState([]);
  const [selectedStateId, setSelectedStateId] = useState<string>("");
  const [customerId, setCustomerId] = useState<string | null>(null); // null means create
  const { type, id } = useLocalSearchParams();

  const handleReset = () => {
    setCustomerName("");
    setContactNumber("");
    setEmail("");
    setWhatsappNumber("");
    setSameAsContact(false);

    setCompanyName("");
    setGstin("");
    setPan("");
    setBillingAddress("");
    setShippingAddress("");
  };

  const handleSave = async () => {
    if (!customerName || !contactNumber) {
      Toast.show({
        type: "error",
        text1: "Name and Contact Number are required.",
      });
      return;
    }

    if (!user?.userid) {
      Toast.show({
        type: "error",
        text1: "User not loaded. Please try again.",
      });
      return;
    }

    const payload =
      type === "update" && id
        ? {
            // 🛠 UPDATE CUSTOMER
            id: id,
            name: customerName,
            email_id: email,
            contact_no: contactNumber,
            whatsapp_no: whatsappNumber,
            address: shippingAddress,
            billing_address: billingAddress,
            state_id: selectedStateId,
            company_name: companyName,
            gstin,
            pan_no: pan,
          }
        : {
            // ➕ CREATE CUSTOMER
            name: customerName,
            email: email,
            contact: contactNumber,
            whatsapp_no: whatsappNumber,
            address: shippingAddress,
            billing_address: billingAddress,
            state_id: selectedStateId,
            company_name: companyName,
            gstin,
            pan_no: pan,
            send_msg: "0",
            send_mail: "0",
          };

    setLoading(true);
    try {
      let response;

      if (type === "update" && id) {
        const updatePayload = {
          ...payload,
          id,
        };

        console.log("Update Payload:", updatePayload);

        response = await axios.patch(
          `http://crmclient.trinitysoftwares.in/crmAppApi/customerProfile.php?type=updateCustomer`,
          updatePayload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        console.log("Create Payload:", payload);

        response = await axios.post(
          `http://crmclient.trinitysoftwares.in/crmAppApi/customerProfile.php?type=createCustomer&loginid=${user?.userid}`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.status === "success") {
        Toast.show({
          type: "success",
          text1: customerId
            ? "Customer updated successfully"
            : "Customer created successfully",
        });
        router.replace("/(components)/customerProfileList");
        handleReset();
      } else {
        Toast.show({
          type: "error",
          text1: response.data.message,
          text2: customerId ? "Update failed" : "Creation failed",
        });
      }
    } catch (error: any) {
      console.error("API Error:", error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          Toast.show({
            type: "error",
            text1: "Contact already exists.",
          });
          Alert.alert(
            "Customer Exists",
            "A customer with this contact number already exists."
          );
        } else {
          Toast.show({
            type: "error",
            text1: "Server Error",
            text2: error.response?.data?.message || "Something went wrong.",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Unexpected Error",
        });
      }
    } finally {
      setLoading(false);
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
      } finally {
        setLoading(false);
      }
    };

    fetchUserIdAndDetails();
  }, []);
  useEffect(() => {
    const fetchStates = async () => {
      const result = await getStateDetails();
      if (result.status === "success") {
        setStates(result.sateData);
      } else {
        Alert.alert("Error", result.message || "Failed to load states.");
      }
    };

    fetchStates();
  }, []);

  useEffect(() => {
    if (id) {
      setCustomerId(id.toString());
      fetchCustomerData(id.toString());
    }
  }, [id]);

  const fetchCustomerData = async (customerId: string) => {
    try {
      const response = await axios.get(
        `http://crmclient.trinitysoftwares.in/crmAppApi/customerProfile.php?type=getCustomerById&id=${customerId}`
      );
      const data = response.data.customer;

      if (data) {
        setCustomerName(data.name || "");
        setContactNumber(data.contact_no || "");
        setEmail(data.email_id || "");
        setWhatsappNumber(data.whatsapp_no || "");
        setCompanyName(data.company_name || "");
        setGstin(data.gstin || "");
        setPan(data.pan_no || "");
        setBillingAddress(data.billing_address || "");
        setShippingAddress(data.address || "");
        setSelectedStateId(data.state_id || "");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch customer details");
    }
  };

  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
   

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
          <Text style={styles.headerTitle}>Customer Details</Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.inputBox}>
            <Text style={styles.label}>Customer Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Full Name"
              value={customerName}
              onChangeText={setCustomerName}
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>
              Contact Number <Text style={styles.subLabel}>(Max 10 digit)</Text>{" "}
              *
            </Text>
            <TextInput
              style={styles.input}
              placeholder="XXXXXXXXXX"
              keyboardType="phone-pad"
              maxLength={10}
              value={contactNumber}
              onChangeText={(text) => {
                setContactNumber(text);
                if (sameAsContact) setWhatsappNumber(text);
              }}
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Email ID</Text>
            <TextInput
              style={styles.input}
              placeholder="abc@gmail.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>WhatsApp Number</Text>
            <View style={styles.rowBetween}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="XXXXXXXXXX"
                keyboardType="phone-pad"
                maxLength={10}
                value={whatsappNumber}
                onChangeText={setWhatsappNumber}
                editable={!sameAsContact}
              />
              <Pressable
                onPress={() => {
                  const newValue = !sameAsContact;
                  setSameAsContact(newValue);
                  if (newValue) setWhatsappNumber(contactNumber);
                }}
                style={styles.checkboxContainer}
              >
                <Ionicons
                  name={sameAsContact ? "checkbox" : "square-outline"}
                  size={24}
                  color="#2D4491"
                />
                <Text style={{ marginLeft: 4 }}>Same As Contact No.</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>State</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={selectedStateId}
                onValueChange={(itemValue) => setSelectedStateId(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="-- Select State --" value="" />
                {states?.map((item: any) => (
                  <Picker.Item
                    key={item?.state_id}
                    label={item?.state_name}
                    value={item?.state_id}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Company Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Company Name"
              value={companyName}
              onChangeText={setCompanyName}
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>GSTIN</Text>
            <TextInput
              style={styles.input}
              placeholder="ENTER GST NUMBER"
              value={gstin}
              onChangeText={setGstin}
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>PAN Number</Text>
            <TextInput
              style={styles.input}
              placeholder="ENTER PAN NUMBER"
              value={pan}
              onChangeText={setPan}
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Billing Address</Text>
            <TextInput
              style={styles.inputMultiline}
              placeholder="Enter Billing Address"
              multiline
              value={billingAddress}
              onChangeText={setBillingAddress}
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.label}>Shipping Address</Text>
            <TextInput
              style={styles.inputMultiline}
              placeholder="Enter Shipping Address"
              multiline
              value={shippingAddress}
              onChangeText={setShippingAddress}
            />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Save</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleReset}
              disabled={loading} // Optional: disable during save
            >
              <Text style={styles.buttonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default withDrawer(CustomerForm, "CustomerForm");

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 150,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#004c91",
    padding: 15,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  inputBox: {
    marginBottom: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    color: "#070557",
  },
  subLabel: {
    fontSize: 12,
    color: "green",
  },
  input: {
    borderWidth: 0.5,
    borderColor: "#5975D9",
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  inputMultiline: {
    borderWidth: 0.5,
    borderColor: "#5975D9",
    padding: 10,
    borderRadius: 4,
    backgroundColor: "#fff",
    height: 60,
    textAlignVertical: "top",
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  pickerWrapper: {
    borderWidth: 0.5,
    borderColor: "#5975D9",
    borderRadius: 4,
    overflow: "hidden",
  },
  picker: {
    margin: -5,
    width: "100%",
    backgroundColor: "#fff",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 16,
  },

  saveButton: {
    backgroundColor: "#2D4491",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  resetButton: {
    backgroundColor: "#E74C3C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },

  disabledButton: {
    opacity: 0.6,
  },
});
