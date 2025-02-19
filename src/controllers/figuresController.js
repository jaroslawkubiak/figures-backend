const pool = require("../config/database");
const OAuth = require("oauth");
const sendImageToFtp = require("../utils/sendImageToFtp");
const extractFromDate = require("../utils/extractFromDate");
const getSeriesId = require("../utils/getSeriesId");
const deleteImageFromFtp = require("../utils/deleteImageFromFtp");
const getFigureNumber = require("../utils/getFigureNumber");
const jsftp = require("jsftp");
require("dotenv").config({ path: "../../16fee4d2c7ebfdff438a892abe812/.env" });

// adding figure to DB
// router.post('/')
exports.addFigure = async (req, res) => {
  const {
    number,
    series,
    mainName,
    additionalName,
    releaseYear,
    bricklink,
    label,
    purchasePrice,
    weapon,
    purchaseDate,
    bricklinkPrice,
  } = req.body;

  // fetching for series id
  const seriesID = await getSeriesId(series);

  //extracting purchase month and year from data
  const extractedDateParts = extractFromDate(purchaseDate);

  const imageLink = `https://img.bricklink.com/ItemImage/MN/0/${number}.png`;

  await pool.query(
    `INSERT INTO figures (seriesID, number, releaseYear, mainName, additionalName,label, bricklink, imageLink, purchasePrice, purchaseDate,purchaseMonth, purchaseYear, weapon, bricklinkPrice)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      seriesID,
      number,
      releaseYear,
      mainName,
      additionalName,
      label,
      bricklink,
      imageLink,
      Number(purchasePrice),
      purchaseDate,
      extractedDateParts.purchaseMonth,
      extractedDateParts.purchaseYear,
      weapon,
      Number(bricklinkPrice),
    ]
  );

  const LAST_INSERT_ID = await pool.query(`SELECT LAST_INSERT_ID()`);
  const lastFigureId = LAST_INSERT_ID[0][0]["LAST_INSERT_ID()"];

  // save img from bricklink to my server
  sendImageToFtp(number);

  res
    .status(201)
    .json({ message: "Figure added", type: "add", lastFigureId, seriesID });
};

// editing figure in DB
// router.put('/:id');
exports.editFigure = async (req, res) => {
  try {
    const figureToEdit = req.params.id;
    const {
      series,
      mainName,
      additionalName,
      releaseYear,
      bricklink,
      label,
      purchasePrice,
      weapon,
      purchaseDate,
      bricklinkPrice,
    } = req.body;

    // fetching for series id
    const seriesID = await getSeriesId(series);

    //extracting purchase month and year from data
    const extractedDateParts = extractFromDate(purchaseDate);

    const [row] = await pool.query("SELECT id FROM figures WHERE id = ?", [
      figureToEdit,
    ]);
    // id is correct - update figure
    if (row[0]) {
      await pool.query(
        `UPDATE figures SET 
      seriesID = ?, mainName = ?, additionalName = ?, releaseYear = ?, bricklink = ?, label = ?,
      purchasePrice = ?, weapon = ?, purchaseDate = ?, bricklinkPrice = ?, purchaseMonth = ?, purchaseYear = ?
      WHERE id = ?`,
        [
          seriesID,
          mainName,
          additionalName,
          releaseYear,
          bricklink,
          label,
          purchasePrice,
          weapon,
          purchaseDate,
          bricklinkPrice,
          extractedDateParts.purchaseMonth,
          extractedDateParts.purchaseYear,
          figureToEdit,
        ]
      );
      res.status(200).json({ message: "Figure updated", type: "edit" });
    } else res.status(400).json({ message: "Fail to edit", type: "error" });
  } catch (err) {
    console.log(err);
  }
};

// update figure image link in DB and send image to FTP
// router.patch('/:id')
exports.editFigureLink = async (req, res) => {
  const figId = req.params.id;
  const { number } = req.body;
  const imageLink = `${process.env.SEND_FIGURE_SERVER}${process.env.SEND_FIGURE_DIRECTORY}/${number}.png`;
  pool
    .query(`UPDATE figures SET imageLink = ? WHERE id = ?`, [imageLink, figId])
    .then(() => {
      res.status(200).json({ message: "Image link updated", type: "edit" });
    })
    .catch((error) => {
      res
        .status(400)
        .json({ message: "Fail to edit image link", type: "error", error });
    });
  // sending image to FTP
  sendImageToFtp(number);
};

// deleting figure from DB
// router.delete('/:id')
exports.deleteFigure = async (req, res) => {
  try {
    const figureToDelete = req.params.id;

    const promises = [];
    // searching for figure number
    promises.push(getFigureNumber(figureToDelete));
    // deleting figure from DB
    promises.push(
      pool.query("DELETE FROM figures WHERE id = ?", [figureToDelete])
    );

    Promise.all(promises).then((result) => {
      const row = result[1];
      // id is correct - delete figure
      if (row[0]) {
        // deleting figure image from FTP
        deleteImageFromFtp(result[0]);

        res.status(200).json({ message: "Figure removed", type: "delete" });
      } else res.status(400).json({ message: "Fail to delete", type: "error" });
    });
  } catch (err) {
    console.error(err);
  }
};

// fetching for all figure data from Bricklink API to use ind figure adding form
// router.get('/getFigureInfo/:number')
exports.getFigureInfo = async (req, res) => {
  let figureInfo = {};
  const searchingNumber = req.params.number;

  const oauth = new OAuth.OAuth(
    "",
    "",
    process.env.BL_ConsumerKey,
    process.env.BL_ConsumerSecret,
    "1.0",
    null,
    "HMAC-SHA1"
  );

  //function for creating Promise to fetch for data
  const fetchForFigureInfo = function (url) {
    return new Promise((resolve, reject) => {
      oauth.get(
        url,
        process.env.BL_TokenValue,
        process.env.BL_TokenSecret,
        function (error, data, response) {
          if (error) reject(error);
          else {
            const dane = JSON.parse(data);
            resolve(dane.data);
          }
        }
      );
    });
  };

  const promises = [];
  // fetch for general info about figure
  promises.push(
    fetchForFigureInfo(
      `${process.env.BL_BASE_URL}/items/MINIFIG/${searchingNumber}`
    )
  );
  // fetch for pricing info
  promises.push(
    fetchForFigureInfo(
      `${process.env.BL_BASE_URL}/items/MINIFIG/${searchingNumber}/price`
    )
  );

  Promise.all(promises)
    .then((result) => {
      //setting up info
      figureInfo.info = result[0];
      //remove price details array
      result[1].price_detail = "";
      figureInfo.price = result[1];
      res.send(figureInfo);
    })
    .catch((err) => console.log(err));
};

// getting list of all figures in DB
// router.get('/')
exports.getAllFigures = async (req, res) => {
  const [rows] = await pool.query(
    `SELECT figures.*, series.name as series 
    FROM figures 
    INNER JOIN series ON figures.seriesID=series.id
    ORDER BY figures.id DESC`
  );
  res.status(200).send(rows);
};

// check if figure image exist on FTP
// router.get('/image/:number')
exports.getFigureImage = async (req, res) => {
  const numberToCheck = req.params.number;
  const ftp = new jsftp({
    host: process.env.FTP_HOST,
    port: process.env.FTP_PORT,
    user: process.env.FTP_USER_NAME,
    pass: process.env.FTP_PASSWORD,
  });
  const remoteFtpDir = `${process.env.SEND_FIGURE_DIRECTORY}/${numberToCheck}`;
  await ftp.get(remoteFtpDir, (err) => {
    if (err) {
      // if image don't exist on FTP - save this image from bricklink to FTP
      sendImageToFtp(numberToCheck.slice(0, numberToCheck.length - 4));
      res.status(400).send("error");
    } else res.status(200).send("ok");
  });
};
