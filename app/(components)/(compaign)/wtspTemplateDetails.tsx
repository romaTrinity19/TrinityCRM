import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const screenHeight = Dimensions.get("window").height;

export default function FollowUpDetailCard() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerContainer}>
         <Ionicons name="arrow-back" size={24} color="#fff" style={styles.backIcon} onPress={()=>router.back()}/>
        <Ionicons name="chatbox-ellipses-outline" size={22} color="#fff" />
        <Text style={styles.header}>WhatsApp Template Details</Text>
      </View>

      <View style={styles.card}>
        {/* Profile Section */}
        <View style={styles.profileRow}>
          <Ionicons
            name="person-circle-outline"
            size={64}
            color="#4B65E9"
            style={styles.profileIcon}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>Roma Chakradhari</Text>
            <Text style={styles.phone}>📞 1234567890</Text>
          </View>
        </View>

        {/* Date & Time */}
        <View style={styles.infoRow}>
          <Ionicons name="language-outline" size={20} color="#4B65E9" />
          <Text style={styles.infoText}>Language - A</Text>

          <Ionicons name="pricetag-outline" size={20} color="#4B65E9" style={{ marginLeft: 20 }} />
          <Text style={styles.infoText}>Category - A</Text>
        </View>

        {/* Service Type */}
        <View style={styles.infoRow}>
          <Ionicons name="document-text-outline" size={20} color="#4B65E9" />
          <Text style={styles.infoText}>Template Type - Type A</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionBox}>
          <Text style={styles.descriptionTitle}>Template Message</Text>
          <Text style={styles.descriptionText}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fuga modi voluptatum nisi !</Text>
        </View>
      </View>

      {/* Footer Tagline */}
      <Text style={styles.footerText}>Stay connected. Stay informed.</Text>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#e6ecfc",
    padding: 20,
    justifyContent: "center",
    minHeight: screenHeight,
  },
  headerContainer: {
    backgroundColor: "#4B65E9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  card: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileIcon: {
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#070557",
  },
  phone: {
    fontSize: 15,
    color: "#444",
    marginTop: 4,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    gap: 10,
  },
  infoText: {
    fontSize: 15,
    color: "#333",
  },
  descriptionBox: {
    marginTop: 24,
    backgroundColor: "#f3f5ff",
    borderRadius: 10,
    padding: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#070557",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: "#666",
  },
  footerText: {
    marginTop: 30,
    textAlign: "center",
    color: "#4B65E9",
    fontWeight: "600",
    fontSize: 14,
  },
  backIcon: {
  position: "absolute",
  left: 16,
  top: 16,
  zIndex: 1,
},

});
