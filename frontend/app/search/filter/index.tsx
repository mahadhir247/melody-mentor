import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Card, Title } from "react-native-paper";
import { useRouter } from "expo-router";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import { useFilterContext } from "../filterContext";

export default function Filter() {
  const router = useRouter();
  const { setDifficulty, difficulty } = useFilterContext() as FilterContextType;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("search/filter/chords")}>
        <Card style={styles.content}>
          <Card.Content>
            <Title>Chords</Title>
          </Card.Content>
        </Card>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("search/filter/genres")}>
        <Card style={styles.content}>
          <Card.Content>
            <Title>Genres</Title>
          </Card.Content>
        </Card>
      </TouchableOpacity>

      <Card>
        <Card.Content style={styles.sliderContent}>
          <Title>Difficulty</Title>

          <MultiSlider
            values={[difficulty[0], difficulty[1]]}
            onValuesChange={(valueRange: number[]) => setDifficulty(valueRange)}
            min={1}
            max={5}
            snapped
            allowOverlap
            enableLabel
          />
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    backgroundColor: "white",
  },
  sliderContent: {
    backgroundColor: "white",
    flexDirection: "column",
    alignItems: "center",
  },
  optionsButton: {
    borderRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    justifyContent: "center",
  },
  optionsButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
});
