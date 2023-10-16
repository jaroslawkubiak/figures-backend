const jsftp = require('jsftp');
const axios = require('axios');
require('dotenv').config({ path: '../../16fee4d2c7ebfdff438a892abe812/.env' });

//saving image to ftp
async function sendImageToFtp(figureNumber) {
  const ftp = new jsftp({
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USER_NAME,
    pass: process.env.FTP_PASSWORD,
  });

  const remoteLink = `https://img.bricklink.com/ItemImage/MN/0/${figureNumber}.png`;
  const remoteFtpPath = `/portfolio/figures/static/media/${figureNumber}.png`;

  const response = await axios.get(remoteLink, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(response.data, 'utf-8');

  ftp.put(buffer, remoteFtpPath, function (err) {
    if (err) console.error(err);
    else console.log(`sending figure ${figureNumber} image to ftp was successful`);
  });
}

module.exports = sendImageToFtp;
