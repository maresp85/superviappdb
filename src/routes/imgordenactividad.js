const express = require('express');
const multer  = require('multer');
const sharp = require("sharp");
const fs = require('fs');
const _ = require('underscore');

let app = express();

let imgordenactividad = require('../models/imgordenactividad');
let ordenactividad = require('../models/ordenactividad');

// ==================================================
// Almacena las imágenes de los items de las ordenes
// ==================================================
const storage = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
      cb(null, './uploads/ordenes/legalizaciones')
    },
    filename: function (req, file, cb) {  
      cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// ===============================================
// Consultar todas las imágenes x orden actividad
// ===============================================
app.get('/imgordenactividad/listar/:ordenactividad', (req, res) => {

    let ordenactividad = req.params.ordenactividad;

    imgordenactividad
        .find({ ordenactividad: ordenactividad })
        .exec((err, imgordenactividadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            imgordenactividadDB
        });
                                
    });

});

// ===============================================
// Consultar todas las imagenes x orden de trabajo
// ===============================================
app.get('/imgordenactividad/listartodas/:ordentrabajo', (req, res) => {

    let ordentrabajo = req.params.ordentrabajo;

    imgordenactividad.find({ ordentrabajo: ordentrabajo })
                     .exec((err, imgordenactividadDB) => {
                        if (err) {
                            return res.status(400).json({
                                ok: false,
                                err
                            });
                        }

                        res.json({
                            ok: true,
                            imgordenactividadDB
                        });
                                
    });

});

// ======================================================
// Eliminar imágenes que se cargaron en una legalización
// ======================================================
app.delete('/imgordenactividad/eliminarimagen/:id/:_id', (req, res) => {

    let id = req.params.id;
    let _id = req.params._id;
    let files = [];

    imgordenactividad
        .find({ _id: _id })
        .exec((err, imgordenactividadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //delete element array
        imgordenactividadDB[0].files.map((elem, index) => {
            if (index != id) {
                files = [...files, elem];
            } else {
                //Eliminar la imagen
                try {
                    fs.unlinkSync(elem.destination + '/' + elem.originalname);
                    //file removed
                } catch(err) {
                    console.error(err)
                }
                try {
                    fs.unlinkSync(elem.destination + '_pdf/' + elem.originalname);
                    //file removed
                } catch(err) {
                    console.error(err)
                }
            }
        });

        let body = {"files" : files};
            
        imgordenactividad
            .findByIdAndUpdate(_id, body, {new: true, runValidators: true}, (err, imgordenactividadDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                imgordenactividadDB
            });

        });                     
                                
    });

});


// ================================================
// Actualizar imágenes de una legalización
// ================================================
app.put('/imgordenactividad/editarimg/:_id', upload.array("uploads[]"), function (req, res, next) {
     
    let _id = req.params._id;
    let files = [];

    imgordenactividad
        .find({ _id: _id })
        .exec((err, imgordenactividadDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        files = imgordenactividadDB[0].files;
        
        req.files.map((elem, index) => {
            files = [...files, elem];
        });

        resizeImages(req).then(() => {});

        let body = { "files" : files };
              
        imgordenactividad
            .findByIdAndUpdate(_id, body, {new: true, runValidators: true}, (err, imgordenactividadDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                imgordenactividadDB
            });

        });                     
                                
    });

        // Actualiza la observacion y la fecha de mejora en la orden actividad
    let id = req.body.id;
    let body = _.pick(req.body, ["observacion", "fechaMejora"]);
    
    ordenactividad.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, ordenactividadDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

    });

});

// =============================================================
// Redimensión de las imágenes que se cargan en la legalización
// =============================================================
const resizeImages = async (req,) => {
    if (!req.files) return;
  
    await Promise.all(
      req.files.map(async file => {  
        await sharp(file.path)
          .resize(280, 380)
          .toFormat("jpeg")
          .jpeg({ quality: 60 })
          .toFile(`./uploads/ordenes/legalizaciones_pdf/${file.originalname}`);

      })
    );
  
};

module.exports = app;