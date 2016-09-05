var validator = require('validator');

var Category = require('../../proxy').Category;

exports.getCategories = function (req, res, next) {
  Category.getCategories(function (err, categories) {
    if (err) {
      res.json({success: false, message: '获取category错误'});
      return;
    }

    res.json({success: true, categories: categories});
  });
}

exports.add = function (req, res, next) {
  var key = validator.trim(req.body.key);
  var text = validator.trim(req.body.text);

  if (key === '' || text === '') {
    return res.json({success: false, message: '参数错误'});
  }

  var query = {"$or": [{key: key}, {text: text}]};
  Category.getCategory(query, function (err, category) {
    if (err) {
      res.json({success: false, message: '添加错误'});
      return;
    }

    if(category) {
      res.json({success: false, message: '数据重复'});
      return;
    }

    Category.newAndSave(key, text, function(err, category) {
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