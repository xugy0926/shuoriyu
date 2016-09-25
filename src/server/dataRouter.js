/*!
 * nodeclub - route.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express');
var sign = require('./controllers/sign');
var site = require('./controllers/site');
var user = require('./controllers/user');
var message = require('./controllers/message');
var topic = require('./controllers/topic');
var reply = require('./controllers/reply');
var menu = require('./controllers/menu');
var rss = require('./controllers/rss');
var auth = require('./middlewares/auth');
var limit = require('./middlewares/limit');
var github = require('./controllers/github');
var search = require('./controllers/search');
var passport = require('passport');
var configMiddleware = require('./middlewares/conf');
var config = require('./config');

var router = express.Router();

// 获取 topics数据
router.post('/topics', site.topics);

// sign controller
router.post('/user/accesstoken', auth.tryAuth, sign.accesstoken);
router.post('/user/signup', sign.signup);  // 提交注册信息
router.post('/user/signin', sign.login);  // 登录校验

router.post('/user/createSearchPassword', sign.createSearchPassword);  // 触发找回密码命令
router.post('/user/authSearchPassword', sign.authSearchPassword);
router.post('/user/:uid/resetPassword', auth.userRequired, sign.updateResetPassword);    // 重置密码

// user controller
router.post('/user/:uid/update', auth.userRequired, user.updateUserInfo); // 提交个人信息设置
router.post('/user/:uid/data', auth.userRequired, user.userInfo);      // 获取用户信息
router.post('/user/:name/topics', user.listTopics);
router.post('/user/set_star', auth.adminRequired, user.toggleStar); // 把某用户设为达人
router.post('/user/cancel_star', auth.adminRequired, user.toggleStar);  // 取消某用户的达人身份
router.post('/user/:name/block', auth.adminRequired, user.block);  // 禁言某用户
router.post('/user/:name/delete_all', auth.adminRequired, user.deleteAll);  // 删除某用户所有发言

// topic
router.post('/topic/config', topic.config);
router.post('/topic/:tid/data', topic.topic);  // 获取单个topic
router.post('/topic/:tid/top', auth.adminRequired, topic.top);       // 将某话题置顶
router.post('/topic/:tid/good', auth.adminRequired, topic.good);     // 将某话题加精
router.post('/topic/:tid/status', auth.userRequired, topic.status);  // 更新话题状态
router.post('/topic/:tid/lock', auth.adminRequired, topic.lock);     // 锁定主题，不能再回复

router.post('/topic/:tid/delete', auth.userRequired, topic.delete);

// 保存新建的文章
router.post('/topic/create', auth.userRequired, limit.peruserperday('create_topic', config.create_post_per_day, false), topic.put);

router.post('/topic/:tid/edit', auth.userRequired, topic.update);
router.post('/topic/collect', auth.userRequired, topic.collect); // 关注某话题
router.post('/topic/de_collect', auth.userRequired, topic.de_collect); // 取消关注某话题

// reply controller
router.get('/:topic_id/replies/data', reply.Replies);
router.post('/:topic_id/reply', auth.userRequired, limit.peruserperday('create_reply', config.create_reply_per_day, false), reply.add); // 提交一级回复
router.post('/reply/:reply_id/edit', auth.userRequired, reply.update); // 修改某评论
router.post('/reply/:reply_id/delete', auth.userRequired, reply.delete); // 删除某评论
router.post('/reply/:reply_id/up', auth.userRequired, reply.up); // 为评论点赞
router.post('/upload', auth.userRequired, topic.upload); //上传图片

// menu
router.post('/menu/data', menu.getMenus);
router.post('/menu/add', auth.adminRequired, menu.addMenu);
router.post('/menu/:mid/delete', auth.adminRequired, menu.deleteMenu);
router.post('/menu/:mid/update',  menu.updateMenu);

// submenu
router.post('/submenu/add', auth.adminRequired, menu.addSubmenu);
router.post('/submenu/:sid/delete', auth.adminRequired, menu.deleteSubmenu);
router.post('/submenu/:sid/update',  menu.updateSubmenu);

module.exports = router;

