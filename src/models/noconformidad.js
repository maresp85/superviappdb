const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateColombia = moment.tz(Date.now(), "America/Bogota");

let tipoAccion = {
    values: ['A.C', 'A.P', 'PNC'],
    message: "{VALUE} no es un estado válido"
}

let tipoGrado = {
    values: ['CORRECTIVO', 'PREVENTIVO', 'PRODUCTO NO CONFORME'],
    message: "{VALUE} no es un estado válido"
}

let tipoEstado = {
    values: ['ABIERTO', 'CERRADO', 'ABIERTO CON ACCIÓN DE MEJORA'],
    message: "{VALUE} no es un estado válido"
}

let noconformidadSchema = new Schema({
    id: { type: Number, unique: true, min: 1 }, 
    empresa: { type: Schema.Types.ObjectId, required: true, ref: 'empresa' },  
    fecha: { type: Date, default: dateColombia, required: true },
    fecha_evidencia: { type: Date, default: dateColombia, required: true },
    proceso: { type: String, required: true },
    tipo_accion: { type: String, default: 'A.C', enum: tipoAccion },
    descripcion: { type: String, required: true },
    tipo_grado:{ type: String, default: 'Correctivo', enum: tipoGrado },
    quien_detecta: { type: String, required: true },
    numeral_norma: { type: String, required: false },
    resolver: { type: Date, required: false },
    analisis: { type: String, required: true },
    accion_correctiva: { type: String, required: true },
    verificacion: { type: String, required: false },
    fecha_verificacion: { type: Date, required: false },
    estado: { type: String, default: 'Abierta', enum: tipoEstado },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' },
    obra: { type: Schema.Types.ObjectId, required: true, ref: 'obra' },
    imagen1: { type: Object, required: false },
    imagen2: { type: Object, required: false },
    imagen3: { type: Object, required: false },
});

autoIncrement.initialize(mongoose.connection);
noconformidadSchema.plugin(autoIncrement.plugin, { model: 'noconformidad', 
                                                  field: 'id',
                                                  startAt: 1,
                                                  incrementBy: 1 });

module.exports = mongoose.model('noconformidad', noconformidadSchema);