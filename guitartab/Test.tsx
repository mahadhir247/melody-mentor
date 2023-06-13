// import { ByteBuffer } from "./ByteBuffer";

// const filePath: string = "http://localhost:19000/guitartab/Metallica - Am I Evil.gp3";
// const file: string = ""

// fetch(filePath)
// .then((res) => res.blob())
// .then((blob) => ByteBuffer.fromFile(blob));

import { Text } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { ByteBuffer } from "./ByteBuffer";
import { readStringByteLength } from "./BinaryReader";
import { GP3Importer } from "./GP3Importer";
import { Score } from "./model/Score";

export default function OpenTabsTest() {
  const [text, setText] = useState<string>("");

  const songRef = collection(FIRESTORE_DB, "songs");

  useEffect(() => {
    const subscriber = onSnapshot(songRef, {
      next: (snapshot) => {
        const wonderwall = snapshot.docs.find(
          (doc) => doc.get("title") == "Wonderwall"
        );

        const str = wonderwall!.get("tabs");
        const byteBuffer = ByteBuffer.fromString(str);
        const test = new GP3Importer(byteBuffer);

        const score: Score = test.readScore();

        console.log(score.author);
        console.log(score.title);
        console.log(score.tempo + " BPM");
        console.log(`Measures: ${score.numMeasures}`);
        console.log(`Tracks: ${score.numTracks}`);

        setText(score.title);
      },
    });

    return () => subscriber();
  }, []);

  return <Text>{text}</Text>;
}
