const fs = require('fs');
// const fileDBname = 'fullFigureList.json';
const fileDBname = 'figureList.json';

exports.getFigures = (req, res, next) => {
  const file = fs.readFile(`./dev-data/${fileDBname}`, 'utf-8', (err, data) => {
    if (err) throw err;
    const figureList = JSON.parse(data);
    res.json(figureList);
  });
};
