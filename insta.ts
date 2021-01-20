import { createWriteStream } from "fs";
import inquirer from "inquirer";
import { IgApiClient, SavedFeed } from "instagram-private-api";
import { chunk, flatten, get, has, last } from "lodash";
import axios from "axios";

// user arguments
const includeCarouselPosts = process.argv[2];
const includeVideoPosts = process.argv[3];

const ig = new IgApiClient();

const igLogin = async (): Promise<void> => {
  ig.state.generateDevice(process.env.IG_USERNAME);

  try {
    // get password encryption key
    await ig.qe.syncLoginExperiments();

    await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  } catch (err) {
    console.log(err);
    await ig.challenge.auto(true); // sometimes instagram wants to verify you're human
    console.log(ig.state.checkpoint);
    const { code } = await inquirer.prompt([
      {
        message: "Enter code",
        name: "code",
        type: "input",
      },
    ]);
    await ig.challenge.sendSecurityCode(code);
  }

  // dispose of password encryption key
  process.nextTick(() => ig.simulate.postLoginFlow());
};

// TODO: make generic, accepts function/boolean for parsing different types of feeds
const getIGFeedImageUrls = async (feed: SavedFeed) => {
  let count = 0;
  let items = [];
  do {
    count++;
    items = items.concat(await feed.items());
  } while (feed.isMoreAvailable() && count < 10);

  const posts = flatten(
    items.map((item) =>
      parseSavedPost(item, !!includeCarouselPosts, !!includeVideoPosts)
    )
  ).filter((url) => url);
  return posts;
};

// grab all image urls from a batch of saved posts
// the final candidate in the list seems to be the most reliable in terms of height and width so use that.
// TODO: find most reliable candidates for images
const parseSavedPost = (
  savedPost,
  includeCarouselPosts: boolean = true,
  includeVideoPosts: boolean = false
) => {
  const isVideoPost = has(savedPost, "video_codec");
  const isImagePost =
    has(savedPost, "image_versions2.candidates") && !isVideoPost;
  const isCarouselPost = has(savedPost, "carousel_media") && !isVideoPost;

  if (isImagePost) {
    const imgCandidate = last(get(savedPost, "image_versions2.candidates"));
    return get(imgCandidate, "url");
  } else if (isCarouselPost) {
    if (includeCarouselPosts) {
      return get(savedPost, "carousel_media").map((post) => {
        const imgCandidate = last(get(post, "image_versions2.candidates"));
        return get(imgCandidate, "url");
      });
    }
    return;
  } else if (isVideoPost) {
    if (includeVideoPosts) {
      const imgCandidate = last(get(savedPost, "image_versions2.candidates"));
      return get(imgCandidate, "url");
    }
    return;
  }
};

// fetch images from image urls and save them to disk
const downloadImages = async (urls: any[]) => {
  let count = 1;

  const groupedURLS = chunk(urls, 10);
  groupedURLS.forEach(async (group) => {
    group.forEach(async (url) => {
      try {
        console.log(`fetching image...`);
        const res = await axios.get(url, {
          timeout: 2000,
          responseType: "stream",
        });
        const dest = createWriteStream(`images/image-${count++}.png`);
        console.log(`saved image ${count} from instagram`);
        res.data.pipe(dest);
      } catch (err) {
        console.log(`error fetching url ${err.code}`);
      }
    });
  });
};

const getSavedFeed = (): SavedFeed => ig.feed.saved();

export { igLogin, getSavedFeed, getIGFeedImageUrls, downloadImages };
