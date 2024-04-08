var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imgordenactividadSchema = new Schema({
    ordentrabajo: { type: Schema.Types.ObjectId, ref: 'ordentrabajo', required: true },
    ordentipotrabajo: { type: Schema.Types.ObjectId, ref: 'ordentipotrabajo', required: true },
    ordenactividad: { type: Schema.Types.ObjectId, ref: 'ordenactividad', required: true },
    files: { type: Object, required: false },    
});

module.exports = mongoose.model('imgordenactividad', imgordenactividadSchema);