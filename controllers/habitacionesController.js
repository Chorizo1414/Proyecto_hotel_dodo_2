const oracledb = require('oracledb');
const dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTION
};

// Controlador para ingresar una nueva habitación
exports.ingresarHabitacion = async (req, res) => {
    let connection;

    try {
        const { nombre, descripcion, precio, imagen } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!nombre || !descripcion || !precio || !imagen) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // Conectar a la base de datos
        connection = await oracledb.getConnection(dbConfig);

        // Insertar la habitación en la base de datos
        const result = await connection.execute(
            `INSERT INTO habitaciones (id, nombre, descripcion, precio, imagen) 
             VALUES (habitaciones_seq.NEXTVAL, :nombre, :descripcion, :precio, :imagen)`,
            {
                nombre,
                descripcion,
                precio,
                imagen: Buffer.from(imagen, 'base64') // Convertir imagen a formato BLOB
            },
            { autoCommit: true }
        );

        res.status(201).json({ message: 'Habitación ingresada exitosamente', result });
    } catch (error) {
        console.error('Error al ingresar habitación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error('Error al cerrar la conexión:', err);
            }
        }
    }
};

// Controlador para actualizar una habitación
exports.actualizarHabitacion = async (req, res) => {
    let connection;

    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, imagen } = req.body;

        if (!nombre || !descripcion || !precio || !imagen) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
        }

        // Conectar a la base de datos
        connection = await oracledb.getConnection(dbConfig);

        // Actualizar la habitación en la base de datos
        const result = await connection.execute(
            `UPDATE habitaciones 
             SET nombre = :nombre, descripcion = :descripcion, precio = :precio, imagen = :imagen
             WHERE id = :id`,
            {
                nombre,
                descripcion,
                precio,
                imagen: Buffer.from(imagen, 'base64'), // Convertir imagen a formato BLOB
                id
            },
            { autoCommit: true }
        );

        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Habitación no encontrada.' });
        }

        res.status(200).json({ message: 'Habitación actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar habitación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};

exports.eliminarHabitacion = async (req, res) => {
    let connection;

    try {
        const { id } = req.params;  // Obtener el ID de los parámetros de la solicitud
        console.log('ID recibido:', id);  // Verificar que el ID esté llegando correctamente

        // Conectar a la base de datos Oracle
        connection = await oracledb.getConnection(dbConfig);

        // Ejecutar la consulta para eliminar la habitación
        const result = await connection.execute(
            `DELETE FROM habitaciones WHERE id = :id`,
            { id: parseInt(id) },  // Asegurarse de que el ID sea un número entero
            { autoCommit: true }
        );

        // Verificar si alguna fila fue afectada (si la habitación fue eliminada)
        if (result.rowsAffected === 0) {
            return res.status(404).json({ error: 'Habitación no encontrada.' });
        }

        // Si la eliminación fue exitosa
        res.status(200).json({ message: 'Habitación eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar habitación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
};