var models       = require('../models');
var Message      = models.Message;
var _            = require('lodash');
var logger       = require('./logger');

exports.sendReplyMessage = function ({masterId, authorId, topicId, replyId}) {

  if (!masterId || !authorId || !topicId || !replyId) {
    logger.debug(('sendAtMessage').red, 'type=at', `${masterId}&${authorId}&${topicId}&${replyId}`);
    return
  }

  var message       = new Message();
  message.type      = 'reply';
  message.master_id = masterId;
  message.author_id = authorId;
  message.topic_id  = topicId;
  message.reply_id  = replyId;

  message.save(function(err) {
    if (err) {
      logger.debug(('sendReplyMessage').red, 'type=reply', `${masterId}&${authorId}&${topicId}&${replyId}. db error!!!`);
    }
  });
};

exports.sendAtMessage = function ({masterId, authorId, topicId, replyId}) {

  if (!masterId || !authorId || !topicId || !replyId) {
    logger.debug(('sendAtMessage').red, 'type=at', `${masterId}&${authorId}&${topicId}&${replyId}`);
    return
  }

  var message       = new Message();
  message.type      = 'at';
  message.master_id = masterId;
  message.author_id = authorId;
  message.topic_id  = topicId;
  message.reply_id  = replyId;

  message.save(function(err) {
    if (err) {
      logger.debug(('sendAtMessage').red, 'type=at', `${masterId}&${authorId}&${topicId}&${replyId}. db error!!!`);
    }
  })
};
