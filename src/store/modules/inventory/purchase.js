import {
  getPurchaseList,
  addPurchase,
  getPurchaseNode,
  getGoodsByCode,
  getPurchaseInfo,
  getUserOption,
  getGoodSearch
} from "@/api/inventory/purchase";
const purchase = {
  state: {},
  mutations: {},
  actions: {
    // 获取列表
    async GetPurchaseList({ dispatch, commit }, params) {
      let res = await getPurchaseList(params);
      return res;
    },
    //新增进货单
    async AddPurchase({ dispatch, commit }, params) {
      let res = await addPurchase(params);
      return res;
    },
    //获取treedata数据（分类加商品）
    async GetPurchaseNode({ dispatch, commit }, params) {
      let res = await getPurchaseNode(params);
      return res;
    },
    //根据code获取商品
    async GetGoodsByCode({ dispatch, commit }, params) {
      let res = await getGoodsByCode(params);
      return res;
    },
    //采购单据明细
    async GetPurchaseInfo({ dispatch, commit }, params) {
      let res = await getPurchaseInfo(params);
      return res;
    },
    //获取创建人下拉数据
    async GetUserOption({ dispatch, commit }, params) {
      let res = await getUserOption(params);
      return res;
    },
    //树状数据搜索
    async GetGoodSearch({ dispatch, commit }, params) {
      let res = await getGoodSearch(params);
      return res;
    }
  }
};

export default purchase;
