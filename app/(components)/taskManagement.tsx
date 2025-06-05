import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { withDrawer } from "./drawer";
import { SafeAreaView } from "react-native-safe-area-context";

type RootDrawerParamList = {
  Dashboard: undefined;
  Qualification: undefined;
  FollowUpForm: undefined;
};

function FollowUpForm() {
  const [form, setForm] = useState({
    lead: "",
    createDate: "",
    createTime: "",
    heading: "",
    description: "",
    priority: "",
    endDate: "",
    endTime: "",
  });

  const [entries, setEntries] = useState<any[]>([]);

  const handleChange = (name: keyof typeof form, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const [showDatePicker, setShowDatePicker] = useState<
    null | "createDate" | "endDate"
  >(null);
  const [showTimePicker, setShowTimePicker] = useState<
    null | "createTime" | "endTime"
  >(null);

  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      const dateStr = `${selectedDate.getDate().toString().padStart(2, "0")}/${(
        selectedDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${selectedDate.getFullYear()}`;
      if (showDatePicker) handleChange(showDatePicker, dateStr);
    }
    setShowDatePicker(null);
  };

  const handleTimeChange = (event: any, selectedTime: Date | undefined) => {
    if (selectedTime) {
      const timeStr = selectedTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      if (showTimePicker) handleChange(showTimePicker, timeStr);
    }
    setShowTimePicker(null);
  };

  const handleReset = () => {
    setForm({
      lead: "",
      createDate: "",
      createTime: "",
      heading: "",
      description: "",
      priority: "",
      endDate: "",
      endTime: "",
    });
  };
  const handleSave = () => {
    if (
      !form.lead ||
      !form.createDate ||
      !form.createTime ||
      !form.description ||
      !form.heading ||
      !form.priority ||
      !form.endDate ||
      !form.endTime
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newEntry = {
      ...form,
      id: Date.now(), // unique ID
    };

    setEntries((prev) => [newEntry, ...prev]);
    handleReset();
  };
  const handleDelete = (id: number) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
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
            <Text style={styles.headerTitle}>Task Management</Text>
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Ionicons name="menu" color="#fff" size={24} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
          <View style={styles.card}>
            {/* Employee */}
            <Text style={styles.label}>
              Employee<Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.input2}>
              <Picker
                selectedValue={form.lead}
                onValueChange={(itemValue) => handleChange("lead", itemValue)}
                style={{ margin: -3 }}
              >
                <Picker.Item label="--Select--" value="" />
                <Picker.Item label="Employee A" value="Employee A" />
                <Picker.Item label="Employee B" value="Employee B" />
                <Picker.Item label="Employee C" value="Employee C" />
              </Picker>
            </View>

            {/* Follow Up Date */}
            <Text style={styles.label}>
              Create Date<Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker("createDate")}
              style={styles.input}
            >
              <Text>{form.createDate || "Select date"}</Text>
            </TouchableOpacity>

            {/* Follow Up Time */}
            <Text style={styles.label}>
              Create Time<Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowTimePicker("createTime")}
              style={styles.input}
            >
              <Text>{form.createTime || "Select time"}</Text>
            </TouchableOpacity>

            {/* Task Heading */}
            <Text style={styles.label}>
              Task Heading<Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Heading"
              value={form.heading}
              onChangeText={(text) => handleChange("heading", text)}
            />

            {/* Description */}
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

            {/* Priority */}
            <Text style={styles.label}>
              Select Priority<Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.input2}>
              <Picker
                selectedValue={form.priority}
                onValueChange={(itemValue) =>
                  handleChange("priority", itemValue)
                }
                style={{ margin: -3 }}
              >
                <Picker.Item label="--Select--" value="" />
                <Picker.Item label="Low" value="low" />
                <Picker.Item label="Medium" value="medium" />
                <Picker.Item label="High" value="high" />
              </Picker>
            </View>

            {/* End Date */}
            <Text style={styles.label}>
              End Date<Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker("endDate")}
              style={styles.input}
            >
              <Text>{form.endDate || "Select date"}</Text>
            </TouchableOpacity>

            {/* End Time */}
            <Text style={styles.label}>
              End Time<Text style={styles.required}>*</Text>
            </Text>
            <TouchableOpacity
              onPress={() => setShowTimePicker("endTime")}
              style={styles.input}
            >
              <Text>{form.endTime || "Select time"}</Text>
            </TouchableOpacity>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.btnText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                <Text style={styles.btnText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>

          {entries.map((entry) => (
            <TouchableOpacity key={entry.id} style={styles.followUpCard}>
              <View style={styles.profileRow}>
                <Ionicons
                  name="person-circle-outline"
                  size={50}
                  color="#1F40B5"
                  style={styles.profileIcon}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.profileName}>{entry.lead}</Text>

                  <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#888" />
                    <Text style={styles.detailText}>{entry.createDate}</Text>
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color="#888"
                      style={{ marginLeft: 12 }}
                    />
                    <Text style={styles.detailText}>{entry.createTime}</Text>
                  </View>

                  <View style={styles.detailRow}>
                    <Ionicons name="flag-outline" size={16} color="#888" />
                    <Text style={styles.detailText}>
                      {entry.priority} Priority
                    </Text>
                  </View>

                  <Text style={styles.noteText}>{entry.description}</Text>

                  {/* Buttons */}
                  <View style={styles.cardBtnRow}>
                    <TouchableOpacity style={styles.editBtn}>
                      <Ionicons name="create-outline" size={16} color="#fff" />
                      <Text style={styles.cardBtnText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(entry.id)}
                    >
                      <Ionicons name="trash-outline" size={16} color="#fff" />
                      <Text style={styles.cardBtnText}>Delete</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
        {showTimePicker && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default withDrawer(FollowUpForm, "FollowUpForm");

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    backgroundColor: "#f5f7ff",
  },
  followUpCard: {
    backgroundColor: "#f0f3ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  profileIcon: {
    marginRight: 12,
  },
  profileName: {
    fontWeight: "700",
    fontSize: 16,
    color: "#070557",
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#444",
  },
  noteText: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
    lineHeight: 18,
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
    padding: 15,
    marginTop: 5,
  },
  input2: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginTop: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  saveBtn: {
    backgroundColor: "#1F40B5",
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

  cardBtnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 10,
  },

  editBtn: {
    backgroundColor: "#1F40B5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  deleteBtn: {
    backgroundColor: "#d32f2f",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  cardBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
