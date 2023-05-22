const getSongsFromEmbedUrl = require("../../scripts/fetch-apple-music-playlist");

async function get2023Favorites() {
  const urlFavorites2023 = `https://embed.music.apple.com/us/playlist/pl.u-9N9L24eFADqk5`;
  return getSongsFromEmbedUrl(urlFavorites2023);
}

module.exports = get2023Favorites;
