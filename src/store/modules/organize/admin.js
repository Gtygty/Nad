import {
  getCommonSelect,
  getAdminList,
  creatAdmin,
  getAdminInfo,
  editAdmin,
  deleteAdmin,
  changeAdminPassword,
  changeUserInfo,
  getGroupOpList
} from "@/api/organize/admin";
const account = {
  state: {},
  mutations: {},
  actions: {
    //获取公共下拉数据
    async GetCommonSelect({ dispatch, commit }, params) {
      let res = await getCommonSelect(params);
      return res;
    },
    //获取账户列表
    async GetAdminList({ dispatch, commit }, params) {
      let res = await getAdminList(params);
      return res;
    },
    //获取组下拉列表
    async GetGroupOpList({ dispatch, commit }, params) {
      let res = await getGroupOpList(params);
      return res;
    },
    //新增账户
    async CreatAdmin({ dispatch, commit }, params) {
      let res = await creatAdmin(params);
      return res;
    },
    //账户详情
    async GetAdminInfo({ dispatch, commit }, params) {
      let res = await getAdminInfo(params);
      return res;
    },
    //编辑账户
    async EditAdmin({ dispatch, commit }, params) {
      let res = await editAdmin(params);
      return res;
    },
    //删除账户
    async DeleteAdmin({ dispatch, commit }, params) {
      let res = await deleteAdmin(params);
      return res;
    },
    //修改账户密码
    async ChangeAdminPassword({ dispatch, commit }, params) {
      let res = await changeAdminPassword(params);
      return res;
    },
    //修改UserInfo
    async ChangeUserInfo({ dispatch, commit }, params) {
      let res = await changeUserInfo(params);
      return res;
    },
  }
};

export default account;
