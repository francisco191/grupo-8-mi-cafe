const { validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const db = require('../../database/models')
const sequelize = require('sequelize')

let usersController = {
    // VISTA LOGIN
    login: function(req, res) {
        return res.render('users/login');           
    },
    // LOGICA LOGIN
    processLogin: function(req, res) {
        let errors = validationResult(req);
        
        db.User.findOne({
            where: {
                email: req.body.email,
            }
        })
        .then(usuarioALoguearse => {
            console.log(usuarioALoguearse);
            if(usuarioALoguearse){
                let comparacion = bcrypt.compareSync(req.body.password, usuarioALoguearse.password);

                if(comparacion){
                    req.session.usuarioALoguearse = usuarioALoguearse;

                    if(req.body.remindme){
                        res.cookie('usuario', req.session.usuarioALoguearse, {maxAge: 1000 * 60 * 60});
                        res.locals.usuarioALoguearse = req.session.usuarioALoguearse;
                    }
                    res.redirect('/');
                } else{
                    res.render('users/login', {errors: {msg: "Credenciales incorrectas"}})
                }
            } else{
                res.render('users/login', {errors: {msg: "Credenciales incorrectas"}})
            }
        })
        .catch(function(error){
            console.log(error);
        })
    },
    // LOGICA LOGOUT
    logout: function(req, res){
        req.session.destroy();
        res.redirect('/usuarios/login')
    },
    // VISTA REGISTRO
    register: function(req, res) {
        res.render('users/formulario-registro');
    },
    // LOGICA DE REGISTRO
    processRegister: function(req, res, next) {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.render('users/formulario-registro', {errors: errors.errors});
        } else {
            db.User.create({
                email: req.body.email,
                password: bcrypt.hashSync(req.body.password, 10),
                name: req.body.name,
                lastname: req.body.email,
                role_id: 2,
                image: 'avatar_placeholder.png'
            })
        }
        res.redirect("/usuarios/login");
    },
    // VISTA EDITAR
    editar: function(req, res) {
        res.render('users/editar-usuario');
    },
    // LOGICA EDICION
    modificacion: (req, res) => {
        db.Profile.update({
            name: req.body.nombre,
            last_name: req.body.apellido,
            birthdate: req.body.fechaNacimiento,
            gender: req.body.genero
        },
        {
            where: {
                id: res.locals.user.id
            }
        })
        .then( resultado => {
            res.redirect('/usuarios/login')
            })
        .catch(error => {
            res.send(error)
        })
    },
    // VISTA PERFIL
    perfil: function(req, res) {
        res.render('users/perfil-usuario');
    }
}

module.exports = usersController;