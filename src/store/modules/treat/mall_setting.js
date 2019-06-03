import {
  getShoppingMallList,
  setMallStatus,
  setMallTags,
  getMallTags,
  getGoodTags
} from "@/api/treat/mall_setting";
const mall_setting = {
  state: {},
  mutations: {},
  actions: {
    //获取商城列表
    async GetShoppingMallList({ dispatch, commit }, params) {
      let res = await getShoppingMallList(params);
      return res;
    },
    //批量上下架
    async SetMallStatus({ dispatch, commit }, params) {
      let res = await setMallStatus(params);
      return res;
    },
    //获取标签
    async GetMallTags({ dispatch, commit }, params) {
      let res = await getMallTags(params);
      return res;
    },
    //获取商品标签
    async GetGoodTags({ dispatch, commit }, params) {
      let res = await getGoodTags(params);
      return res;
    },
    //设置标签
    async SetMallTags({ dispatch, commit }, params) {
      let res = await setMallTags(params);
      return res;
    }
  }
};

export default mall_setting;
