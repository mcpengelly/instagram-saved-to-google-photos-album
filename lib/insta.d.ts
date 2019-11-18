import { SavedFeed } from 'instagram-private-api';
declare const igLogin: () => Promise<void>;
declare const getAllItemsFromFeed: (feed: SavedFeed) => Promise<any[]>;
declare const parseSavedPosts: (savedPost: any, includeCarouselPosts?: boolean, includeVideoPosts?: boolean) => any;
declare const downloadImages: (urls: any[]) => Promise<void>;
declare const getSavedFeed: () => SavedFeed;
export { igLogin, getSavedFeed, getAllItemsFromFeed, parseSavedPosts, downloadImages };
