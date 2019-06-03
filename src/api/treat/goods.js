import {cate_list} from "@/mock/cate_list";
import {files} from "@/mock/files";
import {filesupdate} from "@/mock/filesupdate";
import {goods} from "@/mock/goods";
import {unit} from "@/mock/unit";
import {axiosFormData, axiosPost} from "@/utils/api";

//获取护理分类列表
export function getCategoryList(query) {
  // return axiosGet("/api/admin/goods", query);
  return goods;
}
//获取详情
export function getTreatDetails(query) {
  return axiosPost("/api/admin/treat_details", query);
}
//获取单位
export function getUnit(query) {
  // return axiosPost("/api/admin/unit", query);
  return unit;
}
//修改商品
export function updateTreat(query) {
  return axiosFormData(`api/admin/goods/${query.id}`, query.params);
}
//新增商品
export function creatNewGoods(query) {
  return axiosFormData("/api/admin/goods", query);
}
//富文本上传图片
export function updateImgTINY(query) {
  // return axiosFormData("api/admin/files", query);
  return filesupdate;
}
//富文本获取图片
export function getImgTINY(query) {
  // return axiosGet("api/admin/files", query);
  return files;
}
//富文本删除图片
export function deleteImgTINY(query) {
  return axiosPost(`api/admin/files/${query.id}`, query.params);
}
//获取编辑时绑定的商品
export function getGoodsDetail(query) {
  return axiosPost("/api/admin/goods_detail", query);
}
//获取分类下拉框
export function getCateList(query) {
  // return axiosPost("/api/admin/cate_list", query);
  return cate_list;
}
//修改分类-商品发布-删除 action 1 是发布 2 修改分类 3 删除
export function updateActions(query) {
  return axiosPost("/api/admin/goods/operation", query);
}
//修改分类-商品发布-删除 action 1 是发布 2 修改分类 3 删除
export function deleteGoods(query) {
  return axiosPost("/api/admin/goods/destroy", query);
}
