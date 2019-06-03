import { axiosPost } from "@/utils/api";

//获取盘点列表
export function getChangeList(query) {
  return axiosPost("/api/admin/clinic_list", query);
}
