import {
  getInventoryListById,
  addTransferBill,
  getTransferList,
  getTransferInfo
} from "@/api/inventory/transfer";
const transfer = {
  state: {},
  mutations: {},
  actions: {
    // 根据storid获取商品列表（也是库存列表）
    async GetInventoryListById({ dispatch, commit }, params) {
      let res = await getInventoryListById(params);
      return res;
    },
    // 调入|调出
    async AddTransferBill({ dispatch, commit }, params) {
      let res = await addTransferBill(params);
      return res;
    },
    // 列表
    async GetTransferList({ dispatch, commit }, params) {
      let res = await getTransferList(params);
      return res;
    },
    // 调拨明细
    async GetTransferInfo({ dispatch, commit }, params) {
      let res = await getTransferInfo(params);
      return res;
    }
  }
};

export default transfer;
