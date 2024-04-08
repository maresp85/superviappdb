const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let tiposValidos = {
    values: [
        'REGISTRO FOTOGRÁFICO', 
        'NOTA BITÁCORA', 
        'FOTO BITÁCORA', 
        'ETIQUETA', 
        'CHECKLIST',
        'FIRMA DIGITAL', 
        'EVIDENCIAS'
    ],
    message: "{VALUE} no es un tipo válido"
}

let itemactividadSchema = new Schema({
    actividad: { type: Schema.Types.ObjectId, required: true, ref: 'actividad' },
    trabajo: { type: Schema.Types.ObjectId, required: true, ref: 'trabajo' },
    tipotrabajo: [{ type: Schema.Types.ObjectId, required: true, ref: 'tipotrabajo' }],
    empresa: { type: Schema.Types.ObjectId, required: true, ref: 'empresa' },
    cumple: { type: Boolean, required: false, default: false }, 
    tipo: { type: String, default: 'ETIQUETA', enum: tiposValidos },
    etiqueta: { type: String, required: false }, 
    imagen: { type: Boolean, required: false, default: false }, 
    activo: { type: Boolean, required: false, default: true },
});

module.exports = mongoose.model('itemactividad', itemactividadSchema);