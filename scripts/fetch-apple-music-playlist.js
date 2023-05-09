const puppeteer = require("puppeteer");

/**
 * @typedef {song: string, artist: string} Song
 */

/**
 * Change a newline-delimited playlist item into an artist-song object.
 * @param {string} playlistItem
 * @return { Song | null}
 */
function createSongDataFromPlaylistItem(playlistItem) {
  if (!playlistItem) {
    return null;
  }

  const [song, artist] = playlistItem.split("\n");
  return {
    artist,
    song,
  };
}

/**
 * Returns an array of Song object after fetching and parsing an Apple Music embed playlist.
 * @param {string} url - A URL to an Apple Music embed playlist
 * @return {Promise<Awaited<Song>[]|null>}
 */
async function getSongsFromEmbedUrl(url) {
  if (!url) {
    return null;
  }

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(url);

  const element = await page.waitForSelector(`main >>> embed-audio-tracklist`);
  const itemElements = await element.$$(
    "embed-audio-tracklist > embed-audio-tracklist-item"
  );

  const songsToResolve = itemElements.map(async (item) => {
    const text = await item.evaluate((el) => el.innerText);
    return createSongDataFromPlaylistItem(text);
  });

  const songs = await Promise.all(songsToResolve);

  await browser?.close();

  return songs;
}

(async () => {
  const urlFavorites2023 = `https://embed.music.apple.com/us/playlist/2023-absolute-favorites/pl.u-9N9L24eFADqk5`;
  const urlGoodListening2023 = `https://embed.music.apple.com/us/playlist/2023-good-listenin/pl.u-DdAN8EosKAZ8R`;

  const favoriteSongs = await getSongsFromEmbedUrl(urlFavorites2023);
  console.log(favoriteSongs);

  const goodSongs = await getSongsFromEmbedUrl(urlGoodListening2023);
  console.log(goodSongs);
})();
