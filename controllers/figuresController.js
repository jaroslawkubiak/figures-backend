const fs = require('fs');

exports.getFigures = (req, res, next) => {
  console.log('getting figures list...');
  const file = fs.readFile('./dev-data/figureList.json', (err, data) => {
    if (err) throw err;

    const figureList = JSON.parse(data);
    console.log(figureList.length);
  });
  next();
};

// module.exports = getFigures;
