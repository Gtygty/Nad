import {
  getStoreList,
  postNewStore,
  postTreeList,
  postEditStore,
  setStoreTimeEve,
  setStoreTimeSpe,
  getStoreTimeEve,
  getStoreTimeSpe
} from "@/api/organize/store";
import { CODE_OK, IsAlert } from "@/utils/api";
const storeList = {
  state: {
  },
  mutations: {},
  actions: {
    //获取店面列表
    async GetStoreList({ dispatch, commit }, params) {
      let res = await getStoreList(params);
      return res;
    },
    //新增店面
    async PostNewStore({ dispatch, commit }, params) {
      let res = await postNewStore(params);
      return res;
    },
    //修改店面
    async PostEditStore({ dispatch, commit }, params, id) {
      let res = await postEditStore(params, id);
      return res;
    },
    //树状列表
    async PostTreeList({ dispatch, commit }, params) {
      let res = await postTreeList(params);
      return res;
    },
    //店面排班(星期)
    async SetStoreTimeEve({ dispatch, commit }, params) {
      let res = await setStoreTimeEve(params);
      return res;
    },
    //店面排班(特定)
    async SetStoreTimeSpe({ dispatch, commit }, params) {
      let res = await setStoreTimeSpe(params);
      return res;
    },
    //获取店面排班(星期)
    async GetStoreTimeEve({ dispatch, commit }, params) {
      let res = await getStoreTimeEve(params);
      return res;
    },
    //获取店面排班(特定)
    async GetStoreTimeSpe({ dispatch, commit }, params) {
      let res = await getStoreTimeSpe(params);
      return res;
    }
  }
};

export default storeList;
