import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withDrawer } from "./drawer";

// Define all available fields
type Field = {
  key: string;
  label: string;
  type: "input" | "select";
  options?: string[];
};

const availableFields: Field[] = [
  { key: "mobile", label: "Mobile Number", type: "input" },
  {
    key: "gender",
    label: "Gender",
    type: "select",
    options: ["Male", "Female", "Other"],
  },
  {
    key: "product",
    label: "Product/Service Selection",
    type: "select",
    options: ["Product A", "Product B"],
  },
  {
    key: "state",
    label: "State Selection",
    type: "select",
    options: ["State 1", "State 2"],
  },
  { key: "remark", label: "Remark", type: "input" },
  { key: "website", label: "Website URL", type: "input" },
  { key: "instagram", label: "Instagram URL", type: "input" },
  { key: "google", label: "Google Business URL", type: "input" },
];

type RootDrawerParamList = {
  InquiryFormScreen: undefined;
};
// Main Component
const InquiryFormScreen = () => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  // Handle field select/deselect
  const handleSelect = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log("Form Values :", formValues);
    // Here you can send to API
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

          <Text style={styles.headerTitle}>Enquiry Form</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Step 1: Checkboxes to select fields */}
        <View
          style={{
            backgroundColor: "white",
            margin: 16,
            borderRadius: 12,
            padding: 20,
            elevation: 2,
          }}
        >
          <Text style={styles.title}>Select Form Fields</Text>
          {availableFields.map((field) => (
            <TouchableOpacity
              key={field.key}
              style={styles.checkbox}
              onPress={() => handleSelect(field.key)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={
                  selectedKeys.includes(field.key)
                    ? "checkbox"
                    : "square-outline"
                }
                size={24}
                color="#007AFF"
                style={{ marginRight: 10 }}
              />
              <Text style={styles.checkboxLabel}>{field.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Step 2: Display form based on selected fields */}
        {selectedKeys.length > 0 && (
          <View style={styles.formCard}>
            {/* Header Section */}
            <View style={styles.logo}>
              <Image
                source={require("@/assets/images/trinityLogo.jpeg")}
                style={{
                  width: 300,
                  height: 300,
                  objectFit: "contain",
                  marginTop: -100,
                }}
              />
              <Text style={styles.heading}>ENQUIRY FORM</Text>
              <Text style={styles.subtitle}>
                Kindly fill the below form for your enquiry.
              </Text>
            </View>

            {/* Dynamic Form Fields */}
            {selectedKeys.map((key) => {
              const field = availableFields.find((f) => f.key === key);
              if (!field) return null;

              if (field.type === "input") {
                return (
                  <View key={key} style={[styles.input,{padding:5}]}>
                    <TextInput
                      style={styles.textInput}
                      placeholder={`Enter ${field.label}`}
                      onChangeText={(text) =>
                        setFormValues((prev) => ({ ...prev, [key]: text }))
                      }
                    />
                  </View>
                );
              }
              if (field.type === "select") {
                return (
                  <View key={key} style={styles.input}>
                  
                    <Picker
                      selectedValue={formValues[key]}
                      onValueChange={(item) =>
                        setFormValues((prev) => ({ ...prev, [key]: item }))
                      }
                      style={styles.picker}
                    >
                      <Picker.Item label="--Select--" value="" />
                      {field.options?.map((opt, i) => (
                        <Picker.Item key={i} label={opt} value={opt} />
                      ))}
                    </Picker>
                  </View>
                );
              }
              return null;
            })}

            {/* Send Button */}
            <TouchableOpacity style={styles.sendBtn} onPress={handleSubmit}>
              <Text style={styles.sendBtnText}>Send</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
       </KeyboardAvoidingView> 
    </SafeAreaView>
  );
};

export default withDrawer(InquiryFormScreen, "InquiryFormScreen");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#edf1fd",
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#007AFF",
  },
  logo: {
    alignItems: "center",
    marginBottom: 20,
  },
  heading: {
    color: "teal",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: -100,
  },
  subtitle: {
    color: "grey",
    marginBottom: 20,
    textAlign: "center",
  },
  fieldLabel: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
    fontWeight: "500",
  },
  formCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    margin: 16,
    elevation: 2,
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    padding: 15,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    backgroundColor: "white",
    marginBottom: 15,
    
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  textInput: {
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: "100%",
     
  },
  sendBtn: {
    backgroundColor: "teal",
    padding: 15,
    alignItems: "center",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  sendBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
