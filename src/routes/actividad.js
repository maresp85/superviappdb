const express = require('express');

let app = express();
const { verificaToken, verificaTokenAdmin } = require('../middlewares/autenticacion');
let actividad = require('../models/actividad');
let tipotrabajo = require('../models/tipotrabajo');
let itemactividad = require('../models/itemactividad');

// ==============================================
// Consultar todas las actividades x empresa
// ==============================================
app.get('/actividad/listar/:empresa', verificaTokenAdmin, (req, res) => {

    let empresa = req.params.empresa;

    actividad
        .find({ empresa: empresa })
        .populate({ path : 'tipotrabajo' })
        .populate({ path : 'trabajo' })             
        .sort([['trabajo', 1]])
        .sort([['tipotrabajo', 1]])
        .sort([['orden', 1]])
        .exec((err, actividadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            actividadDB
        });
                        
    });

});


// ===================================================
// Consultar todas las actividades x trabajo x empresa
// ===================================================
app.get('/actividad/listartrabajo/:empresa/:trabajo', verificaTokenAdmin, (req, res) => {

    let empresa = req.params.empresa;
    let trabajo = req.params.trabajo;
    
    actividad
        .find({ empresa: empresa, trabajo: trabajo })
        .populate({path : 'tipotrabajo'})
        .populate({path : 'trabajo'})
        .sort([['trabajo', 1]])
        .sort([['tipotrabajo', 1]])
        .sort([['orden', 1]])
        .exec((err, actividadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            actividadDB
        });
                                
    });

});


// ==========================================================
// Consultar todas las actividades x trabajo x empresa x role
// ==========================================================
app.get('/actividad/listartrabajo-role/:trabajo/:role', verificaToken, (req, res) => {

    let trabajo = req.params.trabajo;
    let role = req.params.role;

    actividad
        .find({ trabajo: trabajo, role: role })
        .populate({path : 'tipotrabajo'})
        .populate({path : 'trabajo'})
        .sort([['trabajo', 1]])
        .sort([['tipotrabajo', 1]])
        .sort([['orden', 1]])
        .exec((err, actividadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            actividadDB
        });
                     
    });

});

// =================================================
// Consultar todas las actividades x tipo de trabajo
// =================================================
app.get('/actividad/listartt/:tipotrabajo', (req, res) => {

    let tipotrabajo = req.params.tipotrabajo;

    actividad
        .find({ tipotrabajo: tipotrabajo })
        .populate('tipotrabajo')
        .sort([['orden', 1]])
        .exec((err, actividadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            actividadDB
        });
                                
    });

});

// =================================================
// Consultar una actividad a partir del ID
// =================================================
app.get('/actividad/listaruna/:id', (req, res) => {

    let id = req.params.id;

    actividad
        .findOne({ _id: id })
        .exec((err, actividadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            actividadDB
        });
                                
    });

});

// ========================================
// Crear actividad
// ========================================
app.post('/actividad/crear', (req, res) => {
   
    let body = req.body;

    //se captura la empresa y el trabajo asociado al tipo de trabajo
    tipotrabajo
        .findOne({ _id: body.tipotrabajo })
        .exec((err, tipotrabajoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            let data = new actividad({
                nombre: body.nombre,
                orden: body.orden,
                role: body.role,
                tipotrabajo: body.tipotrabajo,
                trabajo: tipotrabajoDB.trabajo,
                empresa: tipotrabajoDB.empresa
            });
        
            data.save((err, actividadDB) => {
        
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
        
                if (!actividadDB) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
        
                res.json({
                    ok: true,
                    actividadDB
                });
        
            });                        
    });
    
});


// ========================================
// Actualizar actividad
// ========================================
app.put('/actividad/editar/:id', (req, res) => {
    
    let id = req.params.id;
    let body = req.body;

    actividad.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, actividadDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            actividadDB
        });

    });
    
});

// ========================================
// Eliminar Actividad
// ========================================
app.delete('/actividad/eliminar/:id', (req, res) => {
    
    let id = req.params.id;
   
    actividad.findByIdAndRemove(id, (err) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        itemactividad.deleteMany({actividad: id}, (err) => {

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