import fs from "fs";
import { XMLElement } from "./XMLElement";
fetchSongs();
function fetchSongs() {
  const dir = __dirname + "/../nhp_json/";
  const dist = __dirname + "../nhp_openlyrcs/";

  const songs = fs.readdirSync(dir);
  let firstSong = fs.readFileSync(dir + "/" + songs[0], "utf8");
  let song = JSON.parse(firstSong);
  createOpenLyrcs(song);

  /*let openLyrcsSongs = songs.map((jsonSong) => {
    let song = JSON.parse(jsonSong);
    createOpenLyrcs(song);
  });*/
}

function createOpenLyrcs(song: Song) {
  let openLyrcsSong = new XMLElement("song");
  let attributes: Attributes[] = [
    { attribute: "xmlns", value: "http://openlyrics.info/namespace/2009/song" },
    { attribute: "version", value: "0.8" },
    { attribute: "createdIn", value: "OpenLP 1.9.0" },
  ];
  openLyrcsSong.addAttributes(attributes);

  const properties = new XMLElement("properties");
  const titles = new XMLElement("titles");
  const lang: Attributes = { attribute: "lang", value: "es" };
  const title = new XMLElement("title", [lang], song.titles[0]);
  titles.addChild(title);

  const authors = new XMLElement("auhtors");
  const auhtor = new XMLElement("auhtor", undefined, song.autors[0]);
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
  for (const [verse, lines] of Object.entries(songLyrics)) {
    if (verse == "language" || verse == "order") {
      continue;
    }

    const versexml = new XMLElement("verse", [
      { attribute: "name", value: verse },
      { attribute: "lang", value: "es" },
    ]);
    versexml.addChilds(
      lines.map((line) => new XMLElement("lines", undefined, line))
    );

    lyrics.addChild(versexml);
  }

  openLyrcsSong.addChild(properties);
  openLyrcsSong.addChild(lyrics);
  console.log(openLyrcsSong.getXMLElement());
}
