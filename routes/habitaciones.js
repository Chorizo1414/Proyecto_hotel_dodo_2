const express = require('express');
const router = express.Router();
const habitacionesController = require('../controllers/habitacionesController.js');

// Ruta para ingresar una nueva habitación
router.post('/habitaciones', habitacionesController.ingresarHabitacion);

// Ruta para actualizar una habitación
router.put('/habitaciones/:id', habitacionesController.actualizarHabitacion);

// Ruta para eliminar una habitación
router.delete('/habitaciones/:id', habitacionesController.eliminarHabitacion);


module.exports = router;

