const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const app = express();

const { verificaToken } = require('../middlewares/autenticacion');

let ordentrabajo = require('../models/ordentrabajo');

// ========================================
// Almacena las imágenes de los usuarios
// ========================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/ordenes/firma_usuario')
    },
    filename: function (req, file, cb) {    
        cb(null, file.originalname); // Usa el nombre original del archivo
    }
});

const upload = multer({ storage: storage });

const storageWeb = multer.diskStorage({
    // destination
    destination: function (req, file, cb) {
      cb(null, './uploads/ordenes/firma_usuario')
    },
    filename: function (req, file, cb) {    
      cb(null, req.body.firmaUsuario);
    }
});

const uploadWeb = multer({ storage: storageWeb });

// =============================
// Guardar firma usuario
// =============================
app.put('/signature-order/:id', upload.single('image'), verificaToken, (req, res, next) => {
   
    let id = req.params.id;
    let body = req.body;
    let firmaUsuario = `${id}${uuidv4()}.png`;
    let bodyManual = {
        'firmaUsuario': firmaUsuario,
    }

    const buffer = Buffer.from(body.signatureImage.split(';base64,').pop(), 'base64');
    const path = `./uploads/ordenes/firma_usuario/${firmaUsuario}`; 

    fs.writeFileSync(path, buffer);

    ordentrabajo.findByIdAndUpdate(id, bodyManual, {new: true, runValidators: true}, (err, ordentrabajoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            ordentrabajoDB
        });

    });
});

// =============================
// Guardar firma usuario en Web
// =============================
app.put('/signature-order-web/:_id', uploadWeb.single('image'), verificaToken, (req, res, next) => {
   
    let _id = req.params._id;
    let body = req.body;

    ordentrabajo.findByIdAndUpdate(_id, body, {new: true, runValidators: true}, (err, ordentrabajoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            ordentrabajoDB
        });
  
    });
});

module.exports = app;