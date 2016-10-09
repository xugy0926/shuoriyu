/*!
 * nodeclub - controllers/topic.js
 */

/**
 * Module dependencies.
 */

var validator = require('validator');

import Base from './Base'
var at                = require('../common/at');
var UserProxy         = require('../proxy').User;
var TopicProxy        = require('../proxy').Topic;
var TopicCollectProxy = require('../proxy').TopicCollect;
var EventProxy   = require('eventproxy');
var tools        = require('../common/tools');
var store        = require('../common/store');
var config       = require('../config');
var _            = require('lodash');
var cache        = require('../common/cache');
var logger       = require('../common/logger');
import { apiPrefix } from '../../config';
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';


class Topic extends Base {
  constructor() {
    super()
  }

  config(req, res, next) {
    res.json({success: true, data: {topicStatus: tools.getTopicStatus()}})
  }

  getPages(query) {
    let limit = config.list_topic_count
    let key = JSON.stringify(query) + 'pages'

    return new Promise(function(resolve, reject) {
      cache.get(key)
        .then(pages => {
          if (pages) {
            resolve(pages)
          } else {
            TopicProxy.getCountByQuery(query)
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

  topics(req, res, next) {
    let that = this
    let currentPage = parseInt(req.body.currentPage, 10) || 1;
    let menuKey     = req.body.menuKey || 'all';
    let submenuKey  = req.body.submenuKey || '';
    let status      = req.body.status || 'reviewed';

    if (menuKey === '') {
      return res.json({success: false, message: '没选菜单'});
    }

    // 获取菜单查询条件
    let query = {};
    if (menuKey !== 'all') {
      query.menu = menuKey
    }
    
    if (submenuKey !== '') {
      query.submenu = submenuKey
    }

    if (status !== 'all') {
      query.status = status
    }

    let limit = config.list_topic_count
    let options = { skip: (currentPage - 1) * limit, limit: limit, sort: '-top -last_reply_at'}

    Promise.all([TopicProxy.getTopicsByQuery(query, options), that.getPages(query)])
      .then(([topics, pages]) => {
        let authorIds = [];

        topics.forEach(item => {
          if (item.author_id) authorIds.push(item.author_id.toString())
        })

        authorIds = _.uniq(authorIds)
        return [topics, pages, authorIds]
      })
      .then(([topics, pages, authorIds]) => {
        let thenable = {
          then: function(resolve, reject) {
            UserProxy.getUsersByIds(authorIds)
              .then(authors => resolve([topics, pages, authors]))
              .then(err => reject(err))
          }
        }
        
        return Promise.resolve(thenable)
      })
      .then(([topics, pages, authors]) => that.success(res, {data: topics, currentPage: currentPage, pages: pages, authors: authors}))
      .catch(message => that.error(res, {message}))
  }

  userTopics(req, res, next) {
    let that = this
    let userName = req.params.uid
    let currentPage = parseInt(req.body.currentPage, 10) || 1

    if (!userName) {
      return res.json({success: false, message: '参数错误'})
    }

    UserProxy.getUserByLoginName(userName)
      .then(user => {
        if (!user) throw '没找到用户'
        else return user._id
      })
      .then((userId) => {
        let query = {author_id: userId}
        let limit = config.list_topic_count;
        let options = { skip: (currentPage - 1) * limit, limit: limit, sort: '-top -last_reply_at'};

        let thenable = {
          then: function(resolve, reject) {
            Promise.all([TopicProxy.getTopicsByQuery(query, options), that.getPages(query)])
              .then(([topics, pages]) => resolve([topics, pages]))
              .catch(err => reject(err))
          }
        }
        return Promise.resolve(thenable)
      })
      .then(([topics, pages]) => {
        res.json({
                success: true,
                data: topics,
                currentPage: currentPage,
                pages: pages
              });
      })
      .catch(message => that.error(res, {message}))
  }

  /**
   * 获取topic数据
   *
   * @param  {HttpRequest} req
   * @param  {HttpResponse} res
   * @param  {Function} next
   */
  topic(req, res, next) {
    let that = this
    let topicId = req.params.tid

    if (topicId.length !== 24) {
      return res.json({success: false, message: '此话题不存在或已被删除。'});
    }

    TopicProxy.getTopicById(topicId)
      .then(topic => that.success(res, {success: true, data: topic}))
      .catch(err => that.error(res, {message: err}))
  }


  put(req, res, next) {
    let that = this
    let title    = validator.trim(req.body.title);
    let menu     = validator.trim(req.body.menu);
    let submenu  = validator.trim(req.body.submenu);
    let content  = validator.trim(req.body.content);
    let status   = validator.trim(req.body.status) || 'saved';
    let authorId = req.session.user._id

    // 验证
    let editError;
    if (title === '') {
      editError = '标题不能是空的。';
    } else if (title.length < 1 || title.length > 100) {
      editError = '标题字数太多或太少。';
    } else if (menu === '') {
      editError = '必须选择一个版块。';
    } else if (content === '') {
      editError = '内容不可为空';
    }
    // END 验证

    if (editError) {
      return res.json({success: false, message: editError});
    }

    let newTopic = {
      title: title,
      content: content,
      menu: menu,
      submenu: submenu,
      authorId: req.session.user._id,
      status: status
    }

    TopicProxy.newAndSave(newTopic)
      .then(topic => {
        let thenable = {
          then: function(resolve, reject) {
            let topicCount = 1
            UserProxy.increaseScore(topic.author_id, {topicCount})
              .then(author => {
                if (author) req.session.user = author
                resolve(topic)
              })
              .catch(err => resolve(topic))
          }
        }

        return Promise.resolve(thenable)
      })
      .then(topic => {
        let topicId = topic._id
        at.sendMessageToMentionUsers({content, topicId, authorId});
        that.success(res, {url: apiPrefix.page + '/topic/' + topic._id + '/show'})
      })
      .catch(err => that.error(res, {message: err}))
  }

  update(req, res, next) {
    let that = this
    let topicId = req.params.tid
    let title    = req.body.title || ''
    let menu     = req.body.menu || ''
    let submenu  = req.body.submenu;
    let content  = req.body.content || ''
    let status   = req.body.status

    if (title === '') {
      return res.json({success: false, message: '标题不能为空'})
    }

    if (content === '') {
      return res.json({success: false, message: '内容不能为空'})
    }

    if (menu === '') {
      return res.json({success: false, message: '菜单不能为空'})
    }

    TopicProxy.getTopicById(topicId)
      .then(topic => {
        if (!topic) {
          return res.json({success: false, message: '此话题不存在或已被删除。'})
        }

        if (topic.author_id.equals(req.session.user._id) || req.session.user.is_admin) {
          topic.title     = title;
          topic.content   = content;
          topic.menu      = menu;
          topic.submenu   = submenu;
          topic.status    = status;
          topic.update_at = new Date();

          let thenable = {
            then: function(resolve, reject) {
              TopicProxy.update(topic)
                .then(topic => resolve(topic))
                .catch(err => reject(err))
            }
          }

          return Promise.resolve(thenable)
        } else {
          throw '没有权限'
        }
      })
      .then(topic => {
        at.sendMessageToMentionUsers(content, topic._id, req.session.user._id);
        that.success(res, {url: apiPrefix.page + '/topic/' + topic._id + '/show'});
      })
      .catch(err => that.error(res, {message: err}))
  }

  delete(req, res, next) {
    let that = this
    //删除话题, 话题作者topic_count减1
    //删除回复，回复作者reply_count减1
    //删除topic_collect，用户collect_topic_count减1

    let topicId = req.params.tid;

    TopicProxy.getTopicById(topicId)
      .then(topic => {
        if (!topic) {
          return res.json({success: false, message: '文章不存在'})
        }

        if (!req.session.user.is_admin && !(topic.author_id.equals(req.session.user._id))) {
          return res.json({success: false, message: '无权限'})
        }

        topic.deleted = true

        let thenable = {
          then: function(resolve, reject) {
            TopicProxy.update(topic)
              .then(topic => resolve(topic))
              .catch(err => reject(err))
          }
        }

        return Promise.resolve(thenable)
      })
      .then(topic => that.success(res, {message: '话题已经删除'}))
      .catch(err => that.error(res, {message: err}))
  }

  // 设为置顶
  top(req, res, next) {
    let that = this
    let topicId = req.params.tid
    let referer  = req.get('referer')

    if (topic_id.length !== 24) {
      return res.json({success: false, message: '此话题不存在或已被删除。'})
    }

    TopicProxy.getTopicById(topicId)
      .then(topic => {
        if (!topic) {
          return res.json({success: false, message: ResultMsg.DATA_NOT_FOUND})
        }

        topic.top = !topic.top

        let thenable = {
          then: function(resolve, reject) {
            TopicProxy.update(topic)
              .then(topic => resolve(topic))
              .catch(err => reject(err))
          }
        }

        return Promise.resolve(thenable)
      })
      .then(topic => {
        let msg = topic.top ? '此话题已置顶。' : '此话题已取消置顶。'
        that.success(res, {message: msg});
      })
      .catch(err => that.error(res, {message: err}))
  }

  // 设为精华
  good(req, res, next) {
    let that = this
    let topicId = req.params.tid
    let referer  = req.get('referer')

    if (topic_id.length !== 24) {
      return res.json({success: false, message: '此话题不存在或已被删除。'})
    }

    TopicProxy.getTopicById(topicId)
      .then(topic => {
        if (!topic) {
          return res.json({success: false, message: ResultMsg.DATA_NOT_FOUND})
        }

        topic.good = !topic.good

        let thenable = {
          then: function(resolve, reject) {
            TopicProxy.update(topic)
              .then(topic => resolve(topic))
              .catch(err => reject(err))
          }
        }

        return Promise.resolve(thenable)
      })
      .then(topic => {
        let msg = topic.good ? '此话题已加精。' : '此话题已取消加精。'
        that.success(res, {message: msg});
      })
      .catch(err => that.error(res, {message: err}))
  }

  // 锁定主题，不可再回复
  lock(req, res, next) {
    let topicId = req.params.tid;
    let referer = req.get('referer');
    TopicProxy.getTopic(topicId, function (err, topic) {
      if (err) {
        return next(err);
      }
      if (!topic) {
        res.render404('此话题不存在或已被删除。');
        return;
      }
      topic.lock = !topic.lock;
      topic.save(function (err) {
        if (err) {
          return next(err);
        }

        let msg = topic.lock ? '此话题已锁定。' : '此话题已取消锁定。';
        res.render('notify/notify', {success: msg, referer: referer});
      });
    });
  }

  // 收藏主题
  collect(req, res, next) {
    let topicId = req.body.topic_id;

    TopicProxy.getTopic(topicId, function (err, topic) {
      if (err) {
        return next(err);
      }
      if (!topic) {
        res.json({status: 'failed'});
      }

      TopicCollectProxy.getTopicCollect(req.session.user._id, topic._id, function (err, doc) {
        if (err) {
          return next(err);
        }
        if (doc) {
          res.json({status: 'failed'});
          return;
        }

        TopicCollectProxy.newAndSave(req.session.user._id, topic._id, function (err) {
          if (err) {
            return next(err);
          }
          res.json({status: 'success'});
        });

        UserProxy.getUserById(req.session.user._id, function (err, user) {
          if (err) {
            return next(err);
          }
          user.collect_topic_count += 1;
          user.save();
        });

        req.session.user.collect_topic_count += 1;
        topic.collect_count += 1;
        topic.save();
      });
    });
  }

  de_collect(req, res, next) {
    var topic_id = req.body.topic_id;
    TopicProxy.getTopic(topic_id, function (err, topic) {
      if (err) {
        return next(err);
      }
      if (!topic) {
        res.json({status: 'failed'});
      }
      TopicCollectProxy.remove(req.session.user._id, topic._id, function (err, removeResult) {
        if (err) {
          return next(err);
        }
        if (removeResult.result.n == 0) {
          return res.json({status: 'failed'})
        }

        UserProxy.getUserById(req.session.user._id, function (err, user) {
          if (err) {
            return next(err);
          }
          user.collect_topic_count -= 1;
          req.session.user = user;
          user.save();
        });

        topic.collect_count -= 1;
        topic.save();

        res.json({status: 'success'});
      });
    });
  }

  status(req, res, next) {
    let that = this
    let topicId = req.params.tid
    let status = validator.trim(req.body.status) || 'saved'

    TopicProxy.getTopicById(topicId)
      .then(topic => {
        if (!topic) {
          throw '此话题不存在或已被删除。'
        }

        if (!req.session.user.is_admin && !(topic.author_id.equals(req.session.user._id))) {
          throw '无权限'
        }

        topic.status = status

        let thenable = {
          then: function(resolve, reject) {
            TopicProxy.update(topic)
              .then(topic => resolve('更新成功'))
              .catch(err => reject(err))
          }
        }

        return Promise.resolve(thenable)
      })
      .then(message => that.success(res, {message}))
      .catch(message => that.error(res, {message}))
  }

  upload(req, res, next) {
    let isFileLimit = false;
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        file.on('limit', function () {
          isFileLimit = true;

          res.json({
            success: false,
            msg: 'File size too large. Max is ' + config.file_limit
          })
        });

        store.upload(file, {filename: filename}, function (err, result) {
          if (err) {
            return next(err);
          }
          if (isFileLimit) {
            return;
          }
          res.json({
            success: true,
            url: result.url,
          });
        });

      });

    req.pipe(req.busboy);
  }
}

module.exports = Topic
