/*!
 * nodeclub - route.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

import express 	from 'express'
var Sign = require('./controllers/Sign')
var User = require('./controllers/User')
var Message = require('./controllers/Message')
var Topic = require('./controllers/Topic')
var Reply = require('./controllers/Reply')
var Menu = require('./controllers/Menu')
var Rss = require('./controllers/Rss')
var Search = require('./controllers/Search')
var passport = require('passport')

class DataRouter {
  constructor() {
  	this.router = express.Router()
    this.sign = new Sign()
	this.user = new User()
	this.message = new Message()
	this.topic = new Topic()
	this.reply = new Reply()
	this.menu = new Menu()
	this.rss = new Rss()
	this.search = new Search()
	this.auth = require('./middlewares/auth')
 
	 // 获取 topics数据
	this.router.post('/topics', (req, res, next) => this.topic.topics(req, res, next));

	// sign controller
	this.router.post('/user/accesstoken', this.auth.tryAuth, (req, res, next) => this.sign.accesstoken(req, res, next));
	this.router.post('/user/signup', (req, res, next) => this.sign.signup(req, res, next));  // 提交注册信息
	this.router.post('/user/signin', (req, res, next) => this.sign.login(req, res, next));  // 登录校验

	this.router.post('/user/createSearchPassword', (req, res, next) => this.sign.createSearchPassword(req, res, next));  // 触发找回密码命令
	this.router.post('/user/authSearchPassword', (req, res, next) => this.sign.authSearchPassword(req, res, next));
	this.router.post('/user/:uid/resetPassword', this.auth.userRequired, (req, res, next) => this.sign.updateResetPassword(req, res, next));    // 重置密码

	// user controller
	this.router.post('/user/:uid/topics', this.auth.userRequired, (req, res, next) => this.topic.userTopics(req, res, next));
	this.router.post('/user/:uid/update', this.auth.userRequired, (req, res, next) => this.user.updateUserInfo(req, res, next)); // 提交个人信息设置
	this.router.post('/user/:uid/data', this.auth.userRequired, (req, res, next) => this.user.userInfo(req, res, next));         // 获取用户信息
	this.router.post('/user/set_star', this.auth.adminRequired, (req, res, next) => this.user.toggleStar(req, res, next));       // 把某用户设为达人
	this.router.post('/user/cancel_star', this.auth.adminRequired, (req, res, next) => this.user.toggleStar(req, res, next));    // 取消某用户的达人身份
	this.router.post('/user/:name/block', this.auth.adminRequired, (req, res, next) => this.user.block(req, res, next));         // 禁言某用户

	// topic
	this.router.post('/topic/config', (req, res, next) => this.topic.config(req, res, next));
	this.router.post('/topic/:tid/data', (req, res, next) => this.topic.topic(req, res, next));  // 获取单个topic
	this.router.post('/topic/:tid/top', this.auth.adminRequired, (req, res, next) => this.topic.top(req, res, next));         // 将某话题置顶
	this.router.post('/topic/:tid/good', this.auth.adminRequired, (req, res, next) => this.topic.good(req, res, next));       // 将某话题加精
	this.router.post('/topic/:tid/status', this.auth.userRequired, (req, res, next) => this.topic.status(req, res, next));    // 更新话题状态
	this.router.post('/topic/:tid/lock', this.auth.adminRequired, (req, res, next) => this.topic.lock(req, res, next));       // 锁定主题，不能再回复
	this.router.post('/topic/:tid/delete', this.auth.userRequired, (req, res, next) => this.topic.delete(req, res, next));
	this.router.post('/topic/create', this.auth.userRequired, (req, res, next) => this.topic.put(req, res, next));            // 保存新建的文章
	this.router.post('/topic/:tid/edit', this.auth.userRequired, (req, res, next) => this.topic.update(req, res, next));
	this.router.post('/topic/collect', this.auth.userRequired, (req, res, next) => this.topic.collect(req, res, next));       // 关注某话题
	this.router.post('/topic/de_collect', this.auth.userRequired, (req, res, next) => this.topic.de_collect(req, res, next)); // 取消关注某话题

	// reply controller
	this.router.get('/:tid/replies/data', (req, res, next) => this.reply.Replies(req, res, next));                       // 获取回复列表
	this.router.post('/reply/:tid/reply', this.auth.userRequired, (req, res, next) => this.reply.add(req, res, next));        // 提交一级回复
	this.router.post('/reply/:rid/edit', this.auth.userRequired, (req, res, next) => this.reply.update(req, res, next));      // 修改某评论
	this.router.post('/reply/:rid/delete', this.auth.userRequired, (req, res, next) => this.reply.delete(req, res, next));    // 删除某评论
	this.router.post('/reply/:rid/up', this.auth.userRequired, (req, res, next) => this.reply.up(req, res, next));            // 为评论点赞
	this.router.post('/upload', this.auth.userRequired, (req, res, next) => this.topic.upload(req, res, next));               // 上传图片

	// message controller
	this.router.post('/message/:uid/data', this.auth.userRequired, (req, res, next) => this.message.userMessages(req, res, next));

	// menu
	this.router.post('/menu/data', (req, res, next) => this.menu.getMenus(req, res, next));
	this.router.post('/menu/add', this.auth.adminRequired, (req, res, next) => this.menu.addMenu(req, res, next));
	this.router.post('/menu/:mid/delete', this.auth.adminRequired, (req, res, next) => this.menu.deleteMenu(req, res, next));
	this.router.post('/menu/:mid/update',  (req, res, next) => this.menu.updateMenu(req, res, next));

	// submenu
	this.router.post('/submenu/add', this.auth.adminRequired, (req, res, next) => this.menu.addSubmenu(req, res, next));
	this.router.post('/submenu/:sid/delete', this.auth.adminRequired, (req, res, next) => this.menu.deleteSubmenu(req, res, next));
	this.router.post('/submenu/:sid/update',  (req, res, next) => this.menu.updateSubmenu(req, res, next));
  }

  getRouter() {
    return this.router
  }
}

module.exports = DataRouter

