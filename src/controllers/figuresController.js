const pool = require('../config/database');

exports.getAllFigures = async (req, res) => {
  const [rows] = await pool.query('SELECT * from figures ORDER BY id DESC');
  res.send(rows);
};
