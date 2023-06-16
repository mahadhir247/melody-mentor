import React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebaseConfig";
import { useEffect, useState } from "react";
import encoding from "text-encoding";

export default function Tabs() {
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Tabs Here</Text>
        <OpenTabsTest />
      </View>
    </View>
  );
}

function OpenTabsTest() {
  const [text, setText] = useState<string>("");

  const songRef = collection(FIRESTORE_DB, "songs");

  useEffect(() => {
    const subscriber = onSnapshot(songRef, {
      next: (snapshot) => {
        const wonderwall = snapshot.docs.find(
          (doc) => doc.get("title") == "Wonderwall"
        );

        const str = wonderwall!.get("tabs");
        let encoder = new encoding.TextEncoder();



        setText('s');
      },
    });

    return () => subscriber();
  }, []);

  return <Text>{text}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
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
