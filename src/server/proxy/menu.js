import models from '../models'
import SubmenuProxy from './submenu'
import Promise from 'promise';
import * as ResultMsg from '../constrants/ResultMsg';

let MenuModel = models.Menu
let SubmenuModel = models.Submenu

exports.getMenuById = function (id, callback) {
  return new Promise(function(resolove, reject) {
      MenuModel.findOne({_id: id}, function(err, doc) {
        if (err) reject(ResultMsg.DB_ERROR)
        else resolove(doc)
      })
  })
}

exports.getOneMenu = function (opt) {
  return new Promise(function(resolove, reject) {
    MenuModel.findOne(opt, function(err, doc) {
      if (err) reject(ResultMsg.DB_ERROR)
      else resolove(doc)     
    })
  })
}

exports.getMenus = function (opt) {
  return new Promise(function(resolve, reject) {
    MenuModel.find(opt, function(err, menus) {
      if (err) {
        return reject(ResultMsg.DB_ERROR)
      }

      if (menus.length === 0) {
        return resolve(menus)
      }
      
      let newMenus = [];
      for (let i = 0, len = menus.length; i < len; i++) {
        newMenus[i] = menus[i].toObject()
      }

      SubmenuModel.find({deleted: false}, function(err, submenus) {
        if (err) {
          return reject(ResultMsg.DB_ERROR)
        }

        for(let i = 0; i < newMenus.length; i++) {
          let sub = [];
          submenus.forEach((item2)=> {
            if (newMenus[i]._id.toString() === item2.parent_id.toString()) {
              sub.push(item2);
            }
          });

          newMenus[i].submenus = sub;
        }
        resolve(newMenus)
      });
    });   
  })
};

exports.newAndSave = function (key, value) {
  return new Promise(function(resolve, reject) {
    let menu  = new MenuModel()
    menu.key  = key
    menu.value = value

    menu.save(function(err, doc) {
      if (err) reject(err)
      else resolve(doc)
    })
  })
};
