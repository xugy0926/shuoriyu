/*!
 * nodeclub - site index controller.
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * Copyright(c) 2012 muyuan
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
import multiline  from 'multiline';
import validator  from 'validator';
import Base       from './Base'
var UserProxy         = require('../proxy').User;
var TopicProxy        = require('../proxy').Topic;
var config       = require('../config');
var eventproxy   = require('eventproxy');
var cache        = require('../common/cache');
var xmlbuilder   = require('xmlbuilder');
var renderHelper = require('../common/render_helper');
var _            = require('lodash');
import { apiPrefix } from '../../config';
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';

class Page extends Base {
  cmsPage(req, res) {
    res.render('cms/index',{pageTitle: '全部', navTab: 'topic'});
  }

  signupPage (req, res) {
    res.render('sign/signup');
  };

  signinPage (req, res) {
    req.session._loginReferer = req.headers.referer;
    res.render('sign/signin');
  };

  // sign out
  signout (req, res, next) {
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, { path: '/' });
    res.redirect( apiPrefix.page + '/cms');
  };

  searchPasswordFromMailPage (req, res) {
    res.render('sign/searchPasswordFromMail');
  };

  inputSearchPasswordPage (req, res) {
    let key = validator.trim(req.query.key || '');
    let loginname = validator.trim(req.query.loginname || '');

    UserProxy.getUserByNameAndKey(loginname, key)
      .then(doc => {
        res.render('sign/inputSearchPassword', {key: key, loginname: loginname})
      })
      .catch(message => res.json({success: false, message: message}))
  }

  resetPasswordPage (req, res, next) {
    let userId = req.session.user._id;
    res.render('sign/resetPassword', {userId: userId});
  };

  myMessagesPage (req, res, next) {
    let userId = validator.trim(req.session.user._id || '')
    res.render('message/index', {userId: userId});
  };

  topicPage (req, res, next) {
    let topicId = req.params.tid;

    if (topicId.length !== 24) {
      return res.render('notify', {message: '此话题不存在或已被删除。'});
    }

    TopicProxy.getTopicById(topicId)
      .then(topic => {
        if (!topic) throw '数据不存在'
        topic = topic.toObject()
        let thenable =  {
          then: function(resolve, reject) {
            UserProxy.getUserById()
              .then(author => {
                resolve({...topic, author})
              })
              .catch(err => reject(err))
          }
        }

        return Promise.resolve(thenable)
      })
      .then(topic => res.render('topic/index', {topic: topic}))
      .catch(err => that.error(res, {message: err}))
  }

  createTopicPage (req, res, next) {
    res.render('topic/edit');
  }

  editTopicPage (req, res, next) {
    let topicId = req.params.tid;
    res.render('topic/edit', {topicId: topicId});
  }

  menuPage (req, res, next) {
    res.render('menu/index', {navTab: 'menu'});
  }

  userPage (req, res, next) {
    res.render('user/index');
  }

  userTopicsPage (req, res, next) {
    let userName = req.params.name;
    res.render('user/topics', {userName: userName});
  };

  userRepliesPage (req, res, next) {
    let userName = req.params.name;
    res.render('user/replies', {userName: userName});
  };

  settingPage (req, res, next) {
    let userId = req.session.user._id;
    res.render('user/setting', {userId, userId});
  };

  // static page
  // About
  aboutPage (req, res, next) {
    res.render('static/about', {pageTitle: '关于我们'});
  };

  // FAQ
  faqPage (req, res, next) {
    res.render('static/faq');
  };

  getstartPage (req, res) {
    res.render('static/getstart', {
      pageTitle: 'Node.js 新手入门'
    });
  };

  apiPage (req, res, next) {
    res.render('static/api');
  };

  appDownload (req, res, next) {
    res.redirect('https://github.com/soliury/noder-react-native/blob/master/README.md')
  };
}

module.exports = Page
