const express = require('express');

let app = express();

let actividad = require('../models/actividad');
let itemactividad = require('../models/itemactividad');

// ==============================================
// Consultar todos los item activos
// ==============================================
app.get('/itemactividad/listartodos', (req, res) => {

    itemactividad.find({ activo: 1 })
                 .exec((err, itemactividadDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        itemactividadDB
                    });
                                
    });

});


// ==============================================
// Consultar todos los item x actividad
// ==============================================
app.get('/itemactividad/listar/:actividad', (req, res) => {

    let actividad = req.params.actividad;

    itemactividad.find({ actividad: actividad })
                 .sort([['cumple', -1]])   
                 .exec((err, itemactividadDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        itemactividadDB
                    });
                                
    });

});


// ==============================================
// Consultar items x id
// ==============================================
app.get('/itemactividad/listaruna/:id', (req, res) => {

    let id = req.params.id;

    itemactividad.find({ _id: id })
                 .exec((err, itemactividadDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        itemactividadDB
                    });
                                
    });

});


// ====================================================
// Consultar todos los item x actividad x cumplimiento
// ====================================================
app.get('/itemactividad/listarcumple/:actividad/:cumple', (req, res) => {

    let cumple = req.params.cumple;
    let actividad = req.params.actividad;

    itemactividad
        .find({ actividad: actividad, cumple: cumple, activo: 1 })
        .exec((err, itemactividadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            itemactividadDB
        });
                                
    });

});

// ====================================================
// Consultar todos los item x actividad x cumplimiento
// ====================================================
app.get('/itemactividad/listarnota/:actividad', (req, res) => {

    let actividad = req.params.actividad;

    itemactividad
        .find({ actividad: actividad, activo: 1 })
        .exec((err, itemactividadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            itemactividadDB
        });
                                
    });

});


// ========================================
// Crear item actividad
// ========================================
app.post('/itemactividad/crear', (req, res) => {
   
    let body = req.body;

    //se captura la empresa y el trabajo asociado al tipo de trabajo
    actividad.findOne({ _id: body.actividad })
             .exec((err, actividadDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                let data = new itemactividad({
                    actividad: body.actividad,
                    trabajo: actividadDB.trabajo,
                    tipotrabajo: actividadDB.tipotrabajo,                    
                    empresa: body.empresa,
                    cumple: body.cumple,
                    tipo: body.tipo,
                    etiqueta: body.etiqueta,
                    imagen: body.imagen
                });
            
                data.save((err, itemactividadDB) => {
            
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }
            
                    if (!itemactividadDB) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
            
                    res.json({
                        ok: true,
                        itemactividadDB
                    });
            
                });
                        
    });
    
});


// ========================================
// Actualizar itemactividad
// ========================================
app.put('/itemactividad/editar/:id', function (req, res) {
    
    let id = req.params.id;
    let body = req.body;

    itemactividad.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, itemactividadDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            itemactividadDB
        });

    });
    
});


// ========================================
// Eliminar itemactividad
// ========================================
app.delete('/itemactividad/eliminar/:id', function (req, res) {
    
    let id = req.params.id;

    itemactividad.findByIdAndRemove(id, (err, itemactividadDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            itemactividadDB
        });

    });
    
});

module.exports = app;