var models  = require('../models');
var User    = models.User;
var utility = require('utility');
var uuid    = require('node-uuid');
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';

/**
 * 根据用户名列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 */
exports.getUsersByNames = function (names) {
  return new Promise(function(resolve, reject) {
    if (names.length === 0) {
      return resolve([])
    }

    User.find({ loginname: { $in: names } }, function(err, docs) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve(docs)
    })
  })
};

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 登录名
 */
exports.getUserByLoginName = function (loginName) {
  return new Promise(function(resolve, reject) {
    User.findOne({'loginname': new RegExp('^'+loginName+'$', "i")}, function(err, doc) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve(doc)
    })
  })
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 */
exports.getUserById = function (id) {
  return new Promise(function(resolve, reject) {
    if (!id) return reject(ResultMsg.PARAMS_ERROR)
    User.findOne({_id: id}, function(err, doc) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve(doc)     
    });
  })
};

/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 */
exports.getUserByMail = function (email) {
  return new Promise(function(resolve, reject) {
    User.findOne({email: email}, function(err, doc) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve(doc)
    });
  })
};

/**
 * 根据用户ID列表，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} ids 用户ID列表
 */
exports.getUsersByIds = function (ids) {
  return new Promise(function(resolve, reject) {
    User.find({'_id': {'$in': ids}}, function(err, docs) {
      if (err) reject(ResultMsg.DB_ERROR)
      else {
        console.log(docs)
        resolve(docs)
      }   
    })
  })
};

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 */
exports.getUsersByQuery = function (query, opt) {
  return new Promise(function(resolve, reject) {
    User.find(query, '', opt, function(err, docs) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve(docs)       
    })    
  })
};

/**
 * 根据查询条件，获取一个用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} name 用户名
 * @param {String} key 激活码
 */
exports.getUserByNameAndKey = function (loginname, key) {
  return new Promise(function(resolve, reject) {
    User.findOne({loginname: loginname, retrieve_key: key}, function(err, doc) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve(doc)       
    })
  })
};

exports.increaseScore = function (authorId, {topicCount, replyCount}) {
  topicCount = !topicCount ? 0 : topicCount
  replyCount = !replyCount ? 0 : replyCount

  return new Promise(function(resolve, reject) {
    User.findOne({_id: authorId}, function(err, doc) {
      if (err) reject(ResultMsg.DB_ERROR)
      else {
        if (topicCount != 0) {
          doc.score +=5
          doc.topic_count += 1
        }

        if (replyCount != 0) {
          doc.score +=5
          doc.reply_count += 1          
        }
        
        doc.save(function(err, d) {
          if (err) reject(ResultMsg.DB_ERROR)
          else resolve(d)
        })
      }
    })
  })
}

exports.newAndSave = function ({loginname, passwordHash, email, avatarUrl, active}) {
  return new Promise(function(resolve, reject) {
    if (!loginname || !passwordHash || !email) {
      return reject(ResultMsg.PARAMS_ERROR)
    }

    let user         = new User();
    user.name        = loginname;
    user.loginname   = loginname;
    user.pass        = passwordHash;
    user.email       = email;
    user.avatar      = avatarUrl || '';
    user.active      = active || false;
    user.accessToken = uuid.v4();

    user.save(function(err, doc) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve(doc)
    });
  })
};

exports.update = function (user) {
  return new Promise(function(resolve, reject) {
    if (!user) return reject(ResultMsg.PARAMS_ERROR)
    user.save(function(err, doc) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolve(resolve(doc))
    })
  })
}

var makeGravatar = function (email) {
  return 'http://www.gravatar.com/avatar/' + utility.md5(email.toLowerCase()) + '?size=48';
};
exports.makeGravatar = makeGravatar;

exports.getGravatar = function (user) {
  return user.avatar || makeGravatar(user);
};
