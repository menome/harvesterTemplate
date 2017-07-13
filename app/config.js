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
    routingKey: 'bucketevents.all.minio',
    exchange: 'bucketevents'
  },
}

// Merged external conf and default conf, prioritizing external conf.
var mergedConf = {};
Object.assign(mergedConf, defaults, extConf)

if(process.env.RABBIT_URL) mergedConf.rabbit.url = process.env.RABBIT_URL;

// Export the config.
module.exports = mergedConf;