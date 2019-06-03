import {doctor_list} from "@/mock/doctor_list";
import {axiosPost} from "@/utils/api";

//获取医生列表
export function getDocList(query) {
  // return axiosPost(`/api/admin/doctor_list`, query);
  return doctor_list;
}

//新增编辑
export function postAddOrUpdateDoc(query) {
  return axiosPost("/api/admin/doctor_add_update", query);
}
