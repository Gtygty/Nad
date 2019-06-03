import { axiosPost } from "@/utils/api";

//获取部门列表
export function getDepartmentList(query) {
  return axiosPost("/api/admin/get_department_list", query);
}
