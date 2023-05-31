import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Root() {
  return (
    <Tabs>
      <Tabs.Screen
        name="guitarTab"
        options={{
          title: "Tabs",
          headerShown: false,
          tabBarIcon: () => (
            <Ionicons name="musical-notes" size={24} color="black" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: () => <Ionicons name="search" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="profileTab"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: () => <Ionicons name="person" size={24} color="black" />,
        }}
      />
    </Tabs>
  );
}
