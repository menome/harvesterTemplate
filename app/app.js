/** 
 * Copyright (C) 2017 Menome Technologies Inc.  
 * 
 * A microservice that takes specifically formatted JSON messages and turns them into graph updates.
 */
var express = require("express");
var http = require('http');
var port = process.env.PORT || 3000;
var conf = require('./config');
var rabbit = require('./rabbit');

function app(testMode=false) {
  var app = express();
  app.testMode = testMode;

  // An echo endpoint.
  app.get('/', function (req, res, next) {
    return res.send("This is a healthy data harvester service");
  });

  app.post('/sync', function(req,res,next) {
    rabbit.publishMessage({
      "Name":"Dave Demo",
      "NodeType":"Employee",
      "Priority": 1,
      "ConformedDimensions": {
        "Email": "ddemo@menome.com",
        "EmployeeId": 12345
      },
      "Properties": {
        "Status":"active"
      },
      "Connections": [
        {
          "Name": "Menome Victoria",
          "NodeType": "Office",
          "RelType": "LocatedInOffice",
          "ForwardRel": true,
          "ConformedDimensions": {
            "City": "Victoria"
          }
        },
        {
          "Name": "theLink",
          "NodeType": "Project",
          "RelType": "WorkedOnProject",
          "ForwardRel": true,
          "ConformedDimensions": {
            "Code": "5"
          }
        }
      ]
    })
    return res.send("Starting full sync");
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
  console.log("Listening on " + port);
}

module.exports = app;