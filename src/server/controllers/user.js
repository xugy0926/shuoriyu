import Base from './Base'
var UserProxy         = require('../proxy').User;
var TopicProxy        = require('../proxy').Topic;
var ReplyProxy        = require('../proxy').Reply;
var TopicCollect = require('../proxy').TopicCollect;
var utility      = require('utility');
var util         = require('util');
var TopicModel   = require('../models').Topic;
var ReplyModel   = require('../models').Reply;
var tools        = require('../common/tools');
var config       = require('../config');
var EventProxy   = require('eventproxy');
var validator    = require('validator');
var utility      = require('utility');
var _            = require('lodash');
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';

class User extends Base {
  handleError(res, message) {
    return res.json({success: false, message: message})
  }

  handleSuccess(res, message) {
    return res.json({success: true, message: message})
  }

  userInfo(req, res, next) {
    var userId = validator.trim(req.params.uid) || '';

    if (req.session.user._id && !req.session.user._id.equals(userId)) {
      res.json({success: false, message: '没权限查看'});
      return;
    }

    UserProxy.getUserById(userId)
      .then(user => res.json({success: true, data: user}))
      .catch(err => handleError(res, err))
  }

  updateUserInfo(req, res, next) {
    let location = validator.trim(req.body.location) || '';
    let signature = validator.trim(req.body.signature) || '';

    UserProxy.getUserById(req.session.user._id)
      .then(user => {
        user.location = location
        user.signature = signature

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
        req.session.user = user.toObject({virtual: true})
        return ResultMsg.UPDATE_SUCCESS
      })
      .then(msg => handleSuccess(res, msg))
      .catch(err => handleError(res, err))
  }

  toggleStar(req, res, next) {
    let user_id = req.body.user_id;

    UserProxy.getUserById(req.session.user._id)
      .then(doc => {
        doc.is_star = !doc.is_star;
        doc.save()
        req.session.user = user.toObject({virtual: true})
        return ResultMsg.UPDATE_SUCCESS
      })
      .then(msg => handleSuccess(res, msg))
      .catch(err => handleError(res, message))
  }

  block(req, res, next) {
    let loginname = req.params.name;
    let action = req.body.action;

    User.getUserByLoginName(loginname)
      .then(doc => {
        if (action === 'set_block') {
          user.is_block = true
          user.save()
        } else if (action === 'cancel_block') {
          user.is_block = false
          user.save()
        }

        return ResultMsg.UPDATE_SUCCESS
      })
      .then(msg => handleSuccess(err, msg))
      .catch(err => handleError(err, err))
  }
}

module.exports = User
