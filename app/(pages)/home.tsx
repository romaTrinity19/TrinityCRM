import {
  
  DrawerNavigationProp,
} from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomerInteractionStats from "../(components)/dashboardCard";
import { withDrawer } from "../(components)/drawer";
import { useNavigation } from "@react-navigation/native";
 

type RootDrawerParamList = {
  Dashboard: undefined;
};
const Dashboard = ({ navigation }: any) => {
  const navigationn =
    useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  return (
    <View style={{ flex: 1, backgroundColor: "#f3f5fb" }}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigationn.openDrawer()}>
          <Icon name="menu" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trinity CRM</Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
          <Icon name="logout" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.dashboardContent}
        showsVerticalScrollIndicator={false}
      >
        <CustomerInteractionStats />
        {[
          {
            label: "New Leads",
            count: 19,
            icon: "view-grid",
            color: "#3d40b1",
            route: "/(components)/newLeads",
          },
          {
            label: "Opportunity",
            count: 19,
            icon: "trophy-outline",
            color: "#3d40b1",
            route: "/(components)/opportunity",
          },
          {
            label: "Follow Up",
            count: 19,
            icon: "file-find-outline",
            route: "/(components)/followUpList",
          },
          {
            label: "Reminder",
            count: 23,
            icon: "bell",
            color: "#179dca",
            route: "/(components)/reminder",
          },
          {
            label: "Customer Profile",
            count: 18,
            icon: "account",
            color: "#800080",
            route: "/(components)/customerProfileList",
          },
          {
            label: "Client Document",
            count: 18,
            icon: "clipboard-check-outline",
            color: "#800080",
            route: "/(components)/clientDocuments",
          },
          {
            label: "Quatation",
            count: 13,
            icon: "send-check-outline",
            color: "#FF4500",
            route: "/(components)/quatation",
          },
          {
            label: "Invoice",
            count: 13,
            icon: "send-check-outline",
            color: "#FF4500",
            route: "/(components)/invoiceList",
          },
          {
            label: "Task Management",
            count: 18,
            icon: "clipboard-check-outline",
            color: "#800080",
            route: "/(components)/taskList",
          },
          // {
          //   label: "Qualification",
          //   count: 18,
          //   icon: "account-check-outline",
          //   color: "#800080",
          //   route: "/(components)/qualification",
          // },

          // {
          //   label: "On Hold",
          //   count: 19,
          //   icon: "layers-outline",
          //   color: "#008B8B",
          //   route: "/(components)/hold",
          // },
          // {
          //   label: "Won Lead",
          //   count: 23,
          //   icon: "clipboard-check-outline",
          //   color: "#00695c",
          //   route: "/(components)/wonLead",
          // },
          // {
          //   label: "Add Attachments",
          //   count: 4,
          //   icon: "paperclip",
          //   color: "#2D4491",
          //   route: "/(components)/attachment",
          // },
          // {
          //   label: "Lost Lead",
          //   count: 26,
          //   icon: "clipboard-remove-outline",
          //   color: "#dc143c",
          //   route: "/(components)/lostLead",
          // },
          // {
          //   label: "Pending Follow",
          //   count: 9,
          //   icon: "account-clock-outline",
          //   color: "#f4a300",
          //   route: "/(components)/pendingFollow",
          // },
        ].map((item: any, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route)}
            style={styles.cardContainer}
          >
            <View style={styles.card}>
              <Icon name={item.icon} size={30} color="#5975D9" />
              <Text style={[styles.cardCount, { color: "#5975D9" }]}>
                {item.count}
              </Text>
              <Text style={[styles.cardLabel, { color: "#5975D9" }]}>
                {item.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default withDrawer(Dashboard, "Dashboard");

const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: "#2D4491",
    alignItems: "center",
    padding: 20,
  },
  drawerImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
  },
  drawerTitle: {
    color: "#fff",
    fontSize: 18,
    marginTop: 10,
  },
  drawerBody: {
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#2D4491",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 40,
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  dashboardContent: {
    padding: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingBottom: 200,
  },
  cardWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },

  cardContainer: {
    width: "45%",
    marginBottom: 5,
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 15,
    backgroundColor: "#fff",
    borderWidth: 0.5,
    borderColor: "#5975D9",
    elevation: 2,
  },

  card: {
    height: 120,
    borderRadius: 12,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },

  cardCount: {
    fontSize: 24,
    fontWeight: "bold",
  },

  cardLabel: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },

  bottomTab: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
    backgroundColor: "#fff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
});
