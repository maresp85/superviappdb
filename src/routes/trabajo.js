const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const { verificaTokenAdmin } = require('../middlewares/autenticacion');
let app = express();

let trabajo = require('../models/trabajo');

// =============================
// Consultar todos los Trabajos
// =============================
app.get('/trabajo/listar', (req, res) => {

    trabajo.find()
           .populate('empresa')
           .exec((err, trabajoDB) => {
                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    trabajoDB
                });
                        
    });

});

// =======================================
// Consultar todos los Trabajos x Empresa
// =======================================
app.get('/trabajo/listar/:empresa', (req, res) => {

    let empresa = req.params.empresa;

    trabajo.find({ empresa: empresa })
           .exec((err, trabajoDB) => {
                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    trabajoDB
                });
                        
    });

});

// ==============================================
// Consultar todos los Trabajos excepto bitácoras
// ==============================================
app.get('/trabajo/listar-no-bitacora/:empresa', (req, res) => {

    let empresa = req.params.empresa;

    trabajo.find({ empresa: empresa, bitacora: false })
           .exec( (err, trabajoDB) => {
                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    trabajoDB
                });
                        
    });

});

// =============================
// Consultar Bitácoras
// =============================
app.get('/trabajo/listar-filtrobitacora/:empresa/:bitacora', (req, res) => {

    let empresa = req.params.empresa;
    let bitacora = req.params.bitacora;

    trabajo.find({ empresa: empresa, bitacora: bitacora })
           .exec( (err, trabajoDB) => {
                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    trabajoDB
                });
                        
    });

});

// ==============================================
// Consultar un trabajo
// ==============================================
app.get('/trabajo/listaruno/:_id', verificaToken, (req, res) => {

    let _id = req.params._id;

    trabajo
        .find({ _id: _id })
        .exec((err, trabajoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

        res.json({
            ok: true,
            trabajoDB
        });                        
    });

});

// =============================
// Crear Trabajo
// =============================
app.post('/trabajo/crear', verificaToken, (req, res) => {
   
    let body = req.body;

    let data = new trabajo({
        nombre: body.nombre,
        empresa: body.empresa,
        fechaMejora: body.fechaMejora,
        legalizaCualquierOrden: body.legalizaCualquierOrden,
        bitacora: body.bitacora,
        gradeChart: body.gradeChart,
    });

    data.save((err, trabajoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!trabajoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            trabajoDB
        });

    });
});

// ========================================
// Editar trabajo
// =======================================

app.put('/trabajo/editar/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    trabajo.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, trabajoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            trabajoDB
        });

    });
    
});

// ========================================
// Eliminar tipotrabajo
// ========================================
app.delete('/trabajo/eliminar/:id', verificaTokenAdmin, (req, res) => {
    
    let id = req.params.id;
   
    trabajo.findByIdAndRemove(id, (err) => {

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