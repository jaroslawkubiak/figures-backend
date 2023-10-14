const axios = require('axios');
const fs = require('fs');
const ftp = require('jsftp');

//saving image to server
async function saveImage(url, filepath) {









  
  // const response = await axios({
  //   url,
  //   method: 'GET',
  //   responseType: 'stream',
  // });

  // const rrr = await axios({});

  // return new Promise((resolve, reject) => {
  //   response.data
  //     .pipe(fs.createWriteStream(filepath))
  //     .on('error', reject)
  //     .once('close', () => resolve(filepath));
  // });
}

module.exports = saveImage;
