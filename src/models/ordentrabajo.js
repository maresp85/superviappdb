const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateColombia = moment.tz(Date.now(), "America/Bogota");

let estadosValidos = {
    values: ['ASIGNADA', 'EN PROCESO', 'CUMPLE', 'NO CUMPLE', 'CERRADA'],
    message: "{VALUE} no es un estado válido"
}

let ordentrabajoSchema = new Schema({
    id: { type: Number, unique: true, min: 1 },
    trabajo: { type: Schema.Types.ObjectId, required: true, ref: 'trabajo' },
    empresa: { type: Schema.Types.ObjectId, required: true, ref: 'empresa' }, 
    obra: { type: Schema.Types.ObjectId, required: true, ref: 'obra' },
    observacion: { type: String, required: false },     
    fecha: { type: Date, default: dateColombia, required: [true, 'La fecha es obligatoria'] },
    estado: { type: String, default: 'ASIGNADA', enum: estadosValidos },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' },
    idviga: { type: String, required: false },
    bitacora: { type: Boolean, required: false, default: false },
});

autoIncrement.initialize(mongoose.connection);
ordentrabajoSchema.plugin(autoIncrement.plugin, { model: 'ordentrabajo', 
                                                  field: 'id',
                                                  startAt: 1,
                                                  incrementBy: 1 });

module.exports = mongoose.model('ordentrabajo', ordentrabajoSchema);