// import { Ionicons } from "@expo/vector-icons";
// import { DrawerNavigationProp } from "@react-navigation/drawer";
// import { LinearGradient } from "expo-linear-gradient";
// import { router, useNavigation } from "expo-router";
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   Button,
//   ScrollView,
//   StyleSheet,
//   TouchableOpacity,
// } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { withDrawer } from "../drawer";
// import { RichEditor, RichToolbar } from "react-native-pell-rich-editor";


// type RootDrawerParamList = {
//   TemplateEntryScreen: undefined;
// };

// const TemplateEntryScreen = () => {
//   const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();

//   const [templateName, setTemplateName] = useState("");
//   const [templateContent, setTemplateContent] = useState("");

//   const handleSave = () => {
//     // Handle save logic here
//     console.log("Template Name!", templateName);
//     console.log("Template Content!", templateContent);
//   };

//   const handleReset = () => {
//     setTemplateName("");
//     setTemplateContent("");
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f6ff" }}>
//       <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
//         <View style={styles.headerContent}>
//           <TouchableOpacity onPress={() => router.back()}>
//             <Ionicons name="arrow-back" color="#fff" size={24} />
//           </TouchableOpacity>

//           <Text style={styles.headerTitle}>Template Master</Text>
//           <TouchableOpacity onPress={() => navigation.openDrawer()}>
//             <Ionicons name="menu" color="#fff" size={24} />
//           </TouchableOpacity>
//         </View>
//       </LinearGradient>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.heading}>TemplateEntry</Text>

//         <View style={styles.form}>
//           <Text style={styles.label}>
//             Template Name <Text style={{ color: "red" }}>* </Text>
//           </Text>
//           <TextInput
//             style={styles.input}
//             value={templateName}
//             onChangeText={(text) => setTemplateName(text)}
//             placeholder="Enter Template Name"
//           />

//           <Text style={styles.label}>
//             Template Content <Text style={{ color: "red" }}>* </Text>
//           </Text>
//           <TextInput
//             style={[styles.input, styles.textarea]}
//             value={templateContent}
//             onChangeText={(text) => setTemplateContent(text)}
//             placeholder="Enter Template Content or Description"
//             multiline
//             numberOfLines={10}
//           />

//           <View style={styles.buttonContainer}>
//             <Button title="Save" onPress={handleSave} color="#2D4491" />
//             <View style={{ width: 10 }} />
//             <Button title="Reset" onPress={handleReset} color="#ff4d4d" />
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default withDrawer(TemplateEntryScreen, "TemplateEntryScreen");
// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: "#f3f5fb",
//     flexGrow: 1,
//   },
//   header: {
//     paddingVertical: 16,
//     paddingHorizontal: 12,
//   },
//   headerContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//   },
//   headerTitle: {
//     color: "#fff",
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   heading: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#2D4491",
//     alignSelf: "center",
//   },
//   form: {
//     backgroundColor: "#ffffff",
//     padding: 20,
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     shadowOffset: { width: 0, height: 2 },
//     elevation: 2,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 10,
//     color: "#2D4491",
//     fontWeight: "500",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#2D4491",
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 20,
//     backgroundColor: "#ffffff",
//   },
//   textarea: {
//     height: 150,
//     textAlignVertical: "top",
//   },
//   buttonContainer: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     marginTop: 20,
//   },
// });


import { Ionicons } from "@expo/vector-icons";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { LinearGradient } from "expo-linear-gradient";
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { withDrawer } from "../drawer";

type RootDrawerParamList = {
  TemplateEntryScreen: undefined;
};

type Template = {
  id: string;
  name: string;
  content: string;
};

const TemplateEntryScreen = () => {
  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const [templateName, setTemplateName] = useState("");
  const [templateContent, setTemplateContent] = useState("");
  const [templates, setTemplates] = useState<Template[]>( []);

  const handleSave = () => {
    if (templateName && templateContent) {
      const newTemplate = { id: Date.now().toString(), name: templateName, content: templateContent };
      setTemplates([newTemplate, ...templates]);
      setTemplateName("");
      setTemplateContent("");
    } else {
      Alert.alert("Please fill all fields.");
    }
  };

  const handleReset = () => {
    setTemplateName("");
    setTemplateContent("");
  };

  const handleEdit = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (template) {
      setTemplateName(template.name);
      setTemplateContent(template.content);
      setTemplates(templates.filter((t) => t.id !== id)); //Remove and put back after edit
    }
  };

  const handleDelete = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id)); 
  };

  const handleWhatsapp = (template: Template) => {
    Alert.alert("Send to WhatsApp", `Here’s your template:\n\n${template.name}\n\n${template.content}`);

    // Here you can integrate sharing to WhatsApp if required
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f6ff" }}>
      <LinearGradient colors={["#5975D9", "#1F40B5"]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" color="#fff" size={24} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Template Master
          </Text>

          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>
          TemplateEntry
        </Text>

        {/* Form Section */}
        <View style={styles.form}>
          <Text style={styles.label}>
            Template Name <Text style={{ color: "red" }}>* </Text>
          </Text>
          <TextInput
            style={styles.input}
            value={templateName}
            onChangeText={(text) => setTemplateName(text)}
            placeholder="Enter Template Name"
          />

          <Text style={styles.label}>
            Template Content <Text style={{ color: "red" }}>* </Text>
          </Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={templateContent}
            onChangeText={(text) => setTemplateContent(text)}
            placeholder="Enter Template Content or Description"
            multiline
            numberOfLines={10}
          />

          <View style={styles.buttonContainer}>
            <Button title="Save" onPress={handleSave} color="#2D4491" />
            <View style={{ width: 10 }} />
            <Button title="Reset" onPress={handleReset} color="#ff4d4d" />
          </View>
        </View>

        {/* List Section */}
        {templates.length > 0 && (
          <View style={styles.list}>
            <Text style={styles.subHeading}>
              Saved Templates
            </Text>

            {templates.map((template) => (
              <View key={template.id} style={styles.card}>
                <View style={styles.cardContent}>
                   <Text style={styles.cardTitle}>
                     {template.name}
                   </Text>
                   <Text style={styles.cardText}>
                     {template.content}
                   </Text>
                 </View>

                 <View style={styles.actions}>
                   <TouchableOpacity onPress={() => handleEdit(template.id)} style={styles.actionBtn}>
                     <Ionicons name="pencil" size={20} color="#5975D9" />
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => handleDelete(template.id)} style={styles.actionBtn}>
                     <Ionicons name="trash" size={20} color="#ff4d4d" />
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => handleWhatsapp(template)} style={styles.actionBtn}>
                     <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                   </TouchableOpacity>
                 </View>
               </View>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default withDrawer(TemplateEntryScreen, "TemplateEntryScreen");

const styles = StyleSheet.create({ 
  container: {
    padding: 20,
    backgroundColor: "#f3f5fb",
    flexGrow: 1,
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
    fontWeight: "bold",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2D4491",
    alignSelf: "center",
  },
  form: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: "#2D4491",
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#2D4491",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#ffffff",
  },
  textarea: {
    height: 150,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 20,
  },
  list: {
    marginTop: 20,
  },
  subHeading: {
    fontSize: 18,
    color: "#2D4491",
    marginBottom: 10,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 15,
  },
  cardContent: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2D4491",
    marginBottom: 5,
  },
  cardText: {
    color: "#666",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  actionBtn: {
    padding: 5,
    backgroundColor: "#edf1ff",
    borderRadius: 5,
  },
});


