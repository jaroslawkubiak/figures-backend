const pool = require('../config/database');
const OAuth = require('oauth');
const dotenv = require('dotenv');
dotenv.config();

exports.getAllFigures = async (req, res) => {
  // console.log('getting all figures');
  const [rows] = await pool.query('SELECT * FROM figures ORDER BY id DESC');
  res.status(200).send(rows);
};

exports.editFigure = async (req, res) => {
  console.log('editfigure = szukam id = ', req.params.id);
  const [row] = await pool.query('SELECT * FROM figures WHERE id = ?', [req.params.id]);
  if (row[0]) res.send(row[0]);
  else res.status(200).send('Incorrect id.');
};

exports.addFigure = async (req, res) => {
  const {
    number,
    series,
    mainName,
    additionalName,
    releaseYear,
    bricklink,
    purchasePrice,
    weapon,
    purchaseDate,
    bricklinkPrice,
  } = req.body;

  //changing on to 1
  label = req.body.label === 'on' ? 1 : 0;

  //extracting purchase month and year from data
  const tempDate = purchaseDate.split('-');
  const purchaseMonth = Number(tempDate[1]);
  const purchaseYear = Number(tempDate[2]);

  await pool.query(
    `INSERT INTO figures (series, number, releaseYear, mainName, additionalName,label, bricklink, purchasePrice, purchaseDate,purchaseMonth, purchaseYear, weapon, bricklinkPrice) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      series,
      number,
      releaseYear,
      mainName,
      additionalName,
      label,
      bricklink,
      Number(purchasePrice),
      purchaseDate,
      purchaseMonth,
      purchaseYear,
      weapon,
      Number(bricklinkPrice),
    ]
  );

  res.status(201).send('Figure has been added to DB');
};

// fetching for all figure data to add
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

  let fetchForFigureInfo = function (url) {
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

  let promises = [];
  // fetch for general info about figure
  promises.push(fetchForFigureInfo(`${process.env.BL_BASE_URL}/items/MINIFIG/${searchingNumber}`));
  // fetch for pricing info
  promises.push(fetchForFigureInfo(`${process.env.BL_BASE_URL}/items/MINIFIG/${searchingNumber}/price`));

  Promise.all(promises)
    .then(result => {
      //setting up info
      figureInfo.info = result[0];
      //remove price details array
      // result[1].price_detail = '';
      figureInfo.price = result[1];
      res.send(figureInfo);
    })
    .catch(err => console.log(err));
};
