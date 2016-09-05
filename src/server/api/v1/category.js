var validator = require('validator');

var Category = require('../../proxy').Category;
var Tab = require('../../proxy').Tab;

exports.getCategories = function (req, res, next) {
  Category.getCategories({deleted: false, enable: true}, function (err, categories) {
    if (err) {
      res.json({success: false, message: '获取category错误'});
      return;
    }

    res.json({success: true, categories: categories});
  });
}

exports.getTabs = function (req, res, next) {
  Tab.getTabs({deleted: false, enable: true}, function (err, tabs) {
    if (err) {
      res.json({success: false, message: '获取tabs错误'});
      return;
    }

    res.json({success: true, tabs: tabs});
  });
}

exports.add = function (req, res, next) {
  var key = validator.trim(req.body.key);
  var value = validator.trim(req.body.value);

  if (key === '' || value === '') {
    return res.json({success: false, message: '参数错误'});
  }

  var query = {"$or": [{key: key}, {value: value}]};
  Category.getCategory(query, function (err, category) {
    if (err) {
      res.json({success: false, message: '添加错误'});
      return;
    }

    if(category) {
      res.json({success: false, message: '数据重复'});
      return;
    }

    Category.newAndSave(key, value, function(err, category) {
      if (err) {
        res.json({success: false, message: '添加错误'});
        return;
      }

      res.json({success: true, category: category});
    });
  });
}

exports.delete = function (req, res, next) {
  var category_id = req.params.cid;

  Category.getCategoryById(category_id, function(err, category) {
    if (err) {
      res.json({success: false, message: '获取category错误'});
      return;
    }

    if (!category) {
      res.json({success: false, message: '获取category错误'});
      return;
    }

    category.deleted = true;
    category.save();
    res.json({success: true, message: '删除成功'});
  });
}