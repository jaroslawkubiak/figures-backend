const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const figureRoute = require('./src/routes/figuresRoute');

const app = express();

// implement cors
app.use(cors());

// Set security HTTP headers
app.use(helmet());

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something broke!');
});

// Body parser, reading data from body into req.body
app.use(express.json());

// ROUTES
app.use('/api/v1/figures', figureRoute);

app.use((req, res, next) => {
  res.send('<p>App is working</p>');
  next();
});

module.exports = app;
