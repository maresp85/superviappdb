const jwt = require('jsonwebtoken');


// =====================
// Verificar Token
// =====================
let verificaToken = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};

// ============================
// Verifica Token y Role Admin
// ============================
let verificaTokenAdmin = (req, res, next) => {

    let token = req.get('Authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {   
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;

        if (req.usuario.role != 'ADMIN') {

            return res.json({
                ok: false,
                err: {
                    message: 'El usuario no es administrador'
                }
            });

        }
        next();

    });
    
};

module.exports = {
    verificaToken,
    verificaTokenAdmin
}