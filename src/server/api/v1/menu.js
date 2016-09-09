var validator = require('validator');

var Menu = require('../../proxy').Menu;

exports.getMenus = function (req, res, next) {
  Menu.getMenus({deleted: false, enable: true}, function (err, menus) {
    if (err) {
      res.json({success: false, message: '获取menus错误'});
      return;
    }

    res.json({success: true, data: menus});
  });
}