const express = require('express');
const cors = require('cors');
const figureRoute = require('./src/routes/figuresRoute');

const app = express();

// implement cors
app.use(cors());

// ROUTES
app.use('/api/v1/figures', figureRoute);

module.exports = app;
