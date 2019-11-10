const fs = require('fs');
const http = require('https');
const { flatten } = require('lodash');
const IG_API = require('instagram-private-api');
const axios = require('axios');
const oauth = require('./oauth');
const removeDirectory = require('rimraf')
const path = require('path')

const ig = new IG_API.IgApiClient();

// You must generate device id's before login.
// Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
ig.state.generateDevice(process.env.IG_USERNAME);

async function getAllItemsFromFeed(feed) {
  let count = 0
  let items = [];
  do {
    count++
    items = items.concat(await feed.items());
  } while (feed.isMoreAvailable() && count < 20);
  return items;
}

function removeExisting(dirPath){
  if(fs.existsSync(dirPath)){
    removeDirectory.sync(dirPath)
  }
}

(async () => {
  // login
  const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

  // The same as preLoginFlow()
  // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
  process.nextTick(async () => await ig.simulate.postLoginFlow());

  // get saved posts
  const savedFeed = ig.feed.saved();
  const mySavedPosts = await getAllItemsFromFeed(savedFeed);
  console.log(mySavedPosts.length);
  // const mySavedPosts = await Promise.all([await savedFeed.items(), await savedFeed.items()]);
  const flatSavedPosts = flatten(mySavedPosts);

  // grab all image urls from a batch of saved posts
  const savedImageURLS = flatSavedPosts
    .map(savedPost => {
      if (savedPost.media.carousel_media) {
        return savedPost.media.carousel_media[0].url;
      } else if (savedPost.media.image_versions2 && savedPost.media.image_versions2.candidates) {
        return savedPost.media.image_versions2.candidates[0].url;
      }
    })
    .filter(item => item);

  let count = 0;

  const dirPath = path.join(__dirname, 'images')
  removeExisting(dirPath)
  fs.mkdirSync(dirPath);

  // fetch images from image urls and save them to disk
  savedImageURLS.forEach(url => {
    const image = fs.createWriteStream(`images/image-${count++}.png`);
    console.log(count)
    console.log('url', url)
    http.get(url, response => {
      if(response.statusCode === 200){
        response.pipe(image);
      }
    });
  });

  // oauth.upload();
})();
