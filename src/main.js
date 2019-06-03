// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "@/App";
import router from "@/router";
import store from "@/store";
import iView from "iview";
import VueI18n from "vue-i18n"; //多语言
// import "./../static/css/reset.css";//废弃的公共样式
import "./../static/css/common.less";
import "element-ui/lib/theme-chalk/index.css";
import "iview/dist/styles/iview.css";
import "@/my-theme/index.less";
import "./../static/font/iconfont.css";
import "@/router/permission";
import '../static/tinymce/tinymce.min.js'
import '../node_modules/swiper/dist/css/swiper.min.css'
import axios from "axios";
// import socket from '@/websocket'
Vue.prototype.$http = axios;
import { VTable } from "vue-easytable";
import { Table, TableColumn } from "element-ui";
import zhLocale from "iview/src/locale/lang/zh-CN";
import enLocale from "iview/src/locale/lang/en-US";
import twLocale from "iview/src/locale/lang/zh-TW";

import cn from "@/language/zh-CN";
import tw from "@/language/zh-TW";
import us from "@/language/en-US";

iView.LoadingBar.config({
  color: "#ff80ab",
  height: 5
});
//处理iview InputNumber控件使用precision属性光标混乱的hack
iView.InputNumber.computed.precisionValue = function() {
  let arr = (this.currentValue + "").split(".");
  if (this.precision && arr[1] && this.precision < arr[1].length)
    return this.currentValue.toFixed(this.precision);
  return this.currentValue;
};
Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value), //解决iview使用this.$函数调用组件时和i18n冲突
});
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(VueI18n);
Vue.locale = () => {};
const messages = {
  cn: Object.assign(cn, zhLocale),
  en: Object.assign(us, enLocale),
  tc: Object.assign(tw, twLocale)
};

// 设置参数，创建 Vuei18n 的实例。
const i18n = new VueI18n({
  locale: localStorage.getItem("language") || "en", // set locale
  messages, // set locale messages
  silentTranslationWarn: true//silentWarn
});
export default i18n;
Vue.component("easytable", VTable);
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  i18n,
  // socket,
  template: "<App/>",
  components: {
    App
  }
});
