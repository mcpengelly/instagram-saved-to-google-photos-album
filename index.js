const IG_API = require("instagram-private-api");
const _ = require("lodash");
const fetch = require("node-fetch");
const fs = require("fs");
// const axios = require("axios");

const ig = new IG_API.IgApiClient();
const http = require("https");

// You must generate device id's before login.
// Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
ig.state.generateDevice(process.env.IG_USERNAME);

(async () => {
  // login
  const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

  // The same as preLoginFlow()
  // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
  process.nextTick(async () => await ig.simulate.postLoginFlow());

  // get saved posts
  const savedFeed = ig.feed.saved();
  const mySavedPosts = await savedFeed.items();

  let url;

  let count = 0;
  // grab all image urls from a batch of saved posts
  const savedImageURLS = mySavedPosts
    .map(savedPost => {
      if (savedPost.media.carousel_media) {
        return savedPost.media.carousel_media[0].url;
      } else if (savedPost.media.image_versions2 && savedPost.media.image_versions2.candidates) {
        return savedPost.media.image_versions2.candidates[0].url;
      }
    })
    .filter(item => item);

  console.log(savedImageURLS);

  savedImageURLS.forEach(url => {
    const image = fs.createWriteStream(`images/image-${count++}.png`);
    // fetch(url, res => {
    //   console.log(res);
    //   res.pipe(image);
    // });
    const request = http.get(url, response => {
      console.log("response", response);
      response.pipe(image);
    });
  });
})();
