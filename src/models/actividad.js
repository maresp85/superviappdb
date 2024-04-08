const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let rolesValidos = {
    values: [  
        'ADMIN', 
        'SUPERVISOR SSTA',
        'SUPERVISOR LEGAL LABORAL',
        'SUPERVISOR DEL CONTRATO',
    ],
    message: '{VALUE} no es un rol válido'
}

let actividadSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },    
    trabajo: { type: Schema.Types.ObjectId, required: true, ref: 'trabajo' },
    tipotrabajo: [{ type: Schema.Types.ObjectId, required: true, ref: 'tipotrabajo' }],
    empresa: { type: Schema.Types.ObjectId, required: true, ref: 'empresa' },      
    activo: { type: Boolean, required: false, default: true },
    orden: { type: Number, required: false, default: 1 },
    role: { type: String, required: true, default: 'SUPERVISOR SSTA', enum: rolesValidos },
});

module.exports = mongoose.model('actividad', actividadSchema);