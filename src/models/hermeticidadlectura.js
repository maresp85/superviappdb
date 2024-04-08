const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

const moment = require('moment-timezone');
const dateColombia = moment.tz(Date.now(), "America/Bogota");

let hermeticidadlecturaSchema = new Schema({
    hermeticidad: { type: Schema.Types.ObjectId, required: true, ref: 'hermeticidad' }, 
    ubicacion: { type: String, required: true },
    lecturainicial: { type: Number, required: [true, 'La lectura inicial es obligatoria'] },
    fechainicial: { type: Date, default: dateColombia, required: [true, 'La fecha es obligatoria'] },
    realizo: { type: String, required: true },
    lecturafinal: { type: Number, required: false },
    fechafinal: { type: Date, required: false },
    observaciones: { type: String, required: false },
    imageninicial: { type: Object, required: false },
    imagenfinal: { type: Object, required: false },
    finalizada: { type: Boolean, required: false, default: false }
});

module.exports = mongoose.model('hermeticidadlectura', hermeticidadlecturaSchema);