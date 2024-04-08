const express = require('express');
let app = express();

const { verificaToken } = require('../middlewares/autenticacion');
let obrausuario = require('../models/obrausuario');


// ================================================
// Consultar todas los usuarios asignados por obra
// ================================================
app.get('/obrausuario/listar/:obra', verificaToken, (req, res) => {

    let obra = req.params.obra;

    obrausuario
        .find({ obra: obra })   
        .populate('obra')
        .populate('usuario')
        .sort([['id', -1]])    
        .exec((err, obrausuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

        res.json({
            ok: true,
            obrausuarioDB
        });
                        
    });

});


// ========================================
// Asignar usuario por obra
// ========================================
app.post('/obrausuario/crear', verificaToken, (req, res) => {
   
    let body = req.body;

    obrausuario.find({ obra: body.obra, usuario: body.usuario }, (err, obrausuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (obrausuarioDB.length > 0) {
            
            obrausuarioDB.forEach((item) => {

                return res.status(400).json({
                    ok: false,
                    err: 'El usuario ya se encuentra asociado a la obra'
                });

            });            
        
        } else {

            let data = new obrausuario({        
                obra: body.obra,
                usuario: body.usuario,
                empresa: body.empresa
            });
        
            data.save((err, obrausuarioDB) => {
        
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
        
                if (!obrausuarioDB) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
        
                res.json({
                    ok: true,
                    obrausuarioDB
                });
        
            });

        }   

    });
    
});


// ========================================
// Eliminar usuario en una obra
// ========================================
app.delete('/obrausuario/eliminar/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
   
    obrausuario.findByIdAndRemove(id, (err) => {

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