import { flatten } from 'lodash';

import { IMAGE_PATH } from './constants';
import { downloadImages, getAllItemsFromFeed, getSavedFeed, igLogin, parseSavedPosts } from './insta';
import oauth from './oauth';
import { clearDirectory } from './utils';

(async () => {
  await igLogin();
  await clearDirectory(IMAGE_PATH);

  // get saved posts
  const savedPosts = await getAllItemsFromFeed(getSavedFeed());
  const imageUrls = flatten(
    savedPosts.map(item => {
      return parseSavedPosts(item, true, false);
    })
  ).filter((url: any) => url);
  // console.log('TCL: imageUrls.length', imageUrls.length);

  await downloadImages(imageUrls);
  oauth.upload();
})();
