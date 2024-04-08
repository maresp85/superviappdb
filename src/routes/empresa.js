const express = require('express');
const multer = require('multer');
const app = express();

let { verificaTokenAdmin } = require('../middlewares/autenticacion');

let empresa = require('../models/empresa');

// ========================================
// Almacena las imágenes de las empresas
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
app.get('/empresa/listar', verificaTokenAdmin, (req, res) => {

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
app.post('/empresa/crear', upload.single('logoImage'), verificaTokenAdmin, (req, res) => {
   
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


// ========================================
// Actualizar empresa
// ========================================
app.put('/empresa/editar/:id', (req, res) => {
    
    let id = req.params.id;
    let body = req.body;
   
    empresa.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, empresaDB) => {
        if (err) {
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