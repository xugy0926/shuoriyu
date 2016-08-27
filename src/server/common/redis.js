var { redisInfo } = require('../../config');
var Redis = require('ioredis');
var logger = require('./logger')

var client = new Redis({
  port: redisInfo.port,
  host: redisInfo.host,
  db: redisInfo.db,
  password: redisInfo.password,
});

client.on('error', function (err) {
  if (err) {
    logger.error('connect to redis error, check your redis config', err);
    process.exit(1);
  }
})

exports = module.exports = client;
