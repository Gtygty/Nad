import {
  deleteUserGroup,
  getAllGroup,
  editUserGroup,
  addUserGroup,
  getGroupFeature,
  addGroupFeat,
  addNewFeat,
  getDepartment,
  getUserByDepart,
  setUserByDepart
} from "@/api/dept";
import { CODE_OK } from "@/utils/api";
const dept = {
  state: {},
  mutations: {
    GETGROUP: (state, status) => {
      //分组数据
      state.GroupData = status;
    }
  },
  actions: {
    //删除用户组
    async DeleteGroup({ dispatch, commit }, params) {
      let res = await deleteUserGroup(params);
      if (res.code === "1005") {
        this.LogOut();
      } else {
        return res;
      }
    },
    //新增用户组
    async AddGroup({ dispatch, commit }, params) {
      let res = await addUserGroup(params);
      return res;
    },
    //修改用户组
    async EditGroup({ dispatch, commit }, params) {
      let res = await editUserGroup(params);
      return res;
    },
    //获取组权限
    async GetGroupFeature({ dispatch, commit }, params) {
      let res = await getGroupFeature(params);
      return res;
    },
    //修改组权限
    async AddGroupFeature({ dispatch, commit }, params) {
      let res = await addGroupFeat(params);
      return res;
    },
    //新增权限
    async AddNewFeature({ dispatch, commit }, params) {
      let res = await addNewFeat(params);
      return res;
    },
    //获取用户组部门和用户
    async GetGroupDepartment({ dispatch, commit }, params) {
      let res = await getDepartment(params);
      return res;
    },
    //根据部门获取用户
    async GetUserByDepart({ dispatch, commit }, params) {
      let res = await getUserByDepart(params);

      return res;
    },
    //根据部门设置用户
    async SetUserByDepart({ dispatch, commit }, params) {
      let res = await setUserByDepart(params);
      return res;
    },
    //获取用户组
    async GetGroup({ dispatch, commit }, params) {
      let res = await getAllGroup(params);
      if (res.code === CODE_OK) {
        return res.data;
      } else if (res.code !== CODE_OK) {
        console.log("分组状态码不为2000");
      }
    },

    LogOut() {
      localStorage.clear();
      location.href = "/";
    }
  }
};

export default dept;
