import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { withDrawer } from "./drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserDetails } from "@/components/utils/api";
import Toast from "react-native-toast-message";
type RootDrawerParamList = {
  Dashboard: undefined;
  CreateReminderScreen: undefined;
  Reminder: undefined;
};
const CreateReminderScreen = () => {
  const { type, id } = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [lead, setLead] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [loading, setLoading] = useState(false);

  const formatDateForApi = (date: Date) => date.toISOString().split("T")[0];
  const formatTimeForApi = (date: Date) => date.toTimeString().slice(0, 5);

  const formatDate = (d: Date) => {
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    return `${mm < 10 ? "0" + mm : mm}/${dd < 10 ? "0" + dd : dd}/${d.getFullYear()}`;
  };

  const formatTime = (d: Date) => {
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };

  const handleDateChange = (_: any, selectedDate: any) => {
    if (selectedDate) setDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleTimeChange = (_: any, selectedTime: any) => {
    if (selectedTime) setDate(selectedTime);
    setShowTimePicker(false);
  };

  const handleSave = async () => {
    if (!lead || !description || !user?.userid) {
      Toast.show({ type: "error", text1: "All fields are required" });
      return;
    }
    setLoading(true);
    const payload = {
      cust_id: lead,
      followup_date: formatDateForApi(date),
      followup_time: formatTimeForApi(date),
      description: description.trim(),
    };

    try {
      let response;
      if (type === "update" && id) {
        // Update
        response = await fetch(
          `http://crmclient.trinitysoftwares.in/crmAppApi/reminder.php?type=updateReminder&loginid=${user?.userid}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, reminder_id: id }),
          }
        );
      } else {
        // Create
        response = await fetch(
          `http://crmclient.trinitysoftwares.in/crmAppApi/reminder.php?type=createReminder&loginid=${user?.userid}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
      }

      const result = await response.json();
      if (result.status === "success") {
        Toast.show({
          type: "success",
          text1:
            type === "update"
              ? "Reminder updated successfully"
              : "Reminder created successfully",
        });
        router.push("/(components)/reminder");
      } else {
        Toast.show({
          type: "error",
          text1: result.message || "Failed to save follow-up",
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      Toast.show({ type: "error", text1: "Something went wrong" });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserIdAndDetails = async () => {
    try {
      const id = await AsyncStorage.getItem("userId");
      if (id) {
        const result = await getUserDetails(id);
        if (result.success) setUser(result.user);
        else setError(result.message);
      } else {
        setError("No user ID found in storage.");
      }
    } catch {
      setError("Failed to load user data.");
    }
  };

  const fetchOpportunities = async (userId: string) => {
    try {
      const response = await fetch(
        `http://crmclient.trinitysoftwares.in/crmAppApi/opportunity1.php?type=getAllOpportunity&loginid=${userId}`
      );
      const json = await response.json();
      if (json.status === "success") setOpportunities(json.opportunities);
      else setError(json.message || "Error fetching opportunities.");
    } catch {
      setError("Something went wrong while loading opportunities.");
    }
  };

  const fetchReminderById = async (followupId: string) => {
    try {
      const response = await fetch(
        `http://crmclient.trinitysoftwares.in/crmAppApi/reminder.php?type=getReminderById&reminder_id=${followupId}`
      );
      const json = await response.json();
      if (json.status === "success") {
        const data = json.data;
        setLead(data.opp_create_id);
        setDescription(data.description);
        setDate(new Date(`${data.followup_date}T${data.followup_time}`));
      } else {
        Toast.show({ type: "error", text1: "Failed to load follow-up" });
      }
    } catch {
      Toast.show({ type: "error", text1: "Error fetching follow-up data" });
    }
  };

  // Fetch user
  useEffect(() => {
    fetchUserIdAndDetails();
  }, []);

  // Fetch opportunities after user loads
  useEffect(() => {
    if (user?.userid) fetchOpportunities(user?.userid);
  }, [user]);

  // Fetch follow-up data if updating
  useEffect(() => {
    if (type === "update" && id) {
      const idParam = Array.isArray(id) ? id[0] : id;

      fetchReminderById(idParam);
    }
  }, [type, id]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {type === "update" ? "Update Follow Up" : "Create Follow Up"}
        </Text>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.label}>
          Select Customer/Opportunity <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={lead} onValueChange={setLead} enabled={!(type === "update")}>
            <Picker.Item label="---Select Opportunity---" value="" />
            {opportunities.map((opp) => (
              <Picker.Item
                key={opp.opp_create_id}
                label={`${opp.name || "N/A"} / ${opp.opportunity_name} / ${opp.contact || "N/A"}`}
                value={opp.opp_create_id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Reminder Date</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{formatDate(date)}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <Text style={styles.label}>Reminder Time</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowTimePicker(true)}
        >
          <Text>{formatTime(date)}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <Text style={styles.label}>Notes</Text>
        <TextInput
          placeholder="Description..."
          multiline
          numberOfLines={4}
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity
          style={[styles.button, loading && { opacity: 0.7 }]}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default withDrawer(CreateReminderScreen, "CreateReminderScreen");

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f2f6ff",
    flexGrow: 1,
    paddingVertical: 30,
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
  card: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  label: {
    marginTop: 10,
    fontWeight: "600",
    color: "#333",
  },
  required: {
    color: "red",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    marginTop: 5,
    marginBottom: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingTop: 10,
    minHeight: 80,
    marginTop: 5,
    marginBottom: 10,
    textAlignVertical: "top",
  },
  input: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 16,
    marginTop: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#1F40B5",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
