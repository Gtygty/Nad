import { getLogList } from "@/api/work_desk/operation_log";
const operation_log = {
  state: {},
  mutations: {},
  actions: {
    //获取日志列表
    async GetLogList({ dispatch, commit }, params) {
      let res = await getLogList(params);
      return res;
    }
  }
};

export default operation_log;
