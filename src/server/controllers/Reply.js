import Base from './Base'
var validator  = require('validator');
var _          = require('lodash');
var cache      = require('../common/cache');
var at         = require('../common/at');
var message    = require('../common/message');
var EventProxy = require('eventproxy');
var UserProxy  = require('../proxy').User;
var TopicProxy = require('../proxy').Topic;
var ReplyProxy = require('../proxy').Reply;
var config     = require('../config');
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';

class Reply extends Base {
  constructor() {
    super()
  }

  getPages(query) {
    let limit = config.list_reply_count
    let key = JSON.stringify(query) + '[reply pages]'

    return new Promise(function(resolve, reject) {
      cache.get(key)
        .then(pages => {
          if (pages) {
            resolve(pages)
          } else {
            ReplyProxy.getCountByQuery(query)
              .then(count => {
                let pages = Math.ceil(count / limit);
                cache.set(key, pages, 60 * 1)
                  .then(() => resolve(pages))
                  .catch(err => reject(err))
              })
              .catch(err => reject(err))
          }
        })
        .catch(err => reject(err))
    })
  }

  /**
   * 获取回复列表
   */
  replies(req, res, next) {
    let that = this
    let topicId = req.params.tid
    let currentPage = parseInt(req.body.currentPage, 10) || 1
    let query = {topic_id: topicId, deleted: false}
    let limit = config.list_reply_count
    let options = { skip: (currentPage - 1) * limit, limit: limit, sort: '-create_at'}

    Promise.all([ReplyProxy.getRepliesByQuery(query, options), that.getPages(query)])
      .then(([replies, pages]) => {
        let thenable = {
          then: function(resolve, reject) {
            let replyAuthorIds = [];

            replies.forEach(item => {
              if (item.author_id) replyAuthorIds.push(item.author_id.toString())
            })

            replyAuthorIds = _.uniq(replyAuthorIds)
            resolve([replies, replyAuthorIds, pages])
          }
        }

        return Promise.resolve(thenable)
      })
      .then(([replies, replyAuthorIds, pages]) => {
        let thenable = {
          then: function(resolve, reject) {
            UserProxy.getUsersByIds(replyAuthorIds)
              .then(authors => resolve([replies, authors, pages]))
              .then(err => reject(err))
          }
        }
        
        return Promise.resolve(thenable)
      })
      .then(([replies, authors, pages]) => res.json({success: true, data: {currentPage, replies, authors, pages}}))
      .catch(message => that.error(res, {message}))
  }

  /**
   * 添加回复
   */
  add(req, res, next) {
    var content = req.body.content;
    var topicId = req.params.tid;
    var replyId = req.body.reply_id || '';
    var authorId = req.session.user._id;

    content = validator.trim(String(content));
    if (content === '') {
      return res.json({success: false, message: '回复内容不能为空。'})
    }

    if (!topicId || !authorId) {
      return res.json({success: false, message: '参数错误'})
    }

    TopicProxy.getTopicById(topicId)
      .then(topic => ReplyProxy.newAndSave({authorId, replyId, topicId, content}))
      .then(reply => {
        let thenable = {
          then: function(resolve, reject) {
            TopicProxy.updateLastReply(topicId, reply._id)
              .then(topic => {
                let masterId = topic.author_id
                resolve([reply, masterId])
              })
              .catch(err => reject(err))
          }
        }
        
        return Promise.resolve(thenable)
      })
      .then(([reply, masterId]) => {
        let replyId = reply._id
        at.sendMessageToMentionUsers({content, topicId, authorId, replyId})
        message.sendReplyMessage({masterId, authorId, topicId, replyId})
          
        let thenable = {
          then: function(resolve, reject) {
            let replyCount = 1
            UserProxy.increaseScore(authorId, {replyCount})
            .then((author) => {
              reply = reply.toObject()
              reply.author = author
              resolve(reply)
            })
            .catch(err => reject(err))
          }
        }

        return Promise.resolve(thenable)
      })
      .then((reply) => {
        res.json({success: true, data: reply})
      })
      .catch(err => {
        res.json({success: false, message: err})
      })
  }

  /**
   * 删除回复信息
   */
  delete(req, res, next) {
    let replyId = req.body.reply_id
    let userId = req.session.user._id.toString()

    ReplyProxy.getReplyById(replyId)
      .then(reply => {
        if (!reply)  throw '找不到消息'
        else if (reply.author_id.toString() !== userId && !req.session.user.is_admin) throw '没有权限'
        else return reply
      })
      .then(reply => {
        reply.deleted = true

        let thenable = {
          then: function(resolve, reject) {
            ReplyProxy.update(reply).then(() => resolve(reply)).catch(err => reject(err))
          }
        }

        return Promise.resolve(thenable)
      })
      .then(reply => {
        let thenable = {
          then: function(resolve, reject) {
            ReplyProxy.getLastReplyByTopicId(reply.topic_id)
              .then(lastReply => resolve([reply, lastReply]))
              .catch(err => reject(err))
          }
        }

        return Promise.resolve(thenable)
      })
      .then(([reply, lastReply]) => {return TopicProxy.reduceTopicCount(reply.topic_id, lastReply._id)})
      .then(res.json({success: true, message: '删除成功'}))
      .catch(err => res.json({success: false, message: err}))
  }

  /*
   提交编辑回复
   */
  update(req, res, next) {
    let replyId = req.params.reply_id
    let content = req.body.content
    let userId = req.session.user._id.toString()

    if (content.trim().length > 0) {
      return res.json({success: false, message: '回复字数太少'})
    }

    ReplyProxy.getReplyById(replyId)
      .then(reply => {
        if (!reply) throw '找不到消息'
        else if (reply.author_id.toString() !== userId && !req.session.user.is_admin) throw '没有权限'
        else return reply
      })
      .then(reply => {
        reply.content = content
        return ReplyProxy.update(reply)
      })
      .then(reply => {
        res.json({success: true, message: '更新成功'})
      })
      .catch(err => console.log(err))
  }

  up(req, res, next) {
    var replyId = req.params.reply_id;
    var userId = req.session.user._id;
    ReplyProxy.getReplyById(replyId, function (err, reply) {
      if (err) {
        return next(err);
      }
      if (reply.author_id.equals(userId) && !config.debug) {
        // 不能帮自己点赞
        res.send({
          success: false,
          message: '呵呵，不能帮自己点赞。',
        });
      } else {
        var action;
        reply.ups = reply.ups || [];
        var upIndex = reply.ups.indexOf(userId);
        if (upIndex === -1) {
          reply.ups.push(userId);
          action = 'up';
        } else {
          reply.ups.splice(upIndex, 1);
          action = 'down';
        }
        reply.save(function () {
          res.send({
            success: true,
            action: action
          });
        });
      }
    });
  }
}

module.exports = Reply
