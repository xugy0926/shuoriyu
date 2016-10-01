var EventProxy = require('eventproxy');
var models     = require('../models');
var Topic      = models.Topic;
var User       = require('./user');
var Reply      = require('./reply');
var tools      = require('../common/tools');
var at         = require('../common/at');
var _          = require('lodash');
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';


/**
 * 根据主题ID获取主题
 * Callback:
 * - err, 数据库错误
 * - topic, 主题
 * - author, 作者
 * @param {String} id 主题ID
 * @param {Function} callback 回调函数
 */
// exports.getTopicById = function (id, callback) {
//   Topic.findOne({_id: id}, function (err, topic) {
//     if (err) {
//       return callback(err);
//     }

//     if (!topic) {
//       callback(null, null);
//       return;
//     }

//     at.linkUsers(topic.content, function (err, str) {
//       topic.linkedContent = str;
//       User.getUserById(topic.author_id, function (err, author) {
//         topic.author = author || null;
//         callback(null, topic);
//       });
//     });
//   });
// };

/**
 * 获取关键词能搜索到的主题数量
 * Callback:
 * - err, 数据库错误
 * - count, 主题数量
 * @param {String} query 搜索关键词
 * @param {Function} callback 回调函数
 */
exports.getCountByQuery = function (query) {
  return new Promise(function(resolve, reject) {
    Topic.count(query, function(err, count) {
      if (err) reject(err)
      else resolve(count)
    })
  })
};

/**
 * 根据关键词，获取主题列表
 * Callback:
 * - err, 数据库错误
 * - count, 主题列表
 * @param {String} query 搜索关键词
 * @param {Object} opt 搜索选项
 * @param {Function} callback 回调函数
 */
exports.getTopicsByQuery = function (query, opt) {
  query.deleted = false;

  return new Promise(function(resolve, reject) {
    Topic.find(query, {}, opt, function (err, topics) {
      if (err) return reject(ResultMsg.DB_ERROR)
      if (topics.length === 0) return reject(ResultMsg.DB_ERROR)
      resolve(topics)
    })
  })

  // Topic.find(query, {}, opt, function (err, topics) {

  //   if (err) {
  //     return callback(err);
  //   }
  //   if (topics.length === 0) {
  //     return callback(null, []);
  //   }

  //   var newTopics = [];
  //   for (var i = 0, len = topics.length; i < len; i++) {
  //     newTopics[i] = topics[i].toObject();
  //   }

  //   var proxy = new EventProxy();
  //   proxy.after('topic_ready', newTopics.length, function () {
  //     newTopics = _.compact(newTopics); // 删除不合规的 topic
  //     return callback(null, newTopics);
  //   });
  //   proxy.fail(callback);

  //   newTopics.forEach(function (topic, i) {

  //     topic.create_at = tools.formatDate(topic.create_at, true);

  //     var ep = new EventProxy();
  //     ep.all('author', 'reply', function (author, reply) {
  //       // 保证顺序
  //       // 作者可能已被删除
  //       if (author) {

  //         topic.author = author;
  //         topic.reply = reply;
  //       } else {
  //         topic = null;
  //       }
  //       proxy.emit('topic_ready');
  //     });

  //     User.getUserById(topic.author_id, ep.done('author'));
  //     // 获取主题的最后回复
  //     Reply.getReplyById(topic.last_reply, ep.done('reply'));
  //   });
  // });
};

// for sitemap
exports.getLimit5w = function () {
  return new Promise(function(resolve, reject) {
    Topic.find({deleted: false}, '_id', {limit: 50000, sort: '-create_at'}, function(err, docs) {
      if (err) reject(err)
      else resolve(docs)
    })
  })
};

/**
 * 获取所有信息的主题
 * Callback:
 * - err, 数据库异常
 * - message, 消息
 * - topic, 主题
 * - author, 主题作者
 * @param {String} id 主题ID
 */
// exports.getFullTopicById = function (id) {
//   Topic.findOne({_id: id, deleted: false}, function (err, topic) {
//     if (err || !topic) {
//       return callback('此话题不存在或已被删除。');
//     }

//     at.linkUsers(topic.content, function (err, str) {
//       topic.linkedContent = str;
//       User.getUserById(topic.author_id, function (err, author) {
//         callback(null, topic, author);
//       });
//     });
//   });
// };

/**
 * 更新主题的最后回复信息
 * @param {String} topicId 主题ID
 * @param {String} replyId 回复ID
 */
exports.updateLastReply = function (topicId, replyId) {
  return new Promise(function(resolve, reject) {

    if (!topicId || !replyId) {
      return reject(ResultMsg.PARAMS_ERROR)
    }
    Topic.findOne({_id: topicId}, function (err, topic) {
      if (err) {
        return reject(ResultMsg.DB_ERROR)
      }

      if (!topic) {
        return reject(ResultMsg.DATA_NOT_FOUND)
      }

      topic.last_reply    = replyId;
      topic.last_reply_at = new Date();
      topic.reply_count  += 1;
      topic.save(function(err, doc) {
        if (err) reject(ResultMsg.DB_ERROR)
        else resolve(doc)
      })
    })
  })
};

/**
 * 根据主题ID，查找一条主题(附带作者信息)
 * @param {String} id 主题ID
 */
exports.getTopicById = function (id) {

  return new Promise(function(resolve, reject) {
    Topic.findOne({_id: id}, function(err, doc) {
      if (err) reject(ResultMsg.DB_ERROR)
      else {
        User.getUserById(doc.author_id)
          .then(author => {
            doc.linkedContent = at.linkUsers(doc.content)
            doc.author = author
            resolve(doc)
          })
          .catch(err => reject(ResultMsg.DB_ERROR))
      }
    })
  })
};

/**
 * 将当前主题的回复计数减1，并且更新最后回复的用户，删除回复时用到
 * @param {String} id 主题ID
 */
exports.reduceTopicCount = function (topicId, lastReplyId) {
  return new Promise(function(resolve, reject) {
    if (!topicId || !lastReplyId) {
      return reject(ResultMsg.PARAMS_ERROR)
    }
    
    Topic.findOne({_id: topicId}, function (err, doc) {
      if (err) return reject(ResultMsg.DB_ERROR)
      if (!doc) return reject(ResultMsg.DATA_NOT_FOUND)
      doc.reply_count -= 1
      doc.last_reply = lastReplyId
      doc.save(function(err) {
        if (err) reject(ResultMsg.DB_ERROR)
        else resolve()
      })
    })
  })

  // Topic.findOne({_id: id}, function (err, topic) {
  //   if (err) {
  //     return callback(err);
  //   }

  //   if (!topic) {
  //     return callback(new Error('该主题不存在'));
  //   }
  //   topic.reply_count -= 1;
  //   topic.

  //   Reply.getLastReplyByTopId(id, function (err, reply) {
  //     if (err) {
  //       return callback(err);
  //     }

  //     if (reply.length !== 0) {
  //       topic.last_reply = reply[0]._id;
  //     } else {
  //       topic.last_reply = null;
  //     }

  //     topic.save(callback);
  //   });
  // });
};

exports.newAndSave = function (topic) {
  return new Promise(function(resolve, reject) {
    var newTopic       = new Topic();
    newTopic.title     = topic.title;
    newTopic.content   = topic.content;
    newTopic.menu      = topic.menu;
    newTopic.submenu   = topic.submenu;
    newTopic.author_id = topic.authorId;
    newTopic.status    = topic.status;

    newTopic.save(function(err, doc) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve(doc)
    })
  })
};

exports.update = function(topic) {
  return new Promise(function(resolve, reject) {
    if (!topic) return reject(ResultMsg.PARAMS_ERROR)
    topic.save(function(err, doc) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve(resolve(doc))
    })
  })
}
