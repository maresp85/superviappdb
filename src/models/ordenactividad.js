const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const Schema = mongoose.Schema;

let estadosValidos = {
    values: ['CUMPLE', 'NO CUMPLE', 'PENDIENTE'],
    message: '{VALUE} no es un estado válido'
}

let rolesValidos = {
    values: [  
        'ADMIN', 
        'SUPERVISOR SSTA',
        'SUPERVISOR LEGAL LABORAL',
        'SUPERVISOR DEL CONTRATO',
    ],
    message: '{VALUE} no es un rol válido'
}

let ordenactividadSchema = new Schema({
    id: { type: Number, unique: true, min: 1 },
    ordentrabajo: { type: Schema.Types.ObjectId, required: true, ref: 'ordentrabajo' },
    ordentipotrabajo: { type: Schema.Types.ObjectId, required: true, ref: 'ordentipotrabajo' },
    tipotrabajo: { type: Schema.Types.ObjectId, required: true, ref: 'tipotrabajo' },
    actividad: { type: Schema.Types.ObjectId, required: true, ref: 'actividad' },
    empresa: { type: Schema.Types.ObjectId, required: true, ref: 'empresa' },  
    fecha: { type: Date, required: [true, 'La fecha es obligatoria'] }, 
    estado: { type: String, default: 'PENDIENTE', enum: estadosValidos },  
    usuariolegaliza: { type: Schema.Types.ObjectId, required: false, ref: 'usuario' },
    fechalegaliza: { type: Date, required: false },  
    fechacreacion: { type: Date, required: false },  
    observacion: { type: String, required: false }, 
    fechaMejora: { type: String, required: false }, 
    activo: { type: Boolean, required: false, default: true },
    orden: { type: Number, required: false, default: 1 },
    role: { type: String, required: true, default: 'SUPERVISOR SSTA', enum: rolesValidos },
    consecutivo: { type: Number },
    calificacion: { type: Number, required: false, default: 1 },
});

autoIncrement.initialize(mongoose.connection);
ordenactividadSchema.plugin(autoIncrement.plugin, {
    model: 'ordenactividad', 
    field: 'id',
    startAt: 1,
    incrementBy: 1
});

module.exports = mongoose.model('ordenactividad', ordenactividadSchema);