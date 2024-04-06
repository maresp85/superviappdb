const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateColombia = moment.tz(Date.now(), "America/Bogota");

let estadosValidos = {
    values: ['EN PROCESO', 'CUMPLE', 'NO CUMPLE'],
    message: "{VALUE} no es un estado válido"
}

let hermeticidadSchema = new Schema({
    id: { type: Number, unique: true, min: 1 },   
    empresa: { type: Schema.Types.ObjectId, required: true, ref: 'empresa' }, 
    obra: { type: Schema.Types.ObjectId, required: true, ref: 'obra' },
    fecha: { type: Date, default: dateColombia, required: [true, 'La fecha es obligatoria'] },
    estado: { type: String, default: 'EN PROCESO', enum: estadosValidos },
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' },
});

autoIncrement.initialize(mongoose.connection);
hermeticidadSchema.plugin(autoIncrement.plugin, { model: 'hermeticidad', 
                                                  field: 'id',
                                                  startAt: 1,
                                                  incrementBy: 1 });

module.exports = mongoose.model('hermeticidad', hermeticidadSchema);