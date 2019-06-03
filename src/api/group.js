import { axiosPost } from "@/utils/api";

//删除用户组
export function deleteUserGroup(query) {
  return axiosPost("/api/admin/delete_group", query);
}
//获取用户组列表
export function getAllGroup(query) {
  return axiosPost("/api/admin/group_list", query);
}
//修改用户组列表
export function editUserGroup(query) {
  return axiosPost("/api/admin/edit_group", query);
}
//添加用户组
export function addUserGroup(query) {
  return axiosPost("/api/admin/add_group", query);
}
//获取权限列表
export function getGroupFeature(query) {
  return axiosPost("/api/admin/feature_list", query);
}
//修改权限列表
export function addGroupFeat(query) {
  return axiosPost("/api/admin/set_feature_by_gruop", query);
}
//新增权限列表
export function addNewFeat(query) {
  return axiosPost("/api/admin/add_feature", query);
}
//获取部门和用户
export function getDepartment(query) {
  return axiosPost("/api/admin/get_group_department", query);
}
//根据部门获取用户
export function getUserByDepart(query) {
  return axiosPost("/api/admin/get_user_by_department", query);
}
//根据部门设置用户
export function setUserByDepart(query) {
  return axiosPost("/api/admin/set_user_by_department", query);
}
