const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let obraSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },    
    direccion: { type: String, required: [true, 'La direccion es obligatoria'] },    
    empresa: { type: Schema.Types.ObjectId, required: true, ref: 'empresa' },    
    activo: { type: Boolean, required: false, default: true },
});

module.exports = mongoose.model('obra', obraSchema);