/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

require('colors');
import 'babel-polyfill';
import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import connectMongodb from 'connect-mongo'
import bodyParser from 'body-parser';
import expressJwt from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Html from './components/Html';
import { ErrorPage } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import UniversalRouter from 'universal-router';
import PrettyError from 'pretty-error';
import passport from './core/passport';
import models from './data/models';
import schema from './data/schema';
import routes from './routes';
import assets from './assets'; // eslint-disable-line import/no-unresolved
import { host, debug, port, auth, redisInfo, mongodbUrl, mini_assets, apiPrefix } from './config';

var serverConfig = require('./server/config');
if (!debug && serverConfig.oneapm_key) {
  require('oneapm');
}

var Loader = require('loader');
var LoaderConnect = require('loader-connect');
var session = require('express-session');

require('./server/middlewares/mongoose_log'); // 打印 mongodb 查询日志
require('./server/models');
var PageRouter = require('./server/PageRouter');
var DataRouter = require('./server/DataRouter');
var serverAuth = require('./server/middlewares/auth');
var errorPageMiddleware = require('./server/middlewares/error_page');
var proxyMiddleware = require('./server/middlewares/proxy');
var RedisStore = require('connect-redis')(session);
var _ = require('lodash');
var csurf = require('csurf');
var compress = require('compression');
var busboy = require('connect-busboy');
var errorhandler = require('errorhandler');
var cors = require('cors');
var requestLog = require('./server/middlewares/request_log');
var renderMiddleware = require('./server/middlewares/render');
var logger = require('./server/common/logger');
var helmet = require('helmet');
var bytes = require('bytes');

let MongoStore = new connectMongodb(session)
// assets
let serverAssets = {};

if (mini_assets) {
  try {
    serverAssets = require('./server/assets.json');
  } catch (e) {
    logger.error('You must execute `make build` before start app when mini_assets is true.');
    throw e;
  }
}

const app = express();

// configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';
app.enable('trust proxy');
// Request logger。请求时间
app.use(requestLog);
if (serverConfig.debug) {
  // 渲染时间
  app.use(renderMiddleware.render);
}

// 静态资源
if (serverConfig.debug) {
  app.use(LoaderConnect.less(__dirname)); // 测试环境用，编译 .less on the fly
}

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(serverConfig.session_secret));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// for server.
// -----------------------------------------------------------------------------
// 静态文件目录
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/agent', proxyMiddleware.proxy);
// 通用的中间件
app.use(require('response-time')());
app.use(helmet.frameguard('sameorigin'));
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(require('method-override')());
app.use(compress());
app.use(require('cookie-parser')(serverConfig.session_secret));
app.use(session({
  secret: serverConfig.session_secret,
  store: new MongoStore({
    url: mongodbUrl
  }),
  resave: true,
  saveUninitialized: true,
}));

// custom middleware
app.use(serverAuth.authUser);
app.use(serverAuth.blockUser());

serverConfig.mini_assets = mini_assets;

_.extend(app.locals, {
  config: serverConfig,
  Loader: Loader,
  assets: serverAssets,
  apiPrefix: apiPrefix
});

app.use(errorPageMiddleware.errorPage);
_.extend(app.locals, require('./server/common/render_helper'));
app.use(function (req, res, next) {
  res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
  next();
});

app.use(busboy({
  limits: {
    fileSize: bytes(serverConfig.file_limit)
  }
}));

//
// Authentication
// -----------------------------------------------------------------------------
// app.use(expressJwt({
//   secret: auth.jwt.secret,
//   credentialsRequired: false,
//   getToken: req => req.cookies.id_token,
// }));
// app.use(passport.initialize());

// app.get('/login/facebook',
//   passport.authenticate('facebook', { scope: ['email', 'user_location'], session: false })
// );
// app.get('/login/facebook/return',
//   passport.authenticate('facebook', { failureRedirect: '/login', session: false }),
//   (req, res) => {
//     const expiresIn = 60 * 60 * 24 * 180; // 180 days
//     const token = jwt.sign(req.user, auth.jwt.secret, { expiresIn });
//     res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
//     res.redirect('/');
//   }
// );

//
// Register API middleware
// -----------------------------------------------------------------------------
// app.use('/graphql', expressGraphQL(req => ({
//   schema,
//   graphiql: true,
//   rootValue: { request: req },
//   pretty: process.env.NODE_ENV !== 'production',
// })));

// routes

app.use(apiPrefix.page, cors(), (new PageRouter()).getRouter());
app.use(apiPrefix.data, cors(), (new DataRouter()).getRouter());

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    let css = new Set();
    let statusCode = 200;
    const data = { title: '', description: '', style: '', script: assets.main.js, children: '', csrf: res.locals.csrf };

    await UniversalRouter.resolve(routes, {
      path: req.path,
      query: req.query,
      context: {
        insertCss: (...styles) => {
          styles.forEach(style => css.add(style._getCss())); // eslint-disable-line no-underscore-dangle, max-len
        },
        setTitle: value => (data.title = value),
        setMeta: (key, value) => (data[key] = value),
      },
      render(component, status = 200) {
        css = new Set();
        statusCode = status;
        data.children = ReactDOM.renderToString(component);
        data.style = [...css].join('');
        return true;
      },
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);

    res.status(statusCode);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  console.log(pe.render(err)); // eslint-disable-line no-console
  const statusCode = err.status || 500;
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      style={errorPageStyle._getCss()} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPage error={err} />)}
    </Html>
  );
  res.status(statusCode);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
/* eslint-disable no-console */
models.sync().catch(err => console.error(err.stack)).then(() => {
  app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}/`);
  });
});
/* eslint-enable no-console */
