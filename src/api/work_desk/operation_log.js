import {operation_log} from "@/mock/operation_log";

//获取日志列表
export function getLogList(query) {
  // return axiosPost("/api/admin/operation_log", query);
  return operation_log;
}
