<template>
  <div class="db_translate">
    <transition name="com-fade">
      <div v-if="!modalType">
        <Form :model="seachParams" inline style="text-align:left;height:40px">
          <Select label-in-value v-model="seachParams.table_name" filterable :placeholder="this.$t('backend.selectDb')" @on-change="reloadTable" style="width:240px">
            <Option v-for="item in StoreOptions" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
          <!-- <Select label-in-value v-model="seachParams.with" filterable :placeholder="$t('backend.selectLang')" @on-change="reloadTable" style="width:240px">
            <Option v-for="(item,index) in withOptions" :value="item.locale" :key="index">{{ item.name }}</Option>
          </Select> -->
        </Form>
        <Dropdown trigger="hover" class="btn-toolbar pull-right">
          <Icon type="md-settings" size="16"/>
          <DropdownMenu slot="list" style="text-align:left;margin-left:10px">
            <Checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
              <Checkbox :label="index" v-for="(item,index) in dbFieldOptions" :key="index">{{item}}</Checkbox>
            </Checkbox-group>
          </DropdownMenu>
        </Dropdown>
        <div style="text-align:center;width:100%">
          <Spin fix  v-if="spinShow" style="z-index:1000">
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
          </Spin>
          <Table class="m_t_10" border :columns="tableColumns" :data="MailListData" :height="dynamicHeight"></Table>
          <div class="com-footer-right">
            <Icon type="md-refresh-circle" size="20" class="com-refresh" @click="Refresh()"/>
            <Page
              simple
              :total="count"
              :page-size="seachParams.limit"
              :current="seachParams.page"
              @on-change="handleCurrentChange"
              @on-page-size-change="handlePageSizeChange"
              show-elevator
              show-sizer
              show-total
            />
          </div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div v-show="modalType" style="text-align: left;">
        <langDesc @cancelAdd="cancelAdd" :rowInfo="rowInfo" ref="descRef" :modalType.sync="modalType" :foreign_name="foreign_name" />
      </div>
    </transition>
    <Modal
      v-model="dbModal"
      scrollable
      :title="dbModalObj.title"
      label-width="50"
      @on-ok="submit"
      @on-cancel="cancel"
      class-name="db_modal"
      :mask-closable="false"
      width="700">
        <div class="db_form">
          <Form
            ref="db_form"
            :model="db_form"
            label-position="left"
            :rules="formRules"
            :label-width="100"
            inline>
            <FormItem :label="item" :prop="index" v-for="(item,index) in formOptions" :key="index">
              <Input v-model="db_form[index]" :placeholder="`${$t('PleaseEnterThe')}${item}`"></Input>
            </FormItem>
          </Form>
        </div>
      <div slot="footer">
        <Button size="small" type="dashed" @click="cancel">{{$t('Cancel')}}</Button>
        <Button type="primary" size="small" @click="submit" :loading="dbLoading">{{$t('Apply')}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage , IsLoading } from "@/utils/api";
import tinymce from "@/components/tinymce.vue";
import langDesc from "@/components/backend/langDesc.vue";
export default {
  name: "db_translate",
  components: {
    tinymce,langDesc
  },
  data() {
    return {
      currentId: null,
      dbLoading: false,
      dbModal: false,
      dbModalObj: {
        modalType: '',
        title: ''
      },
      db_form: {},
      formRules: {},
      formOptions: {},
      foreign_name: '',
      rowInfo: {},
      spinShow:false,
      templateOptions: [],
      AccountId: null,
      title: this.$t("Create"),
      MailListData: [],
      tableColumns: [],
      baseColumns: {},
      tableColumnsChecked: [
        /* "id",
        "menu_name",
        "menu_desc",
        "status",
        "Operating" */
      ],
      dbFieldOptions: [],
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      modalType: false,
      modalSend: false,
      modalSeach: false,
      modalTypeLang: false,
      count: 0, //分页总数total
      seachParams: { 
        limit: 20, 
        page: 1,
        /* template_key:"",
        name:"",
        tags:[], */
        table_name: 'ba_country_lang',
        with: 'langEn,langZh'
      }, //获取table列表时的参数
      withOptions: [],
      seachTags:{used_system_cate:[],used_business_cate:[],used_to_cate:[]},
      StoreOptions: [],
      LangOptions: [],
      EditLangOptions: [],
      sendLangOptions: [],
      SystemOptions: [],
      BusienssOptions: [],
      SendObj: {
        data_email: "",
        to_email: "",
        to_name: "",
        lang: ""
      },
      ParametricObj: {
        template_key: "",
        name: "",
        desc: "",
        subject: "",
        from_name: "",
        from_email: "",
        reply_to_email: "",
        bcc_users: "",
        bcc_emails: "",
        used_system_cate_id: [],
        used_business_cate_id: [],
        used_to_id: [],
        html_template: "",
        lang: "",
        locale: ""
      },
      resetRule: {
        template_key: [
          {
            required: true,
            type: "string",
            message: `${this.$t("PleaseEnterThe")}${this.$t("templatekey")}`,
            trigger: "blur"
          }
        ],
        desc: [
          {
            required: true,
            type: "string",
            message: `${this.$t("PleaseEnterThe")}${this.$t("description")}`,
            trigger: "blur"
          }
        ],
        subject: [
          {
            required: true,
            type: "string",
            message: `${this.$t("PleaseEnterThe")}${this.$t("subject")}`,
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            type: "string",
            message: `${this.$t("PleaseEnterThe")}${this.$t("Name")}`,
            trigger: "blur"
          }
        ],
        lang: [
          {
            required: true,
            type: "string",
            message: `${this.$t("PleaseChooseThe")}${this.$t(
              "admin.language"
            )}`,
            trigger: "change"
          }
        ],
        data_email: [
          {
            required: true,
            type: "string",
            message: `${this.$t("PleaseEnterThe")}}`,
            trigger: "blur"
          }
        ],
        to_name: [
          {
            required: true,
            type: "string",
            message: `${this.$t("PleaseEnterThe")}${this.$t("to_name")}`,
            trigger: "blur"
          }
        ],
        to_email: [
          {
            required: true,
            type: "string",
            message: `${this.$t("PleaseEnterThe")}${this.$t("to_email")}`,
            trigger: "blur"
          }
        ],
        from_name: [
          {
            required: true,
            type: "string",
            message: `${this.$t("PleaseEnterThe")}${this.$t("sender")}`,
            trigger: "blur"
          }
        ],
        from_email: [
          {
            required: true,
            message: `${this.$t("PleaseEnterThe")}${this.$t("SenderMail")}`,
            trigger: "blur"
          },
          {
            required: true,
            type: "email",
            message: this.$t("WrongFormat"),
            trigger: "blur"
          }
        ],
        reply_to_email: [
          {
            required: true,
            message: `${this.$t("PleaseEnterThe")}${this.$t("ReplyMail")}`,
            trigger: "blur"
          },
          {
            required: true,
            type: "email",
            message: this.$t("WrongFormat"),
            trigger: "blur"
          }
        ],
        bcc_users: [
          {
            required: true,
            type: "string",
            message: `${this.$t("PleaseEnterThe")}${this.$t("Bcc")}`,
            trigger: "blur"
          }
        ],
        bcc_emails: [
          {
            required: true,
            message: `${this.$t("PleaseEnterThe")}${this.$t("Bccmails")}`,
            trigger: "blur"
          },
          {
            required: true,
            type: "email",
            message: this.$t("WrongFormat"),
            trigger: "blur"
          }
        ],
        used_system_cate_id: [
          {
            required: true,
            type: "array",
            message: `${this.$t("PleaseChooseThe")}${this.$t("Group")}`,
            trigger: "change"
          }
        ],
        used_business_cate_id: [
          {
            required: true,
            type: "array",
            message: `${this.$t("PleaseChooseThe")}${this.$t(
              "ViewInstitution"
            )}`,
            trigger: "change"
          }
        ],
        used_to_id: [
          {
            required: true,
            type: "array",
            message: `${this.$t("PleaseEnterThe")}${this.$t("Remarks")}`,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submit(){
      this.$refs.db_form.validate( valid => {
          if(valid){
            let successFuc = res => {
              this.getInitData()
              this.$refs.db_form.resetFields();
              IsMessage("success", this.$t("Successful"));
              this.dbLoading = false
              this.dbModal = false
            };
            let elseFuc = () => {
              this.dbLoading = false
            };
            this.dbLoading = true
            switch(this.dbModalObj.modalType){
              case 'add': 
                break;
              case 'edit':
              let params = {
                ...this.db_form,
                id: this.currentId,
                table_name: this.seachParams.table_name
              }
              AjaxApi("lang_translate_update", params, successFuc, elseFuc);
              break;
            }
          }
        })
    },
    cancel(){
      this.$refs.db_form.resetFields();
      this.dbModal = false
    },
    reloadTable(value) {
      IsLoading();
      this.getInitData();
    },
    cancelSearch(){
      this.seachParams= { limit: 20, page: 1,template_key:"",name:"",tags:[] };
      this.seachTags={used_system_cate:[],used_business_cate:[],used_to_cate:[]};
      this.modalSeach=false;
    },
    Refresh(){
      this.spinShow=true;
      let successFuc = res => {
        res.data.data.forEach(item => {
          item.used_business_cate = item.used_business_cate + "";
          item.used_system_cate = item.used_system_cate + "";
          item.used_to_cate = item.used_to_cate + "";
        });
        this.MailListData = res.data.data;
        this.count = res.data.count;
        this.$nextTick(()=>{
          this.spinShow=false;
        })
      };
      let elseFuc = () => {
        this.spinShow=false;
      };
      AjaxApi("GetEmailTemList", this.seachParams, successFuc, elseFuc);
    },
    SelectLang(data) {
      this.ParametricObj.lang = data.value;
      this.ParametricObj.locale = data.label;
      if (this.title === this.$t("Create")) {
        return;
      }
      let _params = {
        template_id: this.AccountId,
        lang: this.ParametricObj.lang,
        locale: this.ParametricObj.locale
      };
      let successFuc = res => {
        this.ParametricObj.html_template = res.data.html_template;
      };
      let elseFuc = () => {
        this.ParametricObj.html_template = "";
      };
      AjaxApi("GetEmailHtml", _params, successFuc, elseFuc);
    },
    /* mockTableData() {
      if (!this.MailListData) {
        return [];
      }
      let data = [];
      function getNum() {
        return Math.floor(Math.random() * 10000 + 1);
      }
      for (let i = 0; i < 10; i++) {
        data.push({
          templatekey: getNum(),
          Name: getNum(),
          subject: getNum(),
          platform: getNum(),
          business: getNum(),
          Accepted: getNum(),
          language: getNum(),
          text: getNum(),
          Operating: getNum()
        });
      }
      return data;
    }, */
    getTableColumns(tData,allKeys) {
      this.baseColumns = allKeys.reduce( (obj,key) => {
        obj[key] = {
          title: tData.lang_columns[key],
          key: key,
          minWidth: 130,
          align: "center",
          tooltip: true,
          sortable: key === 'id' ? true : false
        }
        return obj
      },{})
      this.baseColumns['Operating'] = {
        title: this.$t("Operating"),
        minWidth: 80,
        fixed: "right",
        align: "center",
        render: (h, params) => {
            return h("div", [
              h("Button", {
                //查看
                attrs: {
                  title: this.$t('View')
                },
                props: {
                  type: "primary",
                  shape: "circle",
                  icon: "ios-eye",
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    //this.AccountId = params.row.id;
                    this.rowInfo = {
                      id: params.row.id,
                      table_name: this.seachParams.table_name,
                    };
                    this.$nextTick( () => {
                      this.$refs.descRef.getInitData()
                    })
                  }
                }
              }),
              h("Button", {
                  //编辑
                  attrs: {
                    title: this.$t("Edit")
                  },
                  props: {
                    type: "primary",
                    shape: "circle",
                    icon: "md-create",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.dbModal = true
                      this.dbModalObj = {
                        modalType: 'edit',
                        title: this.$t('Edit')
                      }
                      this.currentId = params.row.id
                      Object.keys(this.db_form).map( v => {
                        this.db_form[v] = params.row[v]
                      })
                    }
                  }
                }),
            ]);
          }
      }

      this.changeTableColumns()
      this.MailListData = tData.lang_list
      this.count = tData.count
      this.foreign_name = tData.foreign_name
    },
    changeTableColumns() {
      let data = [];
      this.tableColumnsChecked.forEach(col => data.push(this.baseColumns[col]));
      this.tableColumns = data
    },
    
    /* 按钮方法—————————————————————————————————————————————————————————— */
    
    validate_Send() {
      this.$refs.resetFormSend.validate(valid => {
        if (valid) {
          this.do_Send();
        }
      });
    },
    do_Send() {
      // let arrName = this.SendObj.to_name.split(",");
      let arrName = this.SendObj.to_email.split(",");
      let arrMail = this.SendObj.to_email.split(",");
      let data_email = [];
      if (arrName.length !== arrMail.length) {
        IsMessage("error", "Inconsistent number of mailboxes and names.");
        return;
      }
      for (let index = 0; index < arrName.length; index++) {
        data_email.push({
          to_name: arrName[index],
          to_email: arrMail[index]
        });
      }
      let _params = {
        template_id: this.AccountId,
        user_id:localStorage.getItem("userId"),
        data_email: data_email,
        lang: this.SendObj.lang
      };
      let successFuc = res => {
        IsMessage("success", this.$t("Successful"));
        this.cancelSend();
      };
      let elseFuc = res => {
        IsMessage("info", res.message);
        this.cancelSend();
      };
      AjaxApi("TextSend", _params, successFuc, elseFuc);
    },
    cancelSend() {
      this.title = "";
      this.SendObj = {
        data_email: "",
        to_email: "",
        to_name: "",
        lang: ""
      };
      this.AccountId = null;
      this.modalSend = false;
    },
    do_Lang() {
      let arr = JSON.parse(JSON.stringify(this.dataLang));
      const result = arr.map(item => {
        delete item.lang;
        delete item.locale;
        return item;
      });
      let successFuc = () => {
        IsMessage("success", this.$t("Successful"));
        this.cancelLang();
        this.getInitData();
      };
      let elseFuc = res => {
        IsMessage("error", res.message);
      };
      let params = {
        data: result
      };
      AjaxApi("UpdateLanguages", params, successFuc, elseFuc);
    },
    cancelLang() {
      this.modalTypeLang = false;
    },
    do_Add() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.this_do_Add();
        }
      });
    },
    //表单验证后确定编辑
    this_do_Add() {
      let successFuc = () => {
        IsMessage("success", this.$t("Successful"));
        this.cancelAdd();
        this.getInitData();
      };
      let elseFuc = () => {};
      if (this.title === this.$t("Create")) {
        let params = this.ParametricObj;
        AjaxApi("NewEmailTem", params, successFuc, elseFuc);
      } else {
        let params = {
          id: this.AccountId,
          params: this.ParametricObj
        };
        AjaxApi("EditEmailTem", params, successFuc, elseFuc);
      }
    },
    editMailHtml() {
      let params = {
        template_id: this.AccountId,
        template_key: this.ParametricObj.template_key,
        html_template: this.ParametricObj.html_template,
        lang: this.ParametricObj.lang,
        locale: this.ParametricObj.locale
      };
      let successFuc = () => {
        IsMessage("success", this.$t("Successful"));
        // this.cancelAdd();
        // this.getInitData();
      };
      let elseFuc = () => {};
      AjaxApi("EditEmailHtml", params, successFuc, elseFuc);
    },
    //编辑弹窗  点击取消的回调（重置表单验证）
    cancelAdd() {
      this.getInitData();
      this.$nextTick(()=>{
         this.modalType = false;
      })
      // this.$nextTick(() => {
      //   this.$refs["resetForm"].resetFields();
      // });
    },

    /* /按钮方法—————————————————————————————————————————————————————————— */

    //分页跳转方法
    handleCurrentChange(page) {
      this.seachParams.page = page;
      this.getInitData();
    },
    //分页页数改变
    handlePageSizeChange(limit) {
      this.seachParams.limit = limit;
      this.getInitData();
    },
    getStoreSelect() {
      let successFuc = res => {
        let arrData = [];
        Object.keys(res.data).forEach(function(key) {
          arrData.push({
            //value: key.toString(),
            value: res.data[key],
            label: res.data[key]
          });
        });
        this.StoreOptions = arrData;
      };
      let elseFuc = () => {};
      AjaxApi("lang_all", {}, successFuc, elseFuc);
    },
    getWithSelect(){
      let successFuc = res => {
        this.withOptions = res.data.data;
      };
      let elseFuc = () => {};
      AjaxApi("lang_options", {status: 1}, successFuc, elseFuc);
    },
    getLangSelect() {
      let successFuc = res => {
        this.LangOptions = res.data.data;
      };
      let elseFuc = () => {};
      AjaxApi("GetLangSelect", {}, successFuc, elseFuc);
    },
    getSystemSelect() {
      let successFuc = res => {
        this.SystemOptions = res.data.data;
      };
      let elseFuc = () => {};
      AjaxApi(
        "GetCommonSelect",
        { option_module: "used_system_cate" },
        successFuc,
        elseFuc
      );
    },
    getBusienssSelect() {
      let successFuc = res => {
        this.BusienssOptions = res.data.data;
      };
      let elseFuc = () => {};
      AjaxApi(
        "GetCommonSelect",
        { option_module: "used_business_cate" },
        successFuc,
        elseFuc
      );
    },
    getTemSelect() {
      let successFuc = res => {
        this.templateOptions = res.data;
      };
      let elseFuc = () => {};
      AjaxApi("GetTemOptions", {}, successFuc, elseFuc);
    },
    getUsedtoSelect() {
      let successFuc = res => {
        this.UsedtoOptions = res.data.data;
      };
      let elseFuc = () => {};
      AjaxApi(
        "GetCommonSelect",
        { option_module: "used_to_cate" },
        successFuc,
        elseFuc
      );
    },
    //获取初始table数据
    getInitData() {
      let successFuc = res => {
        this.tableColumnsChecked = Object.keys(res.data.lang_columns)
        this.tableColumnsChecked.push('Operating')
        this.dbFieldOptions = res.data.lang_columns
        this.getTableColumns(res.data,this.tableColumnsChecked)

        /* 定义表单 */
        this.formOptions = {}
        let allFormKeys = Object.keys(res.data.lang_columns_form)
        this.db_form = allFormKeys.reduce( (obj,v) => {
          obj[v] = '';
          return obj
        },{})
        /* 表单验证 */
        allFormKeys.map( v => {
          this.formRules[v] = [
            {
              required: true,
              type: "string",
              message: `${this.$t("isRequired")}`,
              trigger: "blur"
            }
          ]
        })
        /* 表单数据 */
        allFormKeys.filter( v => v !== 'id' && v !== 'menu_id').forEach( key => {
          this.formOptions[key] = res.data.lang_columns_form[key]
        })
      };
      let elseFuc = () => {};
      if(!this.seachParams.table_name){
        IsMessage("warning", this.$t('backend.selectDb'));
      }else{
        AjaxApi("lang_list", this.seachParams, successFuc, elseFuc);
      }
    },
    //动态table高度
    DynamicHeightFuc(Isvh) {
      this.dynamicHeight = String(Isvh - 140);
    }
  },
  mounted() {
    //this.changeTableColumns();
    //动态获取视窗高度
    this.clientHeight = document.documentElement.clientHeight;
    const that = this;
    window.onresize = function temp() {
      that.clientHeight = document.documentElement.clientHeight;
    };
  },
  watch: {
    // 如果 `clientHeight` 发生改变
    clientHeight: function() {
      this.DynamicHeightFuc(this.clientHeight);
    }
  },
  created() {
    this.getInitData();
    this.getStoreSelect();
    this.getTemSelect();
    this.getLangSelect();
    this.getSystemSelect();
    this.getBusienssSelect();
    this.getUsedtoSelect();
    this.getWithSelect();
  }
};
</script>

<style  lang="less" scoped>
.H1class {
  color: #fff;
  font-weight: bold;
  line-height: 69px;
  padding-left: 15px;
  font-size: 36px;
  clear: both;
  max-width: 75%;
  overflow-wrap: break-word;
  font-family: Lato, Calibri, "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-style: normal;
  font-variant-ligatures: normal;
  font-variant-caps: normal;
  letter-spacing: normal;
  orphans: 2;
  text-align: start;
  text-indent: 0px;
  text-transform: none;
  white-space: normal;
  widows: 2;
  word-spacing: 0px;
  -webkit-text-stroke-width: 0px;
  text-decoration-style: initial;
  text-decoration-color: initial;
}
</style>
<style  lang="less">
.users_Input_clear {
  .ivu-form-item-content {
    .ivu-input {
      width: 25vw;
    }
  }
  .ivu-input-icon-clear {
    margin-right: 50px;
  }
}
.btn-toolbar {
  cursor: pointer;
  position: absolute;
  top: 48px;
  right: 10px;
  z-index: 10;
  padding: 3px;
  margin: 0;
  background: #fff;
}
.pull-right {
  float: right !important;
}
.emailtem-center-modal {
  .ivu-form-item {
    margin-bottom: 18px;
  }
}
.email-center-modal {
  .ivu-radio-wrapper {
    margin-right: 0;
  }
}
#adminLang {
  .ivu-form-item-label {
    color: #fff;
  }
}
#adminLang2 {
  .ivu-form-item-label {
    color: #fff;
  }
}
.ivu-icon-ios-eye{
  font-size: 19px;
}
.db_modal{
  .ivu-modal-body{
    padding: 30px 80px;
    .db_form{
      .ivu-form-item{
        width: 100%;
      }
    }
  }
  .ivu-btn > .ivu-icon{
    font-size: 12px;
  }
}
</style>