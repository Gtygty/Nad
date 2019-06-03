import { axiosPost, axiosFormData } from "@/utils/api";

//新增
export function addCategory(query) {
  return axiosFormData("/api/admin/category", query);
}
//修改
export function postEditCategory(query) {
  return axiosFormData(`/api/admin/category/${query.id}`, query.params);
}
