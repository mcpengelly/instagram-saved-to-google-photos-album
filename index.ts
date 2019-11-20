import { IMAGE_PATH } from './constants';
import { downloadImages, getIGFeedImageUrls, getSavedFeed, igLogin } from './insta';
import { getGoogleOauthClient, uploadPhotos } from './oauth';
import { clearDirectory } from './utils';

(async () => {
  try {
    await clearDirectory(IMAGE_PATH);
    await igLogin();

    // get saved posts
    const savedFeedImageUrls = await getIGFeedImageUrls(getSavedFeed());
    // console.log('TCL: savedImageUrls.length', savedImageUrls.length);

    await downloadImages(savedFeedImageUrls);
    const client = await getGoogleOauthClient();
    await uploadPhotos(client);
    await clearDirectory(IMAGE_PATH);
  } catch (err) {
    throw new Error(err);
  }
})();
