var validator = require('validator');

var Category = require('../proxy').Category;
var Tab = require('../proxy').Tab;

exports.index = function (req, res, next) {
  res.render('category/index', {navTab: 'category'});
}

exports.getCategories = function (req, res, next) {
  Category.getCategories(function (err, categories) {
    if (err) {
      res.json({success: false, message: '获取category错误'});
      return;
    }

    res.json({success: true, categories: categories});
  });
}

exports.addCategory = function (req, res, next) {
  var key = validator.trim(req.body.key);
  var value = validator.trim(req.body.value);
  console.log('add category......');

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

exports.deleteCategory = function (req, res, next) {
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

exports.getTabs = function (req, res, next) {
  Tab.getTabs(function (err, tabs) {
    if (err) {
      res.json({success: false, message: '获取tabs错误'});
      return;
    }

    res.json({success: true, tabs: tabs});
  });
}

exports.addTab = function (req, res, next) {
  var key = validator.trim(req.body.key);
  var value = validator.trim(req.body.value);

  if (key === '' || value === '') {
    return res.json({success: false, message: '参数错误'});
  }

  var query = {"$or": [{key: key}, {value: value}]};
  Tab.getTab(query, function (err, tab) {
    if (err) {
      res.json({success: false, message: '添加错误'});
      return;
    }

    if(tab) {
      res.json({success: false, message: '数据重复'});
      return;
    }

    Tab.newAndSave(key, value, function(err, tab) {
      if (err) {
        res.json({success: false, message: '添加错误'});
        return;
      }

      res.json({success: true, tab: tab});
    });
  });
}

exports.deleteTab = function (req, res, next) {
  var tab_id = req.params.tid;

  Tab.getTabById(tab_id, function(err, tab) {
    if (err) {
      res.json({success: false, message: '获取tab错误'});
      return;
    }

    if (!tab) {
      res.json({success: false, message: '获取tab错误'});
      return;
    }

    tab.deleted = true;
    tab.save();
    res.json({success: true, message: '删除成功'});
  });
}