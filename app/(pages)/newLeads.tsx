import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { withDrawer } from "../(components)/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";

const CreateNewLeadForm = () => {
  const [formData, setFormData] = useState({
    opportunity: "",
    leadNumber: "00419",
    leadName: "",
    email: "abc@gmail.com",
    contact: "",
    whatsapp: "",
    leadDate: new Date(),
    leadSource: "",
    leadAgent: "",
    product: "",
    state: "",
    amount: "",
    sendWhatsApp: false,
    sendMail: false,
    notes: "",
  });
  const [sameAsContact, setSameAsContact] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const navigation = useNavigation<DrawerNavigationProp<any>>();

  const handleDateChange = (_: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange("leadDate", selectedDate);
    }
  };

  React.useEffect(() => {
    if (sameAsContact) {
      handleChange("whatsapp", formData.contact);
    }
  }, [sameAsContact, formData.contact]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f6ff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
            <View style={styles.headerContent}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" color="#fff" size={24} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Create New Lead</Text>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu" color="#fff" size={24} />
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <View style={{ paddingHorizontal: 18, paddingTop: 15 }}>
            <Text style={styles.label}>Lead Number</Text>
            <TextInput
              style={styles.input}
              value={formData.leadNumber}
              onChangeText={(text) => handleChange("leadNumber", text)}
            />
            <Text style={styles.label}>
              Opportunity <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={3}
              value={formData.opportunity}
              onChangeText={(text) => handleChange("opportunity", text)}
            />

            <Text style={styles.label}>
              Lead Full Name <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Lead Full Name"
              value={formData.leadName}
              onChangeText={(text) => handleChange("leadName", text)}
            />

            <Text style={styles.label}>Email ID</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => handleChange("email", text)}
            />

            <Text style={styles.label}>
              Contact Number <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={formData.contact}
              keyboardType="phone-pad"
              onChangeText={(text) => handleChange("contact", text)}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.label}>WhatsApp Number </Text>
              <TouchableOpacity
                onPress={() => setSameAsContact(!sameAsContact)}
                style={{ flexDirection: "row", alignItems: "center" }}
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
              style={styles.input}
              value={formData.whatsapp}
              editable={!sameAsContact}
              keyboardType="phone-pad"
              onChangeText={(text) => handleChange("whatsapp", text)}
            />

            <Text style={styles.label}>
              Lead Date <Text style={{ color: "red" }}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.input}
            >
              <Text>{formData.leadDate.toDateString()}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={formData.leadDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            <Text style={styles.label}>Lead Source</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.leadSource}
                onValueChange={(itemValue) =>
                  handleChange("leadSource", itemValue)
                }
              >
                <Picker.Item label="-- Select Source --" value="" />
                <Picker.Item label="Website" value="website" />
                <Picker.Item label="Referral" value="referral" />
                <Picker.Item label="Walk-in" value="walkin" />
              </Picker>
            </View>

            <Text style={styles.label}>Lead Agent</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.leadAgent}
                onValueChange={(itemValue) =>
                  handleChange("leadAgent", itemValue)
                }
              >
                <Picker.Item label="-- Select Agent --" value="" />
                <Picker.Item label="Agent A" value="agentA" />
                <Picker.Item label="Agent B" value="agentB" />
              </Picker>
            </View>

            {/* <Text style={styles.label}>
              Product/Service <Text style={{ color: "red" }}>*</Text>
            </Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.product}
                onValueChange={(itemValue) =>
                  handleChange("product", itemValue)
                }
              >
                <Picker.Item label="-- Select Product --" value="" />
                <Picker.Item label="Product A" value="productA" />
                <Picker.Item label="Product B" value="productB" />
              </Picker>
            </View> */}

            <Text style={styles.label}>State</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.state}
                onValueChange={(itemValue) => handleChange("state", itemValue)}
              >
                <Picker.Item label="-- Select State --" value="" />
                <Picker.Item label="Maharashtra" value="maharashtra" />
                <Picker.Item label="Gujarat" value="gujarat" />
                <Picker.Item label="Delhi" value="delhi" />
              </Picker>
            </View>

            <Text style={styles.label}>Estimate Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount"
              keyboardType="numeric"
              value={formData.amount}
              onChangeText={(text) => handleChange("amount", text)}
            />

            <View style={styles.checkboxContainer}>
              <Switch
                value={formData.sendWhatsApp}
                onValueChange={(value) => handleChange("sendWhatsApp", value)}
              />
              <Text style={styles.checkboxLabel}>Send WhatsApp Message</Text>

              <Switch
                value={formData.sendMail}
                onValueChange={(value) => handleChange("sendMail", value)}
              />
              <Text style={styles.checkboxLabel}>Send Mail</Text>
            </View>

            <Text style={styles.label}>Internal Notes</Text>
            <TextInput
              style={styles.inputMultiline2}
              placeholder="Description...."
              multiline
              numberOfLines={10}
              value={formData.notes}
              onChangeText={(text) => handleChange("notes", text)}
            />

            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default withDrawer(CreateNewLeadForm, "CreateNewLeadForm");

const styles = StyleSheet.create({
  container: {
    paddingBottom: 70,
    backgroundColor: "#f7f9fc",
  },
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
    textAlign: "center",
    flex: 1,
    marginHorizontal: 12,
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    color: "#000",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
  },
  inputMultiline: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlignVertical: "top",
  },
  inputMultiline2: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    height: 120,
    backgroundColor: "#fff",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  checkboxLabel: {
    marginRight: 16,
  },
  button: {
    backgroundColor: "#001b5e",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
