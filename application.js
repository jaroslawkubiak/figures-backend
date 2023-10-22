const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const figureRoute = require('./src/routes/figuresRoute');
const seriesRoute = require('./src/routes/seriesRoute');
const createDate = require('./src/utils/createDate');
const app = express();
const sendImageToFtp = require('./src/utils/sendImageToFtp');

// implement cors
app.use(cors());

// Set security HTTP headers
app.use(helmet());

app.use((err, req, res, next) => {
  console.log(err.stack);
  console.error(err.name);
  console.log(err.code);

  res.status(500).json({
    message: 'Something broke!',
  });
});

// Body parser, reading data from body into req.body
app.use(express.json());

// ROUTES
app.use('/api/v1/figures', figureRoute);
app.use('/api/v1/series', seriesRoute);

// const today = createDate();
// app.use((req, res, next) => {
//   res.json({ message: `<h1>App is working since ${today}</h1>`});
//   next();
// });

module.exports = app;
