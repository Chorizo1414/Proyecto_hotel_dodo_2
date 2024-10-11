//controllers/users.js
const { create } = require('../services/users/create');
const { findByUsername, findAll } = require('../services/users/find');

async function _create(user){
    return await create(user);
}

async function _findByUsername(nombre_usuario) {
    return await findByUsername(nombre_usuario);
}

async function _findAll(){
    return await findAll();
}

module.exports = {
    _create, _findByUsername, _findAll
}