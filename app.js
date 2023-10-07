const express = require('express');
const cors = require('cors');
const figureRoute = require('./src/routes/figuresRoute');

const app = express();

// implement cors
app.use(cors());

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something broke!');
});

// Body parser, reading data from body into req.body
app.use(express.json());

// ROUTES
app.use('/api/v1/figures', figureRoute);

module.exports = app;
