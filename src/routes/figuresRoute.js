const express = require('express');
const figuresController = require(`../controllers/figuresController`);
const router = express.Router();

router.get('/', figuresController.getAllFigures);
router.get('/getFigureInfo/:number', figuresController.getFigureInfo);
router.post('/', figuresController.addFigure);
router.put('/:id', figuresController.editFigure);
router.delete('/:id', figuresController.deleteFigure);
router.get('/image/:number', figuresController.getFigureImage);

module.exports = router;
