
var Category = require('../models').Category;

exports.getCategoryById = function (id, callback) {
  Category.findOne({_id: id}, callback);
}

exports.getCategory = function (opt, callback) {
  Category.findOne(opt, callback);
}

exports.getCategories = function (opt, callback) {
  Category.find(opt, callback);
};

exports.newAndSave = function (key, value, callback) {
  var category  = new Category();
  category.key  = key;
  category.value = value;

  category.save(callback);
};
