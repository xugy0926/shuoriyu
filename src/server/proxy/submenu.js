import models from '../models'
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg'

let SubmenuModel = models.Submenu

exports.getSubmenuById = function (id) {
  return new Promise(function(resolove, reject) {
  	SubmenuModel.findOne({_id: id}, function(err, doc) {
  	  if (err) reject(err)
  	  else resolove(doc)
  	})
  })
}

exports.getOneSubmenu = function (opt) {
  return new Promise(function(resolove, reject) {
  	SubmenuModel.findOne(opt, function(err, doc) {
  	  if (err) reject(err)
  	  else resolove(doc)
  	})
  })
}

exports.getSubmenus = function (opt) {
  return new Promise(function(resolove, reject) {
  	SubmenuModel.find(opt, function(err, docs) {
      if (err) reject(err)
      else resolove(docs)
  	})
  })
};

exports.newAndSave = function (parentId, key, value) {
  return new Promise(function(resolove, reject) {
	  var submenu  = new SubmenuModel();
	  submenu.parent_id = parentId;
	  submenu.key  = key;
	  submenu.value = value;

	  submenu.save(function(err, doc) {
      if (err) reject(err)
      else resolove(doc)
	  })
  })
};
