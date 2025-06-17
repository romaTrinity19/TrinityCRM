import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { withDrawer } from "../(components)/drawer";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

type RootDrawerParamList = {
  Dashboard: undefined;
  CreateNewLeadForm: undefined;
  NewLeads: undefined;
};
const CreateNewLeadForm = () => {
  const [formData, setFormData] = useState({
    opportunity: "",
    leadNumber: "00419",
    leadName: "",
    email: "abc@gmail.com",
    contact: "",
    whatsapp: "",
    walkinDate: "05/20/2025",
    leadSource: "",
    leadAgent: "",
    product: "",
    state: "",
    amount: "",
    sendWhatsApp: false,
    sendMail: false,
    notes: "",
  });

  const handleChange = (key: any, value: any) => {
    setFormData({ ...formData, [key]: value });
  };
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const options = [
    { label: "Product A", value: "productA" },
    { label: "Product B", value: "productB" },
    { label: "Service C", value: "serviceC" },
  ];

  const [selectedItems, setSelectedItems] = useState<string[]>(
    Array.isArray(formData.product) ? formData.product : []
  );

  const [modalVisible, setModalVisible] = useState(false);

  const toggleSelect = (itemValue: string) => {
    const newSelection = selectedItems.includes(itemValue)
      ? selectedItems.filter((i: any) => i !== itemValue)
      : [...selectedItems, itemValue];

    setSelectedItems(newSelection);
    handleChange("product", newSelection);
  };

  return (

   <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f6ff" }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        > 
   
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create New Opportunity</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ paddingHorizontal: 18, paddingTop: 15 }}>
          <Text style={styles.label}>Contact Number *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.contact}
            onChangeText={(text) => handleChange("contact", text)}
          />
          <Text style={styles.label}>Lead Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Lead Full Name"
            value={formData.leadName}
            onChangeText={(text) => handleChange("leadName", text)}
          />
          <Text style={styles.label}>WhatsApp Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={formData.whatsapp}
            onChangeText={(text) => handleChange("whatsapp", text)}
          />

          <Text style={styles.label}>Opportunity *</Text>
          <TextInput
            style={styles.inputMultiline}
            multiline
            placeholder="Enter Opportunity"
            numberOfLines={3}
            value={formData.opportunity}
            onChangeText={(text) => handleChange("opportunity", text)}
          />

          <Text style={styles.label}>Product/Service *</Text>
          {/* Display selected values */}
          <View style={styles.input}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text>
                {selectedItems.length > 0
                  ? selectedItems?.join(", ")
                  : "--Select--"}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Modal with options */}
          <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                backgroundColor: "#000000aa",
              }}
            >
              <View
                style={{
                  backgroundColor: "#fff",
                  margin: 20,
                  borderRadius: 10,
                  padding: 20,
                }}
              >
                <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
                  Select Product/Service
                </Text>
                {options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => toggleSelect(option.value)}
                    style={{
                      paddingVertical: 10,
                      backgroundColor: selectedItems.includes(option.value)
                        ? "#e0f7fa"
                        : "#fff",
                      borderBottomWidth: 1,
                      borderBottomColor: "#ccc",
                    }}
                  >
                    <Text>{option.label}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={{
                    marginTop: 15,
                    backgroundColor: "#5975D9",
                    padding: 10,
                    borderRadius: 5,
                  }}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Text style={styles.label}>Assigned To *</Text>
          <View style={styles.input2}>
            <Picker
              selectedValue={formData.product}
              onValueChange={(itemValue) => handleChange("product", itemValue)}
            >
              <Picker.Item label="--Select--" value="" />
              <Picker.Item label="A" value="productA" />
              <Picker.Item label="B" value="productB" />
              <Picker.Item label="C" value="serviceC" />
            </Picker>
          </View>

          <Text style={styles.label}>Expected Date *</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text>
              {formData.walkinDate ? formData.walkinDate : "Select Date"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={formData.walkinDate ? new Date() : new Date()} // fallback for safety
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) {
                  const day = selectedDate
                    .getDate()
                    .toString()
                    .padStart(2, "0");
                  const month = (selectedDate.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                  const year = selectedDate.getFullYear();
                  const formattedDate = `${day}/${month}/${year}`;
                  handleChange("walkinDate", formattedDate);
                }
              }}
            />
          )}

          <Text style={styles.label}>Estimate Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="Amount"
            keyboardType="numeric"
            value={formData.amount}
            onChangeText={(text) => handleChange("amount", text)}
          />

          <Text style={styles.label}>Status</Text>
          <View style={styles.input2}>
            <Picker
              selectedValue={formData.product}
              onValueChange={(itemValue) => handleChange("product", itemValue)}
            >
              <Picker.Item label="--Select--" value="" />
              <Picker.Item label="A" value="productA" />
              <Picker.Item label="B" value="productB" />
              <Picker.Item label="C" value="serviceC" />
            </Picker>
          </View>

          <Text style={styles.label}>Internal Notes</Text>
          <TextInput
            style={styles.inputMultiline}
            placeholder="Notes...."
            multiline
            numberOfLines={3}
            value={formData.notes}
            onChangeText={(text) => handleChange("notes", text)}
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

          <TouchableOpacity style={styles.button} onPress={()=>router.push('/(components)/opportunity')}>
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  input2: {
    backgroundColor: "#fff",
    // padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputMultiline: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlignVertical: "top",
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
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
