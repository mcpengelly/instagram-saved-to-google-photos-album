import { createWriteStream } from 'fs';
import inquirer from 'inquirer'
import { IgApiClient, SavedFeed } from 'instagram-private-api';
import { chunk, flatten, get, has, last } from 'lodash';
import fetch from 'node-fetch';

// You must generate device id's before login. Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
const ig = new IgApiClient();

// TODO: pass credentials in here
const igLogin = async (): Promise<void> => {
  ig.state.generateDevice(process.env.IG_USERNAME);
  
  // login with credentials
  try {
    await ig.qe.syncLoginExperiments();

    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

  } catch (err){
    console.log(err);
    await ig.challenge.auto(true); // Requesting sms-code or click "It was me" button
    console.log(ig.state.checkpoint);
    const { code } = await inquirer.prompt([
      {
        message: 'Enter code',
        name: 'code',
        type: 'input',
      },
    ]);
    await ig.challenge.sendSecurityCode(code)
  }
  process.nextTick(() => ig.simulate.postLoginFlow());
};

// TODO: make generic, accepts function/boolean for parsing different types of feeds
const getIGFeedImageUrls = async (feed: SavedFeed) => {
  let count = 0;
  let items = [];
  do {
    count++;
    items = items.concat(await feed.items());
  } while (feed.isMoreAvailable() && count < 20);

  const posts = flatten(items.map(item => parseSavedPost(item, true, false))).filter(url => url);
  return posts;
};

// grab all image urls from a batch of saved posts
// the final candidate in the list seems to be the most reliable in terms of height and width so use that.
const parseSavedPost = (savedPost, includeCarouselPosts: boolean = true, includeVideoPosts: boolean = false) => {
  const isVideoPost = has(savedPost, 'video_codec');
  const isImagePost = has(savedPost, 'image_versions2.candidates') && !isVideoPost;
  const isCarouselPost = has(savedPost, 'carousel_media') && !isVideoPost;

  if (isImagePost) {
    const imgCandidate = last(get(savedPost, 'image_versions2.candidates'));
    return get(imgCandidate, 'url');
  } else if (isCarouselPost) {
    if (includeCarouselPosts) {
      return get(savedPost, 'carousel_media').map(post => {
        const imgCandidate = last(get(post, 'image_versions2.candidates'));
        return get(imgCandidate, 'url');
      });
    }
    return;
  } else if (isVideoPost) {
    if (includeVideoPosts) {
      const imgCandidate = last(get(savedPost, 'image_versions2.candidates'));
      return get(imgCandidate, 'url');
    }
    return;
  }
};

// fetch images from image urls and save them to disk
// batch? need to free up node queue for large amounts of requests
// parralelize?
// order is not garunteed
const downloadImages = async (urls: any[]) => {
  let count = 1;
  const groupedURLS = chunk(urls, 5);
  groupedURLS.forEach(async group => {
    for (const url of group) {
      try {
        console.log(`fetching image ${count}`)
        const res = await fetch(url, {timeout: 10000});
        const dest = createWriteStream(`images/image-${count++}.png`);
        res.body.pipe(dest);
      } catch (err) {
        throw new Error(err);
      }
    }
  });
};

const getSavedFeed = (): SavedFeed => ig.feed.saved();

export { igLogin, getSavedFeed, getIGFeedImageUrls, downloadImages };
