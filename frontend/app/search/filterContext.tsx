import React, { useState, createContext, useContext } from "react";

const FilterContext = createContext({});

export function useFilterContext() {
  return useContext(FilterContext);
}

export function Provider(props: any) {
  const [genres, setGenres] = useState<GenreProps[]>([]);
  const [chords, setChords] = useState<ChordProps[]>([]);
  const [difficulty, setDifficulty] = useState<number[]>([1, 5]);

  return (
    <FilterContext.Provider
      value={{
        setGenres,
        genres,
        setChords,
        chords,
        setDifficulty,
        difficulty,
      }}
    >
      {props.children}
    </FilterContext.Provider>
  );
}
