const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let rolesValidos = {
    values: [
        'ADMIN', 
        'SUPERVISOR SSTA',
        'SUPERVISOR LEGAL LABORAL',
        'SUPERVISOR DEL CONTRATO',
    ],
    message: "{VALUE} no es un rol válido"
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es obligatoria'] }, 
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'SUPERVISOR SSTA', enum: rolesValidos },
    estado: { type: Boolean, default: true },
    empresa: [{ type: Schema.Types.ObjectId, required: false, ref: 'empresa' }],
    imgfirma: { type: String, unique: false },
    sendemail: { type: Boolean, required: false, default: false },
    enterweb: { type: Boolean, required: false, default: false },
    entermovil: { type: Boolean, required: false, default: true },
    editorder: { type: Boolean, required: false, default: false },
});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin( uniqueValidator, {
    message: 'El {PATH} fue previamente registrado'
});

module.exports = mongoose.model('usuario', usuarioSchema);