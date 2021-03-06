import fs from 'fs';
import { google } from 'googleapis';
import Photos from 'googlephotos';
import http from 'http';
import opn from 'open';
import path from 'path';
import destroyer from 'server-destroy';
import url from 'url';

interface IOauthKeys {
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
}

const getGoogleOauthClient = async (scopes = [Photos.Scopes.READ_AND_APPEND]) => {
  /**
   * To use OAuth2 authentication, we need access to a a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI.
   * To get these credentials for your application, visit https://console.cloud.google.com/apis/credentials.
   * download the file from there and rename it to oauth2.keys.json in the root directory
   */
  const keyPath = path.join(__dirname, 'oauth2.keys.json');
  let keys: IOauthKeys = { client_id: '', client_secret: '', redirect_uris: [''] };
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
  return new Promise((resolve, reject) => {
    // grab the url that will be used for authorization
    const authorizeUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes.join(' ')
    });
    const server = http
      .createServer(async (req, res) => {
        try {
          if (req.url.indexOf('/oauth2callback') > -1) {
            const qs = new url.URL(req.url, 'http://localhost:8080').searchParams;
            res.end('Google Oauth2 Authentication successful! Please return to the console.');
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
  console.log('creating target google album')
  const titleDate = `${new Date().toDateString()} ${new Date().toTimeString().slice(0, 8)}`;
  const newAlbum = await photosApi.albums.create(titleDate);
  console.log(`new album created with id ${newAlbum.id}`)
  return newAlbum.id;
};

const getPhotos = (directory: fs.PathLike) => {
  const files = fs.readdirSync(directory);
  const photos = files
    .filter(file => file.indexOf('.jpg') > -1 || file.indexOf('.jpeg') > -1 || file.indexOf('.png') > -1)
    .map(photo => {
      return { name: photo };
    });
  return photos;
};

const uploadPhotos = async client => {
  const token = client.credentials.access_token;
  const photosApi = new Photos(token);
  const albumId = await createAlbum(photosApi);
  const photos = getPhotos(path.join(__dirname, 'images'));

  console.log('attempting to upload to google photos')
  try {
    await photosApi.mediaItems.uploadMultiple(albumId, photos, path.join(__dirname, 'images'));
  } catch (err) {
    throw new Error(err);
  }
};

export { getGoogleOauthClient, uploadPhotos };
