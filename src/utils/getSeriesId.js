async function getSeriesId(name) {
  // fetching for series id
  const seriesResponse = await pool.query(`SELECT id FROM series WHERE name = "${name}"`);
  return seriesResponse[0][0].id;
}

module.exports = getSeriesId;
