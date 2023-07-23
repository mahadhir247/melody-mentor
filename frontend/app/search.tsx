import { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Text } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { FIRESTORE_DB } from "../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useRouter } from "expo-router";
import { useFilterContext } from "../context/FilterContext";
import { TouchableOpacity } from "react-native-gesture-handler";

export default function SearchPage() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <TabsSearch />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function TabsSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [songsAll, setSongsAll] = useState<Song[]>([]);

  const { genres, chords, difficulty } =
    useFilterContext() as FilterContextType;

  useEffect(() => {
    const songRef = collection(FIRESTORE_DB, "songs");

    const subscriber = onSnapshot(songRef, {
      next: (snapshot) => {
        const songs: Song[] = [];
        snapshot.docs.forEach((doc) => {
          songs.push({
            uid: doc.id,
            title: doc.get("title"),
            artist: doc.get("artist"),
            genres: doc.get("genres"),
            chords: doc.get("chords"),
            difficulty: doc.get("difficulty"),
          });
        });
        setSongsAll(songs);
      },
    });

    return () => subscriber();
  }, []);

  function filterSearch(song: Song): boolean {
    return (
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase())
    );
  }

  function filterGenres(song: Song): boolean {
    if (genres.length > 0) {
      for (const genre of genres) {
        if (song.genres == genre.title) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }

  function filterChords(song: Song): boolean {
    if (chords.length > 0) {
      for (const chordProp of chords) {
        if (song.chords.includes(chordProp.title)) {
          return true;
        }
      }
      return false;
    } else {
      return true;
    }
  }

  function filterDifficulty(song: Song): boolean {
    return song.difficulty >= difficulty[0] && song.difficulty <= difficulty[1];
  }

  function filterData(item: Song): React.JSX.Element {
    if (
      filterChords(item) &&
      filterGenres(item) &&
      filterDifficulty(item) &&
      filterSearch(item)
    ) {
      return <Item {...item} />;
    }

    return <></>;
  }

  function onChangeSearch(query: string) {
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

        {/* @ts-expect-error (Problem with react native paper components?) */}
        <Button
          style={styles.filterButton}
          icon={() => <Ionicons name="filter" size={32} color="black" />}
          onPress={() => router.push("filter")}
        />
      </View>
      <FlatList
        data={songsAll}
        renderItem={({ item }) => filterData(item)}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
}

function Item({ title, artist, uid }: Song) {
  return (
    <View style={styles.itemContainer}>
      <Link
        href={{
          pathname: `/${uid}`,
        }}
        asChild
      >
        <TouchableOpacity>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{artist}</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchFilterContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-between",
  },
  searchBar: {
    borderRadius: 0,
    flex: 1,
    backgroundColor: "white",
  },
  filterButton: {
    alignSelf: "center",
  },
  flatList: {
    paddingTop: 6,
    paddingBottom: 500,
  },
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
  content: {
    flexDirection: "row",
    backgroundColor: "white",
  },
  sliderContent: {
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
  },
});
