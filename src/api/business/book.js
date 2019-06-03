import { axiosPost } from "@/utils/api";

//根据手机号或者邮箱 搜索客户
export function getUserByEmailMob(query) {
  return axiosPost("/api/admin/users/get_user_mobile_email", query);
}

/**
* 国家列表
* @link  url/api/admin/country
*/
export function getCountry(query) {
  return axiosPost("/api/admin/country", query);
}
