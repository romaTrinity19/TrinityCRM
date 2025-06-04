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
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
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
      <ScrollView contentContainerStyle={{ paddingBottom: 150 }}>
        <View style={styles.card}>
          <Text style={styles.label}>
            Select Lead<Text style={styles.required}>*</Text>
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 6,

              marginTop: 5,
            }}
          >
            <Picker
              selectedValue={form.lead}
              onValueChange={(itemValue) => handleChange("product", itemValue)}
            >
              <Picker.Item label="--Select--" value="" />
              <Picker.Item label="Lead A" value="productA" />
              <Picker.Item label="Lead B" value="productB" />
              <Picker.Item label="Lead C" value="serviceC" />
            </Picker>
          </View>

          <Text style={styles.label}>
            Select Opportunity<Text style={styles.required}>*</Text>
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 6,

              marginTop: 5,
            }}
          >
            <Picker
              selectedValue={form.lead}
              onValueChange={(itemValue) => handleChange("product", itemValue)}
            >
              <Picker.Item label="--Select--" value="" />
              <Picker.Item label="Lead A" value="productA" />
              <Picker.Item label="Lead B" value="productB" />
              <Picker.Item label="Lead C" value="serviceC" />
            </Picker>
          </View>

          <Text style={styles.label}>
            Follow Up Date<Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setShowDate(true)}
            style={styles.input}
          >
            <Text>{form.followUpDate || "Select date"}</Text>
          </TouchableOpacity>

          {showDate && (
            <DateTimePicker
              value={
                form.followUpDate ? new Date(form.followUpDate) : new Date()
              }
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDate(Platform.OS === "ios");
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
                  handleChange("followUpDate", formattedDate);
                }
              }}
            />
          )}

          <Text style={styles.label}>
            Follow Up Time<Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity
            onPress={() => setShowTime(true)}
            style={styles.input}
          >
            <Text>{form.followUpTime || "Select time"}</Text>
          </TouchableOpacity>

          {showTime && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTime(Platform.OS === "ios");
                if (selectedTime) {
                  const formattedTime = selectedTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  handleChange("followUpTime", formattedTime);
                }
              }}
            />
          )}

          <Text style={styles.label}>
            Note<Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            placeholder="Description..."
            multiline
            value={form.description}
            onChangeText={(text) => handleChange("description", text)}
          />

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveBtn}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.btnText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(components)/followUpUserDetails")}
          style={styles.followUpCard}
        >
          <View style={styles.profileRow}>
            <Ionicons
              name="person-circle-outline"
              size={48}
              color="#5975D9"
              style={styles.profileIcon}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>Roma Chakradhari</Text>

              <View style={styles.detailRow}>
                <Ionicons name="calendar-outline" size={16} color="#555" />
                <Text style={styles.detailText}>14/05/2025</Text>

                <Ionicons
                  name="time-outline"
                  size={16}
                  color="#555"
                  style={{ marginLeft: 12 }}
                />
                <Text style={styles.detailText}>05:00 PM</Text>
              </View>

              <Text style={styles.noteText}>
                Discussed service updates. Next follow-up scheduled on
                20/05/2025.
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
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

  pastFollowUp: {
    marginTop: 30,
    padding: 10,
    marginHorizontal: 10,
  },
  pastLabel: {
    fontWeight: "600",
    marginBottom: 10,
    fontSize: 16,
    color: "#070557",
  },
});
