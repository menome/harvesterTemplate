/**
 * Copyright (c) 2017 Menome Technologies Inc.
 * Configuration for the bot
 */
"use strict";
var convict = require('convict');
var fs = require('fs');
var bot = require('botframework')

// Define a schema
var config = convict({
  url: {
    doc: "The URL of the REST Endpoint we're grabbing",
    format: "url",
    default: "https://jsonplaceholder.typicode.com",
    env: "API_URL"
  },
  database: {
    host: {
      doc: "The database hostname or IP",
      format: "*",
      default: "localhost",
      env: "DB_HOST"
    },
    user: {
      doc: "The database username",
      format: "*",
      default: "root",
      env: "DB_USER"
    },
    password: {
      doc: "The database account password",
      format: "*",
      default: "example",
      env: "DB_PASS",
      sensitive: true
    },
    dbname: {
      doc: "The name of the DB to use.",
      format: String,
      default: "world",
      env: "DB_NAME"
    },
  },
  port: bot.configSchema.port,
  logging: bot.configSchema.logging,
  neo4j: bot.configSchema.neo4j,
  rabbit: bot.configSchema.rabbit,
});

// Load from file.
if (fs.existsSync('./config/config.json')) {
  config.loadFile('./config/config.json');
}

// Validate the config.
config.validate({allowed: 'strict'});

module.exports = config;