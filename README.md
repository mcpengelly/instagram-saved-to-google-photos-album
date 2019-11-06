# instagram saved photo downloader

This script will download a the last 40 saved photos from instagram then upload them to google photos via google photos oauth2 api.

Motivation: wanted a fast way of downloading saved instagram pictures and uploading them to a google photos album for use on chromecast

### how to use

WIP

- add your insta username and password to your .bash_profile
- install dependencies `npm install`
- run `npm start`
- check images directory
-

todo:
~~~- integrate with google photos api using oauth2~~

- test creating a new album and then adding new images to it instead of appending new images to an existing album
- user friendly way of authenticating with google
- user friendly way of insta getting un and pw
- upload images with google api
- select a particular collection of saved photos on instagram (no available api)
- more flexible way to get many more photos (batch download?)
