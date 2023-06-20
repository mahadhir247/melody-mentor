import { StyleSheet, Text, View, Button, Alert } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";

export default function Tabs() {
  const fileDir = FileSystem.cacheDirectory + "tabs/";
  const fileUri = fileDir + "Oasis - Wonderwall.wav";
  const [audio, setAudio] = useState<Audio.Sound>();
  const [url, setURL] = useState<string>();

  const storage = getStorage();

  async function playSound() {
    await downloadFile(url as string);
    const uri = FileSystem.cacheDirectory + "Oasis - Wonderwall.wav";

    const { sound } = await Audio.Sound.createAsync({ uri: uri });
    setAudio(sound);
    await sound.playAsync();
  }

  async function stopSound() {
    await audio?.stopAsync();
  }

  useEffect(() => {
    async function getAudioData() {
      let audioRef = ref(storage, "backend/output/Oasis - Wonderwall.wav");
      const audioInfo = await getDownloadURL(audioRef);
      setURL(audioInfo);
    }

    getAudioData();

    return audio
      ? () => {
          console.log("Unloading Sound");
          audio.unloadAsync();
        }
      : undefined;
  }, [audio]);

  async function downloadFile(url: string) {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "This app requires access to your media library."
      );
      return;
    }

    const saveFile = async (fileUri: string) => {
      const directoryInfo = await FileSystem.getInfoAsync(fileUri);
      if (!directoryInfo.exists) {
        await FileSystem.makeDirectoryAsync(fileUri, {
          intermediates: true,
        });
      }
    };

    console.log("Starting Download");
    FileSystem.downloadAsync(url, fileUri)
      .then(({ uri }) => {
        saveFile(uri);
      })
      .catch((e) => {
        console.error(e);
      });
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaView}>
        <Header />
        <Button title="Play" onPress={playSound} />
        <Button title="Stop" onPress={stopSound} />

        <View style={styles.container}>
          <Measure />
          <Measure />
          <Measure />
          <Measure />
          <Measure />
          <Measure />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

/**
 * Song title and bpm information
 */
function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.headerTitle}>
        <Text style={styles.titleText}>Oasis - Wonderwall</Text>
      </View>
      <View style={styles.headerBPM}>
        <Text style={styles.BPMText}>87 BPM</Text>
      </View>
    </View>
  );
}

function Measure() {
  return (
    <View style={styles.measureContainer}>
      <Svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <Path
          d="M0,0 H100 M0,20 H100 M0,40 H100 M0,60 H100 M0,80 H100 M0,100 H100 M0,0 V100 M100,0 V100"
          stroke="black"
          strokeWidth="1"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  header: {
    flex: 1,
  },
  headerTitle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerBPM: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  BPMText: {
    fontSize: 15,
  },
  container: {
    flex: 9,
  },
  measureContainer: {
    flex: 1,
    margin: 10,
    padding: 15,
  },
  measure: {
    flex: 1,
    margin: 10,
    borderWidth: 1,
    backgroundColor: "green",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
