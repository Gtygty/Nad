import { getUsersList } from "@/api/user_manage/user_list";
import { CODE_OK, IsAlert } from "@/utils/api";
const user_list = {
  state: {},
  mutations: {},
  actions: {
    //获取客户列表
    async GetUsersList({ dispatch, commit }, params) {
      let res = await getUsersList(params);
      return res;
    }
  }
};

export default user_list;
