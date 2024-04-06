var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var imgreporteSchema = new Schema({
    reporte: { type: Schema.Types.ObjectId, ref: 'reporte', required: true },
    titulo: { type: String, required: true },  
    file: { type: Object, required: true },    
});

module.exports = mongoose.model('imgreporte', imgreporteSchema);