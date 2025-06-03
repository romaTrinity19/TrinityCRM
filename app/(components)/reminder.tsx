import { Ionicons } from "@expo/vector-icons";

import { FontAwesome5 } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Card } from "react-native-paper";
import { withDrawer } from "./drawer";

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
  const [searchText, setSearchText] =useState("");

  const filteredReminders = remindersData.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );


    const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    { label: "Edit", route: "/(pages)/newLeads" },
    { label: "Follow Up", route: "/(components)/followUp" },

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
                router.push(menuItem.route as any);
              }}
            >
              <Text>{menuItem.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container}>
     <LinearGradient colors={["#5975D9", "#070557"]} style={styles.header}>
        <TouchableOpacity onPress={()=>router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminder</Text>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <TextInput
        style={styles.searchInput}
        placeholder="Type your text"
        value={searchText}
        onChangeText={setSearchText}
      />

      <FlatList
        data={filteredReminders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <View style={styles.cardHeader}>
              <FontAwesome5 name="briefcase-medical" size={20} color="#0082CA" />
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
             {renderMenu(item)}
          </Card>
        )}
      />

      <TouchableOpacity style={styles.createButton}
       onPress={() =>router.push('/(components)/createReminder')}>
        <Text style={styles.createButtonText}>+ Create Reminder Follow Up</Text>
      </TouchableOpacity>
    </View>
  );
}

export default withDrawer(ReminderScreen, "Reminder");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fe",
    paddingTop: 40,
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
    color:"#0082CA",
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
    color:"#0082CA",
    marginTop: 5,
  },
  createButton: {
    backgroundColor: "#001f54",
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius:20,
    marginHorizontal:10,
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
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    width: 160,
  },
  menuItem: {
    paddingVertical: 5,
  },
});
