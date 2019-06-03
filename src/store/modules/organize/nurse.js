import {
  getNurseList,
  docAdress,
  storeSelect,
  docSelect,
  addOrNurse,
  deleteNurse,
  setTimeEve,
  setTimeDate,
  getTimeEve,
  getTimeDate
} from "@/api/organize/nurse";
import { CODE_OK, IsAlert } from "@/utils/api";
const nurse = {
  state: {},
  mutations: {},
  actions: {
    //获取护士列表
    async GetNurseList({ dispatch, commit }, params) {
      let res = await getNurseList(params);
      return res;
    },
    //删除护士
    async DeleteNurse({ dispatch, commit }, params) {
      let res = await deleteNurse(params);
      return res;
    },
    //医生住址下拉
    async DocAdress({ dispatch, commit }, params) {
      let res = await docAdress(params);
      return res;
    },
    //医生下拉
    async DocSelect({ dispatch, commit }, params) {
      let res = await docSelect(params);
      return res;
    },
    //门店下拉
    async StoreSelect({ dispatch, commit }, params) {
      let res = await storeSelect(params);
      return res;
    },
    //新增或修改护士
    async AddOrNurse({ dispatch, commit }, params) {
      let res = await addOrNurse(params);
      return res;
    },
    //护士排班（星期）
    async SetTimeEve({ dispatch, commit }, params) {
      let res = await setTimeEve(params);
      return res;
    },
    //护士排班（特殊）
    async SetTimeDate({ dispatch, commit }, params) {
      let res = await setTimeDate(params);
      return res;
    },
    //获取护士排班（星期）
    async GetTimeEve({ dispatch, commit }, params) {
      let res = await getTimeEve(params);
      return res;
    },
    //获取护士排班（特殊）
    async GetTimeDate({ dispatch, commit }, params) {
      let res = await getTimeDate(params);
      return res;
    }
  }
};

export default nurse;
