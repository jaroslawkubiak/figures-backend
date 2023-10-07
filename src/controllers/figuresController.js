const pool = require('../config/database');
const OAuth = require('oauth');

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
  // console.log('addFigure req=', req.body);
  const { number, series } = req.body;
  console.log(number, series);

  await pool.query(`INSERT INTO figures (number, series) VALUES (?, ?)`, [number, series]);

  res.status(201).send('fig added.');
};

// fetching for all figure data to add
exports.getFigureInfo = async (req, res) => {
  const searchingNumber = req.params.number;
  const ConsumerKey = '636AAA42B8894372873941C792A678F2';
  const ConsumerSecret = '08BB0A38BB9745A4B10531446D38BACC';
  const TokenValue = 'E8555852685F487FAE456F1B8DE30A4E';
  const TokenSecret = 'D33AD7FAC5AB4182A9A23FE17452FAA9';
  const BASE_URL = 'https://api.bricklink.com/api/store/v1';
  const oauth = new OAuth.OAuth('', '', ConsumerKey, ConsumerSecret, '1.0', null, 'HMAC-SHA1');

  oauth.get(`${BASE_URL}/items/MINIFIG/${searchingNumber}`, TokenValue, TokenSecret, function (error, data, response) {
    if (error) console.error(error);
    const dane = JSON.parse(data);
    res.send(dane.data);
  });
};
