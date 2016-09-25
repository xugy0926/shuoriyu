/*!
 * nodeclub - route.js
 * Copyright(c) 2012 fengmk2 <fengmk2@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var express = require('express');
var auth = require('./middlewares/auth');
var sign = require('./controllers/sign');
var page = require('./controllers/page');

var router = express.Router();

router.get('/cms', auth.adminRequired, page.cmsPage);      	// cms页面
router.get('/signup', page.signupPage);                 	// 注册页面
router.get('/signin', page.signinPage);                 	// 登录页面
router.post('/signout', page.signout);

router.get('/user/searchPasswordFromMail', page.searchPasswordFromMailPage); 	// 找回密码页面
router.get('/user/inputPasswordFromMail', page.inputSearchPasswordPage);
router.get('/user/resetPassword', auth.userRequired, page.resetPasswordPage);   // 进入重置密码页面

// user controller
router.get('/user/activeAccount', sign.activeAccount);  				 //帐号激活
router.get('/user/setting/show', auth.userRequired, page.settingPage);		 		// 用户个人设置页
router.get('/user/:name/show', page.userPage);              	    	 		// 用户个人主页
router.get('/user/:name/topics', page.userTopicsPage);  			     		// 用户发布的所有话题页
router.get('/user/:name/replies', page.userRepliesPage);  				 		// 用户参与的所有回复页
router.get('/user/:name/messages', auth.userRequired, page.myMessagesPage); 	// 用户个人的所有消息页
router.get('/topic/:tid/show', page.topicPage); 					     		// 显示某个话题
router.get('/topic/create', auth.userRequired, page.createTopicPage);    		// 创建话题页面
router.get('/topic/:tid/edit', auth.userRequired, page.editTopicPage);   		// 编辑话题页面
router.get('/menu/show', page.menuPage);                                 		// 菜单页面
router.get('/about', page.aboutPage);
router.get('/faq', page.faqPage);
router.get('/getstart', page.getstartPage);
router.get('/api', page.apiPage);

//rss
router.get('/sitemap.xml', page.sitemap);
router.get('/app/download', page.appDownload);

module.exports = router;
