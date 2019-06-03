import {users_list} from "@/mock/users_list";
import {axiosFormData} from "@/utils/api";

//获取客户列表
export function getUsersList(query) {
  // return axiosPost("/api/admin/users/users_list", query);
  return users_list;
}

/**
* 客户导入数据【Excel】
* @link  url/api/admin/excel/user_excel_import
*/
export function user_excel_import(query) {
  return axiosFormData("/api/admin/excel/user_excel_import", query);
}

