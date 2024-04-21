const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let trabajoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },    
    empresa: { type: Schema.Types.ObjectId, required: true, ref: 'empresa' },
    activo: { type: Boolean, required: false, default: true },    
    observacion: { type: Boolean, required: false, default: true },    
    fechaMejora: { type: Boolean, required: false, default: true },    
    legalizaCualquierOrden: { type: Boolean, required: false, default: true },
    bitacora: { type: Boolean, required: false, default: false },
    extraFields: [{ type: String }],
    gradeChart: { type: String, required: false, default: 'bar' },   
});

module.exports = mongoose.model('trabajo', trabajoSchema);