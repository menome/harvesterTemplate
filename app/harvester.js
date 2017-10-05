/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Core harvester code.
 */
"use strict";
var rp = require('request-promise');
var mysql = require('mysql');
var models = require('./models');
var bot = require('@menome/botframework')

module.exports = {
  harvestAll,
  harvestAllSQL
}

// Kicks off the harvester for each type of data.
function harvestAll() {
  bot.changeState({state: "working"})
  var promises = models.queryTransforms.map(({desc,url,transform}) => {
    bot.logger.info(desc);
    return getEndpoint(url,transform);
  })

  Promise.all(promises)
    .then(function(result) {
      bot.changeState({state: "idle"})
      bot.logger.info("Sync Finished. Messages generated");
    })
    .catch(function(err) {
      bot.changeState({state: "failed", message:err.toString()})
      bot.logger.error(err.toString());
    });
}

function harvestAllSQL() {
  var connection = new mysql.createConnection(config.database);
  connection.connect();
  bot.changeState({state: "working"})

  var promises = models.sqlTransforms.map(({desc,query,transform}) => {
    bot.logger.info(desc);
    return getSql(connection, query, transform);
  })

  Promise.all(promises)
    .then(function(result) {
      bot.logger.info("Messages generated");
      bot.changeState({state: "idle"})
      connection.end();
    })
    .catch(function(err) {
      bot.logger.error(err.toString());
      bot.changeState({state: "failed", message:err.toString()})
      connection.end();
    });
}

// Fetches from the URL, transforms the results using the transform function, publishes the message.
function getEndpoint(uri, transformFunc) {
  var options = {
    uri: uri,
    json: true,
    headers: {
      'User-Agent': 'Request-Promise'
    }
  }

  rp(options)
    .then(function(itms) {
      itms.forEach((itm) => {
        bot.rabbitPublish(transformFunc(itm,'harvesterMessage'));
      })
    })
    .catch(function(err) {
      bot.logger.error(err.toString());
    })
}

function getSql(client, query, transformFunc) {
  return new Promise((resolve) => {
    client.query(query, function (err,results) {
      if(err) throw err;
      results.forEach((itm) => {
        rabbit.publishMessage(transformFunc(itm));
        return resolve(itm);
      })
    });
  })
}