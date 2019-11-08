'use strict';

const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');

const { google } = require('googleapis');
const Photos = require('googlephotos');
const plus = google.plus('v1');

module.exports = {
  upload: () => {
    /**
     * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.
     * To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
     * download the file from there and rename it to oauth2.keys.json in the root directory
     */
    const keyPath = path.join(__dirname, 'oauth2.keys.json');
    let keys = { redirect_uris: [''] };
    if (fs.existsSync(keyPath)) {
      keys = require(keyPath).web;
    }
    /**
     * Create a new OAuth2 client with the configured keys.
     */
    const oauth2Client = new google.auth.OAuth2(keys.client_id, keys.client_secret, keys.redirect_uris[1]);

    /**
     * Configure googleapis to use authentication credentials.
     */
    google.options({ auth: oauth2Client });

    /**
     * Open an http server to accept the oauth callback. In this simple example, the only request to our webserver is to /callback?code=<code>
     */
    const authenticate = async scopes => {
      return new Promise((resolve, reject) => {
        // grab the url that will be used for authorization
        const authorizeUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: scopes.join(' '),
        });
        const server = http
          .createServer(async (req, res) => {
            try {
              if (req.url.indexOf('/oauth2callback') > -1) {
                const qs = new url.URL(req.url, 'http://localhost:8080').searchParams;
                res.end('Authentication successful! Please return to the console.');
                server.destroy();
                const { tokens } = await oauth2Client.getToken(qs.get('code'));
                oauth2Client.credentials = tokens; // eslint-disable-line require-atomic-updates
                resolve(oauth2Client);
              }
            } catch (e) {
              reject(e);
            }
          })
          .listen(8080, () => {
            // open the browser to the authorize url to start the workflow
            opn(authorizeUrl, { wait: false }).then(cp => cp.unref());
          });
        destroyer(server);
      });
    };

    const createAlbum = async photosApi => {
      const titleDate = `${new Date().toDateString()} ${new Date().toTimeString().slice(0, 8)}`;
      const newAlbum = await photosApi.albums.create(titleDate);
      return newAlbum.id;
    };

    const getPhotos = directory => {
      const files = fs.readdirSync(directory);
      const photos = files.filter(
        file => file.indexOf('.jpg') > -1 || file.indexOf('.jpeg') > -1 || file.indexOf('.png') > -1,
      );
      return photos;
    };

    const uploadPhotos = async client => {
      const token = client.credentials.access_token;
      const photosApi = new Photos(token);
      const albumId = await createAlbum(photosApi);

      const photos = getPhotos(path.join(__dirname, 'images'));

      // will be supported if open source contrib is accepted and republished
      // const res = await photosApi.mediaItems.uploadMultiple(
      //   albumId,
      //   photos,
      //   path.join(__dirname, 'images'),
      //   'uploaded via instagram-to-googlephotos',
      // );
      
      const res = await photosApi.mediaItems.upload(
        albumId,
        photos,
        path.join(__dirname, 'images'),
        'uploaded via instagram-to-googlephotos',
      );

      console.log('------------');
      console.log(res.newMediaItemResults);
    };
    const scopes = [Photos.Scopes.READ_AND_APPEND];

    authenticate(scopes)
      .then(client => uploadPhotos(client))
      .catch(console.error);
  },
};
