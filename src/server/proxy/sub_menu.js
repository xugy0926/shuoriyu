
var Submenu = require('../models').Submenu;

exports.getSubmenuById = function (id, callback) {
  Submenu.findOne({_id: id}, callback);
}

exports.getSubmenu = function (opt, callback) {
  Submenu.findOne(opt, callback);
}

exports.getSubmenus = function (opt, callback) {
  Submenu.find(opt, callback);
};

exports.newAndSave = function (parentId, key, value, callback) {
  var submenu  = new Submenu();
  submenu.parent_id = parentId;
  submenu.key  = key;
  submenu.value = value;

  submenu.save(callback);
};
