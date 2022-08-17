# instagram to google photos

This script will download a the last 40 saved photos from instagram then upload them to google photos via google photos oauth2 api.

### Motivation: wanted a fast way of downloading saved instagram pictures and uploading them to a google photos album so I could use them with my chromecast

### Setup

- add your insta username and password to your shell profile. under the names: IG_USERNAME, IG_PASSWORD (dont worry this info is only used to fetch your profiles bookmarked images and not saved.)
- create an app here: https://console.cloud.google.com/apis/credentials get oauth credentials, download the credentials file and paste it into oauth2.keys.json
- enable google photos API
- install project dependencies `npm install`

### Usage

Disclaimer, this script will make requests to Instagram servers on your behalf, it's advised that you _do not_ use your personal account in case Instagram tags you as a bot for repeated requests.

- start the script with `npm start`
- optionally you can choose to download videos and carousels using these args: `npm start <shouldDownloadCarouselImages> <shouldDownloadVideos>` ex: `npm start true true`
- you'll be prompted for your google login to do the upload in a browser, complete that.
- check your google photos account for a new album, or check <project>/images/ for images saved to disk

### Todo:

#### general:

- ~~delete old images~~
- ~~use prettier & linting~~
- ~~use typescript~~
- ~~better separation of concerns~~
- ~~clean up after self~~
- ~~axios for fetching~~
- ~~document IG_USERNAME, IG_PASSWORD~~
- ~~better usage docs~~
- remove hotfix from node_modules
- better error messages, graceful warning for no password/un supplied
- more user friendly script
- separate ig download into own module?
- graceful failures
- reduce disk space usage
- global install/usage

#### google photos:

- ~~integrate with google photos api using oauth2~~
- ~~user friendly way of authenticating with google~~
- ~~upload images with google api~~
- ~~batch uploading to google photos~~
- ~~better batch uploads~~
- is there a way around google max requests per minute for uploads?

#### ig:

- ~~deal with videos from insta~~
- ~~exhaust insta paginated photos~~
- ~~deal with saved posts with more then one post in them~~
- ~~batch downloading from insta (fix overloading node queue)~~
- batch large amount of requests (instagram)
- ensure each group completes download before moving onto the next group (instagram)
- user arguments for allowing video or carousel images to show up
- iglogin should accept credentials
- make video posts optional by flag
- make carousel posts optional by flag
- user friendly way of insta getting un and pw (use node args? read from untracked file?)
- select a particular collection of saved photos on instagram (no available api?), other filter methods?
- other types of insta feeds
- generic getIGFeedImageUrls
