//services/users/create.js
const db = require('../../models');
const bcrypt = require('bcrypt');

async function create(user) {
    if (!user.nombre_usuario) throw new Error('Nombre de usuario no ingresado');
    if (!user.password) throw new Error('Contrasenia no ingresada');

    return await db.USUARIOs.create({
        ...user,
        password: bcrypt.hashSync(user.password, 10)
    });
}

module.exports = {
    create 
}