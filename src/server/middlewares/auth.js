var mongoose   = require('mongoose');
var UserModel  = mongoose.model('User');
var MessageProxy    = require('../proxy').Message;
var config     = require('../config');
var eventproxy = require('eventproxy');
var UserProxy  = require('../proxy').User;
var validator  = require('validator');
import { debug } from '../../config';
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';


// 非登录用户也可通过
exports.tryAuth = function (req, res, next) {

  let accessToken = String(req.body.accessToken || '');
  accessToken = validator.trim(accessToken);

  UserProxy.getUserById(accessToken)
    .then(user => {
      if (user.is_block) return res.json({success: false, message: '您的账户被禁用'})
      req.user = user
      next()
    })
    .catch(err => next(err))
};

/**
 * 需要管理员权限
 */
exports.adminRequired = function (req, res, next) {
  if (!req.session || !req.session.user) {
    req.session._loginReferer = req.headers.referer
    return res.render('sign/signin');
  }

  if (!req.session.user.is_admin) {
    return res.json({success: false, message: '需要管理员权限。' });
  }

  next();
};

/**
 * 需要登录
 */
exports.userRequired = function (req, res, next) {
  if (!req.session || !req.session.user || !req.session.user._id) {
    return res.json({success: false, message: 'forbidden!'});
  }

  next();
};

exports.blockUser = function () {
  return function (req, res, next) {
    if (req.path === '/signout') {
      return next();
    }

    if (req.session.user && req.session.user.is_block && req.method !== 'GET') {
      return res.json({success: false, message: '您已被管理员屏蔽了。有疑问请联系 @shuoriyu。'});
    }
    next();
  };
};


function gen_session(user, res) {
  var auth_token = user._id + '$$$$'; // 以后可能会存储更多信息，用 $$$$ 来分隔
  var opts = {
    path: '/',
    maxAge: 1000 * 60 * 60 * 24 * 30,
    signed: true,
    httpOnly: true
  };
  res.cookie(config.auth_cookie_name, auth_token, opts); //cookie 有效期30天
}

exports.gen_session = gen_session;

// 验证用户是否登录
exports.authUser = function (req, res, next) {

  // Ensure current_user always has defined.
  res.locals.current_user = null;

  if (req.session.user) { 
    let user = new UserModel(req.session.user)
    if (config.admins.hasOwnProperty(user.loginname)) {
      user.is_admin = true
    }

    res.locals.current_user = req.session.user = user
    next()
  } else {
    let auth_token = req.signedCookies[config.auth_cookie_name];
    if (!auth_token) {
      return next();
    }

    let auth = auth_token.split('$$$$');
    let userId = auth[0];
    if (userId) {
      UserProxy.getUserById(userId)
        .then((user) => {
          user = new UserModel(user)
          if (config.admins.hasOwnProperty(user.loginname)) {
            user.is_admin = true
          }

          res.locals.current_user = req.session.user = user
          next()
        })
        .catch(err => next(err))
    } else {
      next()
    }
  }
};
