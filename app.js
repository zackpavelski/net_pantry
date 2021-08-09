var express = require('express')
    , urlHelper = require("./routes.js")
  , http = require('http')
  , fs = require('fs')
 , config = require("./config")
 , mysql = require('mysql')
 , methodOverride = require('method-override')
 , logger = require('morgan')
 , bodyParser = require('body-parser')
  , path = require('path');


var createError = require('http-errors');
var cookieParser = require('cookie-parser');

var app = express();

// view engine setup

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));

urlHelper.setRequestUrl(app);


module.exports = app;

