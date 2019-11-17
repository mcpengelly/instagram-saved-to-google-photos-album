'use strict';

// stdlib
const fs = require('fs');
const path = require('path');
const https = require('https');

// local
const oauth = require('./oauth');
const { clearDirectory } = require('./utils');
const { IMAGE_PATH } = require('./constants');

// 3rd oarty
const { get, has, last } = require('lodash');
const fetch = require('node-fetch');
const IG_API = require('instagram-private-api');

// You must generate device id's before login. Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
const ig = new IG_API.IgApiClient();

async function igLogin() {
  ig.state.generateDevice(process.env.IG_USERNAME);
  
  // login with credentials
  const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

  // The same as preLoginFlow()
  // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
  process.nextTick(async () => await ig.simulate.postLoginFlow());
}

async function getAllItemsFromFeed(feed) {
  let count = 0;
  let items = [];
  do {
    count++;
    items = items.concat(await feed.items());
  } while (feed.isMoreAvailable() && count < 1);
  return items;
}

// grab all image urls from a batch of saved posts
// the final candidate in the list seems to be the most reliable in terms of height and width so use that.
function parseSavedPosts(savedPost) {
  if (has(savedPost, 'carousel_media') && !has(savedPost, 'video_codec')) {
    return last(get(savedPost, 'carousel_media')).url;
  } else if (has(savedPost, 'image_versions2.candidates')) {
    return last(get(savedPost, 'image_versions2.candidates')).url;
  } else if (has(savedPost, 'video_codec')) {
    console.log('video posts not supported');
  } else {
    console.log('unable to parse savedPost', savedPost);
  }
}

// fetch images from image urls and save them to disk
// batch? need to free up node queue for large amounts of requests
// parralelize?
async function downloadImages(urls){
  let count = 1;
  urls.forEach(async function (url) {
    await fetch(url)
      .then(res => {
        const dest = fs.createWriteStream(`images/image-${count++}.png`);
        res.body.pipe(dest);
      })
      .catch(err => {
        console.log(err);
      });
  })
}

// remove self invoking
(async () => {
  await igLogin();

  // get saved posts
  const savedFeed = ig.feed.saved();
  const savedPosts = await getAllItemsFromFeed(savedFeed);
  console.log('savedPosts.length', savedPosts.length);

  // ensure urls are valid here? startsWith
  const imageUrls = savedPosts.map(parseSavedPosts).filter(url => url);

  await clearDirectory(IMAGE_PATH);
  await downloadImages(imageUrls)
  // oauth.upload();
})();
