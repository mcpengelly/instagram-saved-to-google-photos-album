import IG_API from 'instagram-private-api';
declare const igLogin: () => Promise<void>;
declare const getAllItemsFromFeed: (feed: IG_API.SavedFeed) => Promise<any[]>;
declare const parseSavedPosts: (savedPost: any, includeCarouselPosts?: boolean, includeVideoPosts?: boolean) => any;
declare const downloadImages: (urls: any[]) => Promise<void>;
declare const getSavedFeed: () => IG_API.SavedFeed;
export { igLogin, getSavedFeed, getAllItemsFromFeed, parseSavedPosts, downloadImages };
