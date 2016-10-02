var redis  = require('./redis');
var _      = require('lodash');
var logger = require('./logger');
var Submenu = require('../proxy').Submenu;
import { appId } from '../../config'
import * as ResultMsg from '../constrants/ResultMsg';

var get = function (key) {
  return new Promise(function(resolove, reject) {
    var t = new Date();
    redis.get( appId + key, function (err, data) {
      if (err) {
        logger.debug('redis.get error.', key, (duration + 'ms').green);
        return resolove();
      }

      var duration = (new Date() - t);
      logger.debug('Cache', 'get', key, (duration + 'ms').green);

      if (!data) {
        return resolove();
      }

      data = JSON.parse(data);
      resolove(data);
    });
  })
};

exports.get = get;

// time 参数可选，秒为单位
var set = function (key, value, time) {
  return new Promise(function(resolove, reject) {
    var t = new Date();

    value = JSON.stringify(value);

    if (!time) {
      redis.set( appId + key, value, function(err) {
        if (err) {
          logger.debug('redis.set error.', key, (duration + 'ms').green);
        } 
        
        resolove()
      });
    } else {
      redis.setex( appId + key, time, value, function(err) {
        if (err) {
          logger.debug('redis.set error.', key, (duration + 'ms').green);
        }

        resolove()
      });
    }
    var duration = (new Date() - t);
    logger.debug("Cache", "set", key, (duration + 'ms').green);
  })
};

exports.set = set;
