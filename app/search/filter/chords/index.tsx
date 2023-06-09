import { useState } from "react";
import { View, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Card, Checkbox, Title } from "react-native-paper";
import CHORDS from "./chordsList";

type ChordProps = {
  title: string;
  id: string;
};

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

function Item({ title, id }: ChordProps) {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const isChecked = (id: string) => {
    return checkedItems.includes(id);
  };

  const toggleItem = (id: string) => {
    if (isChecked(id)) {
      setCheckedItems(checkedItems.filter((item) => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  return (
    <TouchableOpacity onPress={() => toggleItem(id)}>
      <Card mode="contained">
        <Card.Content style={styles.content}>
          <Checkbox status={isChecked(id) ? "checked" : "unchecked"} />
          <Title>{title}</Title>
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
