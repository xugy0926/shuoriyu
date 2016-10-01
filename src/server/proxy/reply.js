var models     = require('../models');
var Reply      = models.Reply;
var EventProxy = require('eventproxy');
var tools      = require('../common/tools');
var User       = require('./user');
var at         = require('../common/at');
var renderHelper = require('../common/render_helper');
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';


/**
 * 获取一条回复信息
 * @param {String} id 回复ID
 */
exports.getReplyById = function (id) {
  return new Promise(function(resolve, reject) {
    Reply.findOne({_id: id}, function(err, doc) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve(doc)
    })
  })
};

/**
 * 根据回复ID，获取回复
 * Callback:
 * - err, 数据库异常
 * - reply, 回复内容
 * @param {String} id 回复ID
 * @param {Function} callback 回调函数
 */
// exports.getReplyById = function (id, callback) {
//   if (!id) {
//     return callback(null, null);
//   }
//   Reply.findOne({_id: id}, function (err, reply) {

//     reply = reply.toObject();

//     if (err) {
//       return callback(err);
//     }
//     if (!reply) {
//       return callback(err, null);
//     }

//     var author_id = reply.author_id;
//     User.getUserById(author_id, function (err, author) {
//       if (err) {
//         return callback(err);
//       }
//       reply.author = author;

//       at.linkUsers(reply.content, function (err, str) {
//         if (err) {
//           return callback(err);
//         }
//         reply.content = renderHelper.markdown(str);
//         return callback(err, reply);
//       });
//     });
//   });
// };

/**
 * 根据主题ID，获取回复列表
 * Callback:
 * - err, 数据库异常
 * - replies, 回复列表
 * @param {String} id 主题ID
 */
exports.getRepliesByTopicId = function (id) {
  return new Promise(function(resolve, reject) {
    Reply.find({topic_id: id, deleted: false}, '', {sort: 'create_at'}, function (err, docs) {
      console.log(docs)
      if (err) return reject(ResultMsg.DB_ERROR)
      if (!docs) return reject(ResultMsg.DATA_NOT_FOUND)
      resolve(docs)
    })
  })
  // Reply.find({topic_id: id, deleted: false}, '', {sort: 'create_at'}, function (err, replies) {


  //   var newReplies = [];
  //   for (var i = 0, len = replies.length; i < len; i++) {
  //     newReplies[i] = replies[i].toObject();
  //   }

  //   var proxy = new EventProxy();
  //   proxy.after('reply_find', newReplies.length, function () {
  //     cb(null, newReplies);
  //   });
  //   for (var j = 0; j < newReplies.length; j++) {
  //     (function (i) {
  //       var author_id = newReplies[i].author_id;
  //       User.getUserById(author_id, function (err, author) {
  //         if (err) {
  //           return cb(err);
  //         }
  //         newReplies[i].author = author || { _id: '' };
  //         if (newReplies[i].content_is_html) {
  //           return proxy.emit('reply_find');
  //         }
  //         at.linkUsers(newReplies[i].content, function (err, str) {
  //           if (err) {
  //             return cb(err);
  //           }
  //           newReplies[i].content = renderHelper.markdown(str);
  //           proxy.emit('reply_find');
  //         });
  //       });
  //     })(j);
  //   }
  // });
};

/**
 * 创建并保存一条回复信息
 * @param {String} content 回复内容
 * @param {String} topicId 主题ID
 * @param {String} authorId 回复作者
 * @param {String} [replyId] 回复ID，当二级回复时设定该值
 */
exports.newAndSave = function ({content, topicId, authorId, replyId}) {
  return new Promise(function(resolve, reject) {
    if (!content || !topicId || !authorId) {
      reject(ResultMsg.PARAMS_ERROR)
      return
    }

    replyId  = !replyId ? '' : replyId;

    var reply       = new Reply();
    reply.content   = content;
    reply.topic_id  = topicId;
    reply.author_id = authorId;

    if (replyId) reply.reply_id = replyId;

    reply.save(function (err, doc) {
      if (err) reject(ResultMsg.DB_ERROR)
      else if (!doc) reject(ResultMsg.SAVE_ERROR)
      else resolve(doc)
    });
  })
};

exports.update = function(doc) {
  return new Promise(function(resolve, reject) {
    if (!doc) reject(ResultMsg.PARAMS_ERROR)
    else {
      doc.save(function(err) {
        if (err) reject(ResultMsg.DB_ERROR)
        else resolve() 
      })
    } 
  })
}

/**
 * 根据topicId查询到最新的一条未删除回复
 * @param topicId 主题ID
 */
exports.getLastReplyByTopicId = function (topicId) {
  return new Promise(function(resolve, reject) {
    Reply.findOne(
      {topic_id: topicId, deleted: false}, 
      '_id', 
      {sort: {create_at : -1}, 
      limit : 1}, 
      function(err, doc) {
        if (err) reject(ResultMsg.DB_ERROR)
        else resolve(doc)
    })
  })
};

exports.getRepliesByAuthorId = function (authorId, opt) {
  return new Promise(function(resolve, reject) {
    opt = !opt? null : opt
    Reply.find({author_id: authorId}, {}, opt, function(err, docs) {
      if (err) reject(ResultMsg.DB_ERROR) 
      else resolve(docs)
    })
  })
};

// 通过 author_id 获取回复总数
exports.getCountByAuthorId = function (authorId) {
  return new Promise(function(resolve, reject) {
    Reply.count({author_id: authorId}, function(err, count) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve(count)
    })
  })
};
