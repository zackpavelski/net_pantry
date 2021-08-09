"use strict";

var config = require('../config');

exports.login = function (req, res, next) {
        res.render('index.html',{message:""});
};
exports.dashboard = function(req, res, next){
    res.render('dashboard.html', {message:""});
}
exports.studentDash = function(req, res, next){
    res.render('studentDash.html', {message:""});
}
exports.inventory = function(req, res, next){
    res.render('inventory.html', {message:""});
}
exports.scanner = function(req, res, next){
    res.render('scanner.html', {message:""});
}
exports.additem = function(req, res, next){
    res.render('additem.html', {message:""});
}
exports.inventory = function(req, res, next){
    res.render('inventory.html', {message:""});
}
exports.account = function(req, res, next){
    res.render('profileSettings.html', {message:""});
}
exports.signup = function(req, res, next){
    res.render('signup.html', {message:""});
}
exports.users = function(req, res, next){
    res.render('users.html', {message:""});
}
exports.feedback = function(req, res, next){
    res.render('feedback.html', {message:""});
}
exports.history = function(req, res, next){
    res.render('history.html', {message:""});
}
exports.switch = function(req, res, next){
    res.render('switchPantry.html', {message:""});
}
exports.forgotPass = function(req, res, next){
    res.render('forgotPass.html', {message:""});
}
exports.thank = function(req, res, next){
    res.render('thankYou.html', {message:""});
}
