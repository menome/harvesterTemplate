/*
 * Copyright (C) 2017 Menome Technologies Inc.
 *
 * Merges the external config file with environment variables and default config values.
 */
var extConf = require('../config/conf');

var defaults = {
  rabbit: {
    enable: true,
    url: 'amqp://rabbitmq:rabbitmq@rabbit:5672?heartbeat=3600',
    routingKey: 'syncevents.harvester.updates.example',
    exchange: 'syncevents'
  },
  database: {
    host: "localhost",
    user: "root", 
    password: "example",
    database: "world"
  },
  apiUrl: "https://jsonplaceholder.typicode.com"
}

// Merged external conf and default conf, prioritizing external conf.
var mergedConf = {};
Object.assign(mergedConf, defaults, extConf)

if(process.env.RABBIT_URL) mergedConf.rabbit.url = process.env.RABBIT_URL;
if(process.env.DB_HOST) mergedConf.database.password = process.env.DB_HOST;
if(process.env.DB_USER) mergedConf.database.user = process.env.DB_USER;
if(process.env.DB_PASSWORD) mergedConf.database.password = process.env.DB_PASSWORD;
if(process.env.DB_DATABASE) mergedConf.database.database = process.env.DB_DATABASE;

// Export the config.
module.exports = mergedConf;
