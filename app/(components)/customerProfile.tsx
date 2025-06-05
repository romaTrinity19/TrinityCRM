import React, { useState } from "react";
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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { withDrawer } from "./drawer";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const [state, setState] = useState(states[0]);
  const [companyName, setCompanyName] = useState("");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  const handleReset = () => {
    setCustomerName("");
    setContactNumber("");
    setEmail("");
    setWhatsappNumber("");
    setSameAsContact(false);
    setState(states[0]);
    setCompanyName("");
    setGstin("");
    setPan("");
    setBillingAddress("");
    setShippingAddress("");
  };

  const handleSave = () => {
    Alert.alert("Form Submitted", "Customer details saved successfully.");
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
                selectedValue={state}
                onValueChange={(itemValue) => setState(itemValue)}
                style={styles.picker}
              >
                {states.map((s) => (
                  <Picker.Item label={s} value={s} key={s} />
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
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
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
    gap: 16,
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: "#2D4491",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  resetButton: {
    backgroundColor: "#E74C3C",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
