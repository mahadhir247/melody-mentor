import { View, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Card, Checkbox, Title } from "react-native-paper";
import GENRES from "./genreList";
import { useFilterContext } from "../../context/FilterContext";

export default function Genres() {
  return (
    <View style={styles.root}>
      <FlatList
        data={GENRES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item title={item.title} id={item.id} />}
      />
    </View>
  );
}

function Item(genre: GenreProps) {
  const { setGenres, genres } = useFilterContext() as FilterContextType;

  const isChecked = (genre: GenreProps) => {
    return genres.filter((g) => g.title === genre.title).length > 0;
  };

  const toggleGenres = (genre: GenreProps) => {
    if (isChecked(genre)) {
      setGenres(genres.filter((g) => g.title !== genre.title));
    } else {
      setGenres([...genres, genre]);
    }
  };

  return (
    <TouchableOpacity onPress={() => toggleGenres(genre)}>
      <Card mode="contained">
        <Card.Content style={styles.content}>
          <Checkbox status={isChecked(genre) ? "checked" : "unchecked"} />
          <Title>{genre.title}</Title>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  content: {
    flexDirection: "row",
    backgroundColor: "white",
  },
});
