import { View, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Card, Checkbox, Title } from "react-native-paper";
import CHORDS from "./chordsList";
import { useFilter } from "../../filterContext";

export default function Chords() {
  return (
    <View style={styles.root}>
      <FlatList
        data={CHORDS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Item title={item.title} id={item.id} />}
      />
    </View>
  );
}

function Item(chord: ChordProps) {
  const { setChords, chords } = useFilter() as FilterContextType;

  const isChecked = (chord: ChordProps) => {
    return chords.filter(c => c.title === chord.title).length > 0;
  };

  const toggleChords = (chord: ChordProps) => {
    if (isChecked(chord)) {
      setChords(chords.filter((c) => c.title !== chord.title));
    } else {
      setChords([...chords, chord]);
    }
  };

  return (
    <TouchableOpacity onPress={() => toggleChords(chord)}>
      <Card mode="contained">
        <Card.Content style={styles.content}>
          <Checkbox status={isChecked(chord) ? "checked" : "unchecked"} />
          <Title>{chord.title}</Title>
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
    backgroundColor: "white",
    flexDirection: "row",
  },
});
