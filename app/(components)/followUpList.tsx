import { Ionicons } from "@expo/vector-icons";

import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Linking,
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
import Toast from "react-native-toast-message";
import { withDrawer } from "./drawer";
import { ActivityIndicator } from "react-native";

type RootDrawerParamList = {
  Dashboard: undefined;
  Qualification: undefined;
  Reminder: undefined;
};
function ReminderScreen() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [followUpToDelete, setFollowUpToDelete] = useState<string | null>(null);

  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filterData, setFilterData] = useState({
    agent: "",
    user: "",
    state: "",
  });

  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const agents = ["--- select ---", "Agent A", "Agent B", "Agent C"];
  const users = ["--- select ---", "User X", "User Y", "User Z"];
  const states = [
    "--- select ---",
    "Madhya Pradesh",
    "Maharashtra",
    "Rajasthan",
  ];

  const filteredReminders = followUps?.filter((item) =>
    item.lead_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const renderMenu = (item: any) => (
    <Modal
      transparent={true}
      visible={selectedItem === item.followup_id && menuVisible}
      animationType="fade"
      onRequestClose={() => setMenuVisible(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer2}>
          {[
            {
              label: "View",
              emoji: "👁️",
              onPress: () => {
                setMenuVisible(false);
                router.push({
                  pathname: "/(components)/followUpUserDetails",
                  params: { id: item.followup_id },
                });
              },
            },
            {
              label: "Edit",
              emoji: "✏️",
              onPress: () => {
                setMenuVisible(false);
                router.push({
                  pathname: "/(pages)/newLeads",
                  params: { type: "update", id: item.followup_id },
                });
              },
            },
            {
              label: "Call",
              emoji: "📞",
              onPress: () => {
                setMenuVisible(false);
                const phone = item.contact;
                const telURL = `tel:${phone}`;
                Linking.openURL(telURL);
              },
            },
            {
              label: "Delete",
              emoji: "🗑️",
              onPress: () => {
                setMenuVisible(false);
                setFollowUpToDelete(item.followup_id);
                setDeleteModalVisible(true);
              },
            },
          ].map((menuItem) => (
            <TouchableOpacity
              key={menuItem.label}
              style={styles.menuItem2}
              activeOpacity={0.7}
              onPress={menuItem.onPress}
            >
              <View style={styles.menuItemRow2}>
                <Text style={styles.menuEmoji}>{menuItem.emoji}</Text>
                <Text style={styles.menuText}>{menuItem.label}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const fetchFollowUps = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://crmclient.trinitysoftwares.in/crmAppApi/followUp.php?type=getAllFollowUps"
      );
      const json = await response.json();

      if (json.status === "success") {
        setFollowUps(json.data);
      } else {
        Toast.show({ type: "error", text1: "Failed to fetch follow-ups" });
      }
    } catch (error) {
      console.error("API Error:", error);
      Toast.show({ type: "error", text1: "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async (followupId: string) => {
    try {
      const response = await fetch(
        "http://crmclient.trinitysoftwares.in/crmAppApi/followUp.php?type=deleteFollowUp",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ followup_id: followupId }),
        }
      );

      const result = await response.json();

      if (result.status === "success") {
        Toast.show({ type: "success", text1: "Deleted successfully" });
        setDeleteModalVisible(false);
        fetchFollowUps();
      } else {
        Toast.show({ type: "error", text1: result.message || "Delete failed" });
      }
    } catch (error) {
      console.error("Delete error:", error);
      Toast.show({ type: "error", text1: "Something went wrong!" });
    }
  };

  if (loading && !followUps) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#5975D9" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Follow Up List</Text>
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
                  <Picker.Item key={a} label={a || "Select Agent"} value={a} />
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
                  <Picker.Item key={s} label={s || "Select State"} value={s} />
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
      <View style={{ paddingBottom: 200 }}>
        <FlatList
          data={filteredReminders}
          keyExtractor={(item) => item.followup_id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <TouchableOpacity
                onPress={() => router.push("/(components)/followUpUserDetails")}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.iconTitleWrapper}>
                    <FontAwesome5
                      name="user-circle"
                      size={24}
                      color="#1F40B5"
                    />
                    <Text style={styles.cardTitle}>{item.lead_name}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedItem(item.followup_id);
                      setMenuVisible(true);
                    }}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color="#888" />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardDetailRow}>
                  <Ionicons name="calendar-outline" size={16} color="#4B65E9" />
                  <Text style={styles.cardLabel}>Follow Up Date</Text>
                  <Text style={styles.cardValue}>{item.followup_date}</Text>
                </View>

                <View style={styles.cardDetailRow}>
                  <Ionicons name="time-outline" size={16} color="#4B65E9" />
                  <Text style={styles.cardLabel}>Follow Up Time</Text>
                  <Text style={styles.cardValue}>{item.followup_time}</Text>
                </View>
              </TouchableOpacity>
              {renderMenu(item)}
            </Card>
          )}
        />
      </View>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 10,
              }}
            >
              Confirm Delete
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: "#444",
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Are you sure you want to delete this follow-up?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => setDeleteModalVisible(false)}
                style={{
                  flex: 1,
                  backgroundColor: "#ccc",
                  padding: 10,
                  borderRadius: 8,
                  marginRight: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#000", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (followUpToDelete) {
                    handleConfirmDelete(followUpToDelete);
                  }
                }}
                style={{
                  flex: 1,
                  backgroundColor: "#e74c3c",
                  padding: 10,
                  borderRadius: 8,
                  marginLeft: 10,
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/(components)/followUp")}
      >
        <Text style={styles.createButtonText}>Follow Up</Text>
      </TouchableOpacity>
    </View>
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
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    padding: 14,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  iconTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    color: "#1F40B5",
    marginLeft: 10,
    fontWeight: "600",
  },
  cardDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
    paddingVertical: 2,
    borderBottomWidth: 0.5,
    borderColor: "#eee",
  },
  cardLabel: {
    color: "#4B65E9",
    fontWeight: "600",
    marginLeft: 6,
    flex: 1,
  },
  cardValue: {
    color: "#222",
    fontWeight: "500",
    fontSize: 14,
  },

  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  createButton: {
    backgroundColor: "#112980",
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
    maxHeight: 400,
  },

  menuItem: {
    paddingVertical: 5,
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

  alertButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 6,
    alignItems: "center",
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
  menuContainer2: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    elevation: 10,
    width: 320,
    maxHeight: 450,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  menuItem2: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },

  menuItemRow2: {
    flexDirection: "row",
    alignItems: "center",
  },

  menuEmoji: {
    fontSize: 20,
    marginRight: 12,
  },

  menuText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});
