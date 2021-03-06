import fs from 'fs';
var log4js = require('log4js');

log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file', filename: 'build/logs/cheese.log', category: 'cheese' }
  ]
});

var logger = log4js.getLogger('cheese');
logger.setLevel( process.env.NODE_ENV !== 'production' ? 'DEBUG' : 'ERROR')

module.exports = logger;
