import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withDrawer } from "../drawer";

const recipientsList = [
  { id: "1", name: "Chokoloko Website", email: "pipeshp@gmail.com" },
  { id: "2", name: "Mallika Dutta", email: "trinitymallika@gmail.com" },
  { id: "3", name: "Harish", email: "hari@gmail.com" },
  { id: "4", name: "Sudhanshu Francise", email: "sudhanshu@gmail.com" },
  { id: "5", name: "Ram Jane", email: "bushani2000@gmail.com" },
  { id: "6", name: "Mridul Sir", email: "mridul@gmail.com" },
  { id: "7", name: "Trinity Solutions", email: "trinitybablu19@gmail.com" },
  { id: "8", name: "Mallika", email: "gjhga@gmail.com" },
];

// sample template options
const templates = [
  { label: "Select Template", value: "" },
  { label: "Promotion Template", value: "promotion" },
  { label: "Follow-up Template", value: "follow-up" },
  { label: "General Template", value: "general" },
];

type RootDrawerParamList = {
  EmailPage: undefined;
};
const EmailPage = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [manualEmails, setManualEmails] = useState<string>("");

  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredRecipients = recipientsList.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const [subject, setSubject] = useState<string>("");

  const [message, setMessage] = useState<string>("");

  const handleSelectAll = () => {
    setSelectedRecipients(recipientsList.map((r) => r.id)); // select all IDs
  };

  const handleDeselectAll = () => {
    setSelectedRecipients([]);
  };

  const handleToggle = (id: string) => {
    setSelectedRecipients((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSend = () => {
    console.log("Recipients IDs :", selectedRecipients);
    console.log("Manual emails :", manualEmails);
    console.log("Template :", selectedTemplate);
    console.log("Subject :", subject);
    console.log("Message :", message);
    // Handle API submission here
  };

  const handleReset = () => {
    setSelectedRecipients([]);

    setManualEmails("");
    setSelectedTemplate("");
    setSubject("");
    setMessage("");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f6ff" }}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header2}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Template Master</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.stats}>
            <Text style={styles.statsText}>
              Email Limit: <Text style={styles.highlight}>500 per day</Text>
            </Text>
            <Text style={styles.statsText}>
              Used Today: <Text style={styles.highlight}>0</Text>
            </Text>
          </View>

          {/* Add Template Button */}
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() =>
              router.push("/(components)/(compaign)/emailTempMaster")
            }
          >
            <Text style={styles.addBtnText}>+ Add Template</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email"
          value={searchTerm}
          onChangeText={(text) => setSearchTerm(text)}
        />

        <View style={styles.chips}>
          <TouchableOpacity onPress={handleSelectAll} style={styles.chip2}>
            <Text style={styles.chipText2}>Select All</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDeselectAll} style={styles.chip2}>
            <Text style={styles.chipText2}>Clear All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.recipients}
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={true}
          nestedScrollEnabled // <- ADD THIS
        >
          {filteredRecipients.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleToggle(item.id)}
              style={styles.chip}
            >
              <Ionicons
                name={
                  selectedRecipients.includes(item.id)
                    ? "checkbox"
                    : "square-outline"
                }
                color="#2D4491"
                size={20}
              />
              <Text style={styles.chipText}>
                {item.name} ({item.email})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Manual Email Input */}
        <View style={styles.form}>
          <Text style={styles.label}>
            Or Enter Emails Manually (comma-separated):
          </Text>
          <TextInput
            style={styles.textarea}
            value={manualEmails}
            onChangeText={(text) => setManualEmails(text)}
            placeholder="e.g. person@example.com, person2@example.com"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Template picker */}
        <View style={styles.form}>
          <Text style={styles.label}>Template:</Text>
          <View style={styles.picker}>
            <Picker
              selectedValue={selectedTemplate}
              onValueChange={(item) => setSelectedTemplate(item)}
            >
              {templates.map((temp) => (
                <Picker.Item
                  key={temp.value}
                  label={temp.label}
                  value={temp.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Subject Input */}
        <View style={styles.form}>
          <Text style={styles.label}>Subject:</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={(text) => setSubject(text)}
            placeholder="Enter subject"
          />
        </View>

        {/* Message Input */}
        <View style={styles.form}>
          <Text style={styles.label}>Message:</Text>
          <TextInput
            style={styles.textarea}
            value={message}
            onChangeText={(text) => setMessage(text)}
            placeholder="Enter message"
            multiline
            numberOfLines={6}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn}>
            <Text style={styles.sendBtnText}>Send Bulk Email</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetBtnText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default withDrawer(EmailPage, "EmailPage");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f6ff",
    padding: 20,
  },
  header2: {
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
    fontWeight: "bold",
  },
  searchActions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  header: {
    marginBottom: 20,
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2D4491",
    marginBottom: 10,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 10,
  },
  statsText: {
    color: "grey",
    fontWeight: "500",
  },
  highlight: {
    color: "green",
    fontWeight: "bold",
  },
  selectButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  selectBtn: {
    padding: 10,
    backgroundColor: "#2D4491",
    borderRadius: 5,
    marginRight: 10,
  },
  deselectBtn: {
    padding: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
  },
  selectBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  recipients: {
    maxHeight: 200, // limits the height to 200px
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 5,
    backgroundColor: "white",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  addBtn: {
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#2D4491",
    borderRadius: 5,
    alignItems: "center",
  },

  addBtnText: {
    color: "white",
    fontWeight: "bold",
  },

  chipText: {
    marginLeft: 10,
    color: "#2D4491",
    fontWeight: "500",
  },
  form: {
    marginBottom: 20,
  },
  label: {
    color: "#2D4491",
    fontWeight: "500",
    marginBottom: 10,
    fontSize: 16,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "white",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
  },
  textarea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    backgroundColor: "white",
    textAlignVertical: "top",
    height: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  sendBtn: {
    padding: 10,
    backgroundColor: "#2D4491",
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  resetBtn: {
    padding: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
  sendBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  resetBtnText: {
    color: "white",
    fontWeight: "bold",
  },
  chips: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
  },
  chip2: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    backgroundColor: "#2D4491",
    borderRadius: 30,
  },
  chipText2: {
    color: "white",
    fontWeight: "500",
  },
});
