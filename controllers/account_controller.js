var express = require('express');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var path = require('path');
var session = require('express-session');
var models = require('../models');
var Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

var accountRoutes = express.Router();

accountRoutes.get('/login',function(req,res){
    res.render('accounts/login',{errors: ""});
});
accountRoutes.get('/register',function(req,res){
    res.render('accounts/register',{errors: ""});
});

accountRoutes.post('/register',function(req,res){

    var matched_users_promise = models.User.findAll({
        where:  Sequelize.or(
            {surname: req.body.surname},
            {email: req.body.email}
        )
    });
    matched_users_promise.then(function(users){
        if(users.length == 0){
            const passwordHash = bcrypt.hashSync(req.body.password,10);
            models.User.create({
                surname: req.body.surname,
                firstname: req.body.firstname,
                email: req.body.email,
                password: passwordHash
            }).then(function(user){
                console.log(user);
                let newSession = req.session;
                newSession.email = req.body.email;
                newSession.expiretime = req.body.email;
                res.redirect('/');
            });
        }
        else{
            res.render('accounts/register',{errors: "Surname or Email already in user"});
        }
    })
});

accountRoutes.post('/login',function(req,res){
    var matched_users_promise = models.User.findAll({
        where: Sequelize.and(
            {email: req.body.email},
        )
    });

    matched_users_promise.then(function(users){
        if(users.length > 0){
            let user = users[0];
            let passwordHash = user.password;
            if(bcrypt.compareSync(req.body.password,passwordHash)){
                req.session.email = req.body.email;
                res.redirect('/home');
            }
            else{
                res.render('accounts/login',{errors: "Wrong Password"});
            }
        }
        else{
            res.redirect('/register');
        }
    });
});

module.exports = {"AccountRoutes" : accountRoutes};
