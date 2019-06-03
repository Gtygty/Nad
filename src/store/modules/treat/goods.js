import {
  getCategoryList,
  getTreatDetails,
  getUnit,
  getCateList,
  updateTreat,
  updateActions,
  getGoodsDetail,
  deleteGoods,
  creatNewGoods,
  updateImgTINY,
  getImgTINY,
  deleteImgTINY
} from "@/api/treat/goods";
import { CODE_OK, IsAlert } from "@/utils/api";
const goods = {
  state: {},
  mutations: {},
  actions: {
    //获取护理分类列表
    async GetCategoryList({ dispatch, commit }, params) {
      let res = await getCategoryList(params);
      return res;
    },
    //获取详情
    async GetTreatDetails({ dispatch, commit }, params) {
      let res = await getTreatDetails(params);
      return res;
    },
    //获取单位
    async GetUnit({ dispatch, commit }, params) {
      let res = await getUnit(params);
      return res;
    },
    //新增商品
    async CreatNewGoods({ dispatch, commit }, params) {
      let res = await creatNewGoods(params);
      return res;
    },
    //修改商品
    async UpdateTreat({ dispatch, commit }, params) {
      let res = await updateTreat(params);
      return res;
    },
    //获取编辑时绑定的商品
    async GetGoodsDetail({ dispatch, commit }, params) {
      let res = await getGoodsDetail(params);
      return res;
    },
    //获取分类下拉框
    async GetCateList({ dispatch, commit }, params) {
      let res = await getCateList(params);
      return res;
    },
    //修改分类-商品发布-删除 action 1 是发布 2 修改分类 3 删除
    async UpdateActions({ dispatch, commit }, params) {
      let res = await updateActions(params);
      return res;
    },
    //富文本上传图片
    async UpdateImgTINY({ dispatch, commit }, params) {
      let res = await updateImgTINY(params);
      return res;
    },
    //富文本获取图片
    async GetImgTINY({ dispatch, commit }, params) {
      let res = await getImgTINY(params);
      return res;
    },
    //富文本删除图片
    async DeleteImgTINY({ dispatch, commit }, params) {
      let res = await deleteImgTINY(params);
      return res;
    },
    //删除
    async DeleteGoods({ dispatch, commit }, params) {
      let res = await deleteGoods(params);
      return res;
    },

    LogOut() {
      localStorage.clear();
      location.href = "/";
    }
  }
};

export default goods;
