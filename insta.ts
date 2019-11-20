import { createWriteStream } from 'fs';
import { IgApiClient, SavedFeed } from 'instagram-private-api';
import { flatten, get, has, last } from 'lodash';
import fetch from 'node-fetch';

// You must generate device id's before login. Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
const ig = new IgApiClient();

// TODO: pass credentials in here
const igLogin = async (): Promise<void> => {
  ig.state.generateDevice(process.env.IG_USERNAME);

  // login with credentials
  const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);

  // The same as preLoginFlow()
  // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
  process.nextTick(() => ig.simulate.postLoginFlow());
};

// TODO: make generic, accepts function/boolean for parsing different types of feeds
const getIGFeedImageUrls = async (feed: SavedFeed) => {
  let count = 0;
  let items = [];
  do {
    count++;
    items = items.concat(await feed.items());
  } while (feed.isMoreAvailable() && count < 7);

  const posts = flatten(
    items.map(item => {
      return parseSavedPost(item, true, false);
    })
  ).filter((url: any) => url);

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
  urls.forEach(async url => {
    await fetch(url)
      .then(res => {
        const dest = createWriteStream(`images/image-${count++}.png`);
        res.body.pipe(dest);
      })
      .catch(err => {
        throw new Error(err);
      });
  });
};

const getSavedFeed = (): SavedFeed => ig.feed.saved();

export { igLogin, getSavedFeed, getIGFeedImageUrls, downloadImages };
