import { useEffect, useState } from "react";
import { StyleSheet, FlatList, View, Text, TouchableOpacity } from "react-native";
import { Button, Searchbar, Card, Title, Checkbox } from "react-native-paper";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { FIRESTORE_DB } from "../../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import GENRES from "./filter/genres/genreList";
import CHORDS from "./filter/chords/chordsList";
import MultiSlider from "@ptomasroos/react-native-multi-slider";

type Song = {
  id: string;
  title: string;
  artist: string;
  genres: string;
  chords: string[];
  difficulty: number;
};
type SongProp = {
  title: string;
  artist: string;
};

type GenreProps = {
  title: string;
  id: string;
};

type ChordProps = {
  title: string;
  id: string;
};

function TabsSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);

  useEffect(() => {
    const songRef = collection(FIRESTORE_DB, "songs");

    const subscriber = onSnapshot(songRef, {
      next: (snapshot) => {
        const songs: Song[] = [];
        snapshot.docs.forEach((doc) => {
          songs.push({
            id: doc.id,
            title: doc.get("title"),
            artist: doc.get("artist"),
            genres: doc.get("genres"),
            chords: doc.get("chords"),
            difficulty: doc.get("difficulty")
          });
        });
        setSongs(songs);
        // setFilteredSongs(songs);
      },
    });

    return () => subscriber();
  }, []);

  const [genres, setGenres] = useState<GenreProps[]>([]);
  const toggleGenres = (id: GenreProps) => {
    if (genres.includes(id)) {
      setGenres(genres.filter((item) => item !== id));
    } else {
      setGenres([...genres, id]);
    }
  };

  const [chords, setChords] = useState<ChordProps[]>([]);
  const toggleChords = (id: ChordProps) => {
    if (chords.includes(id)) {
      setChords(chords.filter((item) => item !== id));
    } else {
      setChords([...chords, id]);
    }
  };

  const [difficulty, setDifficulty] = useState([]);
  const onDifficultyChange = (values: number[]) => setDifficulty(values);

  const filterByGenres = (array: Song[]) => {
    if (genres.length > 0) {
      let tempArr = genres.map((id: GenreProps) => {
        let temp = array.filter((item) => item.genres.includes(id.title));
        return temp;
      });

      const uniqueGenres = Array.from(new Set(tempArr.flat()));
      return uniqueGenres;
    } else {
      return array;
    }
  }

  const filterByChords = (array: Song[]) => {
    if (chords.length > 0) {
      let tempArr = chords.map((id: ChordProps) => {
        let temp = array.filter((item) => item.chords.includes(id.title));
        return temp;
      });

      const uniqueChords = Array.from(new Set(tempArr.flat()));
      return uniqueChords;
    } else {
      return array;
    }
  }

  const filterByDifficulty = (array: Song[]) => {
    return array.filter((item) => item.difficulty >= difficulty[0] && item.difficulty <= difficulty[1]);
  }

  const applyFilters = (array: Song[]) => {
    const filteredGenres = filterByGenres(array);
    const filteredChords = filterByChords(filteredGenres);
    const filteredDifficulty = filterByDifficulty(filteredChords);
    setFilteredSongs(filteredDifficulty);
  }

  function filterData(item: Song) {
    if (
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.artist.toLowerCase().includes(query.toLowerCase())
    ) {
      return <Item title={item.title} artist={item.artist} />;
    }

    return null;
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
          onPress={() => router.push("search/filter")}
        />
      </View>
      <FlatList
        data={GENRES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {toggleGenres(item);}}>
            <Card mode="contained">
              <Card.Content style={styles.content}>
                <Checkbox status={genres.includes(item) ? "checked" : "unchecked"} />
                <Title>{item.title}</Title>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <FlatList
        data={CHORDS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => {toggleChords(item);}}>
            <Card mode="contained">
              <Card.Content style={styles.content}>
                <Checkbox
                  status={chords.includes(item) ? "checked" : "unchecked"}
                />
                <Title>{item.title}</Title>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      <Card>
        <Card.Content style={styles.sliderContent}>
          <Title>Difficulty</Title>
          <MultiSlider
            values={[1, 5]}
            onValuesChange={onDifficultyChange}
            min={1}
            max={5}
            snapped
            allowOverlap
            enableLabel
          />
        </Card.Content>
      </Card>
      <Button mode="contained" onPress={() => applyFilters(songs)}>Apply Filters</Button>
      <FlatList
        data={filteredSongs}
        renderItem={({ item }) => filterData(item)}
        contentContainerStyle={styles.flatList}
      />
    </View>
  );
}

function Item({ title, artist }: SongProp) {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{artist}</Text>
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
  content: {
    flexDirection: "row",
    backgroundColor: "white",
  },
  sliderContent: {
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
  }
});