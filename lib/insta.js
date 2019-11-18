"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function(resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                  ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var instagram_private_api_1 = require("instagram-private-api");
var lodash_1 = require("lodash");
var node_fetch_1 = __importDefault(require("node-fetch"));
// You must generate device id's before login. Id's generated based on seed
// So if you pass the same value as first argument - the same id's are generated every time
var ig = new instagram_private_api_1.IgApiClient();
var igLogin = function() {
  return __awaiter(void 0, void 0, void 0, function() {
    var loggedInUser;
    return __generator(this, function(_a) {
      switch (_a.label) {
        case 0:
          ig.state.generateDevice(process.env.IG_USERNAME);
          return [
            4 /*yield*/,
            ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD)
          ];
        case 1:
          loggedInUser = _a.sent();
          // The same as preLoginFlow()
          // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
          process.nextTick(function() {
            return ig.simulate.postLoginFlow();
          });
          return [2 /*return*/];
      }
    });
  });
};
exports.igLogin = igLogin;
// define feed interface
var getAllItemsFromFeed = function(feed) {
  return __awaiter(void 0, void 0, void 0, function() {
    var count, items, _a, _b;
    return __generator(this, function(_c) {
      switch (_c.label) {
        case 0:
          count = 0;
          items = [];
          _c.label = 1;
        case 1:
          count++;
          _b = (_a = items).concat;
          return [4 /*yield*/, feed.items()];
        case 2:
          items = _b.apply(_a, [_c.sent()]);
          _c.label = 3;
        case 3:
          if (feed.isMoreAvailable() && count < 1) return [3 /*break*/, 1];
          _c.label = 4;
        case 4:
          return [2 /*return*/, items];
      }
    });
  });
};
exports.getAllItemsFromFeed = getAllItemsFromFeed;
// grab all image urls from a batch of saved posts
// the final candidate in the list seems to be the most reliable in terms of height and width so use that.
var parseSavedPosts = function(
  savedPost,
  includeCarouselPosts,
  includeVideoPosts
) {
  if (includeCarouselPosts === void 0) {
    includeCarouselPosts = true;
  }
  if (includeVideoPosts === void 0) {
    includeVideoPosts = false;
  }
  var isVideoPost = lodash_1.has(savedPost, "video_codec");
  var isImagePost =
    lodash_1.has(savedPost, "image_versions2.candidates") && !isVideoPost;
  var isCarouselPost =
    lodash_1.has(savedPost, "carousel_media") && !isVideoPost;
  if (isImagePost) {
    var imgCandidate = lodash_1.last(
      lodash_1.get(savedPost, "image_versions2.candidates")
    );
    return lodash_1.get(imgCandidate, "url");
  } else if (isCarouselPost) {
    if (includeCarouselPosts) {
      return lodash_1.get(savedPost, "carousel_media").map(function(post) {
        var imgCandidate = lodash_1.last(
          lodash_1.get(post, "image_versions2.candidates")
        );
        return lodash_1.get(imgCandidate, "url");
      });
    }
    return;
  } else if (isVideoPost) {
    if (includeVideoPosts) {
      var imgCandidate = lodash_1.last(
        lodash_1.get(savedPost, "image_versions2.candidates")
      );
      return lodash_1.get(imgCandidate, "url");
    }
    return;
  }
  // else {
  //   console.log('unable to parse savedPost', savedPost);
  // }
};
exports.parseSavedPosts = parseSavedPosts;
// fetch images from image urls and save them to disk
// batch? need to free up node queue for large amounts of requests
// parralelize?
// order is not garunteed
var downloadImages = function(urls) {
  return __awaiter(void 0, void 0, void 0, function() {
    var count;
    return __generator(this, function(_a) {
      count = 1;
      urls.forEach(function(url) {
        return __awaiter(void 0, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [
                  4 /*yield*/,
                  node_fetch_1
                    .default(url)
                    .then(function(res) {
                      var dest = fs_1.createWriteStream(
                        "images/image-" + count++ + ".png"
                      );
                      res.body.pipe(dest);
                    })
                    .catch(function(err) {
                      throw new Error(err);
                    })
                ];
              case 1:
                _a.sent();
                return [2 /*return*/];
            }
          });
        });
      });
      return [2 /*return*/];
    });
  });
};
exports.downloadImages = downloadImages;
var getSavedFeed = function() {
  return ig.feed.saved();
};
exports.getSavedFeed = getSavedFeed;
