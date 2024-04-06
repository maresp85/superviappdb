require ('./src/config/config');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/uploads", express.static(__dirname + '/uploads'));

//configuración global de rutas
app.use(require('./src/routes/index'));

mongoose.connect('mongodb://localhost:27017/sistemaordenes', (err, res) => {
    if (err) throw err;
        console.log("base de datos online");
});

app.listen(process.env.PORT, () => {
    console.log('puerto 3000');
})