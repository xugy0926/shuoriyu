import models  from '../models'
import _       from 'lodash'
import Promise from 'promise'
import * as ResultMsg from '../constrants/ResultMsg';

let TopicCollectModel = models.TopicCollect

exports.getTopicCollect = function (userId, topicId) {
  return new Promise(function(resolve, reject) {
    TopicCollectModel.findOne({user_id: userId, topic_id: topicId}, function(err, doc) {
      if (err) reject(err)
      else resolve(doc)   
    });  	
  })
};

exports.getTopicCollectsByUserId = function (userId, opt) {
  return new Promise(function(resolve, reject) {
    var defaultOpt = {sort: '-create_at'};
    opt = _.assign(defaultOpt, opt)
    TopicCollectModel.find({user_id: userId}, '', opt, function(err, docs) {
      if (err) reject(err)
      else resolve(docs) 
    })
  })
};

exports.newAndSave = function (userId, topicId) {
  return new Promise(function(resolve, reject) {
	var topic_collect      = new TopicCollectModel();
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
    TopicCollectModel.remove({user_id: userId, topic_id: topicId}, function(err) {
      if (err) reject(err)
      else resolve
    });
  })
};

