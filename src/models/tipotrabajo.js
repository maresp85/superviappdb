const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let tipotrabajoSchema = new Schema({      
    trabajo: [{ type: Schema.Types.ObjectId, ref: 'trabajo', required: true }],
    empresa: { type: Schema.Types.ObjectId, ref: 'empresa', required: true }, 
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    orden: { type: Number, required: false, default: 1 },
    activo: { type: Boolean, required: false, default: true },
});

module.exports = mongoose.model('tipotrabajo', tipotrabajoSchema);