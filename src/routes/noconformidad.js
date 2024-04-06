const express = require('express');
const multer = require('multer');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let noconformidad = require('../models/noconformidad');

// =====================================================
// Almacena las imágenes del reporte de no conformidades
// =====================================================
const storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
        cb(null, './uploads/reportes/noconformidad');
    },
    filename: function (req, file, cb) {  
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// ===================================================================
// Consultar reportes de No Conformidad x empresa
// ===================================================================
app.get('/noconformidad/listar/:empresa', verificaToken, (req, res) => {

    let empresa = req.params.empresa;

    noconformidad.find({ empresa: empresa }) 
                 .populate('obra')
                 .populate('usuario')
                 .sort([['id', -1]])   
                 .exec((err, noconformidadDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        noconformidadDB
                    });
                            
    });

});

// ========================================================
// Consultar todos los reportes de No Conformidad x usuario
// ========================================================
app.get('/noconformidad/listarusuario/:usuario', verificaToken, (req, res) => {

    let usuario = req.params.usuario;

    noconformidad.find({ usuario: usuario })
               .populate('obra')
               .populate('usuario')
               .sort([['id', -1]])    
               .exec((err, noconformidadDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                res.json({
                    ok: true,
                    noconformidadDB
                });
                        
    });

});

// ======================================================
// Consultar un reporte de No Conformidad
// ======================================================
app.get('/noconformidad/listaruno/:_id', verificaToken, (req, res) => {

    let _id = req.params._id;

    noconformidad.find({ _id: _id })
               .populate('obra')
               .populate('usuario')
               .sort([['id', -1]])    
               .exec((err, noconformidadDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                res.json({
                    ok: true,
                    noconformidadDB
                });
                        
    });

});

// ========================================
// Crear reporte no conformidad
// ========================================
app.post('/noconformidad/crear', upload.array("uploads[]"), verificaToken, (req, res) => {

    let body = req.body;
    let files = req.files;

    let data = new noconformidad({
        empresa: body.empresa,
        fecha_evidencia: body.fecha_evidencia,
        proceso: body.proceso,
        tipo_accion: body.tipo_accion,
        descripcion: body.descripcion,
        tipo_grado: body.tipo_grado,
        quien_detecta: body.quien_detecta,
        numeral_norma: body.numeral_norma,
        resolver: body.resolver != 'undefined' ? body.resolver : null,
        analisis: body.analisis,
        accion_correctiva: body.accion_correctiva,
        verificacion: body.verificacion,
        fecha_verificacion: body.fecha_verificacion != 'undefined' ? body.fecha_verificacion : null,
        estado: body.estado,
        usuario: body.usuario,
        obra: body.obra,
        imagen1: files[0] != 'undefined' ? files[0] : null,
        imagen2: files[1] != 'undefined' ? files[1] : null,
        imagen3: files[2] != 'undefined' ? files[2] : null,
    });

    data.save((err, noconformidadDB) => {  
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!noconformidadDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            noconformidadDB
        });

    });
});

// ========================================
// Actualiza reporte no conformidad
// ========================================
app.put('/noconformidad/actualizar/:_id', upload.array("uploads[]"), verificaToken, (req, res) => {

    let _id = req.params._id;
    let body = req.body;
    let files = req.files;

    if (body.fecha_verificacion === undefined || body.fecha_verificacion === 'null' || body.fecha_verificacion === 'Invalid date') {
        delete body.fecha_verificacion;
    }

    if (body.img1) { 
        delete body.img1;       
        if (files[0]) {
            body.imagen1 = files[0];
        }
    }

    if (body.img2) {     
        delete body.img2;  
        if (files[0]) {
            body.imagen2 = files[0];
        }        
    }

    if (body.img3) { 
        delete body.img3;       
        if (files[0]) {
            body.imagen3 = files[0];
        }
    }

    noconformidad.findByIdAndUpdate(_id, body, {new: true, runValidators: true}, (err, noconformidadDB) => {    
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            noconformidadDB
        });

    });
});

// ========================================
// Eliminar reporte no conformidad
// ========================================
app.delete('/noconformidad/eliminar/:_id', verificaToken, (req, res) => {
    
    let _id = req.params._id;
   
    noconformidad.findByIdAndRemove(_id, (err) => {
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

// ======================================================
// Eliminar imágenes de un reporte de no conformidad
// ======================================================
app.delete('/noconformidad/eliminarimagen/:_id/:_n', (req, res) => {

    let _id = req.params._id;
    let _n = req.params._n;
    let body = [];

    noconformidad
        .find({ _id: _id })
        .exec((err, noconformidadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (_n == 1) {
            body = {"imagen1" : null};
            
            try {
                fs.unlinkSync(noconformidadDB[0].imagen1.destination + '/' + noconformidadDB[0].imagen1.originalname);
                //file removed
            } catch(err) {
                console.error(err)
            }
        }

        if (_n == 2) {
            body = {"imagen2" : null};
            
            try {
                fs.unlinkSync(noconformidadDB[0].imagen2.destination + '/' + noconformidadDB[0].imagen2.originalname);
                //file removed
            } catch(err) {
                console.error(err)
            }
        }

        if (_n == 3) {
            body = {"imagen3" : null};
            
            try {
                fs.unlinkSync(noconformidadDB[0].imagen3.destination + '/' + noconformidadDB[0].imagen3.originalname);
                //file removed
            } catch(err) {
                console.error(err)
            }
        }
            
        noconformidad
            .findByIdAndUpdate(_id, body, {new: true, runValidators: true}, (err, noconformidadDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                noconformidadDB
            });

        });                     
                                
    });

});

module.exports = app;