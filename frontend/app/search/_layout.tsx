import { Stack } from "expo-router";

export default function Root() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="filter/index" options={{ title: "Filter" }} />
      <Stack.Screen name="filter/chords/index" options={{ title: "Chords" }} />
      <Stack.Screen name="filter/genres/index" options={{ title: "Genres" }} />
    </Stack>
  );
}
