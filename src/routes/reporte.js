const express = require('express');
const multer  = require('multer');
const sharp = require("sharp");
const fs = require('fs');

let app = express();

const { verificaToken } = require('../middlewares/autenticacion');
let reporte = require('../models/reporte');
let imgreporte = require('../models/imgreporte');
let ordentrabajo = require('../models/ordentrabajo');


// ==================================================
// Almacena las imágenes de los reportes semanales
// ==================================================
const storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
      cb(null, './uploads/reportes/semanal')
    },
    filename: function (req, file, cb) {  
      cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });


// ================================================
// Consultar todos los reportes semanales x empresa
// ================================================
app.get('/reporte/listar/:empresa', verificaToken, (req, res) => {

    let empresa = req.params.empresa;

    reporte.find({ empresa: empresa })     
            .populate('usuario')
            .sort([['id', -1]])    
            .exec((err, reporteDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    reporteDB
                });                        
    });

});


// ================================================
// Consultar todos los reportes semanales x usuario
// ================================================
app.get('/reporte/listarusuario/:usuario', verificaToken, (req, res) => {

    let usuario = req.params.usuario;

    reporte.find({ usuario: usuario })     
               .populate('usuario')
               .sort([['id', -1]])    
               .exec((err, reporteDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                res.json({
                    ok: true,
                    reporteDB
                });
                        
    });

});


// ===============================
// Crear Reporte
// ===============================
app.post('/reporte/crear', verificaToken, (req, res) => {
   
    let body = req.body;

    let data = new reporte({
        empresa: body.empresa,      
        fecha_inicio: body.fecha_inicio,
        fecha_fin: body.fecha_fin,
        usuario: body.usuario
    });

    data.save((err, reporteDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!reporteDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            reporteDB
        });

    });
});


// ================================================
// Crear Reporte x usuarios
// ================================================
app.post('/reporte/crear/usuarios', (req, res) => {

    const { empresa, fecha } = req.body;
        
    let fechafinal = new Date(fecha);
    fechafinal.setTime(fechafinal.getTime() + (5*60*60*5000));

    let fechainicial = new Date(fecha);
    fechainicial.setDate(fechainicial.getDate() - 6);  
    fechainicial.setTime(fechainicial.getTime() + (5*60*60*1000));  

    ordentrabajo.aggregate([
        { $match: { fecha: { $gte: fechainicial, $lt: fechafinal }, bitacora: false } },
        {
          $group: {
            _id: '$usuario',
            sum: { $sum: 1 }
          }
        }
    ]).exec((err, resultDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        resultDB.forEach(element => {
            let data = new reporte({
                empresa: empresa,      
                fecha_inicio: fechainicial,
                fecha_fin: fechafinal,
                usuario: element._id
            });
        
            data.save((err, reporteDB) => {        
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
        
                if (!reporteDB) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }          
            });
        });
    });

    res.json({
        ok: true,        
    });
    
});


// ========================================================
// Carga imágenes al reporte semanal
// ========================================================
app.put('/reporte/editar/:_id', upload.single('file'), verificaToken, (req, res, next) => {
    
    let _id = req.params._id;
    let body = req.body
  
    reporte.findByIdAndUpdate(_id, body, {new: true, runValidators: true}, (err, reporteDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }        
                
         // Se guardan las imágenes
        let dataimg = new imgreporte({
            reporte: _id,
            titulo: body.titulo,
            file: req.file
        });
   
        dataimg.save((err, dataimgDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }       

            resizeImages(req, next).then(() => {});

            imgreporte.find({ reporte: _id })
                      .exec((err, imgreporteDB) => {
                            if (err) {
                                return res.status(400).json({
                                    ok: false,
                                    err
                                });
                            }

                            res.json({
                                ok: true,
                                imgreporteDB
                            });                                
            });            
            
        });      

    });
    
});


// ========================================================
// Consulta las imágenes del reporte semanal
// ========================================================
app.get('/reporte/listar/imagenes/:_id', verificaToken, (req, res) => {

    let _id = req.params._id;

    imgreporte.find({ reporte: _id })
              .exec((err, imgreporteDB) => {
                if (err) {
                     return res.status(400).json({
                         ok: false,
                         err
                    });
                }

                res.json({
                    ok: true,
                    imgreporteDB
                });                                
    });

});


// ======================================================
// Eliminar imágenes que se cargaron en una legalización
// ======================================================
app.delete('/reporte/eliminarimagen/:_id/:_reporte', verificaToken, (req, res) => {

    let _id = req.params._id;
    let _reporte = req.params._reporte;
    
    imgreporte.findByIdAndRemove(_id, (err, imgreporteDB) => {       
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
        //Eliminar la imagen
        try {
            fs.unlinkSync(imgreporteDB.file.destination + '/' + imgreporteDB.file.originalname);
            //file removed
        } catch(err) {
            console.error(err);
        }  

        imgreporte.find({ reporte: _reporte })
                  .exec((err, imgreporteDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    res.json({
                        ok: true,
                        imgreporteDB
                    });                                
        });
                                
    });

});


// =============================================================
// Redimensión de las imágenes que se cargan al reporte
// =============================================================
const resizeImages = async (req,) => {
    if (!req.files) return;
  
    await Promise.all(
      req.files.map(async file => {  
        await sharp(file.path)
          .resize(480, 780)
          .toFormat("jpeg")
          .jpeg({ quality: 70 })
          .toFile(`./uploads/reportes/semanal/${file.originalname}`);

      })
    );  
};

// ================================================
// Búsqueda de ordenes de trabajo
// ================================================
app.post('/reporte/buscar', verificaToken, (req, res) => {

    const { id, empresa, usuario, fecha, fechaf } = req.body;
        
    let query = {};
    if (id) {
        query.id = id;
    }
    if (empresa) {
        query.empresa = empresa;
    }
    if (usuario) {
        query.usuario = usuario;  
    }

    //======================== Fechas ========================//
    let fechainicial = new Date(fecha);
    fechainicial.setTime(fechainicial.getTime() + (5*60*60*1000));

    let fechafinal = new Date(fechaf);
    fechafinal.setDate(fechafinal.getDate() + 1);
    fechafinal.setTime(fechafinal.getTime() + (5*60*60*5000));
    if (fecha) {
        query.fecha_fin = { $gte: fechainicial, $lt: fechafinal };
    } 

    reporte.find(query)
            .populate('usuario')
            .sort([['id', -1]])     
            .exec((err, reporteDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    reporteDB
                });                        
    });

});

module.exports = app;