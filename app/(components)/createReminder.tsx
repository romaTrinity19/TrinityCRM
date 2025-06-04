import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
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
    View
} from "react-native";
import { withDrawer } from "./drawer";
type RootDrawerParamList = {
  Dashboard: undefined;
  CreateReminderScreen: undefined;
  Reminder: undefined;
};
const CreateReminderScreen = () => {
  const [lead, setLead] = useState("");
  const [priority, setPriority] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const handleDateChange = (event:any, selectedDate:any) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const handleTimeChange = (event:any, selectedTime:any) => {
    const currentDate = selectedTime || date;
    setShowTimePicker(false);
    setDate(currentDate);
  };

  const formatDate = (d:any) => {
    const mm = d.getMonth() + 1;
    const dd = d.getDate();
    return `${mm < 10 ? "0" + mm : mm}/${
      dd < 10 ? "0" + dd : dd
    }/${d.getFullYear()}`;
  };

  const formatTime = (d:any) => {
    let hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes < 10 ? "0" + minutes : minutes} ${ampm}`;
  };

  const handleSave = () => {
    console.log({ lead, priority, description, date });
    alert("Reminder Saved!");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
         <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <TouchableOpacity onPress={()=>router.back()} >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Reminder</Text>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.card}>

        <Text style={styles.label}>
          Select Opportunity <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={lead}
            onValueChange={(itemValue) => setLead(itemValue)}
          >
            <Picker.Item label="---Select Opportunity---" value="" />
            <Picker.Item label="Opportunity A" value="OpportunityA" />
            <Picker.Item label="Opportunity B" value="OpportunityB" />
          </Picker>
        </View>

        <Text style={styles.label}>
          Select Lead <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={lead}
            onValueChange={(itemValue) => setLead(itemValue)}
          >
            <Picker.Item label="---Select Lead---" value="" />
            <Picker.Item label="Lead A" value="leadA" />
            <Picker.Item label="Lead B" value="leadB" />
          </Picker>
        </View>

        <Text style={styles.label}>
          Priority <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={priority}
            onValueChange={(itemValue) => setPriority(itemValue)}
          >
            <Picker.Item label="--Select---" value="" />
            <Picker.Item label="High" value="high" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="Low" value="low" />
          </Picker>
        </View>

        <Text style={styles.label}>Description</Text>
        <TextInput
          placeholder="Description..."
          multiline
          numberOfLines={4}
          style={styles.textArea}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Reminder Follow Up Date</Text>
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

        <Text style={styles.label}>Reminder Follow Up Time</Text>
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

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
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
    paddingVertical: 14,
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
