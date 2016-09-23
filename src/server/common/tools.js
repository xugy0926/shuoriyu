var bcrypt = require('bcryptjs');
var moment = require('moment');

moment.locale('zh-cn'); // 使用中文


const topicStatus = [
	{key: 'saved', value: '已保存'}, 
	{key: 'reviewing', value: '审核中'},
	{key: 'reviewed', value: '审核成功'},
	{key: 'reject', value: '拒绝'}];


// 格式化时间
exports.formatDate = function (date, friendly) {
  date = moment(date);

  if (friendly) {
    return date.fromNow();
  } else {
    return date.format('YYYY-MM-DD HH:mm');
  }

};

exports.validateId = function (str) {
  return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.bhash = function (str, callback) {
  bcrypt.hash(str, 10, callback);
};

exports.bcompare = function (str, hash, callback) {
  bcrypt.compare(str, hash, callback);
};

exports.getTopicStatus = function() {
	return topicStatus;
}
