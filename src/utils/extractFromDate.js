//extracting purchase month and year from data
function extractFromDate(value) {
  const date = {};
  const tempDate = value.split('-');
  date.purchaseMonth = Number(tempDate[1]);
  date.purchaseYear = Number(tempDate[2]);
  return date;
}

module.exports = extractFromDate;
