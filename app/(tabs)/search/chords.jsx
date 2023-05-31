import { useState } from "react";
import { View, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { Card, Checkbox, Title } from "react-native-paper";
import CHORDS from "./chordsList";

export default function Chords() {
  const [checkedItems, setCheckedItems] = useState([]);

  const isChecked = (id) => {
    return checkedItems.includes(id);
  };

  const toggleItem = (id) => {
    if (isChecked(id)) {
      setCheckedItems(checkedItems.filter((item) => item !== id));
    } else {
      setCheckedItems([...checkedItems, id]);
    }
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={CHORDS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleItem(item.id)}>
            <Card mode="contained">
              <Card.Content style={styles.content}>
                <Checkbox
                  status={isChecked(item.id) ? "checked" : "unchecked"}
                />
                <Title>{item.title}</Title>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
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
