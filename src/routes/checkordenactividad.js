const express = require('express');

let app = express();

let checkOrdenActividad = require('../models/checkordenactividad');

// ===============================================
// Consultar todas la lista de chequeo x orden actividad
// ===============================================
app.get('/checkordenactividad/listar/:ordenactividad', (req, res) => {

    let ordenactividad = req.params.ordenactividad;

    checkOrdenActividad
        .find({ ordenactividad: ordenactividad })
        .exec((err, checkOrdenActividadDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                checkOrdenActividadDB
            });                                
    });

});

// ===============================================
// Consultar todas la lista de chequeo x orden actividad
// ===============================================
app.get('/checkordenactividad/listarordentrabajo/:ordentrabajo', (req, res) => {

    let ordentrabajo = req.params.ordentrabajo;

    checkOrdenActividad
        .find({ ordentrabajo: ordentrabajo })
        .exec((err, checkOrdenActividadDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                checkOrdenActividadDB
            });                                
    });

});

module.exports = app;