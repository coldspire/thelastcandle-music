const getSongsFromEmbedUrl = require("../../scripts/fetch-apple-music-playlist");

async function get2023Goods() {
  const urlGoods2023 = `https://embed.music.apple.com/us/playlist/pl.u-DdAN8EosKAZ8R`;
  return getSongsFromEmbedUrl(urlGoods2023);
}

module.exports = get2023Goods;
