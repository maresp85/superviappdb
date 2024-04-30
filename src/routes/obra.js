const express = require('express');
let app = express();

const { verificaToken } = require('../middlewares/autenticacion');
let { verificaTokenAdmin } = require('../middlewares/autenticacion')

let obra = require('../models/obra');
let obrausuario = require('../models/obrausuario');
let usuario = require('../models/usuario');

// =============================
// Consultar Obras
// =============================
app.get('/obra/listar', (req, res) => {

    obra.find()
        .populate('empresa')
        .sort([['nombre', 1]])
        .exec((err, obraDB) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                obraDB
            });
                    
    });

});

// =============================
// Consultar Obras x Empresa
// =============================
app.get('/obra/listar/:empresa', (req, res) => {

    let empresa = req.params.empresa;

    obra.find({ activo: 1, empresa: empresa })
        .sort([['nombre', 1]])
        .exec( (err, obraDB) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                obraDB
            });
                    
    });

});

// =============================
// Consultar Obras x Usuario
// =============================
app.get('/obra/listar-usuario/:usuario', verificaToken, (req, res) => {
    let usuarioId = req.params.usuario;

    obrausuario
        .find({ usuario: usuarioId })    
        .populate('obra')
        .exec((err, obrausuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

        let obras = [];
        obrausuarioDB.forEach((item) => {
            if (item.obra && item.obra.activo) {
                obras.push(item.obra._id);
            }
        });

        obra.find({ activo: 1, _id: { $in: obras } })
            .sort([['nombre', 1]])
            .exec( (err, obraDB) => {
                if ( err ) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    obraDB
                });
                    
        });
                        
    });

});

// =============================
// Consultar Obras x Usuario App
// =============================
app.get('/obra/listar-usuario-app/:usuario', verificaToken, (req, res) => {
    let usuarioId = req.params.usuario;


    usuario
        .find({ _id: usuarioId })
        .exec((err, usuarioDB) => {

            if (usuarioDB[0].role === 'SUPERVISOR DEL CONTRATO' || usuarioDB[0].role === 'CONSULTA') {

                obra.find({ activo: 1, empresa: usuarioDB[0].empresa[0] })
                    .sort([['nombre', 1]])
                    .exec( (err, obraDB) => {
                        if ( err ) {
                            return res.status(400).json({
                                ok: false,
                                err
                            });
                        }
        
                        res.json({
                            ok: true,
                            obraDB
                        });                    
                    });

            } else {

                obrausuario
                    .find({ usuario: usuarioId })    
                    .populate('obra')
                    .sort([['nombre', 1]])
                    .exec((err, obrausuarioDB) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                err
                            });
                        }
            
                    let obras = [];
                    obrausuarioDB.forEach((item) => {
                        if (item.obra && item.obra.activo) {
                            obras.push(item.obra._id);
                        }
                    });
            
                    obra.find({ activo: 1, _id: { $in: obras }, })
                        .exec( (err, obraDB) => {
                            if ( err ) {
                                return res.status(400).json({
                                    ok: false,
                                    err
                                });
                            }
            
                            res.json({
                                ok: true,
                                obraDB
                            });                    
                    });
                                    
                });

            }
        });
});

// ==============================================
// Consultar un tipo de trabajo
// ==============================================
app.get('/obra/listaruna/:_id', (req, res) => {

    let _id = req.params._id;

    obra.find({ _id: _id })
        .exec((err, obraDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

        res.json({
            ok: true,
            obraDB
        });                        
    });

});


// =============================
// Crear Obra
// =============================
app.post('/obra/crear', verificaToken, (req, res) => {
   
    let body = req.body;

    let data = new obra({
        nombre: body.nombre,
        direccion: body.direccion,
        empresa: body.empresa,
    });

    data.save((err, obraDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!obraDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            obraDB
        });

    });
});

// ========================================
// Actualizar Obra
// =======================================

app.put('/obra/editar/:id', verificaTokenAdmin, (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    obra.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, obraDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            obraDB
        });

    });
    
});

// ========================================
// Elimina Obra
// ========================================
app.delete('/obra/eliminar/:id', verificaTokenAdmin, (req, res) => {
    
    let id = req.params.id;
   
    obra.findByIdAndRemove(id, (err) => {

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