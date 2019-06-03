import {daily_show_data} from "@/mock/daily_show_data";
import {doctor_option} from "@/mock/doctor_option";
import {nurses} from "@/mock/nurses";
import {store_option} from "@/mock/store_option";
import {weekly_show_data} from "@/mock/weekly_show_data";
import {axiosPost} from "@/utils/api";

//获取护士列表
export function getNurseList(query) {
  // return axiosGet("/api/admin/nurses", query);
  return nurses;
}
//新增或修改护士
export function addOrNurse(query) {
  return axiosPost("/api/admin/nurse_add_update", query);
}
//删除护士
export function deleteNurse(query) {
  return axiosPost("/api/admin/nurse_destroy", query);
}
//医生住址下拉
export function docAdress(query) {
  return axiosPost("/api/admin/address_list", query);
}
//医生下拉
export function docSelect(query) {
  // return axiosPost("/api/admin/doctor_option", query);
  return doctor_option;
}
//门店下拉
export function storeSelect(query) {
  // return axiosPost("/api/admin/store_option", query);
  return store_option;
}
//护士排班（星期）
export function setTimeEve(query) {
  return axiosPost("/api/admin/nurse/arrange_everyday", query);
}
//护士排班（特殊）
export function setTimeDate(query) {
  return axiosPost("/api/admin/nurse/arrange_specific", query);
}
//获取护士排班（星期）
export function getTimeEve(query) {
  return axiosPost("/api/admin/nurse/arrange_everyday_list", query);
}
//获取护士排班（特殊）
export function getTimeDate(query) {
  return axiosPost("/api/admin/nurse/arrange_specific_list", query);
}

/**
* daily_show
* @param nurse_id
* @param daily 2019-01-01
* @link  url/api/admin/nurse/daily_show
*/
export function daily_show(query) {
  // return axiosPost("/api/admin/nurse/daily_show", query);
  return daily_show_data;
}

/**
* daily_set
* @param nurse_id
* @param daily 2019-01-01
* @param free_time
* @link  url/api/admin/nurse/daily_set
*/
export function daily_set(query) {
  return axiosPost("/api/admin/nurse/daily_set", query);
}

/**
* weekly_show
* @param nurse_id
* @param weekly 1-7
* @link  url/api/admin/nurse/weekly_show
*/
export function weekly_show(query) {
  // return axiosPost("/api/admin/nurse/weekly_show", query);
  return weekly_show_data;
}

/**
* weekly_set
* @param nurse_id
* @param weekly 1-7
* @param free_time
* @link  url/api/admin/nurse/weekly_set
*/
export function weekly_set(query) {
  return axiosPost("/api/admin/nurse/weekly_set", query);
}
