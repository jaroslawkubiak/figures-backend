const express = require('express');
const Figures = require(`../controllers/figuresController`);

const router = express.Router();

router.get('/', Figures.getAllFigures);

module.exports = router;
