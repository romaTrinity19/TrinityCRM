import { Ionicons } from "@expo/vector-icons";
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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";
import { withDrawer } from "../(components)/drawer";
import { Picker } from "@react-native-picker/picker";

const leads = [
  {
    id: "1",
    name: "#00418 - Kush Bhaiya",
    service: "Stock Management App",
    phone: "9131563996, 9131563996",
    amount: "₹10,000",
    date: "14th May 2025",
  },
  {
    id: "2",
    name: "#00418 - Ravish Talreja",
    service: "Social Media and digital",
    phone: "9981515000, 9981515000",
    date: "14th May 2025",
  },
  {
    id: "3",
    name: "#00418 - Amit Ji Jain Traders",
    service: "Lable prinintg software",
    phone: "9827138487, 9827138487",
    date: "14th May 2025",
  },
  {
    id: "4",
    name: "#00418 - Manoj Borker",
    service: "Website",
    phone: "",
    date: "",
  },
];
type RootDrawerParamList = {
  Dashboard: undefined;
  Qualification: undefined;
  NewLeads: undefined;
};

function NewLeadsScreen() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [createCustomerModalVisible, setCreateCustomerModalVisible] =
    useState(false);

  const [filterData, setFilterData] = useState({
    agent: "",
    user: "",
    state: "",
  });

  const agents = ["Agent", "Agent A", "Agent B", "Agent C"];
  const users = ["User", "User X", "User Y", "User Z"];
  const states = ["State", "Madhya Pradesh", "Maharashtra", "Rajasthan"];

  // Filter leads based on search query (case-insensitive)
  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
//   const menuItems = [
//     { label: "View", route: "/(components)/opportunityUserDetails", icon: "eye-outline" },
//     { label: "Transfer", route: "/(pages)/newLeads", icon: "swap-horizontal" },
//     {
//       label: "Create Customer",
//       modal: "createCustomer",
//       icon: "person-add-outline",
//     },
//     { label: "Edit", route: "/(pages)/newLeads", icon: "create-outline" },
//     {
//       label: "WhatsApp Chat",
//       route: "/(pages)/message",
//       icon: "logo-whatsapp",
//     },
//     { label: "Call", route: "CallScreen", icon: "call-outline" },
//     { label: "Delete", route: "/(pages)/message", icon: "trash" },
//   ];

 const menuItems = [
    { label: "View", route: "/(components)/opportunityUserDetails", emoji: "👁️" },
    { label: "Transfer", route: "/(pages)/newLeads", emoji: "🔄" },
    {
      label: "Create Customer",
      modal: "createCustomer",
      emoji: "🧑‍💼",
    },
    { label: "Edit", route: "/(pages)/newLeads", emoji: "✏️" },
    {
      label: "WhatsApp Chat",
      route: "/(pages)/message",
      emoji: "💬",
    },
    { label: "Call", route: "CallScreen", emoji: "📞" },
    { label: "Delete", route: "/(pages)/message", emoji: "🗑️" },
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
        <View style={styles.menuContainer2}>
          {menuItems.map((menuItem) => (
            <TouchableOpacity
              key={menuItem.label}
              style={styles.menuItem2}
              activeOpacity={0.7}
              onPress={() => {
                setMenuVisible(false);
                if (menuItem.modal === "createCustomer") {
                  setCreateCustomerModalVisible(true);
                } else if (menuItem.route) {
                  router.push(menuItem.route as any);
                }
              }}
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

  const CreateCustomer = (item: any) => (
    <Modal
      visible={createCustomerModalVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setCreateCustomerModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertIcon}>❗</Text>
          <Text style={styles.alertTitle}>Are you sure?</Text>
          <Text style={styles.alertMessage}>
            You won't be able to revert this!
          </Text>
          <View style={styles.alertButtons}>
            <TouchableOpacity
              style={[styles.alertButton, { backgroundColor: "#4b3ba9" }]}
              onPress={() => {
                setCreateCustomerModalVisible(false);
                // Action logic here...
              }}
            >
              <Text style={styles.alertButtonText}>Yes!</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.alertButton, { backgroundColor: "#f23547" }]}
              onPress={() => setCreateCustomerModalVisible(false)}
            >
              <Text style={styles.alertButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Opportunity</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
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
        data={filteredLeads}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Card style={styles.card} mode="outlined">
            <Card.Title
              title={`${index + 1}. ${item.name}`}
              right={() => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedItem(item.id);
                    setMenuVisible(true);
                  }}
                >
                  <IconButton icon="dots-vertical" />
                </TouchableOpacity>
              )}
              titleStyle={{ color: "#4b3ba9" }}
            />
            <View style={styles.horizontalLine} />
            <Card.Content>
              <View style={styles.row}>
                <IconButton
                  icon="bookmark-outline"
                  size={18}
                  iconColor="#4b3ba9"
                />
                <Text>{item.service}</Text>
              </View>
              {item.phone ? (
                <View style={styles.row}>
                  <IconButton
                    icon="phone-outline"
                    size={18}
                    iconColor="#4b3ba9"
                  />
                  <Text>{item.phone}</Text>
                </View>
              ) : null}
              {item.amount ? (
                <View style={styles.row}>
                  <IconButton
                    icon="wallet-outline"
                    size={18}
                    iconColor="#4b3ba9"
                  />
                  <Text>{item.amount}</Text>
                </View>
              ) : null}
              {item.date ? (
                <View style={styles.row}>
                  <IconButton icon="calendar" size={18} iconColor="#4b3ba9" />
                  <Text>{item.date}</Text>
                </View>
              ) : null}
            </Card.Content>
            {renderMenu(item)}
          </Card>
        )}
      />
      <CreateCustomer />
      <Button
        icon="plus"
        mode="contained"
        style={styles.createButton}
        labelStyle={{ fontSize: 16 }}
        onPress={() => router.push("/(components)/newOpportunity")}
      >
        Create Opportunity
      </Button>
    </View>
  );
}
export default withDrawer(NewLeadsScreen, "NewLeads");

const styles = StyleSheet.create({
  pickerWrapper: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 8,
    padding: -10,
  },

  modalCloseIcon: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1,
  },

  menuItemRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    backgroundColor: "#fff",
    padding: 20, // increased padding
    borderRadius: 16,
    elevation: 8,
    width: 280, // increased width
    maxHeight: 400, // optional: in case items overflow
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
  container: {
    flex: 1,
    backgroundColor: "#edf1fd",
    paddingTop: 30,
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
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginVertical: 15,
    marginHorizontal: 10,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: "#4b3ba9",
    marginHorizontal: 16,
    marginTop: -15,
    marginBottom: 4,
    opacity: 0.5,
  },
  card: {
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderColor: "#4b3ba9",
    marginHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -10,
  },
  createButton: {
    backgroundColor: "#001a72",
    borderRadius: 25,
    marginBottom: 40,
    paddingVertical: 2,
    alignSelf: "center",
    width: "90%",
    marginTop: 20,
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
