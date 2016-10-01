/*!
 * nodeclub - route.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */
import express from 'express';
import Sign from './controllers/Sign';
import Page from './controllers/Page';

class PageRouter {
  constructor() {
  	this.router = express.Router()
  	this.sign = new Sign()
  	this.page = new Page()
  	this.auth = require('./middlewares/auth');

	this.router.get('/cms', this.auth.adminRequired, (req, res, next) => this.page.cmsPage(req, res, next));      	// cms页面
	this.router.get('/signup', (req, res, next) => this.page.signupPage(req, res, next));                 	// 注册页面
	this.router.get('/signin', (req, res, next) => this.page.signinPage(req, res, next));                 	// 登录页面
	this.router.post('/signout', (req, res, next) => this.page.signout(req, res, next));                      // 登出

	this.router.get('/user/searchPasswordFromMail', (req, res, next) => this.page.searchPasswordFromMailPage(req, res, next)); 	// 从邮箱找回密码的链接
	this.router.get('/user/inputPasswordFromMail', (req, res, next) => this.page.inputSearchPasswordPage(req, res, next));        // 从邮箱找回密码的页面
	this.router.get('/user/resetPassword', this.auth.userRequired, (req, res, next) => this.page.resetPasswordPage(req, res, next));   // 进入重置密码页面

	// user controller
	this.router.get('/user/activeAccount', (req, res, next) => this.sign.activeAccount(req, res, next));  				        //帐号激活
	this.router.get('/user/setting/show', this.auth.userRequired, (req, res, next) => this.page.settingPage(req, res, next));		 	// 用户个人设置页
	this.router.get('/user/:name/show', (req, res, next) => this.page.userPage(req, res, next));              	    	 		// 用户个人主页
	this.router.get('/user/:name/topics', (req, res, next) => this.page.userTopicsPage(req, res, next));  			     		// 用户发布的所有话题页
	this.router.get('/user/:name/replies', (req, res, next) => this.page.userRepliesPage(req, res, next));  				 		// 用户参与的所有回复页
	this.router.get('/user/messages', this.auth.userRequired, (req, res, next) => this.page.myMessagesPage(req, res, next)); 	        // 用户个人的所有消息页
	this.router.get('/topic/:tid/show', (req, res, next) => this.page.topicPage(req, res, next)); 					     		// 显示某个话题
	this.router.get('/topic/create', this.auth.userRequired, (req, res, next) => this.page.createTopicPage(req, res, next));    		// 创建话题页面
	this.router.get('/topic/:tid/edit', this.auth.userRequired, (req, res, next) => this.page.editTopicPage(req, res, next));   		// 编辑话题页面
	this.router.get('/menu/show', (req, res, next) => this.page.menuPage(req, res, next));                                 		// 菜单页面
	this.router.get('/about', (req, res, next) => this.page.aboutPage);
	this.router.get('/faq', (req, res, next) => this.page.faqPage(req, res, next));
	this.router.get('/getstart', (req, res, next) => this.page.getstartPage(req, res, next));
	this.router.get('/api', (req, res, next) => this.page.apiPage(req, res, next));

	//rss
	// this.router.get('/sitemap.xml', page.sitemap);
	this.router.get('/app/download', (req, res, next) => this.page.appDownload(req, res, next));
  }

  getRouter() {
    return this.router
  }
}

module.exports = PageRouter
