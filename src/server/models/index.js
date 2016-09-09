var mongoose = require('mongoose');
var logger = require('../common/logger');
import { mongodbUrl } from '../../config';

mongoose.connect(mongodbUrl, {
  server: {poolSize: 20}
}, function (err) {
  if (err) {
    logger.error('connect to %s error: ', mongodbUrl, err.message);
    process.exit(1);
  }
});

// models
require('./user');
require('./topic');
require('./reply');
require('./topic_collect');
require('./message');
require('./menu');
require('./submenu');

exports.User         = mongoose.model('User');
exports.Topic        = mongoose.model('Topic');
exports.Reply        = mongoose.model('Reply');
exports.TopicCollect = mongoose.model('TopicCollect');
exports.Message      = mongoose.model('Message');
exports.Menu          = mongoose.model('Menu');
exports.Submenu          = mongoose.model('Submenu');
