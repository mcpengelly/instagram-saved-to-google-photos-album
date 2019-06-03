// require("dotenv").config();

// Nodejs
// const fs = require("fs");
// const { exec } = require("child_process");

// // Third party
// const request = require("request");
// const Client = require("instagram-private-api").V1;

// Local
// const { username, password } = require("./credentials");

// const result = await request.get(config.apiEndpoint + '/v1/albums', {
//   headers: {'Content-Type': 'application/json'},
//   qs: parameters,
//   json: true,
//   auth: {'bearer': authToken},
// });

const {auth} = require('google-auth-library');
 
/**
 * Instead of specifying the type of client you'd like to use (JWT, OAuth2, etc)
 * this library will automatically choose the right client based on the environment.
 */
async function main() {
  const client = await auth.getClient({
    scopes: 'https://www.googleapis.com/auth/cloud-platform'
  });
  const projectId = await auth.getProjectId();
  const url = `https://www.googleapis.com/dns/v1/projects/${projectId}`;
  const res = await client.request({ url });
  console.log(res.data);
}
 
main().catch(console.error);


// const device = new Client.Device(username);
// const storage = new Client.CookieMemoryStorage();

// const removeWhitespace = str => str.replace(/\r?\n|\r/g, "");

// const getSavedPosts = session => new Client.Feed.SavedMedia(session, 100).all();

// const getImages = posts =>
//   posts.reduce((accum, current) => {
//     const { caption, images, user } = current.params;
//     const image = Array.isArray(images) ? images[0] : null;

//     // if no image data is found then ignore this post
//     if (!image) {
//       return accum;
//     }

//     const postCaption = removeWhitespace(caption.text);
//     accum.push({ username: user.username, caption: postCaption, image });
//     return accum;
//   }, []);

// const saveToFile = data =>
//   new Promise((resolve, reject) => {
//     const path = `${__dirname}/saved_posts.json`;
//     const content = JSON.stringify(data, null, 4);

//     fs.writeFile(path, content, "utf8", err => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(data, path);
//       }
//     });
//   });

// const saveImagesToDisk = data => {
//   new Promise((resolve, reject) => {
//     let count = 0;
//     data.forEach(post => {
//       const download = (uri, filename, callback) => {
//         request.head(uri, (err, res, body) => {
//           request(uri)
//             .pipe(fs.createWriteStream(filename))
//             .on("close", callback);
//         });
//       };
//       const filename = "filename_" + count++ + ".jpg";
//       download(post.image.url, filename, function() {
//         console.log(filename, "done");
//       });
//     });
//     resolve();
//   });
// };

// Client.Session.create(device, storage, username, password)
//   .then(getSavedPosts)
//   .then(getImages)
//   .then(saveToFile)
//   .then(saveImagesToDisk)
//   .then(() => {
//     console.log(`File saved`);
//   })
//   .catch(err => {
//     console.log(err);
//   });
