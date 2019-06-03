import {get_menu} from "@/mock/get_menu";
import {users_list} from "@/mock/users_list";

/**
 * update_top_menu
 * @param access_token
 * @param top_menu[array]
 * @param un_top_menu[array]
 * @link http://192.168.1.114:666/crm_load/update_top_menu
 */

// export function updateTopMenu(query) {
//   return axiosPost("/crm_load/update_top_menu", query);
// }
export function updateTopMenu(query) {
  // return axiosPost("/api/admin/get_menu", query);
  return get_menu;
}
//获取用户列表
export function getUserList(query) {
  // return axiosPost("/api/admin/get_user_list", query);
  return users_list;
}
