import {
  lang_all,
  lang_list,
  lang_options,
  lang_translate_list,
  lang_add,
  lang_update,
  lang_translate_update
} from "@/api/backend";
const inventory = {
  state: {},
  mutations: {},
  actions: {
    // 所有的翻译
    async lang_all({ dispatch, commit }, params) {
      let res = await lang_all(params);
      return res;
    },
    // 翻译列表
    async lang_list({ dispatch, commit }, params) {
      let res = await lang_list(params);
      return res;
    },
    // 所有的语言列表
    async lang_options({ dispatch, commit }, params) {
      let res = await lang_options(params);
      return res;
    },
    // 翻译具体详细列表
    async lang_translate_list({ dispatch, commit }, params) {
      let res = await lang_translate_list(params);
      return res;
    },
    // 添加翻译
    async lang_add({ dispatch, commit }, params) {
      let res = await lang_add(params);
      return res;
    },
    // 编辑翻译
    async lang_update({ dispatch, commit }, params) {
      let res = await lang_update(params);
      return res;
    },
    // 编辑某个表数据库表的翻译
    async lang_translate_update({ dispatch, commit }, params) {
      let res = await lang_translate_update(params);
      return res;
    }
  }
};

export default inventory;
