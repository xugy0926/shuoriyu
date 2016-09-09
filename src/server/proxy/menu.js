
var EventProxy = require('eventproxy');
var Menu = require('../models').Menu;
var SubmenuProxy = require('./sub_menu');

exports.getMenuById = function (id, callback) {
  Menu.findOne({_id: id}, callback);
}

exports.getMenu = function (opt, callback) {
  Menu.findOne(opt, callback);
}

exports.getMenus = function (opt, callback) {
  Menu.find(opt, function(err, menus) {
  	if (err) {
      return callback(err);
    }
    if (menus.length === 0) {
      return callback(null, []);
    }
    
    var newMenus = [];
    for (var i = 0, len = menus.length; i < len; i++) {
      newMenus[i] = menus[i].toObject();
    }

    SubmenuProxy.getSubmenus({deleted: false}, function(err, submenus) {
      if (err) {
      	return callback(null, newMenus);
      }

      if (submenus === 0) {
      	return callback(null, newMenus);
      }

      for(var i = 0; i < newMenus.length; i++) {
      	let sub = [];
      	submenus.forEach((item2)=> {
      	  if (newMenus[i]._id.toString() === item2.parent_id.toString()) {
      	  	sub.push(item2);
      	  }
      	});

      	newMenus[i].submenus = sub;
      }

      return callback(null, newMenus);
    });
  });
};

exports.newAndSave = function (key, value, callback) {
  var menu  = new Menu();
  menu.key  = key;
  menu.value = value;

  menu.save(callback);
};
