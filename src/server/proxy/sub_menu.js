
var assert = require('power-assert');
var Submenu = require('../models').Submenu;

exports.getSubmenuById = function (id) {
  return new Promise(function(resolove, reject) {
  	Submenu.findOne({_id: id}, function(err, doc) {
  	  if (err) reject(err)
  	  else resolove(doc)
  	})
  })
}

exports.getOneSubmenu = function (opt) {
  return new Promise(function(resolove, reject) {
  	Submenu.findOne(opt, function(err, doc) {
  	  if (err) reject(err)
  	  else resolove(doc)
  	})
  })
}

exports.getSubmenus = function (opt) {
  return new Promise(function(resolove, reject) {
  	Submenu.find(opt, function(err, docs) {
      if (err) reject(err)
      else resolove(docs)
  	})
  })
};

exports.newAndSave = function (parentId, key, value) {
  return new Promise(function(resolove, reject) {
	  var submenu  = new Submenu();
	  submenu.parent_id = parentId;
	  submenu.key  = key;
	  submenu.value = value;

	  submenu.save(function(err, doc) {
      if (err) reject(err)
      else resolove(doc)
	  })
  })
};
