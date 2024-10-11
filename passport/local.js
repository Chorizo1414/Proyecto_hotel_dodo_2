// passport/local.js
const LocalStrategy = require('passport-local').Strategy,
{ _findByUsername } = require('../controllers/users'),
bcrypt = require('bcrypt');

module.exports = new LocalStrategy({
    usernameField: 'nombre_usuario',
    passwordField: 'password',
    session: false
}, async (nombre_usuario, password, done) => {
    try {
        const user = await _findByUsername(nombre_usuario);
        if (!user) return done(null, false, 'Usuario o password incorrecta');
        const match = bcrypt.compareSync(password, user.password);
        if (!match) return done(null, false, 'Usuario o password incorrecta');

        return done(null, {
            nombre_usuario: user.nombre_usuario,
            rol: user.rol,  // Incluir el rol en el token
            id: user.id
        });
    } catch (e) {
        done(e);
    }
});
