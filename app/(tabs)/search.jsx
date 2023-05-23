import { useState } from "react";
import { StyleSheet } from "react-native";
import { Searchbar } from "react-native-paper";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

function TabsSearch() {
  const [query, setQuery] = useState("");

  function onChangeSearch(query) {
    setQuery(query);
  }

  return (
    <Searchbar
      placeholder="Search for tabs"
      onChangeText={onChangeSearch}
      value={query}
    />
  );
}

export default function SearchPage() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TabsSearch />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
});
