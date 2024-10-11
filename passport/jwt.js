//passport/jwt.js
const JWTStrategy = require('passport-jwt').Strategy,
ExtractJWT = require('passport-jwt').ExtractJwt,
{ _findByUsername } = require('../controllers/users');

module.exports = new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY,
    ignoreExpiration: false
}, async (jwt_payload, done) => {
    const user = await _findByUsername(jwt_payload.nombre_usuario);
    if (!user) return done(null, false, 'Usuario no autorizado');
    return done(null, {
        id: user.id,
        nombre_usuario: user.nombre_usuario,
    });
});