import { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { FIRESTORE_DB } from "../../../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";

function TabsSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const songRef = collection(FIRESTORE_DB, "songs");

    const subscriber = onSnapshot(songRef, {
      next: (snapshot) => {
        const songs = [];
        snapshot.docs.forEach((doc) => {
          songs.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setSongs(songs);
      },
    });

    return () => subscriber();
  }, []);

  function filterData(item) {
    if (query === "") {
      return (
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.artist}</Text>
        </View>
      );
    }

    if (
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.artist.toLowerCase().includes(query.toLowerCase())
    ) {
      return (
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.artist}</Text>
        </View>
      );
    }
  }

  function onChangeSearch(query) {
    setQuery(query);
  }

  return (
    <View>
      <View style={styles.searchFilterContainer}>
        <Searchbar
          style={styles.searchBar}
          placeholder="Search for artists or songs"
          onChangeText={onChangeSearch}
          value={query}
        />
        <Button
          style={styles.filterButton}
          icon={() => <Ionicons name="filter" size={32} color="black" />}
          onPress={() => router.push("search/filter")}
        />
      </View>
      <FlatList
        data={songs}
        renderItem={({ item }) => filterData(item)}
        contentContainerStyle={styles.flatList}
      />
    </View>
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
  searchFilterContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent:"space-between",
  },
  searchBar: {
    borderRadius: 0,
    flex: 1,
    backgroundColor: "white",
  },
  filterButton: {
    alignSelf:"center"
  },
  flatList: {
    paddingTop: 6,
    paddingBottom: 60,
  },
  // itemContainer: {
  //   backgroundColor: "white",
  //   padding: 20,
  //   marginVertical: 6,
  //   marginHorizontal: 10,
  //   borderRadius: 25,
  //   borderColor: "black",
  //   borderWidth: 2,
  // },
  itemContainer: {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 10,
    borderColor: "black",
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
  },
});
