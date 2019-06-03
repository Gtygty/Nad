import {used_system_cate} from "@/mock/common_options";
import {groupOptions} from "@/mock/groupOptions";
import {members} from "@/mock/members";
import {membersId} from "@/mock/membersId";
import {axiosFormData, axiosPost} from "@/utils/api";



//获取公共下拉数据
export function getCommonSelect(query) {
  // return axiosPost("/api/admin/common_options", query);
  return used_system_cate
}

//获取账户列表
export function getAdminList(query) {
  // return axiosGet("/api/admin/members", query);
  return members;
}
//获取组下拉列表
export function getGroupOpList(query) {
  // return axiosGet("/api/admin/groupOptions", query);
  return groupOptions;
}
//新增账户
export function creatAdmin(query) {
  return axiosFormData("/api/admin/members", query);
}
//账户详情
export function getAdminInfo(query) {
  // return axiosGet(`/api/admin/members/${query.id}`, query.params);
  return membersId;
}
//编辑账户
export function editAdmin(query) {
  return axiosFormData(`/api/admin/members/${query.id}`, query.params);
}
//删除账户
export function deleteAdmin(query) {
  return axiosPost(`/api/admin/members/${query.id}`, query.params);
}
//修改账户密码
export function changeAdminPassword(query) {
  return axiosPost(`/api/admin/members/modifyPassword/${query.id}`, query.params);
}
//修改UserInfo
export function changeUserInfo(query) {
  return axiosPost(`/api/admin/members/modify/${query.id}`, query.params);
}

