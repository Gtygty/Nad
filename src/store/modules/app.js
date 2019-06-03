import { crmLogin, getAllMenu,getUserInfo } from "@/api/login";
import { menu_data_res, group_data_res } from "../menuData";
import { CODE_OK,IsMessage } from "@/utils/api";
import { setToken } from "@/utils";
const addRoutes = v => {
  let obj = {
    path: `/${v.path}`,
    name: v.children[0].menu_name, //.children[0]是否去掉
    meta: {
      auth: true,
      title: v.children[0].menu_name,
      // menu: v.menu_id
      menu: v.id
    },
    component: resolve => require(["@/views/admin"], resolve),
    redirect:
      v.children[0].children.length === 0
        ? `/${v.children[0].path}`
        : `/${v.path}/${
            v.children[0].children[0].path.split("/")[
              v.children[0].children[0].path.split("/").length - 1
            ]
          }`,
    hidden: true,
    children: []
  };
  obj.children = [...childRoutes(v.children)];
  return obj;
};
const childRoutes = child => {
  let arr = [];
  child.forEach(v => {
    if (v.children.length === 0) {
      arr.push({
        path: v.path.split("/")[v.path.split("/").length - 1],
        name: v.menu_name,
        component: resolve => require([`@/views/${v.path}`], resolve),
        meta: {
          auth: true,
          title: v.menu_name,
          menu: v.id
        }
      });
    } else {
      v.children.forEach(child => {
        arr.push({
          path: child.path.split("/")[child.path.split("/").length - 1],
          name: child.menu_name,
          component: resolve =>
            require([
              `@/views/${child.path.split("/")[0]}/${
                child.path.split("/")[child.path.split("/").length - 1]
              }`
            ], resolve),
          meta: {
            auth: true,
            title: child.menu_name,
            menu: child.id
          }
        });
      });
    }
  });
  return arr;
};

const app = {
  state: {
    logo: "123",
    menuRouter: [],
    vueRouter: [],
    isCollapsed: false,
    isGetModules: false,
    userName: "",
    userAvatar: "",
    loggedIn: "",
    storeId: "",
    loadingText:"",
    // wsResMsg:{},
    // wsParams:{
    //   i:1,
    //   m:0,
    //   type:'anws_frame',
    //   s:''
    // },
    // wsToken:localStorage.getItem('ws_token'),
  },
  mutations: {
    lOADINGTEXT: (state, loadingText) => {
      state.loadingText = loadingText;
    },
    COLLAPSED: (state, status) => {
      state.isCollapsed = status;
    },
    GETGROUP: (state, status) => {
      //分组数据
      state.GroupData = status;
    },
    SETMENU: (state, status) => {
      state.menuRouter = status;
      let arr = [];
      let sortMenu = status.sort((a, b) => {
        return b.is_top - a.is_top;
      }); //菜单按照.is_top排序
      sortMenu.forEach(v => {
        arr.push(addRoutes(v));
      });
      state.vueRouter = arr;
    },
    SET_ISGETMODULES: (state, isGetModules) => {
      state.isGetModules = isGetModules;
    },
    SET_LOGGED_IN: (state, param) => {
      state.loggedIn = param;
    },
    SET_USER_ID: (state, id) => {
      localStorage.setItem("userId", id);
      state.userId = id;
    },
    SET_USER_INFO: (state, info) => {//设置用户详情
      state.userName = info.admin_name;
      state.userAvatar = info.avatar;
    },
    SET_USER_NAME: (state, name) => {
      localStorage.setItem("userName", name);
      state.userName = name;
    },
    SET_USER_AVATAR: (state, avatar) => {
      localStorage.setItem("userAvatar", avatar);
      state.userAvatar = avatar;
    },
    SET_STORE_ID: (state, id) => {
      localStorage.setItem("storeId", id);
      state.storeId = id;
    },
    SET_WS_RES: (state, res) => {
      state.wsResMsg = res;
      state.wsParams.i++;
    },
    SET_WS_TOKEN: (state, token) => {
      localStorage.setItem("ws_token", token);
      state.wsToken = token;
    }
  },
  actions: {
    //登录
    async LoginAction({ dispatch, commit }, params) {
      let res = await crmLogin(params);
      if (res) {
        setToken(res.data.access_token);
      }
      return res;
    },
    //获取菜单
    async GetAllMenu({ dispatch, commit }, params) {
      let res = await getAllMenu(params);
      return res;
    },
    //获取用户数据
    async GetUserInfo({ dispatch, commit }, params) {
      let res = await getUserInfo(params);
      if (res.code === CODE_OK) {
        await commit("SET_USER_INFO", res.data);
      } else {
        IsMessage("error","获取用户数据失败！")
      }
      return res;
    },
    //获取菜单并设置路由
    async SetRouter({ commit, getters }, router) {
      let res = await getAllMenu();
      if (res.code === CODE_OK) {
        await commit("SETMENU", res.data);
        await commit("SET_ISGETMODULES", true); //此状态说明已设置好了路由
        // this.$router不是响应式的，所以手动将路由元注入路由对象
        router.options.routes = [
          ...getters.vueRouter,
          {
            path: "*",
            redirect: "/work_desk"
          }
        ];
      } else if (res.code !== CODE_OK) {
        console.log("设置路由状态码不为0");
      }

      return res;
    },

    LogOut() {
      localStorage.clear();
      location.href = "/";
    }
  }
};

export default app;
