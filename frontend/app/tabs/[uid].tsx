import { StyleSheet, Text, View, Button } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useEffect, useState } from "react";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";
import Spinner from "react-native-loading-spinner-overlay";
import { useLocalSearchParams, useSearchParams } from "expo-router";

export default function Tabs() {
  const { uid } = useSearchParams<{ uid: string }>();
  const { title, artist } = useLocalSearchParams<{
    title: string;
    artist: string;
  }>();

  const fileDir = FileSystem.cacheDirectory + "melodymentor/";
  const fileUri = fileDir + uid + ".wav";
  const firebaseStorageURL = "audio_files/";

  const [audio, setAudio] = useState<Audio.Sound>();
  const [url, setURL] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(false);

  const storage = getStorage();

  async function playSound() {
    await downloadFile(url as string);

    const { sound } = await Audio.Sound.createAsync({ uri: fileUri });

    setAudio(sound);
    console.log("Playing");
    await sound.playAsync();
  }

  async function stopSound() {
    console.log("Stopping");
    await audio?.stopAsync();
  }

  useEffect(() => {
    async function getAudioData() {
      let storageRef = ref(storage, firebaseStorageURL + uid + ".wav");

      getDownloadURL(storageRef)
        .then((url) => {
          setURL(url);
        })
        .catch((error) => {
          console.log(error);
        });
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
    try {
      const dirInfo = await FileSystem.getInfoAsync(fileDir);
      const downloadResumable = FileSystem.createDownloadResumable(
        url,
        fileUri
      );

      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(fileDir, { intermediates: true });
      }

      if (!downloaded) {
        console.log("Downloading File...");
        setLoading(true);

        const { uri } =
          (await downloadResumable.downloadAsync()) as FileSystem.FileSystemDownloadResult;

        console.log("Finished downloading to ", uri);
        setLoading(false);
        setDownloaded(true);
      } else {
        console.log("File already downloaded!");
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaView}>
        <Spinner visible={loading} />

        <Header title={title || ""} artist={artist || ""} />
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
function Header({ title, artist }: SongProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTitle}>
        <Text style={styles.titleText}>{`${title} - ${artist}`}</Text>
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
