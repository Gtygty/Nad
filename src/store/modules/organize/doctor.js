import {
  getDocList,
  postAddOrUpdateDoc
} from "@/api/organize/doctor";
import { CODE_OK, IsAlert } from "@/utils/api";
const doctor = {
  state: {},
  mutations: {},
  actions: {
    //获取医生列表
    async GetDocList({ dispatch, commit }, params) {
      let res = await getDocList(params);
      return res;
    },
    //新增编辑
    async PostAddOrUpdateDoc({ dispatch, commit }, params) {
      let res = await postAddOrUpdateDoc(params);
      return res;
    }
  }
};

export default doctor;
