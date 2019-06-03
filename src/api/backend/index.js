import { axiosPost } from "@/utils/api";

/**
* 所有的翻译
* @link  url/api/admin/lang/lang_all
*/
export function lang_all(query) {
  return axiosPost("/api/admin/lang/lang_all", query);
}

/**
* 翻译列表
* @param page
* @param limit
* @param table_name
* @link  url/api/admin/lang/lang_list
*/
export function lang_list(query) {
  return axiosPost("/api/admin/lang/lang_list", query);
}

/**
* 所有的语言列表
* @param page
* @param limit
* @param table_name
* @link  url/api/admin/lang_options
*/
export function lang_options(query) {
  return axiosPost("/api/admin/lang_options", query);
}

/**
* 翻译具体详细列表
* @param page
* @param limit
* @param table_name
* @param id
* @link  url/api/admin/lang/lang_translate_list
*/
export function lang_translate_list(query) {
  return axiosPost("/api/admin/lang/lang_translate_list", query);
}

/**
* 添加翻译
* @param table_name
* @link  url/api/admin/lang/lang_add
*/
export function lang_add(query) {
  return axiosPost("/api/admin/lang/lang_add", query);
}

/**
* 编辑翻译
* @param table_name
* @param id
* @link  url/api/admin/lang/lang_update
*/
export function lang_update(query) {
  return axiosPost("/api/admin/lang/lang_update", query);
}

/**
* 编辑某个表数据库表的翻译
* @param table_name
* @param id
* @link  url/api/admin/lang/lang_translate_update
*/
export function lang_translate_update(query) {
  return axiosPost("/api/admin/lang/lang_translate_update", query);
}




