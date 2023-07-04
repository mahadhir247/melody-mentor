import guitarpro
import pretty_midi
from firebase_admin import credentials, initialize_app, storage, firestore
from midi2audio import FluidSynth

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

        # measures_per_min = song.tempo / 4  # Assume 4/4 for now
        # measure_duration = 60 / measures_per_min  # in seconds

        for measure_idx, measure in enumerate(track.measures):
            # measure_start = measure_idx * measure_duration

            # measure_start = pm.tick_to_time(measure.start)

            for voice in measure.voices:
                # note_start = measure_start

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


def upload_firestorage(path: str, uid: str):
    """
    Uploads the generated WAV file to Firebase Cloud Storage.

    Args:
        path (str): The path to the WAV file.
    """
    bucket = storage.bucket()
    blob = bucket.blob(f'audio_files/{uid}.wav')
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

    gp_path = input("Path to gp file: ")
    midi_path = OUTPUT_DIR + uid + ".mid"
    wav_path = OUTPUT_DIR + uid + ".wav"

    song = guitarpro.parse(gp_path)
    create_midi(song, midi_path)
    FluidSynth(SF2_PATH).midi_to_audio(midi_path, wav_path)

    print("Uploading to firestorage...")

    # upload_firestorage(wav_path, uid)

    print("Done!")
