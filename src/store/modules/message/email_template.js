import {
  getEmailTemList,
  getLangSelect,
  newEmailTem,
  updateMailStatus,
  updateLanguages,
  getMailInfo,
  editEmailTem,
  editEmailHtml,
  getEmailHtml,
  getEmailHistory,
  textSend,
  getHtmlById,
  getTemOptions,
  insertTemToSearch,
  insertTemHtml
} from "@/api/message/email_template";
const emailTem = {
  state: {},
  mutations: {},
  actions: {
    //status
    async UpdateMailStatus({ dispatch, commit }, params) {
      let res = await updateMailStatus(params);
      return res;
    },
    //lang
    async GetLangSelect({ dispatch, commit }, params) {
      let res = await getLangSelect(params);
      return res;
    },
    //setlang
    async UpdateLanguages({ dispatch, commit }, params) {
      let res = await updateLanguages(params);
      return res;
    },
    //Info
    async GetMailInfo({ dispatch, commit }, params) {
      let res = await getMailInfo(params);
      return res;
    },
    //获取邮件模板列表
    async GetEmailTemList({ dispatch, commit }, params) {
      let res = await getEmailTemList(params);
      return res;
    },
    //新增
    async NewEmailTem({ dispatch, commit }, params) {
      let res = await newEmailTem(params);
      return res;
    },
    //edit
    async EditEmailTem({ dispatch, commit }, params) {
      let res = await editEmailTem(params);
      return res;
    },
    //editHtml
    async EditEmailHtml({ dispatch, commit }, params) {
      let res = await editEmailHtml(params);
      return res;
    },
    //getHtml
    async GetEmailHtml({ dispatch, commit }, params) {
      let res = await getEmailHtml(params);
      return res;
    },
    //getHistory
    async GetEmailHistory({ dispatch, commit }, params) {
      let res = await getEmailHistory(params);
      return res;
    },
    //textSend
    async TextSend({ dispatch, commit }, params) {
      let res = await textSend(params);
      return res;
    },
    //getHtmlById
    async GetHtmlById({ dispatch, commit }, params) {
      let res = await getHtmlById(params);
      return res;
    },
    //getTemOptions
    async GetTemOptions({ dispatch, commit }, params) {
      let res = await getTemOptions(params);
      return res;
    },
    //insertTemToSearch
    async InsertTemToSearch({ dispatch, commit }, params) {
      let res = await insertTemToSearch(params);
      return res;
    },
    //insertTemHtml
    async InsertTemHtml({ dispatch, commit }, params) {
      let res = await insertTemHtml(params);
      return res;
    },
  }
};

export default emailTem;
