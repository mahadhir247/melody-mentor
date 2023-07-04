type Song = {
  uid: string;
  title: string;
  artist: string;
  genres: string;
  chords: string[];
  difficulty: number;
};

type SongProps = {
  title: string;
  artist: string;
};

type GenreProps = {
  title: string;
  id: string;
};

type ChordProps = {
  title: string;
  id: string;
};

type FilterContextType = {
  setGenres: (genre: GenreProps[]) => void;
  genres: GenreProps[];
  setChords: (chord: ChordProps[]) => void;
  chords: ChordProps[];
  setDifficulty: (difficulty: number[]) => void;
  difficulty: number[];
};
