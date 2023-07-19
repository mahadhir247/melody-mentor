import * as FileSystem from "expo-file-system";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

// Directory where downloaded files will be stored
const fileDir = FileSystem.cacheDirectory + "melodymentor/";
// Base URL path in Firebase Storage
const firebaseStorageURL = "audio_files/";

export async function downloadAudioJSON(
  uid: string
): Promise<{ audioUrl: string; jsonUrl: string }> {
  const storage = getStorage();
  console.log(uid);

  let audioRef = ref(storage, firebaseStorageURL + uid + ".wav");
  let jsonRef = ref(storage, firebaseStorageURL + uid + ".json");

  const audioDest = fileDir + uid + ".wav";
  const jsonDest = fileDir + uid + ".json";

  await getDownloadURL(audioRef).then((url) => downloadFile(url, audioDest));
  console.log("hi");
  // .catch((e) => console.error(e));
  await getDownloadURL(jsonRef).then((url) => downloadFile(url, jsonDest));
  // .catch((e) => console.error(e));

  return { audioUrl: audioDest, jsonUrl: jsonDest };
}

async function downloadFile(downloadUrl: string, fileDest: string) {
  try {
    const dirInfo = await FileSystem.getInfoAsync(fileDir);
    const fileInfo = await FileSystem.getInfoAsync(fileDest);
    const audioDownloadResumable = FileSystem.createDownloadResumable(
      downloadUrl,
      fileDest
    );

    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(fileDir, { intermediates: true });
    }

    if (!fileInfo.exists) {
      console.log("Downloading File...");
      const { uri: fileUri } =
        (await audioDownloadResumable.downloadAsync()) as FileSystem.FileSystemDownloadResult;

      console.log(`Downloaded file to ${fileUri}`);
    } else {
      console.log("File already downloaded!");
    }
  } catch (e) {
    console.error(e);
  }
}
