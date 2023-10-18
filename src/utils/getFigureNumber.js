async function getFigureNumber(figureId) {
  // fetching for figure number
  const figuresResponse = await pool.query(`SELECT number FROM figures WHERE id = ${figureId}`);
  return figuresResponse[0][0]?.number;
}

module.exports = getFigureNumber;