import { getDepartmentList } from "@/api/access";
import { CODE_OK } from "@/utils/api";
const access = {
  state: {},
  mutations: {},
  actions: {
    //获取部门
    async GetDepartmentList({ dispatch, commit }, params) {
      let res = await getDepartmentList(params);
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

export default access;
