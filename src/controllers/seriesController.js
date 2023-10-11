const pool = require('../config/database');

exports.getSeries = async (req, res) => {
  const [rows] = await pool.query('SELECT name FROM series ORDER BY name ASC');
  return rows;
};
