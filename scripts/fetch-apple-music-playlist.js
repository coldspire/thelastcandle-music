const { chromium } = require("playwright");

/**
 * @typedef { {song: string, artist: string} } Song
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

  const tokens = playlistItem.split("\n");
  if (tokens.length === 3) {
    // Remove the "Explicit Content" token at index 1
    tokens.splice(1, 1);
  }
  const [song, artist] = tokens;

  return {
    artist,
    song,
  };
}

/**
 * Returns an array of Song object after fetching and parsing an Apple Music embed playlist.
 * @param {string} url - A URL to an Apple Music embed playlist
 */
async function getSongsFromEmbedUrl(url) {
  if (!url) {
    return null;
  }

  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url);
  const headingText = page.getByText("Play", { exact: true });
  await headingText.waitFor();

  const playlistItems = await page.getByRole("listitem").allInnerTexts();
  const songs = playlistItems.map((songItem) =>
    createSongDataFromPlaylistItem(songItem)
  );

  await browser?.close();

  return songs;
}

module.exports = getSongsFromEmbedUrl;
