const { clearDirectory } = require('./utils');
const { IMAGE_PATH } = require('./constants');
const { igLogin, getAllItemsFromFeed, downloadImages, getSavedFeed, parseSavedPosts } = require('./insta');
const oauth = require('./oauth');

const { flatten } = require('lodash');

(async () => {
  await igLogin();
  await clearDirectory(IMAGE_PATH);

  // get saved posts
  const savedPosts = await getAllItemsFromFeed(getSavedFeed());
  const imageUrls = flatten(savedPosts.map(parseSavedPosts)).filter(url => url);
  console.log('TCL: imageUrls.length', imageUrls.length);

  await downloadImages(imageUrls);
  // oauth.upload(); disabled for now cause i broke something
})();
