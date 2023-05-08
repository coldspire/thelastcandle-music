const puppeteer = require("puppeteer");

const urlFavorites2023 = `https://embed.music.apple.com/us/playlist/2023-absolute-favorites/pl.u-9N9L24eFADqk5`;

(async () => {
  /**
   * Change a newline-delimited playlist item into an artist-song object.
   * @param {string} playlistItem
   * @return { {song: string, artist: string} | null}
   */
  const createSongDataFromPlaylistItem = (playlistItem) => {
    if (!playlistItem) {
      return null;
    }

    const [song, artist] = playlistItem.split("\n");
    return {
      artist,
      song,
    };
  };

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(urlFavorites2023);

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
})();
