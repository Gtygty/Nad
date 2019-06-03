import Vue from "vue";
import Router from "vue-router";
// import store from '../store'
// import HelloWorld from '@/components/HelloWorld'

Vue.use(Router);
export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    {
      path: "/login",
      meta: {
        title: "登录"
      },
      component: resolve => require(["@/views/login"], resolve)
    },
    // {
    //   path: '/404',
    //   name: '404',
    //   component: () => import('@/views/inventory/transfer'),
    //   hidden: true
    // },
    // {
    //   path: '*',
    //   redirect: '/404',
    //   hidden: true
    // }
  ]
});
// export const createRouter = routes =>
//   new Router({
//     mode: "history",
//     base: process.env.BASE_URL,
//     routes
//   });
