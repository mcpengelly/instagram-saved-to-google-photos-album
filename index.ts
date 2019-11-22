import { IMAGE_PATH } from './constants';
import { downloadImages, getIGFeedImageUrls, getSavedFeed, igLogin } from './insta';
import { getGoogleOauthClient, uploadPhotos } from './oauth';
import { clearDirectory } from './utils';

(async () => {
  try {
    // setup
    await clearDirectory(IMAGE_PATH);
    await igLogin();

    // download IG posts
    const savedFeedImageUrls = await getIGFeedImageUrls(getSavedFeed());
    await downloadImages(savedFeedImageUrls);

    // upload to google album
    const client = await getGoogleOauthClient();
    await uploadPhotos(client);

    // clean up
    await clearDirectory(IMAGE_PATH);
  } catch (err) {
    throw new Error(err);
  }
})();
