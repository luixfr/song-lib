import fs from "fs";
import { XMLElement, Attribute } from "xml-element";
fetchSongs();
function fetchSongs() {
  const dir = __dirname + "/../nhp/";
  const dist = __dirname + "/../nhp_openlyrics/";

  const files = fs.readdirSync(dir);
  files.map((file: string) => {
    console.log("reading:", file);

    let jsonSong = fs.readFileSync(dir + "/" + file, "utf8");
    let song:Song = JSON.parse(jsonSong);
    let openLyricsSong = createOpenLyrcs(song);

    let fileName = `nhp ${song.songbooks[0].number}: ${file.replace(".json", "")}`.toUpperCase()
    console.log("saving:", fileName);
    fs.writeFileSync(dist + fileName + ".xml", openLyricsSong);
  });
}

function createOpenLyrcs(song: Song) {
  let openLyrcsSong = new XMLElement("song");
  let attributes: Attribute[] = [
    { attribute: "xmlns", value: "http://openlyrics.info/namespace/2009/song" },
    { attribute: "version", value: "0.8" },
    { attribute: "createdIn", value: "toOpenLyrics" },
  ];
  openLyrcsSong.addAttributes(attributes);

  const properties = new XMLElement("properties");
  const titles = new XMLElement("titles");
  const lang: Attribute = { attribute: "lang", value: "es" };
  const title = new XMLElement("title", [lang], capitalizeFirstLetter(song.titles[0]));
  titles.addChild(title);

  const authors = new XMLElement("auhtors");
  const auhtor = new XMLElement("auhtor", undefined, song.authors[0]);
  authors.addChild(auhtor);

  const songbooks = new XMLElement("songbooks");
  const songbook = new XMLElement("songbook", [
    { attribute: "entry", value: song.songbooks[0].number },
    {
      attribute: "name",
      value: song.songbooks[0].name,
    },
  ]);
  songbooks.addChild(songbook);

  const order = new XMLElement(
    "verseOrder",
    undefined,
    song.lyrics[0].order.join(" ")
  );

  properties.addChild(titles);
  properties.addChild(authors);
  properties.addChild(songbooks);
  properties.addChild(order);

  const lyrics = new XMLElement("lyrics");
  const songLyrics = song.lyrics[0];
  
  for (const [verse, lines] of Object.entries(songLyrics.lyric)) {
    if (verse == "language" || verse == "order") {
      continue;
    }

    const versexml = new XMLElement("verse", [
      { attribute: "name", value: verse },
      { attribute: "lang", value: "es" },
    ]);

    versexml.addChildren(
      lines.map((line) => new XMLElement("lines", undefined, line))
    );

    lyrics.addChild(versexml);
  }

  openLyrcsSong.addChild(properties);
  openLyrcsSong.addChild(lyrics);

  
  return '<?xml version="1.0" encoding="UTF-8"?>' + openLyrcsSong.toXML();
}

function capitalizeFirstLetter(input: string): string {
  const words = input.split(' ');

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    if (word.length > 0) {
      words[i] = word[0].toUpperCase() + word.slice(1).toLowerCase();
    }
  }

  return words.join(' ');
}