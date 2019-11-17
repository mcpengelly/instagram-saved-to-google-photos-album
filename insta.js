'use strict';

// stdlib
const fs = require('fs');

// 3rd oarty
const { get, has, last } = require('lodash');
const fetch = require('node-fetch');
const IG_API = require('instagram-private-api');

// You must generate device id's before login. Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
const ig = new IG_API.IgApiClient();

const igLogin = async () => {
  ig.state.generateDevice(process.env.IG_USERNAME);

  // login with credentials
  const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

  // The same as preLoginFlow()
  // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
  process.nextTick(async () => await ig.simulate.postLoginFlow());
};

const getAllItemsFromFeed = async feed => {
  let count = 0;
  let items = [];
  do {
    count++;
    items = items.concat(await feed.items());
  } while (feed.isMoreAvailable() && count < 1);
  return items;
};

// grab all image urls from a batch of saved posts
// the final candidate in the list seems to be the most reliable in terms of height and width so use that.
const parseSavedPosts = (savedPost, includeCarouselPosts = true, includeVideoPosts = false) => {
  const isVideoPost = has(savedPost, 'video_codec');
  const isImagePost = has(savedPost, 'image_versions2.candidates') && !isVideoPost;
  const isCarouselPost = has(savedPost, 'carousel_media') && !isVideoPost;

  if (isImagePost) {
    return last(get(savedPost, 'image_versions2.candidates')).url;
  } else if (isCarouselPost) {
    if (includeCarouselPosts) {
      return get(savedPost, 'carousel_media').map(post => last(get(post, 'image_versions2.candidates')).url);
    }
    return;
  } else if (isVideoPost) {
    if (includeVideoPosts) {
      return last(get(savedPost, 'image_versions2.candidates')).url;
    }
    return;
  } else {
    console.log('unable to parse savedPost', savedPost);
  }
};

// fetch images from image urls and save them to disk
// batch? need to free up node queue for large amounts of requests
// parralelize?
// order is not garunteed
const downloadImages = async urls => {
  let count = 1;
  urls.forEach(async function(url) {
    await fetch(url)
      .then(res => {
        const dest = fs.createWriteStream(`images/image-${count++}.png`);
        res.body.pipe(dest);
      })
      .catch(err => {
        console.log(err);
      });
  });
};

const getSavedFeed = () => {
  return ig.feed.saved();
};

module.exports = {
  igLogin,
  getSavedFeed,
  getAllItemsFromFeed,
  parseSavedPosts,
  downloadImages,
  getSavedFeed,
};
