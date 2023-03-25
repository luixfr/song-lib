type Attributes = {
  attribute: string;
  value: string;
};

type Song = {
  titles: string[];
  autors: string[];
  languages: string[];
  songbooks: Songbook[];
  lyrics: Lyric[];
  versions: string[];
};

type Songbook = {
  name: string;
  number: string;
};

type Lyric = {
  order: Verse[];
  language: string;
  version?: string;
  lyric: LirycVerses;
};

type LirycVerses = {
  v1?: string[];
  v2?: string[];
  v3?: string[];
  v4?: string[];
  v5?: string[];
  v6?: string[];
  v7?: string[];
  v8?: string[];
  c1?: string[];
  c2?: string[];
  c3?: string[];
};

type Verse =
  | "v1"
  | "v2"
  | "v3"
  | "v4"
  | "v5"
  | "v6"
  | "v7"
  | "v8"
  | "c1"
  | "c2"
  | "c3";
