/*
 * Copyright (C) 2017 Menome Technologies Inc.
 *
 * Connects to rabbitmq and listens for messages harvesters.
 * Handles validation of messages, as well as sending acks and nacks.
 * Calls subroutines for updating the DB.
 */
var conf = require('./config');
var amqp = require('amqplib');
var log = require('./logger');

var rabbitConnectInterval;
var rabbitChannel;
module.exports = {
  subscribe,
  publishMessage
}

// Subscribes to the RabbitMQ 
function subscribe() {
  rabbitConnectInterval = setInterval(rabbitConnect, 5000);
  rabbitConnect();
}

function rabbitConnect() {
  log.info("Attempting to connect to RMQ.");
  amqp.connect(conf.rabbit.url)
    .then(function(conn) {
      log.info("Connected to RMQ");
      return conn.createChannel();
    })
    .then(function(channel) {
      log.info("Created channel")
      clearInterval(rabbitConnectInterval); // Stop scheduling this task if it's finished.
      rabbitChannel = channel;
      return channel.assertExchange(conf.rabbit.exchange, 'topic', {durable: true});
    })
    .catch((err) => {
      log.error("Failed to connect to RMQ. Will retry: %s", err.message);
    });
}

function publishMessage(msg) {
  console.log(msg)
  if(!rabbitChannel) return Promise.resolve(false);
  var messageBuffer = new Buffer(JSON.stringify(msg));
  return rabbitChannel.publish(conf.rabbit.exchange,conf.rabbit.routingKey,messageBuffer)
}