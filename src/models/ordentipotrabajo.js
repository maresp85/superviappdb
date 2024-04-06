const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

let estadosValidos = {
    values: ['EN PROCESO', 'CUMPLE', 'NO CUMPLE'],
    message: "{VALUE} no es un estado válido"
}

let ordentipotrabajoSchema = new Schema({
    id: { type: Number, unique: true, min: 1 },
    ordentrabajo: { type: Schema.Types.ObjectId, required: true, ref: 'ordentrabajo' },
    trabajo: { type: Schema.Types.ObjectId, required: true, ref: 'trabajo' },
    tipotrabajo: { type: Schema.Types.ObjectId, required: true, ref: 'tipotrabajo' },
    empresa: { type: Schema.Types.ObjectId, required: true, ref: 'empresa' },  
    fecha: { type: Date, required: [true, 'La fecha es obligatoria'] },
    orden: { type: Number, required: false, default: 1 },
    estado: { type: String, default: 'EN PROCESO', enum: estadosValidos },
    maxConsecutivo: { type: Number, min: 1 },
});

autoIncrement.initialize(mongoose.connection);
ordentipotrabajoSchema.plugin(autoIncrement.plugin, { model: 'ordentipotrabajo', 
                                                    field: 'id',
                                                    startAt: 1,
                                                    incrementBy: 1 });

module.exports = mongoose.model('ordentipotrabajo', ordentipotrabajoSchema);