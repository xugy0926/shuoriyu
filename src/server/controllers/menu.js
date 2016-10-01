import Base from './Base'
var validator = require('validator');
var MenuProxy = require('../proxy').Menu;
var SubmenuProxy = require('../proxy').Submenu;
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';

class Menu extends Base {

  getMenus(req, res, next) {
    let that = this
    let all = req.body.all || false

    let query = {deleted: false};

    if (!all) {
      query.enable = true;
    }

    MenuProxy.getMenus(query)
      .then(menus => that.success(res, {data: menus}))
      .catch(message => that.error(res, {message}))
  }

  updateSubmenu(req, res, next) {
    let that = this
    let submenuId = req.params.sid
    let enable = req.body.enable || false
    let key = req.body.key || ''
    let value = req.body.value || ''

    SubmenuProxy.getSubmenuById(submenuId)
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
      .then(message => that.success(res, {message}))
      .catch(message => that.error(res, {message}));
  }


  addMenu(req, res, next) {
    let that = this
    let key = validator.trim(req.body.key)
    let value = validator.trim(req.body.value)

    if (key === '' || value === '') {
      return res.json({success: false, message: '参数错误'});
    }

    var query = {"$or": [{key: key}, {value: value}]};
    MenuProxy.getOneMenu(query)
      .then(menu => {
        if (menu) throw ResultMsg.REPEAT_DATA
      })
      .then(() => { return MenuProxy.newAndSave(key, value)})
      .then(doc => that.success(res, {data: doc}))
      .catch(message => that.error(res, {message}))
  }

  deleteMenu(req, res, next) {
    let that = this
    let menuId = req.params.mid

    MenuProxy.getMenuById(menuId)
      .then(doc => {
        if (!doc) throw ResultMsg.DATA_NOT_FOUND
        else return doc
      })
      .then(doc => {
        doc.deleted = true
        doc.save()
        return ResultMsg.DELETED_SUCCESS
      })
      .then(message => that.success(res, {message}))
      .catch(message => that.error(res, {message}))
  }


  updateMenu(req, res, next) {
    let that = this
    let menuId = req.params.mid;
    let enable = req.body.enable || false;
    let key = req.body.key || '';
    let value = req.body.value || '';

    MenuProxy.getMenuById(menuId)
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
      .then(message => that.success(res, {message}))
      .catch(message => that.error(res, {message}))
  }

  addSubmenu(req, res, next) {
    let that = this
    let parentId = validator.trim(req.body.parentId);
    let key = validator.trim(req.body.key);
    let value = validator.trim(req.body.value);

    if (parentId === '' || key === '' || value === '') {
      return res.json({success: false, message: '参数错误'});
    }

    let query = {"$or": [{key: key}, {value: value}]};

    SubmenuProxy.getOneSubmenu(query)
      .then(doc => {
        if (doc) throw ResultMsg.REPEAT_DATA
      })
      .then(() => { return SubmenuProxy.newAndSave(parentId, key, value)})
      .then(doc => that.success(res, {data: doc}))
      .catch(message => that.error(res, {message}))
  }

  deleteSubmenu(req, res, next) {
    let that = this
    let submenuId = req.params.sid;

    SubmenuProxy.getSubmenuById(submenuId)
      .then(doc => {
        if(!doc) throw ResultMsg.DATA_NOT_FOUND
        else return doc
      })
      .then(doc => {
        doc.deleted = true
        doc.save()
        return ResultMsg.DELETED_SUCCESS
      })
      .then(message => that.success(res, {message}))
      .catch(message => that.error(res, {message}));
  }
}

module.exports = Menu
