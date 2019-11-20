# instagram to google photos

This script will download a the last 40 saved photos from instagram then upload them to google photos via google photos oauth2 api.

### Motivation: wanted a fast way of downloading saved instagram pictures and uploading them to a google photos album so I could use them with my chromecast

### How to use

- add your insta username and password to your .bash_profile
- create an app here: https://console.cloud.google.com/apis/credentials get oauth credentials, download the credentials file and paste it into oauth2.keys.json
- enable google photos API
- install dependencies `npm install`
- run `npm start`
- select/login to your google account when prompted
- check your google photos account

### Todo:

#### general:

- ~~delete old images~~
- ~~use prettier & linting~~
- ~~use typescript~~
- ~~better separation of concerns~~
- ~~clean up after self~~
- graceful failures
- reduce disk space usage

#### google photos:

- ~~integrate with google photos api using oauth2~~
- ~~user friendly way of authenticating with google~~
- ~~upload images with google api~~
- ~~batch uploading to google photos~~
- better batch uploads

#### ig:

- ~~deal with videos from insta~~
- ~~exhaust insta paginated photos~~
- ~~deal with saved posts with more then one post in them~~

- batch downloading from insta (fix overloading node queue)
- user friendly way of insta getting un and pw (env vars not ideal)
- select a particular collection of saved photos on instagram (no available api?), other filter methods?
- other types of insta feeds
