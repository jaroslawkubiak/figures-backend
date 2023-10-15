const pool = require('../config/database');
const OAuth = require('oauth');
const sendImageToFtp = require('../utils/sendImageToFtp');
const extractFromDate = require('../utils/extractFromDate');
const getSeriesId = require('../utils/getSeriesId');
require('dotenv').config();

// adding figure to DB
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

  await pool.query(
    `INSERT INTO figures (seriesID, number, releaseYear, mainName, additionalName,label, bricklink, purchasePrice, purchaseDate,purchaseMonth, purchaseYear, weapon, bricklinkPrice)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      seriesID,
      number,
      releaseYear,
      mainName,
      additionalName,
      label,
      bricklink,
      Number(purchasePrice),
      purchaseDate,
      extractedDateParts.purchaseMonth,
      extractedDateParts.purchaseYear,
      weapon,
      Number(bricklinkPrice),
    ]
  );

  // save img from bricklink to my server
  sendImageToFtp(number);

  res.status(201).send('Figure has been added to DB');
};

// editing figure in DB
exports.editFigure = async (req, res) => {
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

  const [row] = await pool.query('SELECT id FROM figures WHERE id = ?', [figureToEdit]);
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
    res.send('Figure updated');
  } else res.status(200).send('Incorrect id.');
};

// deleting figure from DB
exports.deleteFigure = async (req, res) => {
  const figureToDelete = req.params.id;
  const [row] = await pool.query('DELETE FROM figures WHERE id = ?', [figureToDelete]);
  // id is correct - update figure
  if (row[0]) {
    res.send('Figure deleted');
  } else res.status(200).send('Incorrect id.');
};

// fetching for all figure data from Bricklink API to use ind figure adding form
exports.getFigureInfo = async (req, res) => {
  let figureInfo = {};
  const searchingNumber = req.params.number;

  const oauth = new OAuth.OAuth(
    '',
    '',
    process.env.BL_ConsumerKey,
    process.env.BL_ConsumerSecret,
    '1.0',
    null,
    'HMAC-SHA1'
  );

  //function for creating Promise to fetch for data
  const fetchForFigureInfo = function (url) {
    return new Promise((resolve, reject) => {
      oauth.get(url, process.env.BL_TokenValue, process.env.BL_TokenSecret, function (error, data, response) {
        if (error) reject(error);
        else {
          const dane = JSON.parse(data);
          resolve(dane.data);
        }
      });
    });
  };

  const promises = [];
  // fetch for general info about figure
  promises.push(fetchForFigureInfo(`${process.env.BL_BASE_URL}/items/MINIFIG/${searchingNumber}`));
  // fetch for pricing info
  promises.push(fetchForFigureInfo(`${process.env.BL_BASE_URL}/items/MINIFIG/${searchingNumber}/price`));

  Promise.all(promises)
    .then(result => {
      //setting up info
      figureInfo.info = result[0];
      //remove price details array
      result[1].price_detail = '';
      figureInfo.price = result[1];
      res.send(figureInfo);
    })
    .catch(err => console.log(err));
};

// getting list of all figures in DB
exports.getAllFigures = async (req, res) => {
  // console.log('getting all figures');
  const [rows] = await pool.query(
    `SELECT figures.*, series.name as series 
    FROM figures 
    INNER JOIN series ON figures.seriesID=series.id
    ORDER BY figures.id DESC`
  );
  res.status(200).send(rows);
};
