import {used_to_cate} from "@/mock/common_options";
import {get_goods_by_code} from "@/mock/get_goods_by_code";
import {get_goods_category} from "@/mock/get_goods_category";
import {purchase_list} from "@/mock/purchase_list";
import {axiosPost} from "@/utils/api";

//获取采购列表
export function getPurchaseList(query) {
  // return axiosPost("/api/admin/purchase/purchase_list", query);
  return purchase_list;
}
//生成进货单
export function addPurchase(query) {
  return axiosPost("/api/admin/inventory/purchase/add", query);
}
//获取treedata数据（分类加商品）
export function getPurchaseNode(query) {
  // return axiosPost("/api/admin/get_goods_category", query);
  return get_goods_category;
}
//根据code获取商品
export function getGoodsByCode(query) {
  // return axiosPost("/api/admin/get_goods_by_code", query);
  return get_goods_by_code;
}
//采购单据明细
export function getPurchaseInfo(query) {
  // return axiosPost("/api/admin/purchase/purchase_info", query);
  return purchase_list;
}
//获取创建人下拉数据
export function getUserOption(query) {
  // return axiosPost("/api/admin/get_user_option", query);
  return used_to_cate;
}
//树状数据搜索
export function getGoodSearch(query) {
  return axiosPost("/api/admin/get_goods_category_search", query);
}
