const express = require('express');
const { verificaTokenAdmin } = require('../middlewares/autenticacion');
let app = express();

let tipotrabajo = require('../models/tipotrabajo');
let actividad = require('../models/actividad');
let itemactividad = require('../models/itemactividad');

// ==============================================
// Consultar todos los tipos de trabajo x empresa
// ==============================================
app.get('/tipotrabajo/listar', verificaTokenAdmin, (req, res) => {

    tipotrabajo
        .find()
        .populate('trabajo')
        .populate('empresa')
        .sort([['trabajo']])     
        .sort([['orden']])     
        .exec((err, tipotrabajoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

        res.json({
            ok: true,
            tipotrabajoDB
        });                        
    });

});

// ==============================================
// Consultar todos los tipos de trabajo x empresa
// ==============================================
app.get('/tipotrabajo/listar/:empresa', verificaTokenAdmin, (req, res) => {

    let empresa = req.params.empresa;

    tipotrabajo.find({ empresa: empresa })
               .populate('trabajo')
               .sort([['trabajo']])     
               .sort([['orden']])     
               .exec((err, tipotrabajoDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                res.json({
                    ok: true,
                    tipotrabajoDB
                });                        
    });

});

// ==============================================
// Consultar un tipo de trabajo
// ==============================================
app.get('/tipotrabajo/listaruno/:_id', (req, res) => {

    let _id = req.params._id;

    tipotrabajo.find({ _id: _id })
               .populate('trabajo')
               .exec((err, tipotrabajoDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                res.json({
                    ok: true,
                    tipotrabajoDB
                });                        
    });

});

// ========================================
// Crear tipo de trabajo x empresa
// ========================================
app.post('/tipotrabajo/crear', (req, res) => {
   
    let body = req.body;

    let data = new tipotrabajo({
        nombre: body.nombre,
        trabajo: body.trabajo,
        empresa: body.empresa
    });

    data.save((err, tipotrabajoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!tipotrabajoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            tipotrabajoDB
        });

    });
});

// ========================================
// Actualizar tipotrabajo
// =======================================

app.put('/tipotrabajo/editar/:id', (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    tipotrabajo.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, tipotrabajoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            tipotrabajoDB
        });

    });
    
});

// ========================================
// Eliminar tipotrabajo
// ========================================
app.delete('/tipotrabajo/eliminar/:id', verificaTokenAdmin, (req, res) => {
    
    let id = req.params.id;
   
    tipotrabajo.findByIdAndRemove(id, (err) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        actividad.deleteMany({ tipotrabajo: id }, (err) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            itemactividad.deleteMany({tipotrabajo: id}, (err) => {

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
      
    });
    
});

module.exports = app;