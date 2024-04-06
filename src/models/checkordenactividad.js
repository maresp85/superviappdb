var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var checkordenactividadSchema = new Schema({
    ordentrabajo: { type: Schema.Types.ObjectId, ref: 'ordentrabajo', required: true },
    ordentipotrabajo: { type: Schema.Types.ObjectId, ref: 'ordentipotrabajo', required: true },
    ordenactividad: { type: Schema.Types.ObjectId, ref: 'ordenactividad', required: true },
    etiqueta: { type: String, required: false },    
    fechaMejora: { type: String, required: false },
});

module.exports = mongoose.model('checkordenactividad', checkordenactividadSchema);