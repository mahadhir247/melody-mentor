import { Tabs } from "expo-router";

export default function Root() {
  return (
    <Tabs>
      <Tabs.Screen
        name="guitarTab"
        options={{ title: "Tabs", headerShown: false }}
      />
      <Tabs.Screen
        name="search"
        options={{ title: "Search", headerShown: false }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", headerShown: false }}
      />
    </Tabs>
  );
}
