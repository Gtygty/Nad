import {
  getInventoryHisList,
  getInventoryReduce,
  getInventoryBatReduce,
  getInventoryInfo
} from "@/api/inventory/inventory";
const inventory = {
  state: {},
  mutations: {},
  actions: {
    // 获取列表
    async GetInventoryHisList({ dispatch, commit }, params) {
      let res = await getInventoryHisList(params);
      return res;
    },
    // 明细
    async GetInventoryInfo({ dispatch, commit }, params) {
      let res = await getInventoryInfo(params);
      return res;
    },
    // 退货
    async GetInventoryReduce({ dispatch, commit }, params) {
      let res = await getInventoryReduce(params);
      return res;
    },
    // 退货新
    async GetInventoryBatReduce({ dispatch, commit }, params) {
      let res = await getInventoryBatReduce(params);
      return res;
    }
  }
};

export default inventory;
