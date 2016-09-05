
var Tab = require('../models').Tab;

exports.getTabById = function (id, callback) {
  Tab.findOne({_id: id}, callback);
}

exports.getTab = function (opt, callback) {
  Tab.findOne(opt, callback);
}

exports.getTabs = function (callback) {
  Tab.find({deleted: false}, callback);
};

exports.newAndSave = function (key, value, callback) {
  var tab  = new Tab();
  tab.key  = key;
  tab.value = value;

  tab.save(callback);
};
