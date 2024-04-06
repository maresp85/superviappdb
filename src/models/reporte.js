const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateColombia = moment.tz(Date.now(), "America/Bogota");

let reporte = new Schema({
    id: { type: Number, unique: true, min: 1 },       
    empresa: { type: Schema.Types.ObjectId, required: true, ref: 'empresa' },   
    fecha_inicio: { type: Date, default: dateColombia, required: [true, 'La fecha es obligatoria'] },
    fecha_fin: { type: Date, default: dateColombia, required: [true, 'La fecha es obligatoria'] },    
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' },  
});

autoIncrement.initialize(mongoose.connection);
reporte.plugin(autoIncrement.plugin, { model: 'reporte', 
                                                field: 'id',
                                                startAt: 1,
                                                incrementBy: 1 });

module.exports = mongoose.model('reporte', reporte);