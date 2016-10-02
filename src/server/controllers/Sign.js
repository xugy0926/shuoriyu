import Base from './Base'
var validator      = require('validator');
var eventproxy     = require('eventproxy');
var config         = require('../config');
var UserProxy           = require('../proxy').User;
var mail           = require('../common/mail');
var tools          = require('../common/tools');
var utility        = require('utility');
var authMiddleWare = require('../middlewares/auth');
var uuid           = require('node-uuid');
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';

class Sign extends Base {

  constructor() {
    super()
    this.notJump = [
      '/active_account', //active page
      '/reset_pass',     //reset password page, avoid to reset twice
      '/signup',         //regist page
      '/search_pass'    //serch pass page
    ];
  }

  accesstoken(req, res, next) {
    res.json({
      success: true,
      data: req.user,
      active: (req.user && req.user.active) || false
    });
  }

  signup(req, res, next) {
    let loginname = validator.trim(req.body.loginname).toLowerCase();
    let email     = validator.trim(req.body.email).toLowerCase();
    let password      = validator.trim(req.body.password);
    let rePassword    = validator.trim(req.body.rePassword);

    // 验证信息的正确性
    if ([loginname, password, rePassword, email].some(function (item) { return item === ''; })) {
      return res.json({success: false, message: '信息不完整。'})
    }
    if (loginname.length < 5) {
      return res.json({success: false, message: '用户名至少需要5个字符。'})
    }
    if (!tools.validateId(loginname)) {
      return res.json({success: false, message: '用户名不合法。'})
    }
    if (!validator.isEmail(email)) {
      return res.json({success: false, message: '邮箱不合法。'})
    }
    if (password !== rePassword) {
      return res.json({success: false, message: '两次密码输入不一致。'})
    }
    // END 验证信息的正确性

    UserProxy.getUserByQuery({'$or': [{'loginname': loginname},{'email': email}]}, {})
      .then(users => {
        if (users.length > 0) { throw new Error(ResultMsg.ACCOUNT_EXIST)}
        let passwordHash = tools.bhash(password)
        let active = false
        let avatarUrl = UserProxy.makeGravatar(email)

        let thenable = {
          then: function(resolve, reject) {
            UserProxy.newAndSave({loginname, passwordHash, email, avatarUrl, active})
              .then(user => resolve(user))
              .catch(err => reject(err))
          }
        }
        
        return Promise.resolve(thenable)
      })
      .then(user => {
        mail.sendActiveMail(user.email, utility.md5(email + user.pass + config.session_secret), loginname)
        res.json({success: true, data: user, active: false, message: '欢迎加入 ' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'})
      })
      .catch(err => console.log(err))
  }

  /**
   * Handle user login.
   *
   * @param {HttpRequest} req
   * @param {HttpResponse} res
   * @param {Function} next
   */
  login(req, res, next) {
    let loginname = validator.trim(req.body.loginname).toLowerCase();
    let password  = validator.trim(req.body.password);

    if (!loginname || !password) {
      return res.json({ success: false, message: '信息不完整。' });
    }

    let getUser;
    if (loginname.indexOf('@') !== -1) {
      getUser = UserProxy.getUserByMail;
    } else {
      getUser = UserProxy.getUserByLoginName;
    }

    getUser(loginname)
      .then(user => {
        let isOK = tools.bcompare(password, user.pass)
        if (isOK) {
          return reject('用户密码错误')
        }

        if (!user.active) {
          mail.sendActiveMail(user.email, utility.md5(user.email + user.pass + config.session_secret), user.loginname)
          res.json({success: true, data: user, active: false, message: '此帐号还没有被激活，激活链接已发送到 ' + user.email + ' 邮箱，请查收。' })
          return
        }

        authMiddleWare.gen_session(user, res);
        //check at some page just jump to home page
        var refer = req.session._loginReferer || '/';
        for (var i = 0, len = this.notJump.length; i !== len; ++i) {
          if (refer.indexOf(this.notJump[i]) >= 0) {
            refer = '/';
            break;
          }
        }
        res.json({success: true, data: user, active: true});
      })
      .catch(err => console.log(err))
  }

  activeAccount(req, res, next) {
    let key  = validator.trim(req.query.key || '');
    let loginname = validator.trim(req.query.name || '');

    UserProxy.getUserByLoginName(loginname)
      .then(user => {
        if (!user) {
          return res.render('notify', {message: '找不到用户。'})
        }

        if (!user || utility.md5(user.email + user.pass + config.session_secret) !== key) {
          return res.render('notify', {message: '信息有误，帐号无法被激活。'});
        }

        if (user.active) {
          return res.render('notify', {message: '帐号已经是激活状态。'});
        }

        user.active = true

        let thenable = {
          then: function(resolve, reject) {
            UserProxy.update(user)
              .then(user => resolve(user))
              .catch(err => reject(err))
          }
        }

        return Promise.resolve(thenable)
      })
      .then(user => res.render('notify', {message: '帐号已被激活，请登录'}))
      .catch(err => console.log(err))
  }

  createSearchPassword(req, res, next) {
    let email = validator.trim(req.body.email).toLowerCase();
    if (!validator.isEmail(email)) {
      return res.json({success: false, message: '邮箱不合法'});
    }

    UserProxy.getUserByMail(email)
      .then(user => {
        if (!user) {
          return res.json({success: false, message: '没有这个电子邮箱。'})
        }

        // 动态生成retrive_key和timestamp到users collection,之后重置密码进行验证
        user.retrieve_key = uuid.v4();
        user.retrieve_time = new Date().getTime();

        let thenable = {
          then: function(resolve, reject) {
            UserProxy.update(user)
              .then(user => resolve(user))
              .catch(err => reject(err))
          }
        }

        return Promise.resolve(thenable)
      })
      .then(user => {
        mail.sendResetPassMail(email, retrieveKey, user.loginname);
        res.json({success: true, message: '我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。'});      
      })
      .catch(err => console.log(err))
  }

  authSearchPassword(req, res, next) {
    let key = validator.trim(req.body.key || '');
    let loginname = validator.trim(req.body.loginname || '');
    let newPassword = validator.trim(req.body.newPassword || '');
    let reNewPassword = validator.trim(req.body.reNewPassword || '');

    UserProxy.getUserByNameAndKey(loginname, key)
      .then(user => {
        if (!user) {
          return res.json({success: false, message: '找不到用户' + loginname})
        }

        let now = new Date().getTime();
        let oneDay = 1000 * 60 * 60 * 24;

        if (!user.retrieve_time || now - user.retrieve_time > oneDay) {
          res.json({success: false, message: '该链接已过期，请重新申请。'})
          return;
        }

        user.retrieve_time = null;
        user.retrieve_key = null;

        let thenable = {
          then: function(resolve, reject) {
            UserProxy.update(user)
              .then(user => resolve(user))
              .catch(err => reject(err))
          }
        }
        
        return Promise.resolve(thenable)
      })
      .then(user => res.json({success: true, message: '重置密码成功'}))
      .catch(err => console.log(err))
  }

  updateResetPassword(req, res, next) {
    let userId = req.session.user._id;
    let oldPassword = validator.trim(req.body.oldPassword) || '';
    let newPassword = validator.trim(req.body.newPassword) || '';

    if (oldPassword === newPassword) {
      res.json({success: false, message: '新密码和老密码一致。'});
      return;
    }

    UserProxy.getUserById(userId)
      .then(user => {
        if (!user) throw '用户不存在'

        let isOK = tools.bcompare(oldPassword, user.pass)
        if (isOK) {
          return res.json({success: false, message: '老密码错误'})
        }

        user.pass = tools.bhash(newPassword)

        let thenable = {
          then: function(resolve, reject) {
            UserProxy.update(user)
              .then(user => resolve(user))
              .catch(err => reject(err))
          }
        }

        return Promise.resolve(thenable)
      })
      .then(user => res.json({success: true, message: '密码更新成功'}))
      .catch(err => console.log(err))
  }
}

module.exports = Sign

