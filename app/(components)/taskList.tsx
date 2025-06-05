import { Ionicons } from "@expo/vector-icons";

import { FontAwesome5 } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card } from "react-native-paper";
import { withDrawer } from "./drawer";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

const remindersData = [
  {
    id: "1",
    name: "Richa",
    date: "04-09-2024",
    time: "06:30 pm",
    priority: "Urgent",
    description: "",
  },
  {
    id: "2",
    name: "Vaibhav Singhaniya",
    date: "20-03-2024",
    time: "04:00 pm",
    priority: "Urgent",
    description: "",
  },
  {
    id: "3",
    name: "Pramod Agrawal ji",
    date: "14-10-2023",
    time: "07:25 am",
    priority: "Urgent",
    description: "",
  },
  {
    id: "4",
    name: "Shreyansh",
    date: "16-10-2023",
    time: "11:00 am",
    priority: "Urgent",
    description: "",
  },

  {
    id: "5",
    name: "Pramod Agrawal ji",
    date: "14-10-2023",
    time: "07:25 am",
    priority: "Urgent",
    description: "",
  },
  {
    id: "6",
    name: "Shreyansh",
    date: "16-10-2023",
    time: "11:00 am",
    priority: "Urgent",
    description: "",
  },
];
type RootDrawerParamList = {
  Dashboard: undefined;
  Qualification: undefined;
  Reminder: undefined;
};
function ReminderScreen() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [searchQuery, setSearchQuery] = useState("");

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterData, setFilterData] = useState({
    agent: "",
    user: "",
    state: "",
  });

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const agents = ["--- select ---", "Agent A", "Agent B", "Agent C"];
  const users = ["--- select ---", "User X", "User Y", "User Z"];
  const states = [
    "--- select ---",
    "Madhya Pradesh",
    "Maharashtra",
    "Rajasthan",
  ];

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const filteredReminders = remindersData.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    {
      label: "Follow Up",
      route: "/(components)/followUp",
      icon: "time-outline",
    },
    { label: "Edit", route: "/(pages)/newLeads", icon: "create-outline" },
    { label: "Delete", route: "/(pages)/message", icon: "trash" },
  ];
  const renderMenu = (item: any) => (
    <Modal
      transparent={true}
      visible={selectedItem === item.id && menuVisible}
      animationType="fade"
      onRequestClose={() => setMenuVisible(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer}>
          {menuItems.map((menuItem) => (
            <TouchableOpacity
              key={menuItem.label}
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                if (menuItem.route) {
                  router.push(menuItem.route as any);
                }
              }}
            >
              <View style={styles.menuItemRow}>
                <Ionicons
                  name={menuItem.icon as any}
                  size={18}
                  color="#333"
                  style={{ marginRight: 10 }}
                />
                <Text>{menuItem.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f6ff" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Task List</Text>
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>

        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Search by name"
            style={[styles.searchInput, { flex: 1 }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity
            onPress={() => setFilterModalVisible(true)}
            style={styles.filterIcon}
          >
            <Ionicons name="filter" size={24} color="#4b3ba9" />
          </TouchableOpacity>
        </View>

        <Modal
          visible={filterModalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setFilterModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.filterContainer}>
              {/* Close Icon */}
              <TouchableOpacity
                onPress={() => setFilterModalVisible(false)}
                style={styles.modalCloseIcon}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>

              <Text style={styles.modalTitle}>Apply Filters</Text>

              {/* Agent Picker */}
              <Text style={styles.dateLabel}>Agent</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={filterData.agent}
                  onValueChange={(itemValue) =>
                    setFilterData({ ...filterData, agent: itemValue })
                  }
                  style={{ padding: 0, margin: -5 }}
                >
                  {agents.map((a) => (
                    <Picker.Item
                      key={a}
                      label={a || "Select Agent"}
                      value={a}
                    />
                  ))}
                </Picker>
              </View>

              {/* User Picker */}
              <Text style={styles.dateLabel}>User</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={filterData.user}
                  onValueChange={(itemValue) =>
                    setFilterData({ ...filterData, user: itemValue })
                  }
                  style={{ padding: 0, margin: -5 }}
                >
                  {users.map((u) => (
                    <Picker.Item key={u} label={u || "Select User"} value={u} />
                  ))}
                </Picker>
              </View>

              {/* State Picker */}
              <Text style={styles.dateLabel}>State</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={filterData.state}
                  onValueChange={(itemValue) =>
                    setFilterData({ ...filterData, state: itemValue })
                  }
                  style={{ padding: 0, margin: -5 }}
                >
                  {states.map((s) => (
                    <Picker.Item
                      key={s}
                      label={s || "Select State"}
                      value={s}
                    />
                  ))}
                </Picker>
              </View>
              {/* From Date Picker */}
              <Text style={styles.dateLabel}>From Date</Text>
              <TouchableOpacity
                onPress={() => setShowFromPicker(true)}
                style={styles.dateField}
              >
                <Text style={styles.dateValue}>{formatDate(fromDate)}</Text>
              </TouchableOpacity>
              <Text style={styles.dateLabel}>To Date</Text>
              {/* To Date Picker */}
              <TouchableOpacity
                onPress={() => setShowToPicker(true)}
                style={styles.dateField}
              >
                <Text style={styles.dateValue}>{formatDate(toDate)}</Text>
              </TouchableOpacity>
              {showFromPicker && (
                <DateTimePicker
                  value={fromDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowFromPicker(Platform.OS === "ios");
                    if (selectedDate) setFromDate(selectedDate);
                  }}
                />
              )}

              {showToPicker && (
                <DateTimePicker
                  value={toDate}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    setShowToPicker(Platform.OS === "ios");
                    if (selectedDate) setToDate(selectedDate);
                  }}
                />
              )}

              {/* Buttons */}
              <View style={styles.filterButtonsRow}>
                <Button
                  mode="contained"
                  style={styles.searchBtn}
                  onPress={() => {
                    // TODO: Apply filter logic
                    setFilterModalVisible(false);
                  }}
                >
                  Search
                </Button>
                <Button
                  mode="outlined"
                  style={styles.resetBtn}
                  onPress={() => {
                    setFilterData({ agent: "", user: "", state: "" });
                  }}
                >
                  Reset
                </Button>
              </View>
            </View>
          </View>
        </Modal>
        <FlatList
          data={filteredReminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <TouchableOpacity
                onPress={() => router.push("/(components)/followUpUserDetails")}
              >
                <View style={styles.cardHeader}>
                  <FontAwesome5
                    name="briefcase-medical"
                    size={20}
                    color="#0082CA"
                  />
                  <Text style={styles.cardTitle}>{item.name}</Text>

                  <TouchableOpacity
                    onPress={() => {
                      setSelectedItem(item.id);
                      setMenuVisible(true);
                    }}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color="gray" />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardDetailRow}>
                  <Text style={styles.cardLabel}>Reminder Date</Text>
                  <Text style={styles.cardValue}>{item.date}</Text>
                </View>

                <View style={styles.cardDetailRow}>
                  <Text style={styles.cardLabel}>Reminder Time</Text>
                  <Text style={styles.cardValue}>{item.time}</Text>
                </View>

                <View style={styles.cardDetailRow}>
                  <Text style={styles.cardLabel}>Priority</Text>
                  <Text style={styles.urgentBadge}>{item.priority}</Text>
                </View>

                <TouchableOpacity>
                  <Text style={styles.descriptionText}>▶ Description</Text>
                </TouchableOpacity>
              </TouchableOpacity>
              {renderMenu(item)}
            </Card>
          )}
        />

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/(components)/taskManagement")}
        >
          <Text style={styles.createButtonText}>Task Management</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default withDrawer(ReminderScreen, "Reminder");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fe",
    paddingTop: 30,
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
  searchInput: {
    margin: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    color: "#0082CA",
    flex: 1,
    marginLeft: 10,
  },
  cardDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  cardLabel: {
    color: "#0082CA",
    fontWeight: "600",
  },
  cardValue: {
    color: "#000",
  },
  urgentBadge: {
    backgroundColor: "#ff3b30",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
  },
  descriptionText: {
    color: "#0082CA",
    marginTop: 5,
  },
  createButton: {
    backgroundColor: "#1F40B5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    marginHorizontal: 10,
    position: "absolute",
    bottom: 40,
    left: 0,
    right: 0,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 8,
    width: 280,
  },

  menuItem: {
    paddingVertical: 5,
  },
  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  filterIcon: {
    marginLeft: 8,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    elevation: 2,
  },

  filterContainer: {
    backgroundColor: "#fff",
    padding: 20,
    margin: 20,
    borderRadius: 10,
    width: "90%",
    elevation: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },

  filterInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },

  filterButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  searchBtn: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#4b3ba9",
  },

  resetBtn: {
    flex: 1,
    borderColor: "#4b3ba9",
  },
  alertBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: 300,
    alignItems: "center",
    elevation: 5,
  },
  alertIcon: {
    fontSize: 36,
    color: "#f0ad4e",
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  alertButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  alertButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: "center",
  },
  alertButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  dateField: {
    backgroundColor: "#f0f0ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: "#4B65E9",
  },
  dateLabel: {
    fontSize: 14,
    color: "#444",
    fontWeight: "600",
  },
  dateValue: {
    fontSize: 16,

    marginTop: 4,
  },
  modalCloseIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },
  pickerWrapper: {
    backgroundColor: "#f0f0ff",
    borderWidth: 0.5,
    borderColor: "#4B65E9",
    borderRadius: 8,
    marginVertical: 8,
    padding: -10,
  },
});
