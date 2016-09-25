var validator = require('validator');
var Menu = require('../proxy').Menu;
var Submenu = require('../proxy').Submenu;
import * as ResultMsg from '../constrants/ResultMsg';

function handleError(res, message) {
  return res.json({success: false, message: message})
}

function handleSuccess(res, message) {
  return res.json({success: true, message: message})
}

exports.getMenus = function (req, res, next) {
  let all = req.body.all || false;

  let query = {deleted: false};

  if (!all) {
    query.enable = true;
  }

  Menu.getMenus(query)
    .then(menus => res.json({success: true, data: menus}))
    .catch(message => handleError(res, message))
}

exports.updateSubmenu = function (req, res, next) {
  var submenuId = req.params.sid;
  var enable = req.body.enable || false;
  var key = req.body.key || '';
  var value = req.body.value || '';

  Submenu.getSubmenuById(submenuId)
    .then(doc => {
      if (!doc) throw ResultMsg.DATA_NOT_FOUND
      else return doc
    })
    .then(doc => {
      submenu.enable = enable

      if (key) {
        submenu.key = key
      }

      if (value) {
        submenu.value = value
      }

      submenu.save()
      return ResultMsg.UPDATE_SUCCESS
    })
    .then(message => handleSuccess(res, message))
    .catch(message => handleError(res, message));
}


exports.addMenu = function (req, res, next) {
  var key = validator.trim(req.body.key);
  var value = validator.trim(req.body.value);

  if (key === '' || value === '') {
    return res.json({success: false, message: '参数错误'});
  }

  var query = {"$or": [{key: key}, {value: value}]};
  Menu.getOneMenu(query)
    .then(menu => {
      if (menu) throw ResultMsg.REPEAT_DATA
    })
    .then(() => {
      return Menu.newAndSave(key, value)
    })
    .then(doc => res.json({success: true, data: doc}))
    .catch(message => handleError(res, message))
}

exports.deleteMenu = function (req, res, next) {
  var menuId = req.params.mid;

  Menu.getMenuById(menuId)
    .then(doc => {
      if (!doc) throw ResultMsg.DATA_NOT_FOUND
      else return doc
    })
    .then(doc => {
      doc.deleted = true
      doc.save()
      return ResultMsg.DELETED_SUCCESS
    })
    .then(message => handleSuccess(res, message))
    .catch(message => handleError(res, message))
}


exports.updateMenu = function (req, res, next) {
  var menuId = req.params.mid;
  var enable = req.body.enable || false;
  var key = req.body.key || '';
  var value = req.body.value || '';

  Menu.getMenuById(menuId)
    .then((doc) => {
      if (!doc) throw ResultMsg.DATA_NOT_FOUND
      else return doc
    })
    .then(doc => {
      doc.enable = enable
      if (key) {
        doc.key = key;
      }

      if (value) {
        doc.value = value;
      }

      doc.save()
      return ResultMsg.UPDATE_SUCCESS
    })
    .then(message => handleSuccess(res, message))
    .catch(message => handleError(res, message))
}

exports.addSubmenu = function (req, res, next) {
  var parentId = validator.trim(req.body.parentId);
  var key = validator.trim(req.body.key);
  var value = validator.trim(req.body.value);

  if (parentId === '' || key === '' || value === '') {
    return res.json({success: false, message: '参数错误'});
  }

  var query = {"$or": [{key: key}, {value: value}]};

  Submenu.getOneSubmenu(query)
    .then(doc => {
      if (doc) throw ResultMsg.REPEAT_DATA
    })
    .then(() => {return Submenu.newAndSave(parentId, key, value)})
    .then(doc => res.json({success: true, data: doc}))
    .catch(message => handleError(res, message))
}

exports.deleteSubmenu = function (req, res, next) {
  var submenuId = req.params.sid;

  Submenu.getSubmenuById(submenuId)
    .then(doc => {
      if(!doc) throw ResultMsg.DATA_NOT_FOUND
      else return doc
    })
    .then(doc => {
      doc.deleted = true
      doc.save()
      return ResultMsg.DELETED_SUCCESS
    })
    .then(message => handleSuccess(res, message))
    .catch(message => handleError(res, message));
}