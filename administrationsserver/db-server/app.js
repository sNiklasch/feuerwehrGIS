var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ip = require('ip');

var layers = require('./routes/layers');
var wms = require('./routes/wms');
var geojson = require('./routes/geojson');
//var json = require('./routes/json');

var app = express();

var mongoose = require('mongoose');
var dbAddress = ip.address();
console.log(dbAddress);

mongoose.connect('mongodb://' + dbAddress + '/admin');
var db = mongoose.connection;

db.on('error', function callback(){
    console.log("Verbindung zu MongoDB fehlgeschlagen");
});

db.once('open', function callback(){
    console.log("Verbindung zu MongoDB erfolgreich");
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
  next();
});

//set up the urls for the REST-interfaces:
app.use('/layers', layers);
app.use('/wms', wms);
app.use('/geojson', geojson);
app.use(express.static(__dirname + '/layers'));
//app.use('/json', json);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  //debug('Express server listening on port ' + server.address().port);
});