import { Stack } from "expo-router";
import { Provider } from "../context/FilterContext";

export default function Root() {
  return (
    <Provider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="filter"
          options={{ headerShown: true, title: "Filter" }}
        />
        <Stack.Screen
          name="filter-options/chords"
          options={{ headerShown: true, title: "Chords" }}
        />
        <Stack.Screen
          name="filter-options/genres"
          options={{ headerShown: true, title: "Genres" }}
        />
      </Stack>
    </Provider>
  );
}
