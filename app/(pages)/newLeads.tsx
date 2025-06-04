import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { withDrawer } from "../(components)/drawer";

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

  return (
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
      <View style={{paddingHorizontal:18 , paddingTop:15}}> 

      <Text style={styles.label}>Opportunity *</Text>
      <TextInput
        style={styles.inputMultiline}
        multiline
        numberOfLines={3}
        value={formData.opportunity}
        onChangeText={(text) => handleChange("opportunity", text)}
      />

      <Text style={styles.label}>Lead Number</Text>
      <TextInput
        style={styles.input}
        value={formData.leadNumber}
        onChangeText={(text) => handleChange("leadNumber", text)}
      />

      <Text style={styles.label}>Lead Full Name *</Text>
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

      <Text style={styles.label}>Contact Number *</Text>
      <TextInput
        style={styles.input}
        value={formData.contact}
        onChangeText={(text) => handleChange("contact", text)}
      />

      <Text style={styles.label}>WhatsApp Number</Text>
      <TextInput
        style={styles.input}
        value={formData.whatsapp}
        onChangeText={(text) => handleChange("whatsapp", text)}
      />

      <Text style={styles.label}>Walkin Date *</Text>
      <TextInput
        style={styles.input}
        value={formData.walkinDate}
        onChangeText={(text) => handleChange("walkinDate", text)}
      />

      <Text style={styles.label}>Lead Source</Text>
      <TextInput
        style={styles.input}
        placeholder="--Select Source--"
        value={formData.leadSource}
        onChangeText={(text) => handleChange("leadSource", text)}
      />

      <Text style={styles.label}>Lead Agent</Text>
      <TextInput
        style={styles.input}
        placeholder="--Select Lead Agent--"
        value={formData.leadAgent}
        onChangeText={(text) => handleChange("leadAgent", text)}
      />

      <Text style={styles.label}>Product/Service *</Text>
      <TextInput
        style={styles.input}
        placeholder="--Select--"
        value={formData.product}
        onChangeText={(text) => handleChange("product", text)}
      />

      <Text style={styles.label}>State</Text>
      <TextInput
        style={styles.input}
        placeholder="--Select--"
        value={formData.state}
        onChangeText={(text) => handleChange("state", text)}
      />

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
        style={styles.inputMultiline}
        placeholder="Description...."
        multiline
        numberOfLines={3}
        value={formData.notes}
        onChangeText={(text) => handleChange("notes", text)}
      />

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity></View>
    </ScrollView>
  );
};

export default withDrawer(CreateNewLeadForm, "CreateNewLeadForm");

const styles = StyleSheet.create({
  container: {
    paddingVertical: 25,
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
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputMultiline: {
    backgroundColor: "#fff",
    padding: 10,
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
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
