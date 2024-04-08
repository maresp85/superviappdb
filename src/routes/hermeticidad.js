const express = require('express');
const fs = require('fs')
let app = express();

const { verificaToken } = require('../middlewares/autenticacion');
let obrausuario = require('../models/obrausuario');
let hermeticidad = require('../models/hermeticidad');
let hermeticidadlectura = require('../models/hermeticidadlectura');

// ======================================================
// Consultar todos los reportes de hermeticidad x empresa
// ======================================================
app.get('/hermeticidad/listar/:empresa', verificaToken, (req, res) => {

    let empresa = req.params.empresa;

    hermeticidad.find({ empresa: empresa })
               .populate('obra')
               .populate('usuario')
               .sort([['id', -1]])    
               .exec((err, hermeticidadDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                res.json({
                    ok: true,
                    hermeticidadDB
                });
                        
    });

});

// ======================================================
// Consultar todos los reportes de hermeticidad x usuario
// ======================================================
app.get('/hermeticidad/listarusuario/:usuario', verificaToken, (req, res) => {

    let usuario = req.params.usuario;

    hermeticidad
        .find({ usuario: usuario })
        .populate('obra')
        .populate('usuario')
        .sort([['id', -1]])    
        .exec((err, hermeticidadDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

        res.json({
            ok: true,
            hermeticidadDB
        });                        
    });

});

// =============================================================
// Consultar todos los reportes de hermeticidad x usuario x obra
// =============================================================
app.get('/hermeticidad/listarusuario-obra/:usuario', verificaToken, (req, res) => {

    let usuario = req.params.usuario;

    obrausuario
        .find({ usuario: usuario })
        .populate('usuario')     
        .populate('obra')     
        .exec((err, obrausuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

        let obras = [];
        let role = '';
        obrausuarioDB.forEach((item) => {
            if (item.obra.activo) {
                obras.push(item.obra._id);
            }            
            role = item.usuario.role;
        });

        // Si es SUPERVISOR SSTA, ordenes asignadas
        // Sino todas las ordenes de las obras asignadas.
        if (role === 'SUPERVISOR SSTA') {
            query = { usuario: usuario, obra: { $in: obras } };
        } else {
            query = { obra: { $in: obras } };
        }

        hermeticidad
            .find(query)
            .populate('obra')
            .populate('usuario')
            .sort([['id', -1]])    
            .exec((err, hermeticidadDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    hermeticidadDB
                });                        
            });                  
    });

    

});

// ======================================================
// Consultar reporte de hermeticidad
// ======================================================
app.get('/hermeticidad/listaruna/:_id', verificaToken, (req, res) => {

    let _id = req.params._id;

    hermeticidad.find({ _id: _id })
               .populate('obra')
               .populate('usuario')
               .sort([['id', -1]])    
               .exec((err, hermeticidadDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                res.json({
                    ok: true,
                    hermeticidadDB
                });
                        
    });

});

// ========================================
// Crear reporte de hermeticidad x empresa
// ========================================
app.post('/hermeticidad/crear', verificaToken, (req, res) => {
   
    let body = req.body;

    let data = new hermeticidad({   
        empresa: body.empresa,
        obra: body.obra,
        fecha: body.fecha,
        estado: "EN PROCESO",
        usuario: body.usuario
    });

    data.save((err, hermeticidadDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!hermeticidadDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
    
        res.json({
            ok: true,
            hermeticidadDB
        });

    });
});

// ========================================
// Eliminar reporte Hermeticidad
// ========================================
app.delete('/hermeticidad/eliminar/:_id', verificaToken, (req, res) => {
    
    let _id = req.params._id;
   
    hermeticidad.findByIdAndRemove(_id, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        hermeticidadlectura.deleteMany({hermeticidad: _id}, (err) => {
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

module.exports = app;