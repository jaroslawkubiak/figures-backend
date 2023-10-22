const jsftp = require('jsftp');
require('dotenv').config({ path: '../../16fee4d2c7ebfdff438a892abe812/.env' });

async function deleteImageFromFtp(number) {
  const ftp = new jsftp({
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USER_NAME,
    pass: process.env.FTP_PASSWORD,
  });

  const remoteFtpDir = `/portfolio/figures/static/media`;

  //creating image list from FTP
  ftp.list(remoteFtpDir, (err, res) => {
    const imageListAsString = res.split('\n');
    imageListAsString.shift();
    imageListAsString.shift();

    const imageList = imageListAsString.map(el => {
      return el.split(' ').pop().trim();
    });
    const fileToDelete = imageList.filter(el => el.includes(number));
    const remoteFtpPath = `/portfolio/figures/static/media/${fileToDelete[0]}`;

    //deleting file if exists
    if (remoteFtpPath) {
      ftp.raw('dele', remoteFtpPath, function (err) {
        if (err) console.error(err);
      });
    }
  });
}
module.exports = deleteImageFromFtp;
