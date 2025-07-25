import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const Drawer = createDrawerNavigator();

const DrawerContent = (props: any) => {
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1, marginBottom:50}}>
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
            label: "Email Template Master",
            icon: "bell-outline",
            route: "/(components)/(compaign)/emailTempMaster",
          },
          {
            label: "Bulk E-mail",
            icon: "mail",
            route: "/(components)/(compaign)/bulkEmail",
          },
          {
            label: "Bulk WhatsApp",
            icon: "mail",
            route: "/(components)/(compaign)/bulkWhatsapp",
          },
          {
            label: "WhatsApp Template Master",
            icon: "whatsapp",
            route: "/(components)/(compaign)/wtspTempMasterList",
          },
          {
            label: "Generate Enquiry Form",
            icon: "file-document-edit-outline",
            route: "/(components)/enquiryForm",
          },
          {
            label: "Add Bill",
            icon: "receipt",
            route: "/(components)/addCustomer",
          },
          
          {
            label: "Add Payment",
            icon: "briefcase-outline",
            route: "/(components)/addPayment",
          },
           {
            label: "Logout",
            icon: "logout",
            route: "/(auth)/login",
          },
             
        ].map((item, index) => (
          <DrawerItem
            key={index}
            label={item.label}
            icon={() => <Icon name={item.icon} size={20} color={"#2D4491"} />}
            onPress={() => {
              props.navigation.closeDrawer();
              router.push(item.route as any);
            }}
            labelStyle={{ color: "#2D4491", fontSize: 14 }}
          />
        ))}
      </ScrollView>
    </DrawerContentScrollView>
  );
};

const PlaceholderScreen = () => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>Welcome to CRM App</Text>
  </View>
);

export const withDrawer = (
  ScreenComponent: any,
  screenName: string = "Main"
) => {
  return () => (
    <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
      <Drawer.Screen
        name={screenName}
        component={ScreenComponent}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};

export default withDrawer(PlaceholderScreen);

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
});
