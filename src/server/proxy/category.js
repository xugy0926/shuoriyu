
var Category = require('../models').Category;

exports.getCategoryById = function (id, callback) {
  Category.findOne({_id: id}, callback);
}

exports.getCategory = function (opt, callback) {
  Category.findOne(opt, callback);
}

exports.getCategories = function (callback) {
  Category.find({deleted: false}, callback);
};

exports.newAndSave = function (key, text, callback) {
  var category  = new Category();
  category.key  = key;
  category.text = text;

  category.save(callback);
};
