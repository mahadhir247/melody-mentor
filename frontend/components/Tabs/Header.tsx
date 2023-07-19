import { StyleSheet, Text, View } from "react-native";
import BackButton from "../BackButton";
import { List } from "react-native-paper";

interface HeaderProps {
  songData: SongData | undefined;
  backOnPress: () => void;
}

export default function Header({ songData, backOnPress }: HeaderProps) {
  let headerText = "";
  if (typeof songData != "undefined") {
    headerText = `${songData.artist} - ${songData.songName}`;
  }

  return (
    <View style={styles.header}>
      <View style={styles.backButton}>
        <BackButton onPress={backOnPress} />
      </View>
      <View style={styles.headerTitle}>
        <Text style={styles.titleText}>{headerText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
  },
  backButton: {
    marginLeft: 10,
  },
  headerTitle: {
    flex: 1,
    paddingLeft: 20,
    justifyContent: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
