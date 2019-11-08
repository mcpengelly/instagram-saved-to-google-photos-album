# instagram to google photos

This script will download a the last 40 saved photos from instagram then upload them to google photos via google photos oauth2 api.

### Motivation: wanted a fast way of downloading saved instagram pictures and uploading them to a google photos album for use with chromecast

### How to use

- add your insta username and password to your .bash_profile
- create an app here: https://console.cloud.google.com/apis/credentials get oauth credentials, download the credentials file and paste it into oauth2.keys.json
- enable google photos API
- install dependencies `npm install`
- run `npm start`
- check your google photos account

### todo:

~~integrate with google photos api using oauth2~~
~~user friendly way of authenticating with google~~
~~upload images with google api~~
~~batch uploading to google photos (rate limited the way its done now)~~

- batch downloading from insta (rate limited the way its done now)
- better separation of concerns
- user friendly way of insta getting un and pw (env vars not ideal)
- select a particular collection of saved photos on instagram (no available api?)
- graceful failures
- transfer other types of insta data
- stream photos to google photos?
- filter insta photos?
- delete images after download/upload
