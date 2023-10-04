const fs = require('fs');

exports.getFigures = (req, res, next) => {
  const file = fs.readFile('./dev-data/figureList.json', 'utf-8', (err, data) => {
    if (err) throw err;
    const figureList = JSON.parse(data);
    console.log(`find ${figureList.length} figures on list`);
    res.body = figureList;
    res.json(figureList);
  });
};
