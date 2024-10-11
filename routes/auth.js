//routes/auth.js
const express = require('express'),
router = express.Router(),
{_create, _findByUsername} = require('../controllers/users'),
passport = require('passport'),
jwt = require('jsonwebtoken');

router.post('/signin', async(req, res, next) =>{
    passport.authenticate('local', { session: false}, function (err, user, info) {
        if (err) return res.status(500).json(err);
        if (!user) return res.status(400).json(info);
        
        // Incluir el rol en el token JWT
        const token = jwt.sign({
            id: user.id,
            nombre_usuario: user.nombre_usuario,
            rol: user.rol  // Asegúrate de que este campo esté presente en el objeto `user`
        }, process.env.SECRET_KEY, { expiresIn: '1h' });

        return res.status(200).json({
            token, expiresIn: 3600, user
        });
    })(req, res, next);
});

router.post('/signup', async (req, res) => {
    try{
        const foundUser = await _findByUsername(req.body.nombre_usuario);
    if(foundUser){
        return res.status(400).json(`El nombre de usuario ${foundUser.nombre_usuario} ya existe...`)
    }
        const user = await _create(req.body);
        return res.status(201).json({
           status : 'Exitoso',
            message :  `El usuario ${user.nombre_usuario} fue creado exitosamente`
        })
    } catch (e){
        console.error(e);
        return res.status(500).json(e.message);
    }
});

module.exports =router;
