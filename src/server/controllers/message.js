import Base from './Base'
var MessageProxy    = require('../proxy').Message;
var eventproxy = require('eventproxy');
var config     = require('../config');
var cache        = require('../common/cache');
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';

class Message extends Base {
  getPages(userId, hasRead) {
    let limit = config.list_topic_count
    let key = JSON.stringify(userId + hasRead.toString()) + 'messages+pages'

    return new Promise(function(resolove, reject) {
      cache.get(key)
        .then(pages => {
          if (pages) {
            resolove(pages)
          } else {
            MessageProxy.getMessagesCount(userId, hasRead)
              .then(count => {
                let pages = Math.ceil(count / limit);
                cache.set(key, pages, 60 * 1)
                  .then(() => resolove(pages))
                  .catch(err => reject(err))
              })
              .catch(err => reject(err))
          }       
        })
        .catch(err => reject(err))
    })
  }

  unreadCount(req, res, next) {
    let that = this
    let userId = req.params.uid

    MessageProxy.getMessagesCount(userId, false)
      .then(count => that.success(res, {count}))
      .catch(message => that.error(res, {message}))
  }

  userMessages(req, res, next) {
    let that = this
    let userId = req.params.uid
    let currentPage = parseInt(req.body.currentPage, 10) || 1
    
    if (userId !== req.session.user._id.toString() && !req.session.user.is_admin) {
      return res.json({success: false, message: '没有权限'})
    }

    let type = req.body.type || 'un_read'

    let limit = config.list_topic_count;
    let options = { skip: (currentPage - 1) * limit, limit: limit, sort: '-top -last_reply_at'};

    let hasRead = (type === 'un_read') ? false : true

    MessageProxy.getMessagesByUserId(userId, hasRead, options)
      .then(messages => {
        if (messages.length > 0) return MessageProxy.getFullMessages(messages)
        else return messages
      })
      .then(messages => {
        let thenable = {
          then: function(resolve, reject) {
            that.getPages(userId, hasRead)
              .then(pages => resolve([messages, pages]))
              .catch(err => reject(err))
          }
        }

        return Promise.resolve(thenable)
      })
      .then(([messages, pages]) => {
        res.json({success: true, data: messages, pages: pages, currentPage: currentPage})
      })
      .catch(err => res.json({success: false, messages: err}))
  }
}

module.exports = Message
