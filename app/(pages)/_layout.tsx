import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Animated } from "react-native";

export default function MainLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#3d40b1",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          backgroundColor: "#fff",
          position: "absolute",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 5,
          elevation: 10,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = "home";
          switch (route.name) {
            case "home":
              iconName = focused ? "home" : "home-outline";
              break;
            case "profile":
              iconName = focused ? "person" : "person-outline";
              break;
            case "newLeads":
              iconName = focused ? "grid" : "grid-outline";
              break;
            case "leads":
              iconName = focused ? "list" : "list-outline";
              break;
            case "message":
              iconName = focused ? "chatbubbles" : "chatbubbles-outline";
              break;
          }

          const scaleValue = new Animated.Value(focused ? 1.2 : 1);

          Animated.spring(scaleValue, {
            toValue: focused ? 1.2 : 1,
            friction: 4,
            useNativeDriver: true,
          }).start();

          return (
            <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
              <Ionicons name={iconName} size={size} color={color} />
            </Animated.View>
          );
        },
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
      <Tabs.Screen name="newLeads" />
      <Tabs.Screen name="leads" />
      <Tabs.Screen name="message" />
    </Tabs>
  );
}
