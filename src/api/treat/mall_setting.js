import {tag_all} from "@/mock/tag_all";
import {axiosPost} from "@/utils/api";

//获取商城列表
export function getShoppingMallList(query) {
  return axiosPost("/api/admin/goods_online/index", query);
}
//批量上下架
export function setMallStatus(query) {
  return axiosPost("/api/admin/goods/stand", query);
}
//获取标签
export function getMallTags(query) {
  // return axiosPost("/api/admin/tag/tag_all", query);
  return tag_all;
}
//打标签
export function setMallTags(query) {
  return axiosPost("/api/admin/goods/addTag", query);
}
//获取商品标签
export function getGoodTags(query) {
  return axiosPost("/api/admin/goods/detailTag", query);
}
