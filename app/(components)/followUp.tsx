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
import { withDrawer } from "./drawer";
 type RootDrawerParamList = {
    Dashboard: undefined;
    Qualification: undefined;
    FollowUpForm: undefined;
  };
function FollowUpForm() {
  const [form, setForm] = useState({
    lead: "Kush bhaiya",
    followUpDate: "05/20/2025",
    followUpTime: "",
    type: "",
    description: "",
    nextFollowUpDate: "",
    nextFollowUpTime: "",
    status: "",
  });

  const handleChange = (name: any, value: any) => {
    setForm({ ...form, [name]: value });
  };

  const handleReset = () => {
    setForm({
      lead: "Kush bhaiya",
      followUpDate: "05/20/2025",
      followUpTime: "",
      type: "",
      description: "",
      nextFollowUpDate: "",
      nextFollowUpTime: "",
      status: "",
    });
  };
  
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={["#5975D9", "#070557"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Follow Up</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.label}>
          Select Lead<Text style={styles.required}>*</Text>
        </Text>
        <TextInput style={styles.input} value={form.lead}   />

        <Text style={styles.label}>
          Follow Up Date<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={form.followUpDate}
           
        />

        <Text style={styles.label}>
          Follow Up Time<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter time"
          value={form.followUpTime}
          onChangeText={(text) => handleChange("followUpTime", text)}
        />

        <Text style={styles.label}>
          Type<Text style={styles.required}>*</Text>
        </Text>
        <Picker
          selectedValue={form.type}
          style={styles.input}
          onValueChange={(itemValue) => handleChange("type", itemValue)}
        >
          <Picker.Item label="---Select Followup Type---" value="" />
          <Picker.Item label="Call" value="call" />
          <Picker.Item label="Visit" value="visit" />
        </Picker>

        <Text style={styles.label}>
          Description<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Description..."
          multiline
          value={form.description}
          onChangeText={(text) => handleChange("description", text)}
        />

        <Text style={styles.label}>
          Next Follow Up Date<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter date"
          value={form.nextFollowUpDate}
          onChangeText={(text) => handleChange("nextFollowUpDate", text)}
        />

        <Text style={styles.label}>
          Next Follow Up Time<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter time"
          value={form.nextFollowUpTime}
          onChangeText={(text) => handleChange("nextFollowUpTime", text)}
        />

        <Text style={styles.label}>Status</Text>
        <Picker
          selectedValue={form.status}
          style={styles.input}
          onValueChange={(itemValue) => handleChange("status", itemValue)}
        >
          <Picker.Item label="---Select---" value="" />
          <Picker.Item label="Pending" value="pending" />
          <Picker.Item label="Completed" value="completed" />
        </Picker>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.saveBtn}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
            <Text style={styles.btnText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.pastFollowUp}>
        <Text style={styles.pastLabel}>Past Follow Up</Text>
        <View style={styles.profileRow}>
          <View style={styles.profileIcon} />
          <View>
            <Text style={styles.profileName}>Kush bhaiya</Text>
            <Text>14-05-2025</Text>
          </View>
        </View>
        <Text>No Followups Yet!</Text>
      </View>
      
    </ScrollView>
    
  );
}
export default withDrawer(FollowUpForm, "FollowUpForm");

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    backgroundColor: "#f5f7ff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    backgroundColor: "#1a237e",
    color: "white",
    padding: 10,
    borderRadius: 5,
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
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    elevation: 3,
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
  },
  required: {
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveBtn: {
    backgroundColor: "#0d1b61",
    padding: 10,
    borderRadius: 6,
    width: "48%",
    alignItems: "center",
  },
  resetBtn: {
    backgroundColor: "#d32f2f",
    padding: 10,
    borderRadius: 6,
    width: "48%",
    alignItems: "center",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
  },
  pastFollowUp: {
    marginTop: 30,
    padding: 10,
  },
  pastLabel: {
    fontWeight: "600",
    marginBottom: 10,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  profileIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#ccc",
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    fontWeight: "600",
  },
});
