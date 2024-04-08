const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');
const app = express();

const empresa = require('../models/empresa');

// ===================================================================
// Login utilizado desde el móvil
// ===================================================================
app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email.trim(), estado: 1 }, (err, usuarioDB) => {
       
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                }
            });
        }

        if (!usuarioDB.entermovil) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario sin permiso para ingresar, contacte al administrador'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecta'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });

        res.json({
            ok: true,
            usuarioDB,
            token
        });

    });
  
});

// ===================================================================
// Login utilizado desde la Web
// ===================================================================
app.post('/loginweb', (req, res) => {

    let body = req.body;

    Usuario
        .findOne({ email: body.email, estado: 1 })
        .populate('empresa')  
        .exec((err, usuarioDB) => {
       
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario incorrecto'
                }
            });
        }

        if (!usuarioDB.enterweb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario sin permiso para ingresar, contacte al administrador'
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Contraseña incorrecta'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CAD_TOKEN });

        res.json({
            ok: true,
            usuarioDB,
            token
        });

    });
  
});


module.exports = app;