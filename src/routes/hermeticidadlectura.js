const express = require('express');
const multer = require('multer');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let hermeticidadlectura = require('../models/hermeticidadlectura');

// ===================================================
// Almacena las imágenes del reporte de hermeticidad
// ===================================================
const storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
        cb(null, './uploads/reportes/hermeticidad');
    },
    filename: function (req, file, cb) {  
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// ===================================================================
// Consultar todas las lecturas de un reporte de hermeticidad
// ===================================================================
app.get('/hermeticidadlectura/listar/:hermeticidad', verificaToken, (req, res) => {

    let hermeticidad = req.params.hermeticidad;

    hermeticidadlectura.find({ hermeticidad: hermeticidad }) 
                       .exec((err, hermeticidadlecturaDB) => {
                            if (err) {
                                return res.status(400).json({
                                    ok: false,
                                    err
                                });
                            }

                            res.json({
                                ok: true,
                                hermeticidadlecturaDB
                            });
                            
    });

});

// ========================================
// Crear lectura x reporte hermeticidad
// ========================================
app.post('/hermeticidadlectura/crear', upload.single('file'), verificaToken, (req, res) => {

    let body = req.body;
 
    let data = new hermeticidadlectura({
        hermeticidad: body.hermeticidad,
        ubicacion: body.ubicacion,
        imageninicial: body.imageninicial,
        lecturainicial: body.lecturainicial,
        fechainicial: body.fechainicial,
        realizo: body.realizo,
        observaciones: body.observaciones,
    });

    data.save((err, hermeticidadlecturaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!hermeticidadlecturaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            hermeticidadlecturaDB
        });

    });
});

// ========================================
// Actualiza lectura x reporte hermeticidad
// ========================================
app.put('/hermeticidadlectura/actualizar/:_id', upload.single('file'), verificaToken, (req, res) => {

    let _id = req.params._id;
    let body = req.body;

    hermeticidadlectura.findByIdAndUpdate(_id, body, {new: true, runValidators: true}, (err, hermeticidadlecturaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            hermeticidadlecturaDB
        });

    });
});

module.exports = app;