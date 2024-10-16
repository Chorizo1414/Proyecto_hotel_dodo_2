const usuarioModel = require('../models/usuarioModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Crear un nuevo usuario
async function createUsuario(req, res) {
    const { nombre, apellido, email, password } = req.body;
    if (!nombre || !apellido || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    try {
        const result = await usuarioModel.createUsuario(nombre, apellido, email, password);
        res.status(201).json({ message: 'Usuario registrado exitosamente', result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Inicio de sesión
async function loginUsuario(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }
    
    try {
        const user = await usuarioModel.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar un token JWT
        const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createUsuario, loginUsuario };

