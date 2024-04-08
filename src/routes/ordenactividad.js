const express = require('express');
const multer  = require('multer');
const nodemailer = require('nodemailer');
const sharp = require('sharp');

let app = express();

const { verificaToken } = require('../middlewares/autenticacion');
let actividad = require('../models/actividad');
let ordenactividad = require('../models/ordenactividad');
let ordentipotrabajo = require('../models/ordentipotrabajo');
let ordentrabajo = require('../models/ordentrabajo');
let imgOrdenActividad = require('../models/imgordenactividad');
let checkOrdenActividad = require('../models/checkordenactividad');
let obrausuario = require('../models/obrausuario');

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

// ===================================================================
// Consultar todas las ordenes actividades x orden de trabajo x estado
// ===================================================================
app.get('/ordenactividad/listar/:ordentrabajo/:activo', (req, res) => {

    let ordentrabajo = req.params.ordentrabajo;
    let activo = req.params.activo;

    ordenactividad
        .find({ ordentrabajo: ordentrabajo, activo: activo })
        .populate('ordentrabajo')   
        .populate('actividad')   
        .populate('tipotrabajo')          
        .populate('usuariolegaliza')  
        .exec((err, ordenactividadDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ordenactividadDB
            });
                        
    });

});

// ===================================================================
// Consultar todas las ordenes actividades x orden de trabajo x estado
// ===================================================================
app.get('/ordenactividad/listartodas/:ordentrabajo', (req, res) => {

    let ordentrabajo = req.params.ordentrabajo;

    ordenactividad
        .find({ ordentrabajo: ordentrabajo })
        .populate('ordentrabajo')   
        .populate('actividad')   
        .populate('tipotrabajo')          
        .populate('usuariolegaliza')
        .exec((err, ordenactividadDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ordenactividadDB
            });
                        
    });

});

// ===================================================================
// Consultar todas las ordenes actividades x orden de trabajo x estado
// ===================================================================
app.get('/ordenactividad/listartodas-bitacoras/:ordentrabajo', (req, res) => {

    let ordentrabajo = req.params.ordentrabajo;
    let estados = ['CUMPLE', 'NO CUMPLE'];

    ordenactividad
        .find({ ordentrabajo: ordentrabajo, estado: { $in: estados} })
        .populate('ordentrabajo')   
        .populate('actividad')   
        .populate('tipotrabajo')          
        .populate('usuariolegaliza')
        .exec((err, ordenactividadDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ordenactividadDB
            });
                        
    });

});

// =======================================================================
// Consultar todas las ordenes actividades NO CUMPLIDAS x orden de trabajo
// =======================================================================
app.get('/ordenactividad/listartodasnocumple/:ordentrabajo', (req, res) => {

    let ordentrabajo = req.params.ordentrabajo;

    ordenactividad
        .find({ ordentrabajo: ordentrabajo, estado: "NO CUMPLE" })
        .populate('ordentrabajo')   
        .populate('actividad')   
        .populate('tipotrabajo')          
        .populate('usuariolegaliza')  
        .exec((err, ordenactividadDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ordenactividadDB
            });                        
    });

});

// ===========================================================================
// Consultar todas las ordenes actividades x actividad x orden tipo de trabajo
// ===========================================================================
app.get('/ordenactividad/listarordentipotrabajo/:actividad/:ordentipotrabajo', (req, res) => {

    let actividad = req.params.actividad;
    let ordentipotrabajo = req.params.ordentipotrabajo;

    ordenactividad
        .find({ actividad: actividad, ordentipotrabajo: ordentipotrabajo })
        .populate('ordentrabajo')   
        .populate('actividad')   
        .populate('tipotrabajo')            
        .populate('usuariolegaliza')              
        .exec((err, ordenactividadDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ordenactividadDB
            });                        
    });

});

// ===========================================================================
// Consultar todas las ordenes actividades x orden tipo de trabajo
// ===========================================================================
app.get('/ordenactividad/listarunaordentipotrabajo/:ordentipotrabajo', (req, res) => {

    let ordentipotrabajo = req.params.ordentipotrabajo;

    ordenactividad
        .find({ ordentipotrabajo: ordentipotrabajo, activo: 1 })
        .populate('ordentrabajo')   
        .populate('actividad')   
        .populate('tipotrabajo')            
        .populate('usuariolegaliza')      
        .sort([['orden', 1]])      
        .exec((err, ordenactividadDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ordenactividadDB
            });                        
    });

});

// ===========================================================================
// Consultar todas las ordenes actividades x orden tipo de trabajo x usuario
// ===========================================================================
app.get('/ordenactividad/listarunaordentipotrabajo-usuario/:ordentipotrabajo/:role', (req, res) => {

    let ordentipotrabajo = req.params.ordentipotrabajo;
    let role = req.params.role;

    ordenactividad
        .find({ ordentipotrabajo: ordentipotrabajo, role: role, activo: 1 })
        .populate('ordentrabajo')   
        .populate('actividad')   
        .populate('tipotrabajo')            
        .populate('usuariolegaliza')      
        .sort([['orden', 1]])      
        .exec((err, ordenactividadDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ordenactividadDB
            });                        
    });

});

// ===================================================================
// Consultar ordenes actividad x ID
// ===================================================================
app.get('/ordenactividad/listaruna/:id', (req, res) => {

    let id = req.params.id;

    ordenactividad
        .find({ _id: id })      
        .populate('actividad')           
        .populate({
            path : 'tipotrabajo',
            populate : {
                path : 'trabajo'
            }
        })              
        .populate('usuariolegaliza')                                    
        .populate('ordentrabajo')            
        .exec((err, ordenactividadDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                ordenactividadDB
            });
                        
    });

});

// ==================================================
// Actualizar una orden de actividad (legalización)
// ==================================================
app.put('/ordenactividad/editar/:id', upload.array('uploads[]'), function (req, res, next) {
   
    let id = req.params.id;
    let body = req.body
       
    ordenactividad.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, ordenactividadDB) => {   
            
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
         // Se envia el correo cuando el estado legalizado sea NO CUMPLE
        if (body.estado === 'NO CUMPLE') {
            ordenactividad
                .find({ _id: ordenactividadDB._id })      
                .populate('ordentrabajo') 
                .exec((err, ordenactividadDB2) => {
                    sendEmail(ordenactividadDB, ordenactividadDB2[0].ordentrabajo.obra);
            });            
        }

         // Se guardan las imágenes
        let dataImg = new imgOrdenActividad({
            ordentrabajo: ordenactividadDB.ordentrabajo,
            ordentipotrabajo: ordenactividadDB.ordentipotrabajo,
            ordenactividad: id,
            files: req.files
        });

        dataImg.save((err, dataimgDB) => {});

        try {
            // Se guardan los checklist
            let checklist = JSON.parse(body.checklist);
            checklist.forEach((item) => {
                if (item.isChecked) {
                    let dataCheck = new checkOrdenActividad({
                        ordentrabajo: ordenactividadDB.ordentrabajo,
                        ordentipotrabajo: ordenactividadDB.ordentipotrabajo,
                        ordenactividad: id,
                        etiqueta: item.etiqueta,
                        fechaMejora: item.fechaMejora
                    });

                    dataCheck.save((err, dataCheckDB) => {});
                }
            });  
        } catch {
            console.log('Error al guardar el checklist');
        }
        
        resizeImages(req, next).then(() => {});

        // consulta actividades, para cambiar el estado de la orden tipo de trabajo
        ordenactividad
            .find({ ordentipotrabajo: ordenactividadDB.ordentipotrabajo,
                    activo: true,
                    estado: {$in: ['NO CUMPLE', 'PENDIENTE']} 

            }).exec((err, ordenactividadDB2) => {       

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                let body = { estado: 'EN PROCESO' };
                ordenactividadDB2.forEach((value) => {
                    if (value.estado === 'NO CUMPLE') {
                        body = { estado: 'NO CUMPLE' }
                    }
                });  

                //si la consulta no trae datos, todas las ordenes están cumplidas
                if (ordenactividadDB2.length === 0) {                                
                    body = { estado: 'CUMPLE' }
                }                    

                ordentipotrabajo
                    .findByIdAndUpdate(
                        ordenactividadDB.ordentipotrabajo, 
                        body, 
                        { new: true, runValidators: true }, 
                    (err, dataDB) => {
                        //Cambio de estado orden de trabajo
                        //NO CUMPLE: si alguna de sus ordenes de tipo de trabajo está como NO CUMPLE
                        //EN PROCESO: si hay ordenes de tipo de trabajo CUMPLIDAS o EN PROCESO
                        //CUMPLE: cuando todas las ordenes de tipo de trabajo asociadas, están cumplidas                                                
                        ordentipotrabajo
                            .find({ 
                                ordentrabajo: ordenactividadDB.ordentrabajo,
                                estado: { $in: ['NO CUMPLE', 'EN PROCESO'] } 
                            }).exec((err, ordentipotrabajoDB2) => { 

                                var body = { estado: 'EN PROCESO' };
                                ordentipotrabajoDB2.forEach(function(value) {
                                    if (value.estado === 'NO CUMPLE') {
                                        body = { estado: 'NO CUMPLE' }
                                    }
                                });    

                                if (ordentipotrabajoDB2.length == 0) {                                
                                    body = { estado: 'CUMPLE' }
                                }   

                                ordentrabajo.findByIdAndUpdate(
                                    ordenactividadDB.ordentrabajo, 
                                    body, {new: true, runValidators: true}, 
                                    (err, dataDB) => {}
                                );                   
                    
                        });
                        //
                    });

           });

        res.json({
            ok: true,
            ordenactividadDB
        });

    });
    
});

// ==================================================
// Actualizar una orden de actividad (legalización)
// ==================================================
app.put('/ordenactividad-bitacora/editar/:id', upload.array("uploads[]"), function (req, res, next) {
   
    let id = req.params.id;
    let body = req.body
       
    ordenactividad.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, ordenactividadDB) => {   
            
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        
         // Se envia el correo cuando el estado legalizado sea NO CUMPLE
        if (body.estado === 'NO CUMPLE') {
            ordenactividad
                .find({ _id: ordenactividadDB._id })      
                .populate('ordentrabajo') 
                .exec((err, ordenactividadDB2) => {
                    sendEmail(ordenactividadDB, ordenactividadDB2[0].ordentrabajo.obra);
            });            
        }

         // Se guardan las imágenes
        let dataImg = new imgOrdenActividad({
            ordentrabajo: ordenactividadDB.ordentrabajo,
            ordentipotrabajo: ordenactividadDB.ordentipotrabajo,
            ordenactividad: id,
            files: req.files
        });

        dataImg.save((err, dataimgDB) => {});

        try {
            // Se guardan los checklist
            let checklist = JSON.parse(body.checklist);
            checklist.forEach((item) => {
                if (item.isChecked) {
                    let dataCheck = new checkOrdenActividad({
                        ordentrabajo: ordenactividadDB.ordentrabajo,
                        ordentipotrabajo: ordenactividadDB.ordentipotrabajo,
                        ordenactividad: id,
                        etiqueta: item.etiqueta,
                        fechaMejora: item.fechaMejora
                    });

                    dataCheck.save((err, dataCheckDB) => {});
                }
            });  
        } catch {
            console.log('Error al guardar el checklist');
        }
        
        resizeImages(req, next).then(() => {});

        ordenactividad
            .find({ _id: id })
            .populate('ordentipotrabajo')
            .exec((err, ordenactividadDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                let consecutivo = ordenactividadDB[0].ordentipotrabajo.maxConsecutivo;

                bodyUpdate = {
                    'consecutivo': consecutivo
                }

                ordenactividad.findByIdAndUpdate(id, bodyUpdate, {new: true, runValidators: true}, (err, ordenactividadDB) => {})

                consecutivo += 1;
                
                bodyUpdate = {
                    'maxConsecutivo': consecutivo
                }

                ordentipotrabajo.findByIdAndUpdate(ordenactividadDB[0].ordentipotrabajo._id, bodyUpdate, {new: true, runValidators: true}, (err, ordenactividadDB) => {})
                            
                res.json({
                    ok: true,
                    ordenactividadDB
                });        

        });
       
        
    });
    
});

// =================================================
// Inactiva una orden de actividad (re-legalización)
// =================================================
app.put('/ordenactividad/inactivar/:id', function (req, res) {
    
    let id = req.params.id;
    let body = req.body;    

    ordenactividad
        .findByIdAndUpdate(id, body, {new: true, runValidators: true})
        .populate('ordentipotrabajo')
        .exec(function(err, ordenactividadUpdateDB) {

        // Se actualiza el máx consecutivo
        let bodyUpdate = {
            'maxConsecutivo': ordenactividadUpdateDB.ordentipotrabajo.maxConsecutivo + 1,
        }
        
        ordentipotrabajo.findByIdAndUpdate(
            ordenactividadUpdateDB.ordentipotrabajo._id, 
            bodyUpdate, {new: true, runValidators: true}, (err, ordenUpdateDB) => {
            
            let data = new ordenactividad({
                estado: 'PENDIENTE',
                ordentrabajo: ordenactividadUpdateDB.ordentrabajo,
                ordentipotrabajo: ordenactividadUpdateDB.ordentipotrabajo._id,
                tipotrabajo: ordenactividadUpdateDB.tipotrabajo,
                actividad: ordenactividadUpdateDB.actividad,
                empresa: ordenactividadUpdateDB.empresa,
                fecha: ordenactividadUpdateDB.fecha,
                role: ordenactividadUpdateDB.role,
                consecutivo: ordenactividadUpdateDB.ordentipotrabajo.maxConsecutivo,
                fechacreacion: new Date(),
                activo: true,
            });
    
            data.save((err, ordenactividadDB) => {
    
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
        
                if (!ordenactividadDB) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }            
        
                res.json({
                    ok: true,
                    ordenactividadDB
                });
            });
                                   
        });
        
    }); 
    
});

// ========================================
// Elimina orden Actividad
// ========================================
app.delete('/ordenactividad/eliminar/:id', (req, res) => {
    
    let id = req.params.id;
   
    ordenactividad.findByIdAndRemove(id, (err) => {

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
          .jpeg({ quality: 50 })
          .toFile(`./uploads/ordenes/legalizaciones_pdf/${ file.originalname }`);

      })
    );  
};

// =============================
// Crear Nota Actividad
// =============================
app.post('/ordenactividad-nota/crear', verificaToken, (req, res) => {

    let body = req.body

    actividad
        .findOne({ _id: body.actividad })
        .exec((err, actividadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        ordentipotrabajo
            .findOne({ ordentrabajo: body.ordentrabajo })
            .exec((err, ordentipotrabajoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            let data = new ordenactividad({
                ordentrabajo: body.ordentrabajo,
                ordentipotrabajo: ordentipotrabajoDB._id,
                actividad: body.actividad ,
                empresa: body.empresa,
                fecha: body.fecha,
                orden: actividadDB.orden,
                tipotrabajo: actividadDB.tipotrabajo,
                role: body.role,
                fechacreacion: new Date(),
                activo: true,
            });
        
            data.save((err, ordenactividadDB) => {
                
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
        
                if (!ordenactividadDB) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
        
                res.json({
                    ok: true,
                    ordenactividadDB
                });
        
            });

        });        
                                
    });
    
});

// ========================================
// Cerrar orden
// ========================================
app.put('/ordenactividad/cerrar/:id', (req, res) => {
    
    let id = req.params.id;
    let body = {
        'estado': 'CUMPLE',
    }
   
    ordenactividad.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, ordenactividadDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            ordenactividadDB
        });

    });
    
});

// =========================================================
// Envia correo cuando se legaliza una orden como incumplida
// =========================================================
const sendEmail = (ordenact, obra) => {
    obrausuario
        .find({ empresa: ordenact.empresa, obra: obra })
        .populate('usuario')
        .exec((err, usuarioDB) => {
        
            usuarioDB.forEach(coordinador => {
                ordentrabajo
                    .find({ _id: ordenact.ordentrabajo })
                    .populate('obra')
                    .populate('usuario')
                    .populate('trabajo')
                    .exec((err, ordentrabajoDB) => {                      
                        
                        ordenactividad
                            .find({ _id: ordenact._id })
                            .populate('actividad')
                            .populate('usuariolegaliza')
                            .exec((err, ordenactividadDB2) => {  

                                let transporter = nodemailer.createTransport({
                                    host: 'smtp.hostinger.com',
                                    port: 465,
                                    secure: true, // true for 465, false for other ports                                        
                                    auth: {
                                        user: 'admin@supervision-tecnica.com',
                                        pass: 'Torito2020+', 
                                    },
                                });

                                let mailOptions = '';
                                if (ordentrabajoDB[0]['trabajo'].bitacora) {
                                    mailOptions = {
                                        from: 'admin@supervision-tecnica.com',
                                        to: coordinador.usuario.email,
                                        subject: `Nueva nota en bitácora de obra ${ ordentrabajoDB[0]['obra'].nombre }`,
                                        html: `<div style="padding: 10px; border-bottom: 4px solid #ddd; font-family: 'Montserrat', 'Tahoma', 'Roboto'; background-color: #fbfbfb" >
                                            Estimado Usuario, <br><br> La bitácora N° ${ ordentrabajoDB[0]['id'] } 
                                            tiene una nueva nota <strong style="color:red">ABIERTA</strong> 
                                            por el SUPERVISOR SSTA ${ ordenactividadDB2[0]['usuariolegaliza'].nombre }.
                                            Tipo de nota: <i>"${ ordenactividadDB2[0]['actividad'].nombre }"</i>
                                            </div>`
                                    };
                                } else {
                                    mailOptions = {
                                        from: 'admin@supervision-tecnica.com',
                                        to: coordinador.usuario.email,
                                        subject: `Legalización en obra ${ ordentrabajoDB[0]['obra'].nombre }`,
                                        html: `<div style="padding: 10px; border-bottom: 4px solid #ddd; font-family: 'Montserrat', 'Tahoma', 'Roboto'; background-color: #fbfbfb" >
                                            Estimado Usuario, <br><br> La orden N° ${ ordentrabajoDB[0]['id'] } 
                                            fue legalizada como <strong style="color:red">INCUMPLIDA</strong> 
                                            por el SUPERVISOR SSTA ${ ordenactividadDB2[0]['usuariolegaliza'].nombre } 
                                            en la <b>Viga: ${ ordentrabajoDB[0]['idviga'] }</b>. En la 
                                            actividad: <i>"${ ordenactividadDB2[0]['actividad'].nombre }"</i>
                                            </div>`
                                    };
                                }
                                
                                // Enviamos el email
                                transporter.sendMail(mailOptions, function(error, info) {                                                    
                                    if (error){
                                        console.log(error);
                                    } else {
                                        console.log("Email sent");
                                    }
                                });
                                    
                            });
                                                    
                });
            });

        });

}

module.exports = app;