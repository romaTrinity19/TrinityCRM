import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  findNodeHandle,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  UIManager,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomerInteractionStats from "../(components)/dashboardCard";
import { withDrawer } from "../(components)/drawer";
import { useNavigation } from "@react-navigation/native";
import { Modal } from "react-native";

import {
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
  Ionicons,
} from "@expo/vector-icons";

type RootDrawerParamList = {
  Dashboard: undefined;
};
const Dashboard = ({ navigation }: any) => {
  const navigationn =
    useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const userIconRef = useRef<View>(null);

  const handleUserIconPress = () => {
    if (userIconRef.current) {
      const handle = findNodeHandle(userIconRef.current);
      if (handle) {
        UIManager.measureInWindow(handle, (x, y, width, height) => {
          setMenuPosition({ x, y: y + height + 5 }); // add 5px below icon
          setMenuVisible(true);
        });
      }
    }
  };

  const dashboardItems = [
    {
      label: "New Leads",
      count: 19,
      icon: () => <Feather name="grid" size={28} color="#fff" />,
      gradient: ["#667eea", "#764ba2"] as const,
      route: "/(components)/newLeads",
    },
    {
      label: "Opportunity",
      count: 19,
      icon: () => (
        <MaterialCommunityIcons name="trophy-outline" size={28} color="#fff" />
      ),
      gradient: ["#f093fb", "#f5576c"] as const,
      route: "/(components)/opportunity",
    },
    {
      label: "Follow Up",
      count: 19,
      icon: () => <Feather name="search" size={28} color="#fff" />,
      gradient: ["#4facfe", "#00f2fe"] as const,
      route: "/(components)/followUpList",
    },
    {
      label: "Reminder",
      count: 23,
      icon: () => <Feather name="clock" size={28} color="#fff" />,
      gradient: ["#43e97b", "#38f9d7"] as const,
      route: "/(components)/reminder",
    },
    {
      label: "Customer Profile",
      count: 18,
      icon: () => <Feather name="users" size={28} color="#fff" />,
      gradient: ["#fa709a", "#fee140"] as const,
      route: "/(components)/customerProfileList",
    },
    {
      label: "Client Document",
      count: 18,
      icon: () => <Feather name="file-text" size={28} color="#fff" />,
      gradient: ["#a8edea", "#fed6e3"] as const,
      route: "/(components)/clientDocuments",
    },
    {
      label: "Quotation",
      count: 13,
      icon: () => <Feather name="send" size={28} color="#fff" />,
      gradient: ["#ff758c", "#ff7eb3"] as const,
      route: "/(components)/quatation",
    },
    {
      label: "Invoice",
      count: 13,
      icon: () => (
        <MaterialCommunityIcons name="receipt" size={28} color="#fff" />
      ),
      gradient: ["#f6d365", "#fda085"] as const,
      route: "/(components)/invoiceList",
    },
    {
      label: "Task Management",
      count: 18,
      icon: () => <Feather name="check-square" size={28} color="#fff" />,
      gradient: ["#7F00FF", "#E100FF"] as const,
      route: "/(components)/taskList",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f5fb" }}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <TouchableOpacity onPress={() => navigationn.openDrawer()}>
          <Icon name="menu" size={28} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Trinity CRM</Text>

        <View style={styles.iconContainer}>
          {/* Bell Icon with Badge */}
          <TouchableOpacity style={styles.bellContainer}>
            <FontAwesome5 name="bell" size={24} color="#fff" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>

          {/* User Icon */}
          <TouchableOpacity ref={userIconRef} onPress={handleUserIconPress}>
            <Icon name="account-circle" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Dropdown Modal with absolute position */}
        <Modal
          visible={menuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMenuVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
            <View style={styles.modalBackdrop}>
              <View
                style={[
                  styles.dropdownMenu,
                  {
                    top: menuPosition.y,
                    left: menuPosition.x - 130, // adjust for alignment
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.menuItemContainer}
                  onPress={() => {
                    setMenuVisible(false);
                    router.push("/(pages)/profile");
                  }}
                >
                  <Text style={styles.menuItem}>Profile</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItemContainer}
                  onPress={() => {
                    setMenuVisible(false);
                    router.push("/(auth)/login");
                  }}
                >
                  <Text style={styles.menuItem}>Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.dashboardContent}
        showsVerticalScrollIndicator={false}
      >
        <CustomerInteractionStats />
        {/* {[
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
        ))} */}
        <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              color: "#1e293b",
              marginBottom: 4,
            }}
          >
            Quick Actions
          </Text>
          <Text style={{ fontSize: 16, color: "#64748b", marginBottom: 24 }}>
            Access your most used features
          </Text>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {dashboardItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <TouchableOpacity
                  key={index}
                  style={{
                    width: "48%",

                    borderRadius: 20,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.1,
                    shadowRadius: 12,
                    elevation: 4,
                    marginBottom: 16, // space between rows
                  }}
                  activeOpacity={0.8}
                  onPress={() => router.push(item.route as any)}
                >
                  <LinearGradient
                    colors={item.gradient}
                    style={{ borderRadius: 20, padding: 20 }}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View
                      style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <View
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 16,
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <IconComponent />
                      </View>

                      <View
                        style={{
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 22,
                            fontWeight: "800",
                            color: "#fff",
                            marginBottom: 4,
                          }}
                        >
                          {item.count}
                        </Text>
                        <Text
                          style={{
                            fontSize: 14,
                            color: "rgba(255, 255, 255, 0.9)",
                            fontWeight: "500",
                          }}
                        >
                          {item.label}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
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
    paddingTop: 40,
    paddingBottom: 20,
    justifyContent: "space-between",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  bellContainer: {
    position: "relative",
    marginRight: 10,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -6,
    backgroundColor: "red",
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "transparent",
  },
  dropdownMenu: {
    position: "absolute",
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  menuItemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuItem: {
    fontSize: 16,
    color: "#333",
  },
  menu: {
    backgroundColor: "#fff",
    width: 150,
    borderRadius: 8,
    paddingVertical: 8,
    elevation: 5,
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
