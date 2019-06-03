import {inventory_list} from "@/mock/inventory_list";
import {transfer_info} from "@/mock/transfer_info";
import {transfer_list} from "@/mock/transfer_list";
import {axiosPost} from "@/utils/api";

//根据storid获取商品列表（也是库存列表）
export function getInventoryListById(query) {
  // return axiosPost("/api/admin/inventory/inventory_list", query);
  return inventory_list;
}
//调入|调出
export function addTransferBill(query) {
  return axiosPost("/api/admin/inventory/transfer/add", query);
}
//调拨单据明细
export function getTransferInfo(query) {
  // return axiosPost("/api/admin/transfer/transfer_info", query);
  return transfer_info;
}
//列表
export function getTransferList(query) {
  // return axiosPost("/api/admin/transfer/transfer_list", query);
  return transfer_list;
}
