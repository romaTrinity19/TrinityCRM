import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Button } from "react-native-paper";
import { withDrawer } from "./drawer";
type RootDrawerParamList = {
  Dashboard: undefined;
  Qualification: undefined;
  ReleventCallLogsScreen: undefined;
};

const ReleventCallLogsScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleDateChange = (event: any, date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
    hideDatePicker();
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US");
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#5975D9", "#070557"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Not Relevent Call</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View style={{ paddingHorizontal: 15   }}>
        <TouchableOpacity style={styles.datePicker} onPress={showDatePicker}>
          <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        </TouchableOpacity>

        {isDatePickerVisible && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}

        <Button
          icon="plus"
          mode="contained"
          style={styles.createButton}
          labelStyle={{ fontSize: 16 }}
          onPress={() => router.push("/(pages)/newLeads")}
        >
          Create New Leads
        </Button>
      </View>
    </View>
  );
};

export default withDrawer(ReleventCallLogsScreen, "ReleventCallLogsScreen");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f4fb",
    paddingTop: 30,
     
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 20,
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
  datePicker: {
    backgroundColor: "white",
    borderRadius: 30,
    padding: 15,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  createButton: {
    backgroundColor: "#001a72",
    borderRadius: 25,
    marginVertical: 20,
    paddingVertical: 2,
    paddingHorizontal: 15,
    alignSelf: "center",
    width: "90%",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
