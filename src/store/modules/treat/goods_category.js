import { addCategory, postEditCategory } from "@/api/treat/goods_category";
const goods_category = {
  state: {},
  mutations: {},
  actions: {
    //新增
    async AddCategory({ dispatch, commit }, params) {
      let res = await addCategory(params);
      return res;
    },
    //修改
    async PostEditCategory({ dispatch, commit }, params, id) {
      let res = await postEditCategory(params, id);
      return res;
    }
  }
};

export default goods_category;
