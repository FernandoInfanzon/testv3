const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const path = require('path');
const Usuario = require('../models/usuario');

const app = express();
// configure view handler
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

app.get("/", function(req, res) {
    res.render("login");
});



app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        }

        if (!usuarioDB) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o Contraseña incorrectos"
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o Contraseña incorrectos"
                }
            });
        }


        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });



});





module.exports = app;