var TopicCollect = require('../models').TopicCollect;
var _ = require('lodash')
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';

exports.getTopicCollect = function (userId, topicId) {
  return new Promise(function(resolve, reject) {
    TopicCollect.findOne({user_id: userId, topic_id: topicId}, function(err, doc) {
      if (err) reject(err)
      else resolve(doc)   
    });  	
  })
};

exports.getTopicCollectsByUserId = function (userId, opt) {
  return new Promise(function(resolve, reject) {
    var defaultOpt = {sort: '-create_at'};
    opt = _.assign(defaultOpt, opt)
    TopicCollect.find({user_id: userId}, '', opt, function(err, docs) {
      if (err) reject(err)
      else resolve(docs) 
    })
  })
};

exports.newAndSave = function (userId, topicId) {
  return new Promise(function(resolve, reject) {
	var topic_collect      = new TopicCollect();
	topic_collect.user_id  = userId;
	topic_collect.topic_id = topicId;
	topic_collect.save(function(err, doc) {
      if (err) reject(err)
      else resolve(doc)     
	})
  })
};

exports.remove = function (userId, topicId) {
  return new Promise(function(resolve, reject) {
    TopicCollect.remove({user_id: userId, topic_id: topicId}, function(err) {
      if (err) reject(err)
      else resolve
    });
  })
};

