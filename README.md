# instagram to google photos

This script will download a the last 40 saved photos from instagram then upload them to google photos via google photos oauth2 api.

### Motivation: wanted a fast way of downloading saved instagram pictures and uploading them to a google photos album for use with chromecast

### How to use

- add your insta username and password to your .bash_profile
- create an app here: https://console.cloud.google.com/apis/credentials get oauth credentials, download the credentials file and paste it into oauth2.keys.json
- enable google photos API
- install dependencies `npm install`
- run `npm start`
- select/login to your google account when prompted
- check your google photos account

### todo:

#### general:

~~delete old images~~

- use typescript
- better separation of concerns
- graceful failures
- stream photos from one place to the other?
- clean up after self

#### google photos:

~~integrate with google photos api using oauth2~~
~~user friendly way of authenticating with google~~
~~upload images with google api~~
~~batch uploading to google photos~~

- even better batch uploading

#### ig:

~~deal with videos from insta~~
~~exhaust insta paginated photos~~
~~deal with saved posts with more then one post in them~~

- batch downloading from insta (fix overloading node queue, deal with broken urls)
- user friendly way of insta getting un and pw (env vars not ideal)
- select a particular collection of saved photos on instagram (no available api?)
- transfer other types of insta data
- filter insta photos?
