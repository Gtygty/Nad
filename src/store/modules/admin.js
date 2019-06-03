import { getUserList } from "@/api/admin";
import { CODE_OK } from "@/utils/api";
const admin = {
  state: {},
  mutations: {},
  actions: {
    //获取用户组
    async GetUserList({ dispatch, commit }, params) {
      let res = await getUserList(params);
      if (res.code === CODE_OK) {
        return res.data;
      } else if (res.code !== CODE_OK) {
        console.log("分组状态码不为2000");
      }
    },

    LogOut() {
      localStorage.clear();
      location.href = "/";
    }
  }
};

export default admin;
