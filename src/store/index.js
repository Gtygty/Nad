import Vue from "vue";
import Vuex from "vuex";
import app from "./modules/app";
import dept from "./modules/dept"; //权限

import admin from "./modules/admin"; //用户
import access from "./modules/access"; //部门

import work_reminder from "./modules/work_reminder"; //工作台

import goods from "./modules/treat/goods"; //护理
import mall_setting from "./modules/treat/mall_setting"; //商城
import goods_category from "./modules/treat/goods_category"; //分类

import user_list from "./modules/user_manage/user_list"; //客户

import storeList from "./modules/organize/store"; //店面
import doctor from "./modules/organize/doctor"; //doctor
import nurse from "./modules/organize/nurse"; //nurse
import account from "./modules/organize/admin"; //账户


import emailTem from "./modules/message/email_template"; //邮件模板

import change from "./modules/inventory/check"; //change
import purchase from "./modules/inventory/purchase"; //purchase
import transfer from "./modules/inventory/transfer"; //transfer
import inventory from "./modules/inventory/inventory"; //inventory

import operation_log from "./modules/work_desk/operation_log"; //日志


import book from "./modules/business/book"; //预约

import backend from "./modules/backend"; //后台
import getters from "./getters";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    app,
    user_list,
    goods_category,
    dept,
    account,
    emailTem,
    admin,
    access,
    work_reminder,
    mall_setting,
    goods,
    storeList,
    doctor,
    nurse,
    operation_log,
    transfer,
    purchase,
    inventory,
    change,
    book,
    backend
  },
  // gettersmodules: {
  //   app,
  //   dept
  // },
  getters
});

export default store;
