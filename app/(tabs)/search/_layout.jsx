import { Stack } from "expo-router";

export default function Root() {
  return (
    <Stack>
      <Stack.Screen name="searchTab" options={{ headerShown: false }} />
      <Stack.Screen name="filter" options={{ title: "Filter" }} />
      <Stack.Screen name="chords" options={{ title: "Chords" }} />
      <Stack.Screen name="genres" options={{ title: "Genres" }} />
    </Stack>
  );
}
