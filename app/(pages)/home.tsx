import {
  createDrawerNavigator,
  DrawerContentScrollView,
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

const Drawer = createDrawerNavigator();

const DrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={styles.drawerHeader}>
        <Image
          source={require("@/assets/images/log.jpeg")}
          style={styles.drawerImage}
        />
        <Text style={styles.drawerTitle}>CRM App</Text>
      </View>
      <ScrollView
        style={styles.drawerBody}
        showsVerticalScrollIndicator={false}
      >
        {[
          { label: "Dashboard", icon: "home", route: "/(pages)/home" },
          {
            label: "New Leads",
            icon: "view-dashboard-outline",
            route: "/(components)/newLeads",
          },
          {
            label: "Create New Leads",
            icon: "file-document-outline",
            route: "/(pages)/newLeads",
          },
          {
            label: "Qualification",
            icon: "account-check-outline",
            route: "/(components)/qualification",
          },
          {
            label: "Add Quotation",
            icon: "file-plus-outline",
            route: "/(components)/quatation",
          },
          {
            label: "Quat. Send",
            icon: "send-check-outline",
            route: "/(components)/quatation",
          },
          {
            label: "On Hold",
            icon: "layers-outline",
            route: "/(components)/hold",
          },
          {
            label: "Won Lead",
            icon: "clipboard-check-outline",
            route: "/(components)/wonLead",
          },
          {
            label: "Lost Lead",
            icon: "clipboard-remove-outline",
            route: "/(components)/lostLead",
          },
          {
            label: "Add Attachment",
            icon: "paperclip",
            route: "/(components)/attachment",
          },
          {
            label: "Follow Up",
            icon: "file-find-outline",
            route: "/(components)/followUp",
          },
          {
            label: "Pending Follow Up",
            icon: "account-clock-outline",
            route: "/(components)/pendingFollow",
          },
          {
            label: "Reminder",
            icon: "bell-outline",
            route: "/(components)/reminder",
          },
          {
            label: "Generate Enquiry Form",
            icon: "file-document-edit-outline",
            route: "/(components)/reminder",
          },
          {
            label: "Add Bill",
            icon: "receipt",
            route: "/(components)/addCustomer",
          },
          {
            label: "Add Payment",
            icon: "credit-card-outline",
            route: "/(components)/addPayment",
          },
        ].map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route as any)}
            style={{ flexDirection: "row", alignItems: "center", padding: 15 }}
          >
            <Icon
              name={item.icon}
              size={20}
              color="#2D4491"
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: "#2D4491", fontSize: 14 }}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </DrawerContentScrollView>
  );
};

const Dashboard = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#f3f5fb" }}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
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
            label: "Qualification",
            count: 18,
            icon: "account-check-outline",
            color: "#800080",
            route: "/(components)/qualification",
          },
          {
            label: "Quat. Send",
            count: 13,
            icon: "send-check-outline",
            color: "#FF4500",
            route: "/(components)/quatation",
          },
          {
            label: "On Hold",
            count: 19,
            icon: "layers-outline",
            color: "#008B8B",
            route: "/(components)/hold",
          },
          {
            label: "Won Lead",
            count: 23,
            icon: "clipboard-check-outline",
            color: "#00695c",
            route: "/(components)/wonLead",
          },
          {
            label: "Add Attachments",
            count: 4,
            icon: "paperclip",
            color: "#2D4491",
            route: "/(components)/attachment",
          },
          {
            label: "Lost Lead",
            count: 26,
            icon: "clipboard-remove-outline",
            color: "#dc143c",
            route: "/(components)/lostLead",
          },
          {
            label: "Pending Follow",
            count: 9,
            icon: "account-clock-outline",
            color: "#f4a300",
            route: "/(components)/pendingFollow",
          },
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

export default function DashboardScreen() {
  return (
    <Drawer.Navigator
      drawerContent={(props: any) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

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
