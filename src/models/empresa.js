const mongoose = require('mongoose')
const Schema = mongoose.Schema;

let empresaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es obligatorio'] },
    ubicacion: { type: String, required: [true, 'La ubicación es obligatoria'] },
    telefono: { type: Number, required: [true, 'El teléfono es obligatorio'] },
    activo: { type: Boolean, required: [true, 'Campo obligatorio'] },
    logo: { type: String, unique: false },
});

module.exports = mongoose.model('empresa', empresaSchema);