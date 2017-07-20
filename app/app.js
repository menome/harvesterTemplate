/** 
 * Copyright (C) 2017 Menome Technologies Inc.  
 * 
 * A microservice that takes specifically formatted JSON messages and turns them into graph updates.
 */
var express = require("express");
var http = require('http');
var port = process.env.PORT || 3000;
var conf = require('./config');
var rabbit = require('./harvester/rabbit');
var harvester = require('./harvester');
var log = require('./harvester/logger')
var models = require('./models');

function app(testMode=false) {
  var app = express();
  app.testMode = testMode;

  // An echo endpoint.
  app.get('/', function (req, res, next) {
    return res.json(models.harvesterMetadata);
  });

  app.post('/sync', function(req,res,next) {
    res.send("Starting full sync");
    return harvester.harvestAll();
  })

  app.post('/sqlsync', function(req,res,next) {
    res.send("Starting full sync of sql database");
    return harvester.harvestAllSQL();
  })

  rabbit.subscribe();
  return app;
}

///////////////
// Start the App

// If we're not being imported, just run our app.
if (!module.parent) {
  var app = app();
  
  http.createServer(app).listen(port);
  log.info("Listening on " + port);
}

module.exports = app;