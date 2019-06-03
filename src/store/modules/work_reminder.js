import // getCategoryList,
// getTreatDetails,
// getUnit,
// updateTreat,
// updateStatus
"@/api/work_reminder";
import { CODE_OK, IsAlert } from "@/utils/api";
const work_reminder = {
  state: {},
  mutations: {},
  actions: {
    // //获取护理分类列表
    // async GetCategoryList({ dispatch, commit }, params) {
    //   let res = await getCategoryList(params);
    //   // if (res.code === CODE_OK) {
    //   return res.data;
    //   // } else if (res.code !== CODE_OK) {
    //   //   IsAlert("失败！", res.message);
    //   // }
    // },
    // //获取详情
    // async GetTreatDetails({ dispatch, commit }, params) {
    //   let res = await getTreatDetails(params);
    //   return res;
    // },
    // //获取单位
    // async GetUnit({ dispatch, commit }, params) {
    //   let res = await getUnit(params);
    //   return res;
    // },
    // //修改商品
    // async UpdateTreat({ dispatch, commit }, params) {
    //   let res = await updateTreat(params);
    //   return res;
    // },
    // //修改商品状态
    // async UpdateStatus({ dispatch, commit }, params) {
    //   let res = await updateStatus(params);
    //   return res;
    // },

    LogOut() {
      localStorage.clear();
      location.href = "/";
    }
  }
};

export default work_reminder;
