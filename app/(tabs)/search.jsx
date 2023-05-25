import React, { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { Searchbar } from "react-native-paper";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { FIRESTORE_DB } from "../../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";

function TabsSearch() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState([]);

  useEffect(() => {
    const songRef = collection(FIRESTORE_DB, 'songs');

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
        <View style={styles.flatlist}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.artist}</Text>         
        </View>
      );
    }

    if (item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.artist.toLowerCase().includes(query.toLowerCase())) {
      return (
        <View style={styles.flatlist}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.artist}</Text>         
        </View>
      )
    }
  }

  function onChangeSearch(query) {
    setQuery(query);
  }

  return (
    <View>
      <Searchbar
      placeholder="Search for tabs"
      onChangeText={onChangeSearch}
      value={query}
      />
      <FlatList
      data={songs}
      renderItem={({item}) => filterData(item)}
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
  flatlist: {
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 6,
    marginHorizontal: 10,
    borderRadius: 25,
    borderColor: 'black',
    borderWidth: 2
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 15,
  }
});
