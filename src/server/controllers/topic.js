/*!
 * nodeclub - controllers/topic.js
 */

/**
 * Module dependencies.
 */

var validator = require('validator');

var at           = require('../common/at');
var User         = require('../proxy').User;
var Topic        = require('../proxy').Topic;
var TopicCollect = require('../proxy').TopicCollect;
var EventProxy   = require('eventproxy');
var tools        = require('../common/tools');
var store        = require('../common/store');
var config       = require('../config');
var _            = require('lodash');
var cache        = require('../common/cache');
var logger       = require('../common/logger');
import { apiPrefix } from '../../config';

exports.config = function (req, res, next) {
  res.json({success: true, data: {topicStatus: tools.getTopicStatus()}});
}

/**
 * 获取topic数据
 *
 * @param  {HttpRequest} req
 * @param  {HttpResponse} res
 * @param  {Function} next
 */
exports.topic = function (req, res, next) {
  var topic_id = req.params.tid;

  if (topic_id.length !== 24) {
    return res.json({success: false, message: '此话题不存在或已被删除。'});
  }

  Topic.getTopic(topic_id, function(err, topic) {

    if(err || !topic) {
      return res.json({success: false, message: '此话题不存在或已被删除。'});
    }

    return res.json({
      success: true,
      data: topic
    });
  });
};


exports.put = function (req, res, next) {
  var title   = validator.trim(req.body.title);
  var menu     = validator.trim(req.body.menu);
  var submenu = validator.trim(req.body.submenu);
  var content = validator.trim(req.body.content);
  var status = validator.trim(req.body.status) || 'saved';

  // 验证
  var editError;
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
    return res.json({error: editError});
  }

  var newTopic = {
    title: title,
    content: content,
    menu: menu,
    submenu: submenu,
    authorId: req.session.user._id,
    status: status
  }

  Topic.newAndSave(newTopic, function (err, topic) {
    if (err) {
      return res.json({error: '出错啦！'});
    }

    var proxy = new EventProxy();

    proxy.all('score_saved', function () {
      res.json({success: 'success', url: apiPrefix.page + '/topic/' + topic._id + '/show'});
    });
    proxy.fail(next);
    User.getUserById(req.session.user._id, proxy.done(function (user) {
      user.score += 5;
      user.topic_count += 1;
      user.save();
      req.session.user = user;
      proxy.emit('score_saved');
    }));

    //发送at消息
    at.sendMessageToMentionUsers(content, topic._id, req.session.user._id);
  });
};

exports.update = function (req, res, next) {
  var topic_id = req.params.tid;
  var title    = req.body.title;
  var menu     = req.body.menu;
  var submenu  = req.body.submenu;
  var content  = req.body.content;
  var status   = req.body.status;

  Topic.getTopicById(topic_id, function (err, topic, tags) {
    if (!topic) {
      res.json({success: false, message: '此话题不存在或已被删除。'});
      return;
    }

    if (topic.author_id.equals(req.session.user._id) || req.session.user.is_admin) {
      title   = validator.trim(title);
      menu     = validator.trim(menu);
      submenu = validator.trim(submenu);
      content = validator.trim(content);
      status = validator.trim(status);

      // 验证
      var editError;
      if (title === '') {
        editError = '标题不能是空的。';
      } else if (title.length < 1 || title.length > 100) {
        editError = '标题字数太多或太少。';
      } else if (menu === '') {
        editError = '必须选择menu';
      }
      // END 验证

      if (editError) {
        return res.json({success: false, message: editError});
      }

      //保存话题
      topic.title     = title;
      topic.content   = content;
      topic.menu      = menu;
      topic.submenu   = submenu;
      topic.status    = status;
      topic.update_at = new Date();

      topic.save(function (err) {
        if (err) {
          return next(err);
        }
        //发送at消息
        at.sendMessageToMentionUsers(content, topic._id, req.session.user._id);

        res.json({success: true, url: apiPrefix.page + '/topic/' + topic._id + '/show'});

      });
    } else {
      res.json({success: false, message: '对不起，你不能编辑此话题。'});
    }
  });
};

exports.delete = function (req, res, next) {
  //删除话题, 话题作者topic_count减1
  //删除回复，回复作者reply_count减1
  //删除topic_collect，用户collect_topic_count减1

  var topic_id = req.params.tid;

  Topic.getTopicById(topic_id, function (err, topic) {
    if (err || !topic) {
      res.json({ success: false, message: '出错/或此话题不存在' });
      return;
    }

    if (!req.session.user.is_admin && !(topic.author_id.equals(req.session.user._id))) {
      res.json({success: false, message: '无权限'});
      return;
    }

    // author.score -= 5;
    // author.topic_count -= 1;
    // author.save();

    topic.deleted = true;
    topic.save(function (err) {
      if (err) {
        res.json({success: false, message: '无权限'});
        return;
      }

      res.send({ success: true, message: '话题已被删除。' });
    });
  });
};

// 设为置顶
exports.top = function (req, res, next) {
  var topic_id = req.params.tid;
  var referer  = req.get('referer');

  if (topic_id.length !== 24) {
    res.render404('此话题不存在或已被删除。');
    return;
  }
  Topic.getTopic(topic_id, function (err, topic) {
    if (err) {
      return next(err);
    }
    if (!topic) {
      res.render404('此话题不存在或已被删除。');
      return;
    }
    topic.top = !topic.top;
    topic.save(function (err) {
      if (err) {
        return next(err);
      }
      var msg = topic.top ? '此话题已置顶。' : '此话题已取消置顶。';
      res.render('notify/notify', {success: msg, referer: referer});
    });
  });
};

// 设为精华
exports.good = function (req, res, next) {
  var topicId = req.params.tid;
  var referer = req.get('referer');

  Topic.getTopic(topicId, function (err, topic) {
    if (err) {
      return next(err);
    }
    if (!topic) {
      res.render404('此话题不存在或已被删除。');
      return;
    }
    topic.good = !topic.good;
    topic.save(function (err) {
      if (err) {
        return next(err);
      }
      var msg = topic.good ? '此话题已加精。' : '此话题已取消加精。';
      res.render('notify/notify', {success: msg, referer: referer});
    });
  });
};

// 锁定主题，不可再回复
exports.lock = function (req, res, next) {
  var topicId = req.params.tid;
  var referer = req.get('referer');
  Topic.getTopic(topicId, function (err, topic) {
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
      var msg = topic.lock ? '此话题已锁定。' : '此话题已取消锁定。';
      res.render('notify/notify', {success: msg, referer: referer});
    });
  });
};

// 收藏主题
exports.collect = function (req, res, next) {
  var topic_id = req.body.topic_id;

  Topic.getTopic(topic_id, function (err, topic) {
    if (err) {
      return next(err);
    }
    if (!topic) {
      res.json({status: 'failed'});
    }

    TopicCollect.getTopicCollect(req.session.user._id, topic._id, function (err, doc) {
      if (err) {
        return next(err);
      }
      if (doc) {
        res.json({status: 'failed'});
        return;
      }

      TopicCollect.newAndSave(req.session.user._id, topic._id, function (err) {
        if (err) {
          return next(err);
        }
        res.json({status: 'success'});
      });
      User.getUserById(req.session.user._id, function (err, user) {
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
};

exports.de_collect = function (req, res, next) {
  var topic_id = req.body.topic_id;
  Topic.getTopic(topic_id, function (err, topic) {
    if (err) {
      return next(err);
    }
    if (!topic) {
      res.json({status: 'failed'});
    }
    TopicCollect.remove(req.session.user._id, topic._id, function (err, removeResult) {
      if (err) {
        return next(err);
      }
      if (removeResult.result.n == 0) {
        return res.json({status: 'failed'})
      }

      User.getUserById(req.session.user._id, function (err, user) {
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
};

exports.status = function (req, res, next) {
  var topicId = req.params.tid;
  var status = validator.trim(req.body.status) || 'saved';

  Topic.getTopic(topicId, function (err, topic) {
    if (err) {
      return res.json({ success: false, message: '获取数据错误'});
    }

    if (!req.session.user.is_admin && !(topic.author_id.equals(req.session.user._id))) {
      return res.json({success: false, message: '无权限'});
    }

    if (!topic) {
      return res.json({ success: false, message: '此话题不存在或已被删除。' });
    }

    topic.status = status;
    topic.save(function (err) {
      if (err) {
        return res.json({ success: false, message: '保存数据出错'});
      }
      res.json({ success: true, message: '更新成功' });
    });
  });
}

exports.upload = function (req, res, next) {
  var isFileLimit = false;
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
};
