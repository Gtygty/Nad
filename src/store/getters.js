const getters = {
  logo: state => state.app.logo,
  menuRouter: state => state.app.menuRouter, //菜单路由
  isCollapsed: state => state.app.isCollapsed,
  userName: state => state.app.userName,
  userAvatar: state => state.app.userAvatar,
  GroupData: state => state.app.GroupData,
  vueRouter: state => state.app.vueRouter,
  isGetModules: state => state.app.isGetModules,
  loggedIn: state => state.app.loggedIn,
  wsResMsg: state => state.app.wsResMsg,
  wsParams: state => state.app.wsParams,
  loadingText: state => state.app.loadingText
};
export default getters;
