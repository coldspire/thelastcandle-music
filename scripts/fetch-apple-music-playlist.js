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

module.exports = getSongsFromEmbedUrl;
