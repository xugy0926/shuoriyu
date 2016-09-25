var validator      = require('validator');
var eventproxy     = require('eventproxy');
var config         = require('../config');
var User           = require('../proxy').User;
var mail           = require('../common/mail');
var tools          = require('../common/tools');
var utility        = require('utility');
var authMiddleWare = require('../middlewares/auth');
var uuid           = require('node-uuid');

exports.accesstoken = function (req, res, next) {
  var ep = new eventproxy();
  ep.fail(next);

  res.send({
    success: true,
    data: req.user,
    active: req.user.active || false
  });
};

exports.signup = function (req, res, next) {
  var loginname = validator.trim(req.body.loginname).toLowerCase();
  var email     = validator.trim(req.body.email).toLowerCase();
  var password      = validator.trim(req.body.password);
  var rePassword    = validator.trim(req.body.rePassword);

  var ep = new eventproxy();
  ep.fail(next);
  ep.on('prop_err', function (msg) {
    res.json({success: false, message: msg});
  });

  // 验证信息的正确性
  if ([loginname, password, rePassword, email].some(function (item) { return item === ''; })) {
    ep.emit('prop_err', '信息不完整。');
    return;
  }
  if (loginname.length < 5) {
    ep.emit('prop_err', '用户名至少需要5个字符。');
    return;
  }
  if (!tools.validateId(loginname)) {
    return ep.emit('prop_err', '用户名不合法。');
  }
  if (!validator.isEmail(email)) {
    return ep.emit('prop_err', '邮箱不合法。');
  }
  if (password !== rePassword) {
    return ep.emit('prop_err', '两次密码输入不一致。');
  }
  // END 验证信息的正确性


  User.getUsersByQuery({'$or': [
    {'loginname': loginname},
    {'email': email}
  ]}, {}, function (err, users) {
    if (err) {
      return next(err);
    }
    if (users.length > 0) {
      ep.emit('prop_err', '用户名或邮箱已被使用。');
      return;
    }

    tools.bhash(password, ep.done(function (passhash) {
      // create gravatar
      var avatarUrl = User.makeGravatar(email);
      User.newAndSave(loginname, loginname, passhash, email, avatarUrl, false, function (err, user) {
        if (err) {
          return next(err);
        }
        // 发送激活邮件
        mail.sendActiveMail(email, utility.md5(email + passhash + config.session_secret), loginname);
        res.json({
          success: true, data: user, active: false, message: '欢迎加入 ' + config.name + '！我们已给您的注册邮箱发送了一封邮件，请点击里面的链接来激活您的帐号。'
        });
      });

    }));
  });
};

/**
 * define some page when login just jump to the home page
 * @type {Array}
 */
var notJump = [
  '/active_account', //active page
  '/reset_pass',     //reset password page, avoid to reset twice
  '/signup',         //regist page
  '/search_pass'    //serch pass page
];

/**
 * Handle user login.
 *
 * @param {HttpRequest} req
 * @param {HttpResponse} res
 * @param {Function} next
 */
exports.login = function (req, res, next) {
  var loginname = validator.trim(req.body.loginname).toLowerCase();
  var password  = validator.trim(req.body.password);
  var ep        = new eventproxy();

  ep.fail(next);

  if (!loginname || !password) {
    return res.json({ success: false, message: '信息不完整。' });
  }

  var getUser;
  if (loginname.indexOf('@') !== -1) {
    getUser = User.getUserByMail;
  } else {
    getUser = User.getUserByLoginName;
  }

  ep.on('login_error', function (login_error) {
//    res.status(403);
    res.json({ success: false, message: '用户名或密码错误' });
  });

  getUser(loginname, function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return ep.emit('login_error');
    }
    var passhash = user.pass;
    tools.bcompare(password, passhash, ep.done(function (bool) {
      if (!bool) {
        return ep.emit('login_error');
      }
      if (!user.active) {
        // 重新发送激活邮件
        mail.sendActiveMail(user.email, utility.md5(user.email + passhash + config.session_secret), user.loginname);
//        res.status(403);
        return res.json({ success: true, data: user, active: false, message: '此帐号还没有被激活，激活链接已发送到 ' + user.email + ' 邮箱，请查收。' });
      }
      // store session cookie
      authMiddleWare.gen_session(user, res);
      //check at some page just jump to home page
      var refer = req.session._loginReferer || '/';
      for (var i = 0, len = notJump.length; i !== len; ++i) {
        if (refer.indexOf(notJump[i]) >= 0) {
          refer = '/';
          break;
        }
      }
      res.json({success: true, data: user, active: true});
    }));
  });
};

exports.activeAccount = function (req, res, next) {
  var key  = validator.trim(req.query.key || '');
  var loginname = validator.trim(req.query.name || '');

  User.getUserByLoginName(loginname, function (err, user) {
    if (err) {
      return res.render('notify', {message: '激活失败'});
    }
    if (!user) {
      return res.render('notify', {message: '激活失败'});
    }

    var passhash = user.pass;
    if (!user || utility.md5(user.email + passhash + config.session_secret) !== key) {
      return res.render('notify', {message: '信息有误，帐号无法被激活。'});
    }
    if (user.active) {
      return res.render('notify', {message: '帐号已经是激活状态。'});
    }
    user.active = true;
    user.save(function (err) {
      if (err) {
        return next(err);
      }
      res.render('notify', {message: '帐号已被激活，请登录'});
    });
  });
};

exports.createSearchPassword = function (req, res, next) {
  var email = validator.trim(req.body.email).toLowerCase();
  if (!validator.isEmail(email)) {
    return res.json({success: false, message: '邮箱不合法'});
  }

  // 动态生成retrive_key和timestamp到users collection,之后重置密码进行验证
  var retrieveKey  = uuid.v4();
  var retrieveTime = new Date().getTime();

  User.getUserByMail(email, function (err, user) {
    if (!user) {
      res.json({success: false, message: '没有这个电子邮箱。'});
      return;
    }
    user.retrieve_key = retrieveKey;
    user.retrieve_time = retrieveTime;
    user.save(function (err) {
      if (err) {
        return next(err);
      }
      // 发送重置密码邮件
      mail.sendResetPassMail(email, retrieveKey, user.loginname);
      res.json({success: true, message: '我们已给您填写的电子邮箱发送了一封邮件，请在24小时内点击里面的链接来重置密码。'});
    });
  });
};

exports.authSearchPassword = function (req, res, next) {
  var key = validator.trim(req.body.key || '');
  var loginname = validator.trim(req.body.loginname || '');
  var newPassword = validator.trim(req.body.newPassword || '');
  var reNewPassword = validator.trim(req.body.reNewPassword || '');

  User.getUserByNameAndKey(loginname, key, function(err, user) {
    if (err || !user) {
      console.log('11');
      res.json({success: false, message: '找不到用户' + loginname});
      return;
    }

    console.log('111');

    var now = new Date().getTime();
    var oneDay = 1000 * 60 * 60 * 24;

    if (!user.retrieve_time || now - user.retrieve_time > oneDay) {
      console.log('2');
      res.json({success: false, message: '该链接已过期，请重新申请。'});
      return;
    }

    user.retrieve_time = null;
    user.retrieve_key = null;
    user.save(function(err) {
      if (err) {
        res.json({success: false, message: '重置密码失败。'});
        return;
      }

      res.json({success: true, message: '重置密码成功。'});
    });
  });
}

exports.updateResetPassword = function (req, res, next) {
  var userId = req.session.user._id;
  var oldPassword = validator.trim(req.body.oldPassword) || '';
  var newPassword = validator.trim(req.body.newPassword) || '';

  var ep = new eventproxy();
  ep.fail(function(err) {
    res.json({success: false, message: '出错'});
    return;   
  });

  if (oldPassword === newPassword) {
    res.json({success: false, message: '新密码和老密码一致。'});
    return;
  }

  User.getUserById(userId, function (err, user) {
    if (err || !user) {
      res.json({success: false, message: '用户不存在'});
      return;
    }

    tools.bcompare(oldPassword, user.pass, ep.done(function(bool) {
      if (!bool) {
        res.json({success: false, message: '老密码错误'});
        return;
      }

      tools.bhash(newPassword, ep.done(function (passhash) {
        user.pass = passhash;

        user.save(function (err) {
          if (err) {
            return next(err);
          }
          return res.json({success: true, message: '你的密码已重置。'});
        });
      }));
    }));
  });
};

