const express = require('express');

let app = express();

let ordentipotrabajo = require('../models/ordentipotrabajo');

// ===================================================================
// Consultar todas las ordenes de tipo de trabajo por orden de trabajo
// ===================================================================
app.get('/ordentipotrabajo/listar/:ordentrabajo', (req, res) => {

    let ordentrabajo = req.params.ordentrabajo;

    ordentipotrabajo
        .find({ ordentrabajo: ordentrabajo })
        .populate({
            path : 'ordentrabajo',
            populate : { path : 'obra' }
        })
        .populate('tipotrabajo') 
        .populate('trabajo') 
        .sort([['orden']])                 
        .exec((err, ordentipotrabajoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ordentipotrabajoDB
            });                        
    });

});


module.exports = app;