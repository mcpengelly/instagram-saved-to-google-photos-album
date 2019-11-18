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
var fs_1 = __importDefault(require("fs"));
var googleapis_1 = require("googleapis");
var googlephotos_1 = __importDefault(require("googlephotos"));
var http_1 = __importDefault(require("http"));
var open_1 = __importDefault(require("open"));
var path_1 = __importDefault(require("path"));
var server_destroy_1 = __importDefault(require("server-destroy"));
var url_1 = __importDefault(require("url"));
var constants_1 = require("./constants");
var utils_1 = require("./utils");
module.exports = {
  upload: function() {
    /**
     * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.
     * To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
     * download the file from there and rename it to oauth2.keys.json in the root directory
     */
    var keyPath = path_1.default.join(__dirname, "oauth2.keys.json");
    var keys = { client_id: "", client_secret: "", redirect_uris: [""] };
    if (fs_1.default.existsSync(keyPath)) {
      keys = require(keyPath).web;
    }
    /**
     * Create a new OAuth2 client with the configured keys.
     */
    var oauth2Client = new googleapis_1.google.auth.OAuth2(
      keys.client_id,
      keys.client_secret,
      keys.redirect_uris[1]
    );
    /**
     * Configure googleapis to use authentication credentials.
     */
    googleapis_1.google.options({ auth: oauth2Client });
    /**
     * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
     */
    var authenticate = function(scopes) {
      return __awaiter(void 0, void 0, void 0, function() {
        return __generator(this, function(_a) {
          return [
            2 /*return*/,
            new Promise(function(resolve, reject) {
              // grab the url that will be used for authorization
              var authorizeUrl = oauth2Client.generateAuthUrl({
                access_type: "offline",
                scope: scopes.join(" ")
              });
              var server = http_1.default
                .createServer(function(req, res) {
                  return __awaiter(void 0, void 0, void 0, function() {
                    var qs, tokens, e_1;
                    return __generator(this, function(_a) {
                      switch (_a.label) {
                        case 0:
                          _a.trys.push([0, 3, , 4]);
                          if (!(req.url.indexOf("/oauth2callback") > -1))
                            return [3 /*break*/, 2];
                          qs = new url_1.default.URL(
                            req.url,
                            "http://localhost:8080"
                          ).searchParams;
                          res.end(
                            "Authentication successful! Please return to the console."
                          );
                          server.destroy();
                          return [
                            4 /*yield*/,
                            oauth2Client.getToken(qs.get("code"))
                          ];
                        case 1:
                          tokens = _a.sent().tokens;
                          oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
                          resolve(oauth2Client);
                          _a.label = 2;
                        case 2:
                          return [3 /*break*/, 4];
                        case 3:
                          e_1 = _a.sent();
                          reject(e_1);
                          return [3 /*break*/, 4];
                        case 4:
                          return [2 /*return*/];
                      }
                    });
                  });
                })
                .listen(8080, function() {
                  // open the browser to the authorize url to start the workflow
                  open_1
                    .default(authorizeUrl, { wait: false })
                    .then(function(cp) {
                      return cp.unref();
                    });
                });
              server_destroy_1.default(server);
            })
          ];
        });
      });
    };
    var createAlbum = function(photosApi) {
      return __awaiter(void 0, void 0, void 0, function() {
        var titleDate, newAlbum;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              titleDate =
                new Date().toDateString() +
                " " +
                new Date().toTimeString().slice(0, 8);
              return [4 /*yield*/, photosApi.albums.create(titleDate)];
            case 1:
              newAlbum = _a.sent();
              return [2 /*return*/, newAlbum.id];
          }
        });
      });
    };
    var getPhotos = function(directory) {
      var files = fs_1.default.readdirSync(directory);
      var photos = files
        .filter(function(file) {
          return (
            file.indexOf(".jpg") > -1 ||
            file.indexOf(".jpeg") > -1 ||
            file.indexOf(".png") > -1
          );
        })
        .map(function(photo) {
          return { name: photo };
        });
      return photos;
    };
    var uploadPhotos = function(client) {
      return __awaiter(void 0, void 0, void 0, function() {
        var token, photosApi, albumId, photos, res;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              token = client.credentials.access_token;
              photosApi = new googlephotos_1.default(token);
              return [4 /*yield*/, createAlbum(photosApi)];
            case 1:
              albumId = _a.sent();
              photos = getPhotos(path_1.default.join(__dirname, "images"));
              return [
                4 /*yield*/,
                photosApi.mediaItems.uploadMultiple(
                  albumId,
                  photos,
                  path_1.default.join(__dirname, "images")
                )
              ];
            case 2:
              res = _a.sent();
              return [2 /*return*/];
          }
        });
      });
    };
    var scopes = [googlephotos_1.default.Scopes.READ_AND_APPEND];
    authenticate(scopes)
      .then(function(client) {
        return uploadPhotos(client);
      })
      .then(function() {
        return __awaiter(void 0, void 0, void 0, function() {
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                return [
                  4 /*yield*/,
                  utils_1.clearDirectory(constants_1.IMAGE_PATH)
                ];
              case 1:
                _a.sent();
                return [2 /*return*/];
            }
          });
        });
      })
      .catch(function(err) {
        throw new Error(err);
      });
  }
};
