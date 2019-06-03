import {email_templates_history_list} from "@/mock/email_templates_history_list";
import {email_templates_list} from "@/mock/email_templates_list";
import {email_template_all} from "@/mock/email_template_all";
import {history_details} from "@/mock/history_details";
import {isok} from "@/mock/isok";
import {axiosPost} from "@/utils/api";

//获取账户列表
export function getEmailTemList(query) {
  // return axiosPost("api/admin/email_templates/email_templates_list", query);
  return email_templates_list;
}
//status
export function updateMailStatus(query) {
  // return axiosPost("api/admin/email_templates/updateStatus", query);
  return isok;
}
//lang
export function getLangSelect(query) {
  // return axiosPost("api/admin/lang_options", query);
  return { code: "2000", message: "成功",data:{data:[{id:1,locale:"en",name:"英文"}]}}
}
//setlang
export function updateLanguages(query) {
  return axiosPost("api/admin/email_templates/updateLanguages", query);
}
//info
export function getMailInfo(query) {
  return axiosPost("api/admin/email_templates/details", query);
}
//新增
export function newEmailTem(query) {
  return axiosPost("api/admin/email_templates", query);
}
//edit
export function editEmailTem(query) {
  return axiosPost(`/api/admin/email_templates/${query.id}`, query.params);
}
//editHtml
export function editEmailHtml(query) {
  return axiosPost(`api/admin/email_templates/set_language`, query);
}
//getHtml
export function getEmailHtml(query) {
  return axiosPost(`api/admin/email_templates/get_email_language_html`, query);
}
//getHistoryList
export function getEmailHistory(query) {
  // return axiosPost(`api/admin/email_templates/email_templates_history_list`, query);
  return email_templates_history_list;
}
//text send
export function textSend(query) {
  return axiosPost(`api/admin/email_templates/send_email`, query);
}
//getHtmlById
export function getHtmlById(query) {
  // return axiosPost(`api/admin/email_templates/history_details`, query);
  return history_details;
}
//gettemOptions
export function getTemOptions(query) {
  // return axiosPost(`api/admin/email_templates/email_template_all`, query);
  return email_template_all;
}
//InsertTemToSearch
export function insertTemToSearch(query) {
  return axiosPost(`api/admin/email_templates/email_templates_key_name`, query);
}
//InsertTemHtml
export function insertTemHtml(query) {
  return axiosPost(`api/admin/email_templates/email_templates_lang_html`, query);
}
