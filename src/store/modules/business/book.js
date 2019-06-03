import {
  getUserByEmailMob
} from "@/api/business/book";
const book = {
  state: {},
  mutations: {},
  actions: {
    // 根据手机号或者邮箱 搜索客户
    async GetUserByEmailMob({ dispatch, commit }, params) {
      let res = await getUserByEmailMob(params);
      return res;
    },
  }
};

export default book;
