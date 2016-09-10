/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */

export const port = process.env.PORT || 3000;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;
export const node_env = process.env.NODE_ENV || 'development';

export const mini_assets = node_env === 'production';

export const mongodbUrl = (node_env === 'production') ? 'mongodb://192.168.0.2/shuoriyu_club_product' : 'mongodb://127.0.0.1/shuoriyu_club_test_db';
export const databaseUrl = process.env.DATABASE_URL || 'sqlite:database.sqlite';

export const redisInfo = {
  host: (node_env === 'production') ? '192.168.0.3' : '127.0.0.1',
  port: 6379,
  db: 0,
  password: '',
};

console.log('############## env ####################');

console.log('## node_env = ' + node_env);
console.log('## host = ' + host);
console.log('## port = ' + port);
console.log('## mongodbUrl = ' + mongodbUrl);
console.log('## redisInfo host = ' + redisInfo.host);
console.log('## redisInfo port = ' + redisInfo.port);

console.log('#######################################');

export const analytics = {

  // https://analytics.google.com/
  google: {
    trackingId: process.env.GOOGLE_TRACKING_ID, // UA-XXXXX-X
  },

};

export const auth = {

  jwt: { secret: process.env.JWT_SECRET || 'React Starter Kit' },

  // https://developers.facebook.com/
  facebook: {
    id: process.env.FACEBOOK_APP_ID || '186244551745631',
    secret: process.env.FACEBOOK_APP_SECRET || 'a970ae3240ab4b9b8aae0f9f0661c6fc',
  },

  // https://cloud.google.com/console/project
  google: {
    id: process.env.GOOGLE_CLIENT_ID || '251410730550-ahcg0ou5mgfhl8hlui1urru7jn5s12km.apps.googleusercontent.com',
    secret: process.env.GOOGLE_CLIENT_SECRET || 'Y8yR9yZAhm9jQ8FKAL8QIEcd',
  },

  // https://apps.twitter.com/
  twitter: {
    key: process.env.TWITTER_CONSUMER_KEY || 'Ie20AZvLJI2lQD5Dsgxgjauns',
    secret: process.env.TWITTER_CONSUMER_SECRET || 'KTZ6cxoKnEakQCeSpZlaUCJWGAlTEBJj0y2EMkUBujA7zWSvaQ',
  },

};
