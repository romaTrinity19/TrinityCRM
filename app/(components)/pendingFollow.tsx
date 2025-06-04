import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
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
import { withDrawer } from "./drawer";

const followUps = [
  {
    id: "1",
    name: "Richa",
    followUpDate1: "11 Oct 2024 17:47 pm",
    followUpDate2: "11 Oct 2024 17:47 pm",
    status: "LEAD",
    type: "TELEPHONIC",
  },
  {
    id: "2",
    name: "San Kumar",
    followUpDate1: "16 Aug 2024 16:50 pm",
    followUpDate2: "16 Aug 2024 17:50 pm",
    status: "WON_LEAD",
    type: "TELEPHONIC",
  },
  {
    id: "3",
    name: "Kapil Sir",
    followUpDate1: "07 Aug 2024 10:30 am",
    followUpDate2: "08 Aug 2024 11:00 am",
    status: "ON_HOLD",
    type: "TELEPHONIC",
  },
  {
    id: "4",
    name: "Meet Ji",
    followUpDate1: "10 May 2023 12:30 pm",
    followUpDate2: "",
    status: "IN_PROGRESS",
    type: "TELEPHONIC",
  },
];
type RootDrawerParamList = {
  Dashboard: undefined;
  Qualification: undefined;
  PendingFollowUpScreen: undefined;
};

const PendingFollowUpScreen = () => {
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const filteredData = followUps.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

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
          <TouchableOpacity style={styles.menuItem}>
            <Text>Add Follow Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Pending Follow Up</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <TextInput
        style={styles.searchBox}
        placeholder="Type your text"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <MaterialIcons name="person" size={20} color="#3E4A89" />
              <Text style={styles.cardTitle}>{item.name}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSelectedItem(item.id);
                  setMenuVisible(true);
                }}
              >
                <MaterialIcons name="more-vert" size={24} color="#3E4A89" />
              </TouchableOpacity>
            </View>
            <View style={styles.horizontalLine} />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons
                  name="calendar-today"
                  size={16}
                  color={"#3E4A89"}
                />
                <Text style={styles.detail}> Follow Up Date</Text>
              </View>

              <Text style={styles.detail}> {item.followUpDate1}</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons
                  name="calendar-today"
                  size={16}
                  color={"#3E4A89"}
                />
                <Text style={styles.detail}> Follow Up Date</Text>
              </View>

              <Text style={styles.detail}> {item.followUpDate2}</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="credit-card" size={16} color={"#3E4A89"} />
                <Text style={styles.detail}> Status</Text>
              </View>

              <Text style={styles.detail}> {item.status}</Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="credit-card" size={16} color={"#3E4A89"} />
                <Text style={styles.detail}> Type</Text>
              </View>

              <Text style={styles.detail}> {item.type}</Text>
            </View>

            <Text style={styles.detail}>▶ Opportunity</Text>
            {renderMenu(item)}
          </View>
        )}
      />
    </View>
  );
};

export default withDrawer(PendingFollowUpScreen, "PendingFollowUpScreen");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f6fe",
    paddingTop: 30,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
   horizontalLine: {
    height: 1,
    backgroundColor: "#3E4A89",
    marginHorizontal: 10,
    marginVertical: 10,
    opacity: 0.5,
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
  searchBox: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 30,
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3E4A89",
    flex: 1,
    marginLeft: 10,
  },
  detail: {
    color: "#3E4A89",
    marginTop: 4,
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
    paddingVertical: 10,
  },
});
