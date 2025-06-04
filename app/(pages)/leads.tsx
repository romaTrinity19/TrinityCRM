import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { withDrawer } from "../(components)/drawer";

type RootDrawerParamList = {
  Dashboard: undefined;
  CreateNewLeadForm: undefined;
  NewLeads: undefined;
};
const CreateNewLeadForm = () => {
  const [formData, setFormData] = useState({
    opportunity: "",
    leadNumber: "00419",
    leadName: "",
    email: "abc@gmail.com",
    contact: "",
    whatsapp: "",
    walkinDate: "05/20/2025",
    leadSource: "",
    leadAgent: "",
    product: "",
    state: "",
    amount: "",
    sendWhatsApp: false,
    sendMail: false,
    notes: "",
  });

  const handleChange = (key: any, value: any) => {
    setFormData({ ...formData, [key]: value });
  };
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedLeadAgent, setSelectedLeadAgent] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedState, setSelectedState] = useState("");
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient colors={["#5975D9", "#070557"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Create New Lead</Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <View style={{ paddingHorizontal: 18, paddingTop: 15 }}>
        <Text style={styles.label}>Opportunity *</Text>
        <TextInput
          style={styles.inputMultiline}
          multiline
          numberOfLines={3}
          value={formData.opportunity}
          onChangeText={(text) => handleChange("opportunity", text)}
        />

        <Text style={styles.label}>Lead Number</Text>
        <TextInput
          style={styles.input}
          value={formData.leadNumber}
          onChangeText={(text) => handleChange("leadNumber", text)}
        />

        <Text style={styles.label}>Lead Full Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Lead Full Name"
          value={formData.leadName}
          onChangeText={(text) => handleChange("leadName", text)}
        />

        <Text style={styles.label}>Email ID</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleChange("email", text)}
        />

        <Text style={styles.label}>Contact Number *</Text>
        <TextInput
          style={styles.input}
          value={formData.contact}
          onChangeText={(text) => handleChange("contact", text)}
        />

        <Text style={styles.label}>WhatsApp Number</Text>
        <TextInput
          style={styles.input}
          value={formData.whatsapp}
          onChangeText={(text) => handleChange("whatsapp", text)}
        />

        <Text style={styles.label}>Walkin Date *</Text>
        <TextInput
          style={styles.input}
          value={formData.walkinDate}
          onChangeText={(text) => handleChange("walkinDate", text)}
        />

        <Text style={styles.label}>Lead Source</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedSource}
            onValueChange={(itemValue) => setSelectedSource(itemValue)}
          >
            <Picker.Item label="--Select Source--" value="" />
            <Picker.Item label="Source 1" value="Source1" />
            <Picker.Item label="Source 2" value="Source2" />
          </Picker>
        </View>

        <Text style={styles.label}>Lead Agent</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedLeadAgent}
            onValueChange={(itemValue) => setSelectedLeadAgent(itemValue)}
          >
            <Picker.Item label="--Select Lead Agent--" value="" />
            <Picker.Item label="Lead Agent 1" value="Lead Agent1" />
            <Picker.Item label="Lead Agent 2" value="Lead Agent2" />
          </Picker>
        </View>

        <Text style={styles.label}>Product/Service *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedService}
            onValueChange={(itemValue) => setSelectedService(itemValue)}
          >
            <Picker.Item label="--Select--" value="" />
            <Picker.Item label="Service 1" value="Service1" />
            <Picker.Item label="Service 2" value="Service2" />
          </Picker>
        </View>

        <Text style={styles.label}>State</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedState}
            onValueChange={(itemValue) => setSelectedState(itemValue)}
          >
            <Picker.Item label="--Select--" value="" />
            <Picker.Item label="State 1" value="State1" />
            <Picker.Item label="State 2" value="State2" />
          </Picker>
        </View>

        <Text style={styles.label}>Estimate Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Amount"
          keyboardType="numeric"
          value={formData.amount}
          onChangeText={(text) => handleChange("amount", text)}
        />

        <View style={styles.checkboxContainer}>
          <Switch
            value={formData.sendWhatsApp}
            onValueChange={(value) => handleChange("sendWhatsApp", value)}
          />
          <Text style={styles.checkboxLabel}>Send WhatsApp Message</Text>

          <Switch
            value={formData.sendMail}
            onValueChange={(value) => handleChange("sendMail", value)}
          />
          <Text style={styles.checkboxLabel}>Send Mail</Text>
        </View>

        <Text style={styles.label}>Internal Notes</Text>
        <TextInput
          style={styles.inputMultiline}
          placeholder="Description...."
          multiline
          numberOfLines={3}
          value={formData.notes}
          onChangeText={(text) => handleChange("notes", text)}
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default withDrawer(CreateNewLeadForm, "CreateNewLeadForm");

const styles = StyleSheet.create({
  container: {
    paddingVertical: 25,
    backgroundColor: "#f7f9fc",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  pickerContainer: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 16,
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
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    color: "#000",
  },
  input: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputMultiline: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlignVertical: "top",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  checkboxLabel: {
    marginRight: 16,
  },
  button: {
    backgroundColor: "#001b5e",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});



// import React from "react";
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
// import { LinearGradient } from "expo-linear-gradient";
// import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

// export default function AttendanceDashboard() {
//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       {/* Date Header */}
//       <View style={styles.dateCard}>
//         <View style={styles.dateRow}>
//           <Text style={styles.dateNumber}>
//   27
//   <Text style={styles.sup}>th</Text>
// </Text>

//           <View style={styles.dateDetails}>
//             <Text style={styles.dayText}>Wednesday</Text>
//             <Text style={styles.monthText}>August 2019</Text>
//           </View>
//         </View>
//         <View style={styles.weekStatus}>
//           {["M", "T", "W", "T", "F"].map((d, i) => (
//             <View
//               key={i}
//               style={[
//                 styles.dayCircle,
//                 i === 2 ? styles.activeDay : i === 1 ? styles.leaveDay : {},
//               ]}
//             >
//               <Text style={styles.dayLabel}>{d}</Text>
//             </View>
//           ))}
//         </View>
//       </View>

//       {/* Circular Stats */}
//       <View style={styles.statRow}>
//         <View style={styles.statCircle}>
//           <Text style={styles.statNumber}>83%</Text>
//           <Text style={styles.statLabel}>Attendance</Text>
//         </View>
//         <View style={styles.statCircle}>
//           <Text style={styles.statNumber}>03</Text>
//           <Text style={styles.statLabel}>Leave Taken</Text>
//         </View>
//         <View style={styles.statCircle}>
//           <Text style={styles.statNumber}>23</Text>
//           <Text style={styles.statLabel}>Ongoing Days</Text>
//         </View>
//       </View>

//       {/* Grid Options */}
//       <View style={styles.grid}>
//         {[
//           { label: "Ask Leave", icon: "calendar-minus" },
//           { label: "Leaderboard", icon: "trophy" },
//           { label: "News", icon: "newspaper" },
//           { label: "Predictor", icon: "chart-line" },
//           { label: "Friends", icon: "account-group" },
//           { label: "Assignments", icon: "file-document-outline" },
//         ].map((item, index) => (
//           <TouchableOpacity key={index} style={styles.gridItem}>
//             <MaterialCommunityIcons name={item.icon} size={30} color="#5975D9" />
//             <Text style={styles.gridLabel}>{item.label}</Text>
//           </TouchableOpacity>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: "#f3f5fb",
//   },
//   dateCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 20,
//     elevation: 3,
//   },
//   sup: {
//   fontSize: 12,
//   lineHeight: 24,
//   textAlignVertical: "top",
//   color: "#5975D9",
// },

//   dateRow: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   dateNumber: {
//     fontSize: 36,
//     color: "#5975D9",
//     fontWeight: "bold",
//   },
//   dateDetails: {
//     marginLeft: 10,
//   },
//   dayText: {
//     fontSize: 16,
//     color: "#333",
//   },
//   monthText: {
//     fontSize: 14,
//     color: "#888",
//   },
//   weekStatus: {
//     flexDirection: "row",
//     marginTop: 20,
//     justifyContent: "space-between",
//   },
//   dayCircle: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: "#e0e0e0",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   activeDay: {
//     backgroundColor: "#5975D9",
//   },
//   leaveDay: {
//     backgroundColor: "#FFBABA",
//   },
//   dayLabel: {
//     color: "#fff",
//     fontWeight: "bold",
//   },
//   statRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 20,
//   },
//   statCircle: {
//     width: "30%",
//     aspectRatio: 1,
//     backgroundColor: "#fff",
//     borderRadius: 100,
//     justifyContent: "center",
//     alignItems: "center",
//     elevation: 2,
//   },
//   statNumber: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#5975D9",
//   },
//   statLabel: {
//     fontSize: 12,
//     color: "#888",
//     marginTop: 4,
//   },
//   grid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   gridItem: {
//     width: "30%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 15,
//     alignItems: "center",
//     elevation: 2,
//   },
//   gridLabel: {
//     fontSize: 12,
//     marginTop: 8,
//     textAlign: "center",
//     color: "#444",
//   },
// });

