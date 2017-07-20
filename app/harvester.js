/**
 * The core harvester code
 */
var rabbit = require('./harvester/rabbit');
var rp = require('request-promise');
var log = require('./harvester/logger');
var models = require('./models');
var mysql = require('mysql');
var config = require('./config')

module.exports = {
  harvestAll,
  harvestAllSQL
}

// Kicks off the harvester for each type of data.
function harvestAll() {
  getEndpoint(config.apiUrl+'/users', models.userTransform);
  getEndpoint(config.apiUrl+'/posts', models.postTransform);
  getEndpoint(config.apiUrl+'/comments', models.commentTransform);
  getEndpoint(config.apiUrl+'/albums', models.albumTransform);
  getEndpoint(config.apiUrl+'/photos', models.photoTransform);
  getEndpoint(config.apiUrl+'/todos', models.todoTransform);
}

function harvestAllSQL() {
  var connection = new mysql.createConnection(config.database);
  connection.connect();
  var promises = [
    getSql(connection, "SELECT * FROM city", models.cityTransform),
    getSql(connection, "SELECT * FROM country", models.countryTransform),
    getSql(connection, "SELECT * FROM countrylanguage", models.countryLanguageTransform)
  ]

  Promise.all(promises)
    .then(function(result) {
      log.info("Messages generated");
      connection.end();
    })
    .catch(function(err) {
      log.error(err);
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
        rabbit.publishMessage(transformFunc(itm));
      })
    })
    .catch(function(err) {
      log.error(err.toString());
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