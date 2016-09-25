
var EventProxy = require('eventproxy');
var Menu = require('../models').Menu;
var SubmenuProxy = require('./sub_menu');
var Submenu = require('../models').Submenu;

import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';

exports.getMenuById = function (id, callback) {
  return new Promise(function(resolove, reject) {
      Menu.findOne({_id: id}, function(err, doc) {
        if (err) reject(ResultMsg.DB_ERROR)
        else resolove(doc)
      })
  })
}

exports.getOneMenu = function (opt) {
  return new Promise(function(resolove, reject) {
    Menu.findOne(opt, function(err, doc) {
      console.log('get menu ...1');
      console.log(doc);
      if (err) reject(ResultMsg.DB_ERROR)
      else resolove(doc)     
    })
  })
}

exports.getMenus = function (opt) {
  return new Promise(function(resolove, reject) {
    Menu.find(opt, function(err, menus) {
      if (err) {
        return reject(ResultMsg.DB_ERROR)
      }

      if (menus.length === 0) {
        return reject(ResultMsg.DATA_NOT_FOUND)
      }
      
      var newMenus = [];
      for (var i = 0, len = menus.length; i < len; i++) {
        newMenus[i] = menus[i].toObject()
      }

      Submenu.find({deleted: false}, function(err, submenus) {
        if (err) {
          return reject(ResultMsg.DB_ERROR)
        }

        for(var i = 0; i < newMenus.length; i++) {
          let sub = [];
          submenus.forEach((item2)=> {
            if (newMenus[i]._id.toString() === item2.parent_id.toString()) {
              sub.push(item2);
            }
          });

          newMenus[i].submenus = sub;
        }

        resolove(newMenus)
      });
    });   
  })
};

exports.newAndSave = function (key, value) {
  return new Promise(function(resolove, reject) {
    var menu  = new Menu()
    menu.key  = key
    menu.value = value

    menu.save(function(err, doc) {
      if (err) reject(err)
      else resolove(doc)
    })
  })
};
