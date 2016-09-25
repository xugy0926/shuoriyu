/*!
 * nodeclub - site index controller.
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * Copyright(c) 2012 muyuan
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
var multiline    = require('multiline');
var validator    = require('validator');
var User         = require('../proxy').User;
var Topic        = require('../proxy').Topic;
var config       = require('../config');
var eventproxy   = require('eventproxy');
var cache        = require('../common/cache');
var xmlbuilder   = require('xmlbuilder');
var renderHelper = require('../common/render_helper');
var _            = require('lodash');
import { apiPrefix } from '../../config';


exports.cmsPage = function (req, res) {
  res.render('cms/index',{pageTitle: '全部', navTab: 'topic'});
}

exports.signupPage = function (req, res) {
  res.render('sign/signup');
};

exports.signinPage = function (req, res) {
  req.session._loginReferer = req.headers.referer;
  res.render('sign/signin');
};

// sign out
exports.signout = function (req, res, next) {
  req.session.destroy();
  res.clearCookie(config.auth_cookie_name, { path: '/' });
  res.redirect( apiPrefix.page + '/cms');
};

exports.searchPasswordFromMailPage = function (req, res) {
  res.render('sign/searchPasswordFromMail');
};

exports.inputSearchPasswordPage = function (req, res) {
  var key = validator.trim(req.query.key || '');
  var loginname = validator.trim(req.query.loginname || '');

  User.getUserByNameAndKey(loginname, key, function(err, user) {
    if (err || !user) {
      res.json({success: false, message: '找不到用户' + loginname});
      return;
    }

    res.render('sign/inputSearchPassword', {key: key, loginname: loginname});
  });
}

exports.resetPasswordPage = function (req, res, next) {
  var userId = req.session.user._id;
  res.render('sign/resetPassword', {userId: userId});
};

exports.myMessagesPage = function (req, res, next) {
  res.render('message/index');
};

exports.topicPage = function (req, res, next) {
  var topicId = req.params.tid;
  console.log(topicId);

  Topic.getTopicById(topicId, function(err, topic) {
    if (err) {
      return res.json({error: 'topic not found!'});
    }

    console.log(topic);

    res.render('topic/index', {topic: topic});
  });
}

exports.createTopicPage = function (req, res, next) {
  res.render('topic/edit');
}

exports.editTopicPage = function (req, res, next) {
  var topicId = req.params.tid;
  console.log(topicId);
  res.render('topic/edit', {topicId: topicId});
}

exports.menuPage = function (req, res, next) {
  res.render('menu/index', {navTab: 'tag'});
}

exports.userPage = function (req, res, next) {
  res.render('user/index');
}

exports.userTopicsPage = function (req, res, next) {
  var userName = req.params.name;
  res.render('user/topics', {userName: userName});
};

exports.userRepliesPage = function (req, res, next) {
  var userName = req.params.name;
  res.render('user/replies', {userName: userName});
};

exports.settingPage = function (req, res, next) {
  var userId = req.session.user._id;
  res.render('user/setting', {userId, userId});
};

// static page
// About
exports.aboutPage = function (req, res, next) {
  res.render('static/about', {
    pageTitle: '关于我们'
  });
};

// FAQ
exports.faqPage = function (req, res, next) {
  res.render('static/faq');
};

exports.getstartPage = function (req, res) {
  res.render('static/getstart', {
    pageTitle: 'Node.js 新手入门'
  });
};

exports.apiPage = function (req, res, next) {
  res.render('static/api');
};


exports.sitemap = function (req, res, next) {
  var urlset = xmlbuilder.create('urlset',
    {version: '1.0', encoding: 'UTF-8'});
  urlset.att('xmlns', 'http://www.sitemaps.org/schemas/sitemap/0.9');

  var ep = new eventproxy();
  ep.fail(next);

  ep.all('sitemap', function (sitemap) {
    res.type('xml');
    res.send(sitemap);
  });

  cache.get('sitemap', ep.done(function (sitemapData) {
    if (sitemapData) {
      ep.emit('sitemap', sitemapData);
    } else {
      Topic.getLimit5w(function (err, topics) {
        if (err) {
          return next(err);
        }
        topics.forEach(function (topic) {
          urlset.ele('url').ele('loc', 'http://cnodejs.org/topic/' + topic._id);
        });

        var sitemapData = urlset.end();
        // 缓存一天
        cache.set('sitemap', sitemapData, 3600 * 24);
        ep.emit('sitemap', sitemapData);
      });
    }
  }));
};

exports.appDownload = function (req, res, next) {
  res.redirect('https://github.com/soliury/noder-react-native/blob/master/README.md')
};
