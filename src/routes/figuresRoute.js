const express = require('express');
const figuresController = require(`../controllers/figuresController`);
const router = express.Router();

router.get('/', figuresController.getAllFigures);
router.get('/getFigureInfo/:number', figuresController.getFigureInfo);
router.patch('/edit/:id', figuresController.editFigure);
router.post('/add', figuresController.addFigure);
router.delete('/delete/:id', figuresController.deleteFigure);

module.exports = router;
