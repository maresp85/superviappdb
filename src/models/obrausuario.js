const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let obrausuarioSchema = new Schema({
    obra: { type: Schema.Types.ObjectId, required: true, ref: 'obra' },   
    usuario: { type: Schema.Types.ObjectId, ref: 'usuario' },    
    empresa: { type: Schema.Types.ObjectId, required: true, ref: 'empresa' },    
});

module.exports = mongoose.model('obrausuario', obrausuarioSchema);