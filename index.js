    require('dotenv').config();
    const port = process.env.PORT || 3000,
    express = require('express'),
    app = express(),
    db = require('./models'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('./passport/local'),
    JWTStrategy = require('./passport/jwt'),
    oracledb = require('oracledb'),
    path = require('path');
    app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Configuración de passport
passport.use('local', LocalStrategy);
passport.use('jwt', JWTStrategy);
app.use(passport.initialize());


// Configuración de rutas de autenticación y usuarios
app.use('/auth', require('./routes/auth'));
app.use('/users', require('./routes/users'));

app.use('/api/habitaciones', require('./routes/habitaciones')); 


// Configuración de conexión a la base de datos Oracle
const dbConfig = {
    user: process.env.ORACLE_USER,
    password: process.env.ORACLE_PASSWORD,
    connectString: process.env.ORACLE_CONNECTION
};

// Ruta para obtener las habitaciones desde la base de datos Oracle
app.get('/api/habitaciones', async (req, res) => {
    let connection;

    try {
        connection = await oracledb.getConnection(dbConfig);

        // Incluir el campo 'id' en la consulta
        const result = await connection.execute(`
            SELECT id, nombre, descripcion, precio, imagen
            FROM habitaciones
        `);

        const habitaciones = await Promise.all(result.rows.map(async room => {
            let imagenBase64 = '';
            if (room[4]) {  // room[4] es la columna de imagen
                const buffer = await room[4].getData(); // Obtener el BLOB
                imagenBase64 = buffer.toString('base64'); // Convertir a base64
            }
            return {
                id: room[0],          // id
                nombre: room[1],       // nombre
                descripcion: room[2],  // descripcion
                precio: room[3],       // precio
                imagen: imagenBase64   // imagen convertida a base64
            };
        }));

        res.json(habitaciones);  // Enviar como JSON al frontend
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener las habitaciones' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});


// Nueva ruta para agregar una habitación a la base de datos Oracle
app.post('/api/habitaciones', async (req, res) => {
    let connection;

    try {
        const { nombre, descripcion, precio, imagen } = req.body;

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
                console.error(err);
            }
        }
    }
});

// Ruta para obtener los servicios adicionales desde la base de datos Oracle
app.get('/api/servicios', async (req, res) => {
    let connection;

    try {
        // Conectar a la base de datos Oracle
        connection = await oracledb.getConnection(dbConfig);

        // Consulta SQL para obtener los servicios
        const result = await connection.execute(`
            SELECT nombre, descripcion, precio, imagen
            FROM servicios
        `);

        // Convertir el BLOB a base64 y enviar al frontend
        const servicios = await Promise.all(result.rows.map(async servicio => {
            let imagenBase64 = '';
            if (servicio[3]) {  // servicio[3] es la columna de imagen
                const buffer = await servicio[3].getData(); // Obtener el BLOB
                imagenBase64 = buffer.toString('base64'); // Convertir a base64
            }
            return {
                nombre: servicio[0],        // nombre
                descripcion: servicio[1],   // descripcion
                precio: servicio[2],        // precio
                imagen: imagenBase64        // imagen convertida a base64
            };
        }));

        res.json(servicios);  // Enviar como JSON al frontend
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los servicios' });
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta 'frontend'
app.use(express.static(path.join(__dirname, 'frontend')));

// Redireccionar a la página principal para todas las rutas que no coincidan con la API
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/habitaciones.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`servidor corriendo en puerto ${port}...`);
});

// Conexión a la base de datos Sequelize
db.sequelize
    .sync({ force: false })
    .then(() => console.log('Conexión a la base de datos establecida'))
    .catch((e) => console.log(`Error => ${e}`));
