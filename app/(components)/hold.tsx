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
import { Card, IconButton, Text } from "react-native-paper";
import { withDrawer } from "./drawer";

const leads = [
  {
    id: "1",
    name: " Kush Bhaiya",
    service: "Stock Management App",
    phone: "9131563996, 9131563996",
    amount: "₹10,000",
    date: "14th May 2025",
    email: "example@gmail.com",
  },
  {
    id: "2",
    name: "  Ravish Talreja",
    service: "Social Media and digital",
    phone: "9981515000, 9981515000",
    date: "14th May 2025",
    email: "example@gmail.com",
  },
  {
    id: "3",
    name: "  Amit Ji Jain Traders",
    service: "Lable prinintg software",
    phone: "9827138487, 9827138487",
    date: "14th May 2025",
    email: "example@gmail.com",
  },
  {
    id: "4",
    name: "  Manoj Borker",
    service: "Website",
    phone: "",
    date: "",
  },
];
type RootDrawerParamList = {
  Dashboard: undefined;
  Qualification: undefined;
  OnHold: undefined;
};
function OnHold() {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter leads based on search query (case-insensitive)
  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const menuItems = [
    { label: "Edit", route: "/(pages)/newLeads" },
    { label: "Follow Up", route: "FollowUpScreen" },
    { label: "Lead", route: "LeadScreen" },
    { label: "Quotation Sent", route: "QuotationSentScreen" },
    { label: "On Hold", route: "OnHoldScreen" },
    { label: "Won Lead", route: "WonLeadScreen" },
    { label: "Lost Lead", route: "LostLeadScreen" },
    { label: "WhatsApp Chat", route: "/(pages)/message" },
    { label: "Call", route: "CallScreen" },
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
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>On Hold</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <TextInput
        placeholder="Search by name"
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          marginHorizontal: 20,
          marginVertical: 10,
        }}
      >
        <Text style={{ color: "#000", fontSize: 18 }}>On Hold</Text>
        <Text style={{ color: "#000", fontSize: 18 }}>₹ 1000</Text>
      </View>
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
              titleStyle={{ color: "#008B8B" }}
              left={() => <IconButton icon="school" iconColor={"#008B8B"} />}
            />
            <View style={styles.horizontalLine} />
            <Card.Content>
              <View style={styles.row}>
                <IconButton
                  icon="bookmark-outline"
                  size={18}
                  iconColor="#008B8B"
                />
                <Text>{item.service}</Text>
              </View>
              {item.email ? (
                <View style={styles.row}>
                  <IconButton icon="mail" size={18} iconColor="#008B8B" />
                  <Text>{item.email}</Text>
                </View>
              ) : null}
              {item.phone ? (
                <View style={styles.row}>
                  <IconButton
                    icon="phone-outline"
                    size={18}
                    iconColor="#008B8B"
                  />
                  <Text>{item.phone}</Text>
                </View>
              ) : null}

              {item.amount ? (
                <View style={styles.row}>
                  <IconButton
                    icon="wallet-outline"
                    size={18}
                    iconColor="#008B8B"
                  />
                  <Text>{item.amount}</Text>
                </View>
              ) : null}
              {item.date ? (
                <View style={styles.row}>
                  <IconButton icon="calendar" size={18} iconColor="#008B8B" />
                  <Text>{item.date}</Text>
                </View>
              ) : null}
            </Card.Content>
             {renderMenu(item)}
          </Card>
        )}
      />
    </View>
  );
}

export default withDrawer(OnHold, "OnHold");

const styles = StyleSheet.create({
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
    backgroundColor: "#008B8B",
    marginHorizontal: 16,
    marginTop: -15,
    marginBottom: 4,
    opacity: 0.5,
  },
  card: {
    marginBottom: 20,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderColor: "#008B8B",
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
    marginVertical: 20,
    paddingVertical: 2,
    alignSelf: "center",
    width: "90%",
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
