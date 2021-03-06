import _ from 'lodash'
import models from '../models'
import Promise from 'promise'
import * as ResultMsg from '../constrants/ResultMsg'

let TopicModel      = models.Topic
let MessageModel    = models.Message
let UserModel       = models.User
let ReplyModel      = models.Reply

/**
 * 根据用户ID，获取未读消息的数量
 * Callback:
 * 回调函数参数列表：
 * - err, 数据库错误
 * - count, 未读消息数量
 * @param {String} id 用户ID
 */
exports.getMessagesCount = function (id, hasRead=false) {
  return new Promise(function(resolve, reject) {
    MessageModel.count({master_id: id, has_read: hasRead}, function(err, count) {
      if (err) return reject(ResultMsg.DB_ERROR)
      else resolve(count)
    })    
  })
};


/**
 * 根据消息Id获取消息
 * Callback:
 * - err, 数据库错误
 * - message, 消息对象
 * @param {String} id 消息ID
 */
exports.getMessageById = function (id) {
  return new Promise(function(resolve, reject) {
    MessageModel.findOne({_id: id}, function (err, doc) {
      if (err) return reject(ResultMsg.DB_ERROR)
      else resolve(doc)
    });
  })
};

/**
 * 根据用户ID，获取已读消息列表
 * Callback:
 * - err, 数据库异常
 * - messages, 消息列表
 * @param {String} userId 用户ID
 */
exports.getMessagesByUserId = function (userId, hasRead=false, options) {
  options = options ? options : {}
  return new Promise(function(resolve, reject) {
    MessageModel.find({master_id: userId, has_read: hasRead}, {}, options, function(err, docs) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve(docs)
    })
  })
};

/**
 * 获取一个消息的详细信息
 */
exports.getFullMessages = function (messages=[]) {
  return new Promise(function(resolve, reject) {
    if (messages.length > 0) readFullMessages(messages, resolve, reject)
    else reject(ResultMsg.DB_ERROR)
  })
}

var readFullMessages = function(messages=[], resolve, reject) {
  if (messages.length === 0) return reject(ResultMsg.PARAMS_ERROR)

  var ep = new EventProxy()
  ep.fail(err => {return reject(ResultMsg.DB_ERROR)})

  ep.after('read', messages.length, function(list) {
    return resolve(list)
  })

  for (let i = 0; i < messages.length; i++) {
    ep.all('topic', 'author', 'reply', function(topic, author, reply) {
      let message = messages[i].toObject()
      if (topic) message.topic = _.pick(topic, ['_id', 'title'])
      if (author) message.author = _.pick(author, ['_id', 'loginname'])
      if (reply) message.reply = reply
      ep.emit('read', message)
    })

    TopicModel.findOne({_id: messages[i].topic_id}, ep.done('topic'))
    UserModel.findOne({_id: messages[i].author_id}, ep.done('author'))
    ReplyModel.findOne({_id: messages[i].reply_id}, ep.done('reply'))
  }
}


/**
 * 将消息设置成已读
 */
exports.updateMessagesToRead = function (userId, messages) {
  return new Promise(function(resolve, reject) {
    if (messages.length === 0) {
      return reject(ResultMsg.PARAMS_ERROR)
    }

    var ids = messages.map(function (m) {
      return m.id
    });

    var query = { master_id: userId, _id: { $in: ids } };
    MessageModel.update(query, { $set: { has_read: true } }, { multi: true }).exec(function(err) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve
    })
  })
};
