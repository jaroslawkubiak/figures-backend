const express = require('express');
const seriesController = require('../controllers/seriesController');
const router = express.Router();

router.get('/', seriesController.getSeries);

module.exports = router;
