interface SongData {
  songName: string;
  artist: string;
  tempo: number;
  tracks: Track[];
}

interface Track {
  instrument: string;
  measures: Measure[];
}

interface Measure {
  measureNumber: number;
  voices: Voice[];
}

interface Voice {
  beats: Beat[];
}

interface Beat {
  notes: Note[];
  value: number;
  isDotted: boolean;
  tuplet: string;
}

interface Note {
  string: number;
  value: number;
}
