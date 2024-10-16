// reservacionRouter.js
const express = require('express');
const reservacionController = require('../controllers/reservacionController');
const router = express.Router();


router.post('/create', reservacionController.createReservacion);
router.get('/', reservacionController.getReservaciones);
router.put('/create', reservacionController.updateReservacion);
router.delete('/create', reservacionController.deleteReservacion);

module.exports = router;

