const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const figureRoute = require('./src/routes/figuresRoute');
const seriesRoute = require('./src/routes/seriesRoute');

const app = express();

// implement cors
app.use(cors());

// Set security HTTP headers
app.use(helmet());

app.use((err, req, res, next) => {
  console.log(err.stack);
  console.log(err.name);
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

app.use((req, res, next) => {
  res.send('<h3>App is working</h3>');
  next();
});

module.exports = app;
