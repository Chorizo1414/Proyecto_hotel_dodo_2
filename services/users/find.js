//services/users/find.js
const db = require('../../models');

async function findByUsername(nombre_usuario){
    if (!nombre_usuario) throw new Error('No hay ningun nombre de usuario');
    return await db.USUARIOs.findOne({
        where: {
            nombre_usuario
        }
    });
}

async function findAll(){
    return await db.USUARIOs.findAll({
        attributes:  [
            'id',
            'nombre_usuario',
            'created_at'
    ] 
    });

}

module.exports = {
    findByUsername, findAll
}