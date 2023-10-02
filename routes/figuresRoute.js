const express = require('express');
const Figures = require(`./../controllers/figuresController`);

const router = express.Router();

router.get('/', Figures.getFigures);

module.exports = router;
