import { StyleSheet, View, TouchableOpacity, Dimensions } from "react-native";
import { List, PaperProvider } from "react-native-paper";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Svg, { Path, Circle, Text as TextSvg, G } from "react-native-svg";
import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import Spinner from "react-native-loading-spinner-overlay";
import { useRouter, useSearchParams } from "expo-router";
import { FlatList } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { downloadAudioJSON } from "../src/download";
import Header from "../components/Tabs/Header";

export default function Tabs() {
  const router = useRouter();
  const { uid } = useSearchParams<{ uid: string }>();
  const scrollViewRef = useRef<FlatList>(null);
  const measureRef = useRef<number>(0);

  const [audio, setAudio] = useState<Audio.Sound>();
  const [isPlaying, setPlaying] = useState<boolean>(false);
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
    setPlaying(true);
    console.log("Playing");
    await sound.playAsync();
  }

  async function stopSound() {
    console.log("Stopping");
    setPlaying(false);
    measureRef.current = 0;
    await audio?.stopAsync();
  }

  //Unloads sound upon audio change
  useEffect(() => {
    return audio
      ? () => {
          console.log("Unloading Sound");
          audio.unloadAsync();
        }
      : undefined;
  }, [audio]);

  //Handles downloading and reading of data
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
  }, [json]);

  //Sets interval actions per measure
  useEffect(() => {
    const interval = setInterval(
      () => {
        if (isPlaying) {
          measureRef.current++;
          scrollViewRef.current?.scrollToIndex({
            index: measureRef.current,
            animated: false,
          });
        }
      },
      loading ? 0 : (60000 / json!.tempo) * 4 // 4/4 for now
    );

    return () => clearInterval(interval);
  }, [isPlaying]);

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

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeAreaView}>
          <Spinner visible={loading} />

          <View style={styles.container}>
            <FlatList
              data={getArrayOfMeasures()}
              renderItem={({ item }) => (
                <Measure
                  json={json}
                  number={item}
                  instID={inst.id}
                  measureRef={measureRef}
                />
              )}
              ListHeaderComponent={
                <View>
                  <Header songData={json} backOnPress={router.back} />
                  <List.Section>
                    <List.Accordion title={inst.name}>
                      {getListElements()}
                    </List.Accordion>
                  </List.Section>
                </View>
              }
              extraData={json}
              keyExtractor={(item, index) => index.toString()}
              ref={scrollViewRef}
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
    </PaperProvider>
  );
}

function Measure({ json, number, instID, measureRef }: MeasureProps) {
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

  const staffWidth: number = Dimensions.get("window").width;
  const xStart = 6; //x coordinate of start of measure
  const padding: number = 20; //padding between first/last note and bar line
  const noteStaff = staffWidth - 2 * padding; // area where notes occupy
  const colour = measureRef.current + 1 === number ? "green" : "black";
  const strokeWidth = measureRef.current + 1 === number ? 2 : 1;

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
        <Staff width={staffWidth} colour={colour} strokeWidth={strokeWidth} />
        {tabNumArray}
      </Svg>
    </View>
  );
}

type StaffProps = {
  width: number;
  colour: string;
  strokeWidth: number;
};

function Staff({ width, colour, strokeWidth }: StaffProps) {
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

  return <Path d={d} stroke={colour} strokeWidth={strokeWidth} />;
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
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
