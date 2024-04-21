const express = require('express');
const fs = require('fs')
let app = express();

const { verificaToken } = require('../middlewares/autenticacion');
let ordentrabajo = require('../models/ordentrabajo');
let ordentipotrabajo = require('../models/ordentipotrabajo');
let imgordenactividad = require('../models/imgordenactividad');
let ordenactividad = require('../models/ordenactividad');
let tipotrabajo = require('../models/tipotrabajo');
let actividad = require('../models/actividad');
let trabajo = require('../models/trabajo');
let usuario = require('../models/usuario');

// ================================================
// Consultar todas las ordenes de trabajo x empresa
// ================================================
app.get('/ordentrabajo/listar/:empresa', verificaToken, (req, res) => {

    let empresa = req.params.empresa;

    ordentrabajo
        .find({ empresa: empresa })
        .populate('trabajo')
        .populate('obra')
        .populate('usuario')
        .sort([['id', -1]])    
        .exec((err, ordentrabajoDB) => {
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


// =====================================================================
// Consultar todas las ordenes de trabajo x empresa, filtro bitácora
// =====================================================================
app.get('/ordentrabajo-filtrobitacora/listar/:empresa/:bitacora', verificaToken, (req, res) => {

    let empresa = req.params.empresa;
    let bitacora = req.params.bitacora;

    trabajo
        .find({ empresa: empresa, bitacora: bitacora })
        .exec((err, trabajoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
        
            let trabajos = [];
            trabajoDB.forEach((item) => {                
                trabajos.push(item._id);                
            });

            ordentrabajo
                .find({ trabajo: { $in: trabajos } })
                .populate('trabajo')
                .populate('obra')
                .populate('usuario')
                .sort([['id', -1]])    
                .exec((err, ordentrabajoDB) => {
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

});

// ================================================
// Consultar todas las ordenes de trabajo x usuario
// ================================================
app.get('/ordentrabajo/listarusuario/:usuario/:bitacora', verificaToken, (req, res) => {

    let usuarioId = req.params.usuario;

    ordentrabajo
        .find({ usuario: usuarioId })
        .populate('trabajo')
        .populate('obra')
        .populate('usuario')
        .sort([['id', -1]])    
        .exec((err, ordentrabajoDB) => {
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

// ===================================================================
// Consultar todas las ordenes de trabajo x usuario x filtro bitácora
// ===================================================================

app.get('/ordentrabajo-filtrobitacora/listarusuario/:usuario/:empresa/:bitacora', verificaToken, (req, res) => {

    let empresa = req.params.empresa;
    let usuarioId = req.params.usuario;
    let bitacora = req.params.bitacora;

    trabajo
        .find({ empresa: empresa, bitacora: bitacora })
        .exec((err, trabajoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
        
            let trabajos = [];
            trabajoDB.forEach((item) => {                
                trabajos.push(item._id);                
            });

            ordentrabajo
                .find({ usuario: usuarioId, trabajo: { $in: trabajos } })
                .populate('trabajo')
                .populate('obra')
                .populate('usuario')
                .sort([['id', -1]])    
                .exec((err, ordentrabajoDB) => {
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

});

// ================================================
// Consultar todas las ordenes de trabajo x usuario
// ================================================
app.get('/ordentrabajo/listarusuario-obra/:usuario/:bitacora', verificaToken, (req, res) => {

    let usuarioId = req.params.usuario;
    let bitacora = req.params.bitacora;

    usuario
        .find({ _id: usuarioId })
        .exec((err, usuarioDB) => {

            let estados = ['ASIGNADA', 'EN PROCESO', 'CUMPLE', 'NO CUMPLE'];      
            query = { 
                bitacora: bitacora,
                empresa: usuarioDB[0].empresa[0],
                estado: { $in: estados } 
            };

            if (usuarioDB[0].role !== 'SUPERVISOR DEL CONTRATO') {
                query.usuario = usuarioId;
            }

            ordentrabajo
                .find(query)
                .populate('trabajo')
                .populate('obra')
                .populate('usuario')
                .sort([['id', -1]])    
                .exec((err, ordentrabajoDB) => {
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

});

// =========================================================
// Consultar todas las ordenes de trabajo x empresa x estado
// =========================================================
app.get('/ordentrabajo/contarestado/:empresa', (req, res) => {

    let empresa = req.params.empresa;

    ordentrabajo
        .find({ empresa: empresa })
        .exec((err, ordentrabajoDB) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            var estado1 = 0;
            var estado2 = 0;
            var estado3 = 0;
            var estado4 = 0;

            ordentrabajoDB.forEach(function(item) {
                if (item.estado == "ASIGNADA") {
                    estado1 ++;
                } else if (item.estado == "EN PROCESO") {
                    estado2 ++;
                } else if (item.estado == "CUMPLE") {
                    estado3 ++;
                } else if (item.estado == "NO CUMPLE") {
                    estado4 ++;
                }                                                           
            }); 

            var conteo = [];
            conteo.push(estado1);
            conteo.push(estado2);
            conteo.push(estado3);
            conteo.push(estado4);
                
            res.json({
                ok: true,
                conteo
            });         
                        
    });

});


// ================================================
// Consultar una orden de trabajo
// ================================================
app.get('/ordentrabajo/listaruna/:id', (req, res) => {

    let id = req.params.id;

    ordentrabajo
        .find({ _id: id })
        .populate('trabajo')
        .populate('obra')
        .populate('usuario')
        .exec((err, ordentrabajoDB) => {
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

// ========================================
// Crear orden de trabajo x empresa
// ========================================
app.post('/ordentrabajo/crear', verificaToken, (req, res) => {    
   
    let body = req.body;

    trabajo
        .find({ _id: body.trabajo })
        .exec((err, trabajoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            let data = new ordentrabajo({        
                trabajo: body.trabajo,
                bitacora: trabajoDB[0].bitacora,
                empresa: body.empresa,
                obra: body.obra,
                fecha: body.fecha,
                observacion: body.observaciones,
                estado: 'ASIGNADA',
                idviga: 'NO',
                usuario: body.usuario,
                extraFields: trabajoDB[0].extraFields,
                extraFieldsData: [],
            });
        
            data.save((err, ordentrabajoDB) => {  
                
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
        
                if (!ordentrabajoDB) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
        
                // llenar la tabla orden tipo de trabajo
                // se capturan los tipos de trabajo asociados al trabajo
                tipotrabajo
                    .find({ empresa: body.empresa, trabajo: body.trabajo })
                    .exec((err, tipotrabajoDB) => {
        
                        tipotrabajoDB.forEach(function(item) {
                            let datatipo = new ordentipotrabajo({
                                ordentrabajo: ordentrabajoDB._id,
                                trabajo: body.trabajo,
                                tipotrabajo: item._id,
                                empresa: body.empresa,
                                orden: item.orden,
                                fecha: body.fecha,
                                estado: 'EN PROCESO',
                                maxConsecutivo: 1,
                            });                            
        
                            datatipo.save((err, ordtipoDB) => {
                             
                                //llenar la tabla orden actividad
                                //se capturan las actividades asociadas al tipo de trabajo
                                actividad
                                    .find({ tipotrabajo: item._id, empresa: body.empresa })
                                    .exec((err, actividadDB) => {
                                            
                                    let consecutivo = 1;
        
                                    actividadDB.forEach((itemActividad) => {
                                                        
                                        let dataActividad = new ordenactividad({
                                            ordentrabajo: ordentrabajoDB._id,
                                            ordentipotrabajo: ordtipoDB._id,
                                            tipotrabajo: item._id,
                                            actividad: itemActividad._id,
                                            empresa: body.empresa,
                                            fecha: body.fecha,
                                            orden: itemActividad.orden,
                                            role: itemActividad.role,
                                            consecutivo: consecutivo,
                                            calificacion: itemActividad.calificacion,
                                            fechacreacion: new Date(),
                                            activo: true,
                                        });
        
                                        dataActividad.save();
        
                                        consecutivo += 1;                                        
        
                                    });
        
                                    let bodyUpdate = {
                                        'maxConsecutivo': consecutivo,
                                    }
                                    
                                    ordentipotrabajo
                                        .findByIdAndUpdate(
                                            ordtipoDB._id, bodyUpdate, {new: true, runValidators: true}, (err, ordenUpdateDB) => {
                                        
                                    });
                                    
                                });                               
        
                            });
                                
                        });  
        
                    });
        
                res.json({
                    ok: true,
                    ordentrabajoDB
                });
        
            });                     
    }); 
    
});

// ========================================
// Crear orden de trabajo x empresa
// ========================================
app.post('/ordentrabajo-bitacora/crear', verificaToken, (req, res) => {    
   
    let body = req.body;

    trabajo
        .find({ _id: body.trabajo })
        .exec((err, trabajoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            let data = new ordentrabajo({        
                trabajo: body.trabajo,
                bitacora: trabajoDB[0].bitacora,
                empresa: body.empresa,
                obra: body.obra,
                fecha: body.fecha,
                observacion: body.observaciones,
                estado: 'ASIGNADA',
                idviga: 'NO',
                usuario: body.usuario
            });
        
            data.save((err, ordentrabajoDB) => {  
                
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
        
                if (!ordentrabajoDB) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }
        
                // llenar la tabla orden tipo de trabajo
                // se capturan los tipos de trabajo asociados al trabajo
                tipotrabajo
                    .find({ empresa: body.empresa, trabajo: body.trabajo })
                    .exec((err, tipotrabajoDB) => {
        
                        tipotrabajoDB.forEach(function(item) {
                            let datatipo = new ordentipotrabajo({
                                ordentrabajo: ordentrabajoDB._id,
                                trabajo: body.trabajo,
                                tipotrabajo: item._id,
                                empresa: body.empresa,
                                orden: item.orden,
                                fecha: body.fecha,
                                estado: 'EN PROCESO',
                                maxConsecutivo: 1,
                            });                            
        
                            datatipo.save((err, ordtipoDB) => {});
                                
                        });  
        
                    });
        
                res.json({
                    ok: true,
                    ordentrabajoDB
                });
        
            });                     
    }); 
    
});


// ========================================
// Actualizar extra campos
// ========================================
app.put('/ordentrabajo/extraFields/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
    let body = req.body;
   
    ordentrabajo.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, ordentrabajoDB) => {
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

// ========================================
// Cerrar orden
// ========================================
app.put('/ordentrabajo/cerrar/:id', (req, res) => {
    
    let id = req.params.id;
    let body = {
        'estado': 'CERRADA',
    }
   
    ordentrabajo.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, ordentrabajoDB) => {
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


// ========================================
// Eliminar orden de trabajo
// ========================================
app.delete('/ordentrabajo/eliminar/:id', verificaToken, (req, res) => {
    
    let id = req.params.id;
   
    ordentrabajo.findByIdAndRemove(id, (err) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        ordentipotrabajo.deleteMany({ordentrabajo: id}, (err) => {

            ordenactividad.deleteMany({ordentrabajo: id}, (err) => {

                imgordenactividad.find({ ordentrabajo: id })
                                 .exec((err, imgordenactividadDB) => {

                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }
                
                    //delete images
                    try {
                        imgordenactividadDB[0].files.map((elem, index) => {
                        
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
                        
                        });
                    } catch {}

                    imgordenactividad.deleteMany({ordentrabajo: id}, (err) => {

                        res.json({
                            ok: true
                        });        
                
                    });    
                                        
                });
            
            });
            
        });
      
    });
    
});

// ================================================
// Búsqueda de ordenes de trabajo
// ================================================
app.post('/ordentrabajo/buscar', (req, res) => {

    const { id, empresa, usuario, estado, trabajo, obra, fecha, fechaf } = req.body;
        
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
    if (estado) {
        query.estado = estado;
    }
    if (trabajo) {
        query.trabajo = trabajo;
    }
    if (obra) {
        query.obra = obra;
    } 

    //======================== Fechas ========================//
    let fechaInicial = new Date(fecha);
    fechaInicial.setTime(fechaInicial.getTime() + (5*60*60*1000));

    let fechaFinal = new Date(fechaf);
    fechaFinal.setDate(fechaFinal.getDate() + 1);
    fechaFinal.setTime(fechaFinal.getTime() + (5*60*60*5000));

    if (fecha) {
        query.fecha = { $gte: fechaInicial, $lt: fechaFinal };
    }

    ordentrabajo
        .find(query)
        .populate('trabajo')
        .populate('obra')
        .populate('usuario')
        .sort([['id', -1]])    
        .exec((err, ordentrabajoDB) => {
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

// ================================================
// Búsqueda de ordenes de trabajo desde la app
// ================================================
app.post('/ordentrabajo/buscar-app', (req, res) => {

    const { id, usuarioId, estado, trabajo, obra, fecha, fechaf } = req.body;

    usuario
        .find({ _id: usuarioId })
        .exec((err, usuarioDB) => {

            let query = { empresa: usuarioDB[0].empresa[0] };
            if (id) {
                query.id = id;
            }          
            if (usuarioDB[0].role !== 'SUPERVISOR DEL CONTRATO') {
                query.usuario = usuarioId;
            }
            if (estado) {
                query.estado = estado;
            }
            if (trabajo) {
                query.trabajo = trabajo;
            }
            if (obra) {
                query.obra = obra;
            }

            //======================== Fechas ========================//
            let fechaInicial = new Date(fecha);
            fechaInicial.setTime(fechaInicial.getTime() + (5*60*60*1000));

            let fechaFinal = new Date(fechaf);
            fechaFinal.setDate(fechaFinal.getDate() + 1);
            fechaFinal.setTime(fechaFinal.getTime() + (5*60*60*5000));

            if (fecha) {
                query.fecha = { $gte: fechaInicial, $lt: fechaFinal };
            }

            ordentrabajo
                .find(query)
                .populate('trabajo')
                .populate('obra')
                .populate('usuario')
                .sort([['id', -1]])    
                .exec((err, ordentrabajoDB) => {
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

});

// ==================================================================
// Consultar las ordenes de trabajo x usuario en un rango de fechas
// ==================================================================
app.get('/ordentrabajo/listarusuariofecha/:usuario/:fecha_inicio/:fecha_final', (req, res) => {

    let query = {};   
    query.usuario = req.params.usuario;
    
    //======================== Fechas ========================//
    let fechaInicial = new Date(req.params.fecha_inicio);
    fechaInicial.setTime(fechaInicial.getTime() + (5*60*60*1000));

    let fechaFinal = new Date(req.params.fecha_final);
    // fechaFinal.setDate(fechaFinal.getDate() + 1);
    fechaFinal.setTime(fechaFinal.getTime() + (5*60*60*1000));
    
    query.fecha = { $gte: fechaInicial, $lt: fechaFinal };   

    ordentrabajo
        .find(query)
        .populate('trabajo')
        .populate('obra')
        .populate('usuario')
        .sort([['fecha', 1]])
        .exec((err, ordentrabajoDB) => {
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