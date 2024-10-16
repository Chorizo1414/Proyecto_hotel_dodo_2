const reservacionModel = require('../models/reservacionModel');

// Crear una nueva reservación (POST)
async function createReservacion(req, res) {
    const { id_usuario, id_habitacion, id_paquete, costo_total, metodo_pago, fecha_ingreso, fecha_salida, servicios } = req.body;

    // Validar los campos requeridos
    if (!id_usuario || !id_habitacion || !costo_total || !metodo_pago || !fecha_ingreso || !fecha_salida) {
        return res.status(400).json({ error: 'Todos los campos son requeridos: id_usuario, id_habitacion, costo_total, metodo_pago, fecha_ingreso y fecha_salida' });
    }

    try {
        // Intentar crear la reservación
        const result = await reservacionModel.createReservacion(id_usuario, id_habitacion, id_paquete, costo_total, metodo_pago, fecha_ingreso, fecha_salida, servicios);

        // Si la reservación se crea exitosamente, responder con éxito
        res.status(201).json({ message: 'Reservación creada exitosamente', id_reservacion: result.id_reservacion });
    } catch (error) {
        // Manejo de errores del servidor
        res.status(500).json({ error: error.message });
    }
}

// Obtener todas las reservaciones (GET)
async function getReservaciones(req, res) {
    try {
        const reservaciones = await reservacionModel.getReservaciones();
        res.json(reservaciones);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Actualizar una reservación (PUT)
async function updateReservacion(req, res) {
    const { id } = req.params;
    const { id_habitacion, id_paquete, costo_total, metodo_pago, fecha_ingreso, fecha_salida } = req.body;

    // Validar los campos requeridos
    if (!id_habitacion || !costo_total || !metodo_pago || !fecha_ingreso || !fecha_salida) {
        return res.status(400).json({ error: 'Todos los campos son requeridos: id_habitacion, costo_total, metodo_pago, fecha_ingreso y fecha_salida' });
    }

    try {
        const result = await reservacionModel.updateReservacion(id, id_habitacion, id_paquete, costo_total, metodo_pago, fecha_ingreso, fecha_salida);

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Reservación no encontrada' });
        }

        res.status(200).json({ message: 'Reservación actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Eliminar una reservación (DELETE)
async function deleteReservacion(req, res) {
    const { id } = req.params;

    try {
        const result = await reservacionModel.deleteReservacion(id);

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Reservación no encontrada' });
        }

        res.status(200).json({ message: 'Reservación eliminada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { 
    createReservacion, 
    getReservaciones, 
    updateReservacion, 
    deleteReservacion 
};

