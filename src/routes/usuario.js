const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../models/usuario');
const app = express();

let { verificaTokenAdmin } = require('../middlewares/autenticacion');

// ========================================
// Almacena las imágenes de los usuarios
// ========================================
const storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
      cb(null, './uploads/usuarios/firmas')
    },
    filename: function (req, file, cb) {    
      cb(null, req.body.imgfirma);
    }
});

const upload = multer({ storage: storage });

// ========================================
// Obtiene todos los usuarios
// ========================================
app.get('/usuario', verificaTokenAdmin, (req, res) => {

    Usuario.find({})
           .populate('empresa')
           .exec((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({}, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarioDB
                    });
                });
                
           });
});

// ========================================
// Obtiene todos los usuarios x empresa
// =======================================
app.get('/usuario/:empresa', verificaTokenAdmin, (req, res) => {

    let empresa = req.params.empresa;

    Usuario.find({ empresa: empresa, role : { $nin: ['ADMIN'] } })
           .populate('empresa')
           .exec((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({}, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarioDB
                    });
                });
                
           });
});

// ========================================
// Consultar un usuario a partir del Email
// ========================================
app.get('/unusuario/:email', verificaTokenAdmin, (req, res) => {

    let email = req.params.email;

    Usuario.findOne({ email: email })
            .exec((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({}, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarioDB
                    });
                });
                
           });
});

// ========================================
// Crear nuevo usuario x empresa
// ========================================
app.post('/usuario', upload.single('signimg'), verificaTokenAdmin, (req, res) => {

    let body = req.body;
   
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        empresa: body.empresa,
        imgfirma: body.imgfirma
    });

    usuario.save((err, usuarioDB) => {        
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuarioDB
        });
    });

});

// ========================================
// Actualizar un usuario
// =======================================
app.put('/usuario/editar/:id', upload.single('signimg'), verificaTokenAdmin, (req, res) => {
    
    let id = req.params.id;
    let fields = [
        'nombre',
        'email', 
        'role',
        'empresa',
        'estado', 
        'enterweb', 
        'entermovil', 
        'editorder'
    ];
    
    if (req.body.imgfirma) {
        fields.push('imgfirma');
    }

    let body = _.pick(req.body, fields);

    Usuario.findByIdAndUpdate(
        id, 
        body, 
        {
            new: true,
            runValidators: true,
            context: 'query'
        }, 
        (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
    
});


// ========================================
// Actualizar clave de un usuario
// =======================================
app.put('/usuario/editarclave/:id', verificaTokenAdmin, (req, res) => {
    
    let id = req.params.id;
    req.body.password = bcrypt.hashSync(req.body.password, 10)
    let body = _.pick(req.body, ['password']);

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });
    
});

// ========================================
// Consultar un usuario a partir del ID
// ========================================
app.get('/unusuarioid/:id', verificaTokenAdmin, (req, res) => {

    let id = req.params.id;

    Usuario.findOne({ _id: id })
           .exec((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.count({}, (err, conteo) => {
                    res.json({
                        ok: true,
                        usuarioDB
                    });
                });
                
           });
});

// ========================================
// Elimina usuario
// ========================================
app.delete('/usuario/eliminar/:id', verificaTokenAdmin, (req, res) => {
    
    let id = req.params.id;
   
    Usuario.findByIdAndRemove(id, (err) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true
        });              
        
    });

});    

module.exports = app;