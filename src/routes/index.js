const express = require('express');

const app = express();

app.use(require('./usuario'));
app.use(require('./login'));
app.use(require('./empresa'));
app.use(require('./obra'));
app.use(require('./trabajo'));
app.use(require('./tipotrabajo'));
app.use(require('./actividad'));
app.use(require('./ordentrabajo'));
app.use(require('./ordentipotrabajo'));
app.use(require('./ordenactividad'));
app.use(require('./itemactividad'));
app.use(require('./imgordenactividad'));
app.use(require('./checkordenactividad'));
app.use(require('./reporte'));
app.use(require('./hermeticidad'));
app.use(require('./hermeticidadlectura'));
app.use(require('./noconformidad'));
app.use(require('./obrausuario'));
app.use(require('./utils'));

module.exports = app;