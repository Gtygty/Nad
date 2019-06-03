import {inventory_history_list} from "@/mock/inventory_history_list";
import {inventory_info} from "@/mock/inventory_info";
import {axiosPost} from "@/utils/api";

//获取库存列表
export function getInventoryHisList(query) {
  // return axiosPost("/api/admin/inventory/inventory_history_list", query);
  return inventory_history_list;
}
//明细
export function getInventoryInfo(query) {
  // return axiosPost("/api/admin/inventory/inventory_info", query);
  return inventory_info;
}
//退货
export function getInventoryReduce(query) {
  return axiosPost("/api/admin/inventory/purchase/reduce", query);
}
//退货新
export function getInventoryBatReduce(query) {
  return axiosPost("/api/admin/inventory/purchase/batchReduce", query);
}
