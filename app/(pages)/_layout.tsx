import { useColorScheme } from "@/hooks/useColorScheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";


export default function MainLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={({ route }: { route: { name: string } }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#3d40b1",
        tabBarInactiveTintColor: "gray",
        tabBarIcon: ({
          focused,
          color,
          size,
        }: {
          focused: boolean;
          color: string;
          size: number;
        }) => {
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
          return <Ionicons name={iconName} size={size} color={color} />;
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