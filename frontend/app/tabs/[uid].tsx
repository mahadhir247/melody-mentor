import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { List } from "react-native-paper";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Svg, { Path, Circle, Text as TextSvg, G } from "react-native-svg";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";
import Spinner from "react-native-loading-spinner-overlay";
import { Stack, useRouter, useSearchParams } from "expo-router";
import { FlatList } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { downloadAudioJSON } from "./download";

export default function Tabs() {
  const router = useRouter();
  const { uid } = useSearchParams<{ uid: string }>();

  const [audio, setAudio] = useState<Audio.Sound>();
  const [loading, setLoading] = useState<boolean>(true);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [jsonUrl, setJsonUrl] = useState<string>("");
  const [json, setJSON] = useState<SongData>();
  const [inst, setInst] = useState<Instrument>({
    id: 0,
    name: "",
  });

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });

    setAudio(sound);
    console.log("Playing");
    await sound.playAsync();
  }

  async function stopSound() {
    console.log("Stopping");
    await audio?.stopAsync();
  }

  useEffect(() => {
    async function readJSONData(jsonUrl: string) {
      fetch(jsonUrl)
        .then((response) => response.json())
        .then((json) => {
          console.log(json["songName"]);
          setJSON(json);
          setInst({
            id: 0,
            name: json.tracks[0].instrument,
          });
        })
        .catch((e) => console.error(`Error occured reading JSON data (${e})`));
    }

    if (audioUrl == "" || jsonUrl == "") {
      downloadAudioJSON(uid as string)
        .then(({ audioUrl, jsonUrl }) => {
          setAudioUrl(audioUrl);
          setJsonUrl(jsonUrl);
          readJSONData(jsonUrl);
        })
        .catch((e) => {
          console.error(`Error occured when downloading audio/json (${e})`);
          router.back();
        });
    }

    if (json !== undefined) {
      setLoading(false);
    }

    return audio
      ? () => {
          console.log("Unloading Sound");
          audio.unloadAsync();
        }
      : undefined;
  }, [audio, json]);

  function getArrayOfMeasures() {
    let res = [];
    //If json not loaded return null
    if (loading) {
      return [];
    }

    for (let i = 1; i <= json!.tracks[0].measures.length; i++) {
      res.push(i);
    }

    return res;
  }

  function getListElements() {
    //If json not loaded return null
    if (loading) {
      return [];
    }

    let res = [];
    for (let i = 0; i < json!.tracks.length; i++) {
      let instrument: Instrument = {
        id: i,
        name: json!.tracks[i].instrument,
      };
      res.push(
        <List.Item
          title={instrument.name}
          onPress={() => setInst(instrument)}
          key={i}
        />
      );
    }
    return res;
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
        <List.Section>
          <List.Accordion title={inst.name}>{getListElements()}</List.Accordion>
        </List.Section>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeAreaView}>
        <Spinner visible={loading} />

        <View style={styles.container}>
          <FlatList
            data={getArrayOfMeasures()}
            renderItem={({ item }) => (
              <Measure json={json} number={item} instID={inst.id} />
            )}
            ListHeaderComponent={
              <Header
                title={!loading ? json!.songName : ""}
                artist={!loading ? json!.artist : ""}
              />
            }
            extraData={json}
            keyExtractor={(item, index) => index.toString()}
          />
          <TouchableOpacity onPress={playSound} style={styles.playButton}>
            <Ionicons name="play-outline" size={32} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={stopSound} style={styles.stopButton}>
            <Ionicons name="stop-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function Measure({ json, number, instID }: MeasureProps) {
  if (typeof json == "undefined") {
    return <></>;
  }

  function numberBackground(x: number, y: number, fretNum: number) {
    if (fretNum >= 10) {
      return <Circle cx={x + 8} cy={y - 5} r="7" fill="white" key="1" />;
    } else {
      return <Circle cx={x + 4} cy={y - 5} r="5" fill="white" key="1" />;
    }
  }

  const staffWidth: number = 370;
  const xStart = 6; //x coordinate of start of measure
  const padding: number = 20; //padding between first/last note and bar line
  const noteStaff = staffWidth - 2 * padding; // area where notes occupy

  let track = json.tracks[instID];
  let measure = track.measures[number - 1];
  let voice = measure.voices[0];
  let tabNumArray: JSX.Element[] = [];

  let x = xStart + padding;
  let key = 0;
  for (let beat of voice.beats) {
    let beatValue = beat.value;
    for (let note of beat.notes) {
      let y = 5 + 14 * (note.string - 1);
      let value = note.value;

      tabNumArray.push(
        <G key={key}>
          {numberBackground(x, y, value)}
          <TextSvg x={x} y={y} fill="black" key="2" fontSize="105%">
            {value}
          </TextSvg>
        </G>
      );
      key++;
    }
    x += (1 / beatValue) * noteStaff;
  }

  return (
    <View style={styles.measureContainer}>
      <Svg>
        <Staff width={staffWidth} />
        {tabNumArray}
      </Svg>
    </View>
  );
}

type StaffProps = {
  width: number;
};

function Staff({ width }: StaffProps) {
  let height = 70;
  let padding = 10;
  let d = "";

  //Draw horizontal lines
  let staffWidth = width - 2 * padding;
  let y = 0;
  let x = padding;
  for (let i = 0; i < 6; i++) {
    d += `M${x},${y} H${staffWidth} `;
    y += height / 5;
  }

  //Draw vertical lines
  d += `M${padding},0 V${height} M${staffWidth},0 V${height}`;

  return <Path d={d} stroke="black" strokeWidth="1" />;
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
    maxHeight: 100,
    margin: 10,
    paddingTop: 10,
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
  playButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "dodgerblue",
    borderRadius: 100,
  },
  stopButton: {
    position: "absolute",
    bottom: 70,
    right: 10,
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "dodgerblue",
    borderRadius: 100,
  },
});
