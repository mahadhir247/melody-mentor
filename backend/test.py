import guitarpro
import pretty_midi
from firebase_admin import credentials, initialize_app, storage
from midi2audio import FluidSynth

GP_PATH = 'backend/Oasis - Wonderwall.gp3'
SF2_PATH = 'backend/GeneralUser GS v1.471.sf2'
MIDI_OUTPUT_PATH = 'backend/output/Oasis - Wonderwall.mid'
WAV_OUTPUT_PATH = 'backend/output/Oasis - Wonderwall.wav'
CREDENTIALS_PATH = 'backend/orbitalapp-4da0d-4af45d41ef9c.json'
FIREBASE_STORAGE_PATH = 'orbitalapp-4da0d.appspot.com'


def get_duration(note_value: int, tempo: int, dotted: bool) -> float:
    measures_per_min = tempo / 4  # Assume 4/4 for now
    measure_duration = 60 / measures_per_min  # in seconds

    if (dotted):
        note_value *= 0.75

    return (1 / note_value) * measure_duration


def create_midi(song: guitarpro.Song):
    pm = pretty_midi.PrettyMIDI(initial_tempo=song.tempo)

    # for track in song.tracks:
    track = song.tracks[0]

    instrument = pretty_midi.Instrument(program=track.channel.instrument)
    start_time = 0
    for measure in track.measures:
        for voice in measure.voices:
            for beat in voice.beats:
                duration = get_duration(beat.duration.value,
                                        song.tempo, beat.duration.isDotted)
                end_time = start_time + duration
                # print(f'{duration=:.2f}')
                # print(f'{start_time=:.2f}')
                # print(f'{end_time=:.2f}')

                for note in beat.notes:
                    note = pretty_midi.Note(
                        velocity=100, pitch=note.realValue, start=start_time, end=end_time)
                    instrument.notes.append(note)
                start_time += duration

    pm.instruments.append(instrument)

    pm.write(MIDI_OUTPUT_PATH)


def upload_firestorage():
    cred = credentials.Certificate(
        CREDENTIALS_PATH)
    initialize_app(
        cred, {'storageBucket': FIREBASE_STORAGE_PATH})

    bucket = storage.bucket()
    blob = bucket.blob(WAV_OUTPUT_PATH)
    blob.upload_from_filename(WAV_OUTPUT_PATH)

    # Opt : if you want to make public access from the URL
    blob.make_public()


if __name__ == "__main__":
    song = guitarpro.parse(GP_PATH)
    create_midi(song)
    FluidSynth(SF2_PATH).midi_to_audio(
        MIDI_OUTPUT_PATH, WAV_OUTPUT_PATH)
    upload_firestorage()
