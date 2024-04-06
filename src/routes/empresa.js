const express = require('express');
const multer = require('multer');
const app = express();

const { verificaToken } = require('../middlewares/autenticacion');

let empresa = require('../models/empresa');

// ========================================
// Almacena las imágenes de los usuarios
// ========================================
const storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
      cb(null, './uploads/empresas/logos')
    },
    filename: function (req, file, cb) {    
      cb(null, req.body.logo);
    }
});

const upload = multer({ storage: storage });

// =============================
// Consultar Empresas
// =============================
app.get('/empresa/listar', verificaToken, (req, res) => {

    empresa
        .find({}, 'nombre ubicacion telefono activo logo')
        .exec( (err, empresaDB) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                empresaDB
            });
                        
    });

});

// =============================
// Crear Empresa
// =============================
app.post('/empresa/crear', upload.single('logoImage'), verificaToken, (req, res) => {
   
    let body = req.body;

    let data = new empresa({
        nombre: body.nombre,
        ubicacion: body.ubicacion,
        telefono: body.telefono,
        activo: body.activo,
        logo: body.logo,
    });

    data.save((err, empresaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!empresaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            empresaDB
        });

    });
});

module.exports = app;