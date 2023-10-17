const jsftp = require('jsftp');
const axios = require('axios');
require('dotenv').config({ path: '../../16fee4d2c7ebfdff438a892abe812/.env' });

async function deleteImageFromFtp(number) {
  const ftp = new jsftp({
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USER_NAME,
    pass: process.env.FTP_PASSWORD,
  });

  const remoteFtpPath = `/portfolio/figures/static/media/${number}.png`;

  ftp.raw('dele', remoteFtpPath, function (err) {
    if (err) console.error(err);
    else console.log(`Delete figure ${number} image from ftp was successful`);
  });
}
module.exports = deleteImageFromFtp;
