/*!
 * nodeclub - site index controller.
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * Copyright(c) 2012 muyuan
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var User         = require('../proxy').User;
var Topic        = require('../proxy').Topic;
var config       = require('../config');
var eventproxy   = require('eventproxy');
var cache        = require('../common/cache');
var xmlbuilder   = require('xmlbuilder');
var renderHelper = require('../common/render_helper');
var _            = require('lodash');


exports.index = function (req, res, next) {
  return res.render('cms/index',{pageTitle: '全部', navTab: 'topic'});
}

exports.topics = function (req, res, next) {
  var currentPage = parseInt(req.body.currentPage, 10) || 1;
  var menuKey = req.body.menuKey || 'all';
  var submenuKey = req.body.submenuKey || '';
  var status = req.body.status || 'reviewed';

  if (menuKey === '') {
    return res.json({success: false, message: '没选菜单'});
  }

  // 获取菜单查询条件
  var query = {};
  if (menuKey !== 'all') {
    query.menu = menuKey;
  }
  
  if (submenuKey !== '') {
    query.submenu = submenuKey;
  }

  if (status !== 'all') {
    query.status = status;
  }

  var proxy = new eventproxy();
  proxy.fail(next);

  var limit = config.list_topic_count;
  var options = { skip: (currentPage - 1) * limit, limit: limit, sort: '-top -last_reply_at'};

  Topic.getTopicsByQuery(query, options, proxy.done('topics', function (topics) {
    return topics;
  }));

  // 取分页数据
  var pagesCacheKey = JSON.stringify(query) + 'pages';
  cache.get(pagesCacheKey, proxy.done(function (pages) {
    if (pages) {
      proxy.emit('pages', pages);
    } else {
      Topic.getCountByQuery(query, proxy.done(function (all_topics_count) {
        var pages = Math.ceil(all_topics_count / limit);
        cache.set(pagesCacheKey, pages, 60 * 1);
        proxy.emit('pages', pages);
      }));
    }
  }));
  // END 取分页数据

  proxy.all('topics', 'pages',
    function (topics, pages) {
      return res.json({
        success: true,
        data: topics,
        currentPage: currentPage,
        pages: pages
      });
    });
};
