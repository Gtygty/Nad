import {get_menu} from "@/mock/get_menu";
import {get_user_info} from "@/mock/get_user_info";
import {login} from "@/mock/login";

export function crmLogin(query) {
  // return axiosPost("/api/auth/login", query); //gty登录
  return login //gty登录
}

/**
 * get_all_menu
 * @param access_token
 * @link http://192.168.1.114:666/crm_load/get_all_menu
 */

export function getAllMenu(query) {
  // return axiosPost("/api/admin/get_menu", query);
  return get_menu;
  // return axiosPost("/crm_load/get_all_menu", query);
}
//获取用户详情
export function getUserInfo(query) {
  // return axiosPost("/api/admin/get_user_info", query);
  return get_user_info;
}
