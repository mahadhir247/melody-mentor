import guitarpro
import pretty_midi
from firebase_admin import credentials, initialize_app, storage, firestore
from midi2audio import FluidSynth
import json
import sys

# Path to the SoundFont file
SF2_PATH = 'backend/GeneralUser GS v1.471.sf2'
# Output paths for MIDI and WAV files
OUTPUT_DIR = 'backend/output/'
# Path to the Firebase credentials JSON file
CREDENTIALS_PATH = 'backend/orbitalapp-4da0d-4af45d41ef9c.json'
# Firebase storage path
FIREBASE_STORAGE_PATH = 'orbitalapp-4da0d.appspot.com'

cred = credentials.Certificate(CREDENTIALS_PATH)
initialize_app(cred, {'storageBucket': FIREBASE_STORAGE_PATH})
db = firestore.client()


def create_midi(song: guitarpro.Song, midi_path: str):
    """
    Creates a MIDI file from a parsed Guitar Pro song.

    Args:
        song (guitarpro.Song): The parsed Guitar Pro song object.
        midi_path (str): The path to save the MIDI file.
    """

    pm = pretty_midi.PrettyMIDI(initial_tempo=song.tempo, resolution=960)

    for track in song.tracks:
        instrument = pretty_midi.Instrument(
            program=track.channel.instrument, is_drum=track.channel.isPercussionChannel)

        for measure in track.measures:
            for voice in measure.voices:
                for beat in voice.beats:
                    note_start = pm.tick_to_time(beat.start)
                    note_duration = pm.tick_to_time(beat.duration.time)
                    note_end = note_start + note_duration

                    for note in beat.notes:
                        note = pretty_midi.Note(
                            velocity=note.velocity, pitch=note.realValue + track.offset, start=note_start, end=note_end)
                        instrument.notes.append(note)

                    note_start = note_end

        pm.instruments.append(instrument)

    pm.write(midi_path)


def generate_json(song: guitarpro.Song, json_path: str):
    """
    Generates a json file with tab info to be read by frontend.

    Args:
        song (guitarpro.Song): The parsed Guitar Pro song object.
        json_path (str): The path to save the JSON file.
    """

    output = {}
    output["songName"] = song.title
    output["artist"] = song.artist
    output["tempo"] = song.tempo
    output["tracks"] = []

    for track in song.tracks:
        track_output = {}
        track_output["instrument"] = pretty_midi.program_to_instrument_name(
            track.channel.instrument)

        track_output["measures"] = []

        for measure in track.measures:
            measure_output = {}
            measure_output["measureNumber"] = measure.number
            measure_output["voices"] = []

            for voice in measure.voices:
                voice_output = {}
                voice_output["beats"] = []

                for beat in voice.beats:
                    beat_output = {}
                    beat_output["notes"] = []
                    beat_output["value"] = beat.duration.value
                    beat_output["isDotted"] = beat.duration.isDotted
                    beat_output["tuplet"] = f"({beat.duration.tuplet.enters}, {beat.duration.tuplet.times})"

                    for note in beat.notes:
                        note_output = {}
                        note_output["string"] = note.string
                        note_output["value"] = note.value
                        beat_output["notes"].append(note_output)

                    voice_output["beats"].append(beat_output)
                measure_output["voices"].append(voice_output)
            track_output['measures'].append(measure_output)
        output['tracks'].append(track_output)

    with open(json_path, "w") as file:
        json.dump(output, file, indent=2)


def upload_firestorage(path: str, upload_path: str):
    """
    Uploads the generated WAV file to Firebase Cloud Storage.

    Args:
        path (str): The path to the WAV file.
    """
    bucket = storage.bucket()
    blob = bucket.blob(upload_path)
    blob.upload_from_filename(path)

    blob.make_public()


if __name__ == "__main__":
    uploading = input("Uploading new song? (y/n): ")
    if (uploading == "y"):
        name = input("Song name: ")
        artist = input("Artist name: ")
        chords = input("Chords: ").strip().split()
        difficulty = int(input("Difficulty: "))
        genre = input("Genre: ")

        song = {
            "title": name,
            "artist": artist,
            "chords": chords,
            "difficulty": difficulty,
            "genres": genre
        }

        update_time, song_ref = db.collection("songs").add(song)
        uid = song_ref.id
        print(f"Added song with id {uid}")
    elif (uploading == "n"):
        uid = input("UID: ").strip()
    else:
        sys.exit()

    gp_path = input("Path to gp file: ")
    midi_path = OUTPUT_DIR + uid + ".mid"
    wav_path = OUTPUT_DIR + uid + ".wav"
    json_path = OUTPUT_DIR + uid + ".json"

    song = guitarpro.parse(gp_path)
    generate_json(song, json_path)
    create_midi(song, midi_path)
    FluidSynth(SF2_PATH, sample_rate=22050).midi_to_audio(midi_path, wav_path)

    print("Uploading to firestorage...")

    upload_firestorage(wav_path, f'audio_files/{uid}.wav')
    upload_firestorage(json_path, f'audio_files/{uid}.json')

    print("Done!")
