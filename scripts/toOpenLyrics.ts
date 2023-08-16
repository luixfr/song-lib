import fs from "fs";
import { XMLElement, Attribute } from "xml-element";
fetchSongs();
function fetchSongs() {
  const dir = __dirname + "/../coros_json/";
  const dist = __dirname + "/../coros_openlyrics/";

  const files = fs.readdirSync(dir);
  files.map((file: string) => {
    console.log("reading:", file);

    let jsonSong = fs.readFileSync(dir + "/" + file, "utf8");
    let song:Song = JSON.parse(jsonSong);
    let openLyricsSong = createOpenLyrcs(song);

    let fileName = `CORO_${song.songbooks[0].number}`
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
  const title = new XMLElement("title", [lang], `CORO ${song.songbooks[0].number}: ${song.titles[0].toUpperCase()}`);
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

/*
The following songs could not be imported:
- C:\Users\Luix\Documents\songs\coros_openlyrics\CORO_.xml (XML syntax error)
- C:\Users\Luix\Documents\songs\coros_openlyrics\CORO_70.xml (XML syntax error)
- C:\Users\Luix\Documents\songs\coros_openlyrics\CORO_87.xml (XML syntax error)
- C:\Users\Luix\Documents\songs\coros_openlyrics\CORO_168.xml (XML syntax error)
- C:\Users\Luix\Documents\songs\coros_openlyrics\CORO_217.xml (XML syntax error)
- C:\Users\Luix\Documents\songs\coros_openlyrics\CORO_218.xml (XML syntax error)
- C:\Users\Luix\Documents\songs\coros_openlyrics\CORO_268.xml (XML syntax error)
- C:\Users\Luix\Documents\songs\coros_openlyrics\CORO_475.xml (XML syntax error)
*/