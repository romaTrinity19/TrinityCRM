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
import { Card } from "react-native-paper";
import { withDrawer } from "../drawer";
import { SafeAreaView } from "react-native-safe-area-context";

const remindersData = [
  {
    id: "1",
    name: "Richa",
    Status: "Approved",
    description: "",
    language: "Hindi",
    category: "A",
    type: "TypeA",
    msg: "Hey Customer , Welcome To trinity Solutions. Bulk Whatsapp api testing for crm . By, User",
  },
  {
    id: "2",
    name: "Vaibhav Singhaniya",
    language: "Hindi",
    category: "A",
    type: "TypeA",
    msg: "Hey Customer , Welcome To trinity Solutions. Bulk Whatsapp api testing for crm . By, User",
    Status: "Pending",
    description: "",
  },
  {
    id: "3",
    name: "Pramod Agrawal ji",
    language: "Hindi",
    category: "A",
    type: "TypeA",
    msg: "Hey Customer , Welcome To trinity Solutions. Bulk Whatsapp api testing for crm . By, User",
    Status: "Cancelled",
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
          <Text style={styles.headerTitle}>WhatsApp Template List</Text>
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
        </View>

        <FlatList
          data={filteredReminders}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <TouchableOpacity
                onPress={() =>
                  router.push("/(components)/(compaign)/wtspTemplateDetails")
                }
              >
                <View style={styles.cardHeader}>
                      <Ionicons name="person" size={20} color="#0082CA" />
                  <Text style={styles.cardTitle}>{item.name}</Text>

                  {/* <TouchableOpacity
                    onPress={() => {
                      setSelectedItem(item.id);
                      setMenuVisible(true);
                    }}
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color="gray" />
                  </TouchableOpacity> */}
                </View>

                <View style={styles.cardDetailRow}>
                  <Text style={styles.cardLabel}>Language</Text>
                  <Text style={styles.cardValue}>{item.language}</Text>
                </View>

                <View style={styles.cardDetailRow}>
                  <Text style={styles.cardLabel}>Category</Text>
                  <Text style={styles.cardValue}>{item.category}</Text>
                </View>
                <View style={styles.cardDetailRow}>
                  <Text style={styles.cardLabel}>Template Type</Text>
                  <Text style={styles.cardValue}>{item.type}</Text>
                </View>

                <View style={styles.cardDetailRow}>
                  <Text style={styles.cardLabel}>Status</Text>
                  <Text
                    style={[
                      styles.urgentBadge,
                      {
                        backgroundColor:
                          item.Status === "Approved"
                            ? "green"
                            : item.Status === "Pending"
                              ? "yellow"
                              : "red",
                        color: item.Status === "Pending" ? "#000" : "#fff",
                      },
                    ]}
                  >
                    {item.Status}
                  </Text>
                </View>
              </TouchableOpacity>
              {renderMenu(item)}
            </Card>
          )}
        />

        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/(components)/(compaign)/wtspTempMaster")}
        >
          <Text style={styles.createButtonText}>Create</Text>
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
    bottom: 10,
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
});
