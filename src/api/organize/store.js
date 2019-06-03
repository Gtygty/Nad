import {daily_show_data} from "@/mock/daily_show_data";
import {stores_list} from "@/mock/stores_list";
import {tree_list} from "@/mock/tree_list";
import {weekly_show_data} from "@/mock/weekly_show_data";
import {axiosFormData, axiosPost} from "@/utils/api";

//获取店面列表
export function getStoreList(query) {
  // return axiosPost("/api/admin/stores/stores_list", query);
  return stores_list;
}
//新增店面
export function postNewStore(query) {
  return axiosFormData("/api/admin/stores", query);
}
//修改店面
export function postEditStore(query) {
  return axiosFormData(`/api/admin/stores/${query.id}`, query.params);
}
//树状列表
export function postTreeList(query) {
  // return axiosPost("/api/admin/stores/tree_list", query);
  return tree_list;
}
//店面排班(星期)
export function setStoreTimeEve(query) {
  return axiosPost("/api/admin/stores/arrange_everyday", query);
}
//店面排班(特定)
export function setStoreTimeSpe(query) {
  return axiosPost("/api/admin/stores/arrange_specific", query);
}
//获取店面排班(星期)
export function getStoreTimeEve(query) {
  return axiosPost("/api/admin/stores/arrange_everyday_list", query);
}
//获取店面排班(特定)
export function getStoreTimeSpe(query) {
  return axiosPost("/api/admin/stores/arrange_specific_list", query);
}

/**
* daily_show
* @param store_id
* @param daily 2019-01-01
* @link  url/api/admin/stores/daily_show
*/
export function store_daily_show(query) {
  // return axiosPost("/api/admin/stores/daily_show", query);
  return daily_show_data;
}

/**
* daily_set
* @param store_id
* @param daily 2019-01-01
* @link  url/api/admin/stores/daily_set
*/
export function store_daily_set(query) {
  return axiosPost("/api/admin/stores/daily_set", query);
}

/**
* weekly_show
* @param store_id
* @param weekly
* @link  url/api/admin/stores/weekly_show
*/
export function store_weekly_show(query) {
  // return axiosPost("/api/admin/stores/weekly_show", query);
  return weekly_show_data;
}

/**
* weekly_set
* @param store_id
* @param weekly
* @param free_time
* @link  url/api/admin/stores/weekly_set
*/
export function store_weekly_set(query) {
  return axiosPost("/api/admin/stores/weekly_set", query);
}


