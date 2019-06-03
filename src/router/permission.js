/** 路由导航守卫，每次跳转逻辑判断*/

import router, { createRouter } from "@/router";
import store from "@/store";
import util from "util";
import { CODE_OK } from "@/utils/api";
// import socket from '@/websocket'
import { getToken } from "@/utils";
import iView from "iview";
const whiteList = ["/login"]; // 不重定向白名单
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  //  && store.state.app.wsToken
  if (getToken()) {
    // 判断是否有token
    if (to.path === "/login") {
      store.commit("SET_ISGETMODULES", false);
      store.dispatch("LogOut");
      next();
    } else if (to.path === "/") {
      if (!store.getters.userName) {//判断vuex中是否因为刷新丢失了userinfo，是则重新获取
        store.dispatch("GetUserInfo").then(()=>{
          next({
            path: "/work_desk"
          });
        });
      };
      // next({
      //   path: "/work_desk"
      // });
    } else {
      if (!store.getters.isGetModules) {
        if (!store.getters.userName) {//判断vuex中是否因为刷新丢失了userinfo，是则重新获取
          store.dispatch("GetUserInfo");
        }
        store.dispatch("SetRouter", router).then(res => {
          if (res.code === CODE_OK) {
            // router.matcher = createRouter([
            //   ...store.getters.vueRouter,
            //   {
            //     path: "*",
            //     redirect: "/work_desk"
            //   }
            // ]).matcher;
            if (!res.data.length) {
              iView.Notice.error({
                title: "Error Of Menu",
                duration: 0,
                desc: "No Menu Permissions"
              });
              setTimeout(function() {
                store.dispatch("LogOut");
              }, 4000);
              return;
            }
            router.addRoutes([
              ...store.getters.vueRouter,
              {
                path: "*",
                redirect: "/work_desk"
              }
            ]);
            // console.log(`store.state.app.wsToken:${store.state.app.wsToken}`);
            // let WSparams = {
            //   n: "WebAuthenticateUser",
            //   o: JSON.stringify({ SessionToken: store.state.app.wsToken }),
            //   ...store.state.app.wsParams
            // };
            // socket.send(JSON.stringify(WSparams))

            // next({ ...to });
            next(to);
          } else {
            store.dispatch("LogOut"); //获取菜单失败
          }
        });
      } else {
        next();
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next();
    } else {
      next({
        path: "/login"
      }); // 否则全部重定向到登录页
      iView.LoadingBar.finish(); // 在hash模式下 改变手动改变hash 重定向回来 不会触发afterEach 暂时hack方案 ps：history模式下无问题，可删除该行！
    }
  }
});

router.afterEach(() => {
  iView.LoadingBar.finish();
});
