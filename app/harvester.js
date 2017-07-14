/**
 * The core harvester code
 */
var rabbit = require('./rabbit');
var rp = require('request-promise');
var log = require('./logger');
var models = require('./models');

module.exports = {
  harvestAll
}

// Kicks off the harvester for each type of data.
function harvestAll() {
  getEndpoint('https://jsonplaceholder.typicode.com/users', models.userTransform)
  getEndpoint('https://jsonplaceholder.typicode.com/posts', models.postTransform)
  getEndpoint('https://jsonplaceholder.typicode.com/comments', models.commentTransform)
  getEndpoint('https://jsonplaceholder.typicode.com/albums', models.albumTransform)
  getEndpoint('https://jsonplaceholder.typicode.com/photos', models.photoTransform)
  getEndpoint('https://jsonplaceholder.typicode.com/todos', models.todoTransform)
  
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
