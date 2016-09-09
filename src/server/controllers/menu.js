var validator = require('validator');

var Menu = require('../proxy').Menu;
var Submenu = require('../proxy').Submenu;

exports.index = function (req, res, next) {
  res.render('menu/index', {navTab: 'tag'});
}

exports.getMenus = function (req, res, next) {
  Menu.getMenus({deleted: false}, function (err, menus) {
    if (err) {
      res.json({success: false, message: '获取menus错误'});
      return;
    }

    res.json({success: true, data: menus});
  });
}

exports.updateSubmenu = function (req, res, next) {
  var submenuId = req.params.sid;
  var enable = req.body.enable || false;
  var key = req.body.key || '';
  var value = req.body.value || '';

  Submenu.getSubmenuById(submenuId, function(err, submenu) {
    if (err) {
      res.json({success: false, message: '获取tab错误'});
      return;
    }

    if (!submenu) {
      res.json({success: false, message: '获取tab错误'});
      return;
    }

    submenu.enable = enable;

    if (key) {
      submenu.key = key;
    }

    if (value) {
      submenu.value = value;
    }

    submenu.save();
    res.json({success: true, message: '更新成功'});
  });
}


exports.addMenu = function (req, res, next) {
  var key = validator.trim(req.body.key);
  var value = validator.trim(req.body.value);

  if (key === '' || value === '') {
    return res.json({success: false, message: '参数错误'});
  }

  var query = {"$or": [{key: key}, {value: value}]};
  Menu.getMenu(query, function (err, menu) {
    if (err) {
      res.json({success: false, message: '添加错误'});
      return;
    }

    if(menu) {
      res.json({success: false, message: '数据重复'});
      return;
    }

    Menu.newAndSave(key, value, function(err, menu) {
      if (err) {
        res.json({success: false, message: '添加错误'});
        return;
      }

      return res.json({success: true, data: menu});
    });
  });
}

exports.deleteMenu = function (req, res, next) {
  var menuId = req.params.mid;

  Menu.getMenuById(menuId, function(err, menu) {
    if (err) {
      res.json({success: false, message: '获取menu错误'});
      return;
    }

    if (!menu) {
      res.json({success: false, message: '获取menu错误'});
      return;
    }

    menu.deleted = true;
    menu.save();
    res.json({success: true, message: '删除成功'});
  });
}


exports.updateMenu = function (req, res, next) {
  var menuId = req.params.mid;
  var enable = req.body.enable || false;
  var key = req.body.key || '';
  var value = req.body.value || '';

  Menu.getMenuById(menuId, function(err, menu) {
    if (err) {
      res.json({success: false, message: '获取menu错误'});
      return;
    }

    if (!menu) {
      res.json({success: false, message: '获取menu错误'});
      return;
    }

    menu.enable = enable;
    
    if (key) {
      menu.key = key;
    }

    if (value) {
      menu.value = value;
    }

    menu.save();
    res.json({success: true, message: '更新成功'});
  });
}

exports.addSubmenu = function (req, res, next) {
  var parentId = validator.trim(req.body.parentId);
  var key = validator.trim(req.body.key);
  var value = validator.trim(req.body.value);

  if (parentId === '' || key === '' || value === '') {
    return res.json({success: false, message: '参数错误'});
  }

  var query = {"$or": [{key: key}, {value: value}]};
  Submenu.getSubmenu(query, function (err, tag) {
    if (err) {
      res.json({success: false, message: '添加错误'});
      return;
    }

    if(tag) {
      res.json({success: false, message: '数据重复'});
      return;
    }

    Submenu.newAndSave(parentId, key, value, function(err, submenu) {
      if (err) {
        res.json({success: false, message: '添加错误'});
        return;
      }

      res.json({success: true, data: submenu});
    });
  });
}

exports.deleteSubmenu = function (req, res, next) {
  var submenuId = req.params.sid;

  Submenu.getSubmenuById(submenuId, function(err, submenu) {
    if (err) {
      res.json({success: false, message: '获取tag错误'});
      return;
    }

    if (!submenu) {
      res.json({success: false, message: '获取tag错误'});
      return;
    }

    submenu.deleted = true;
    submenu.save();
    res.json({success: true, message: '删除成功'});
  });
}