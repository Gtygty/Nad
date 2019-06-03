<template>
  <div class="email_template">
    <transition name="com-fade">
      <div v-if="!modalType">
        <Form :model="seachParams" inline style="text-align:left;height:30px">
          <FormItem>
            <Button type="primary" @click="addModel">{{$t('New')}}</Button>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="modalSeach=true">{{$t('search')}}</Button>
          </FormItem>
        </Form>
        <Dropdown trigger="hover" class="btn-toolbar pull-right">
          <Icon type="md-settings" size="16"/>
          <DropdownMenu slot="list" style="text-align:left;margin-left:10px">
            <Checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
              <Checkbox label="templatekey">{{$t('templatekey')}}</Checkbox>
              <Checkbox label="Name">{{$t('Name')}}</Checkbox>
              <Checkbox label="subject">{{$t('subject')}}</Checkbox>
              <Checkbox label="platform">{{$t('platform')}}</Checkbox>
              <Checkbox label="business">{{$t('business')}}</Checkbox>
              <Checkbox label="Accepted">{{$t('Accepted')}}</Checkbox>
            </Checkbox-group>
          </DropdownMenu>
        </Dropdown>
        <div style="text-align:center;width:100%">
          <Spin fix v-if="spinShow" style="z-index:1000">
            <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
          </Spin>
          <Table
            class="m_t_10"
            border
            :columns="tableColumns"
            :data="MailListData"
            :height="dynamicHeight"
          ></Table>
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
    <!-- search -->
    <div v-if="modalSeach">
      <Modal
        v-model="modalSeach"
        scrollable
        :title="$t('search')"
        label-width="50"
        @on-ok="searchFuc"
        @on-cancel="cancelSearch"
        :mask-closable="false"
        width="600"
      >
        <div>
          <Form v-if="modalSeach" :model="seachParams" label-position="left" :label-width="90">
            <FormItem :label="$t('templatekey')">
              <Input
                v-model="seachParams.template_key"
                type="textarea"
                :autosize="{minRows: 1,maxRows: 3}"
                :placeholder="`${this.$t('templatekey')}...`"
                style="width:95%"
              ></Input>
            </FormItem>
            <FormItem :label="$t('Template')">
              <Select v-model="seachParams.name" clearable filterable style="width:95%">
                <Option
                  v-for="(item,index) in templateOptions"
                  :value="item.name"
                  :key="index"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('platform')">
              <Select
                v-model="seachTags.used_system_cate"
                clearable
                multiple
                filterable
                style="width:95%"
              >
                <Option
                  v-for="(item,index) in SystemOptions"
                  :value="item.key"
                  :key="index"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('business')">
              <Select
                v-model="seachTags.used_business_cate"
                clearable
                multiple
                filterable
                style="width:95%"
              >
                <Option
                  v-for="(item,index) in BusienssOptions"
                  :value="item.key"
                  :key="index"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('Accepted')">
              <Select
                v-model="seachTags.used_to_cate"
                clearable
                multiple
                filterable
                style="width:95%"
              >
                <Option
                  v-for="(item,index) in UsedtoOptions"
                  :value="item.key"
                  :key="index"
                >{{ item.value }}</Option>
              </Select>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelSearch">{{$t('Cancel')}}</Button>
          <Button type="primary" size="small" @click="searchFuc">{{$t('Apply')}}</Button>
        </div>
      </Modal>
    </div>
    <!-- send -->
    <div v-if="modalSend">
      <Modal
        v-model="modalSend"
        scrollable
        :title="title"
        label-width="50"
        @on-ok="validate_Send"
        @on-cancel="cancelSend"
        :mask-closable="false"
        width="600"
      >
        <div>
          <Form
            v-if="modalSend"
            ref="resetFormSend"
            :model="SendObj"
            label-position="left"
            :rules="resetRule"
            :label-width="90"
          >
            <FormItem :label="$t('language')" prop="lang">
              <Select v-model="SendObj.lang" clearable filterable style="width:95%">
                <Option
                  v-for="(item,index) in sendLangOptions"
                  :value="item.lang"
                  :key="index"
                >{{ item.locale }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('to_email')" prop="to_email">
              <Input
                v-model="SendObj.to_email"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                :placeholder="`${this.$t('to_email')}...`"
                style="width:95%"
              ></Input>
            </FormItem>
            <!-- <FormItem :label="$t('to_name')" prop="to_name">
              <Input
                v-model="SendObj.to_name"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                :placeholder="`${$t('to_name')}...`"
                style="width:95%"
              ></Input>
            </FormItem>-->
          </Form>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelSend">{{$t('Cancel')}}</Button>
          <Button type="primary" size="small" @click="validate_Send">{{$t('Apply')}}</Button>
        </div>
      </Modal>
    </div>
    <!-- InsertModal-->
    <div>
      <Modal
        v-model="InsertModal"
        scrollable
        :title="$t('InsertTemplate')"
        :mask-closable="false"
        width="700"
        footer-hide
      >
        <div class="Tem_Input_clear">
          <Input
                    search
                    enter-button
                    clearable
                    :placeholder="$t('alertName')"
                    v-model="InsertTemSearch"
                    @on-search="InsertTemSearchFuc"
                    @on-clear="InsertTemSearchFuc"
                    :style="{width: focusWidth}"
                    onkeypress="if(event.keyCode == 13) return false;"
                    class="m_b_10"
                  ></Input>
          <Table border :columns="columnsInsert" :data="dataInsert" @on-row-click="InsertTem" :max-height='dynamicHeight-200'></Table>
        </div>
        <!-- <div slot="footer">
          <Button size="small" type="dashed" @click="cancelLang">{{$t('Cancel')}}</Button>
          <Button type="primary" size="small" @click="do_Lang">{{$t('Apply')}}</Button>
        </div> -->
      </Modal>
    </div>
    <!-- 修改语言-->
    <div v-if="modalTypeLang">
      <Modal
        v-model="modalTypeLang"
        scrollable
        :title="$t('admin.language')"
        label-width="50"
        @on-ok="do_Lang"
        @on-cancel="cancelLang"
        :mask-closable="false"
        width="700"
      >
        <div>
          <Table border :columns="columnsLang" :data="dataLang"></Table>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelLang">{{$t('Cancel')}}</Button>
          <Button type="primary" size="small" @click="do_Lang">{{$t('Apply')}}</Button>
        </div>
      </Modal>
    </div>
    <transition name="fade">
      <div v-show="modalType" style="text-align: left;">
        <Button type="primary" @click="cancelAdd">
          <Icon type="ios-arrow-back"></Icon>
          {{$t('goback')}}
        </Button>
        <Form
          v-if="modalType"
          ref="resetForm"
          :model="ParametricObj"
          :rules="resetRule"
          :label-width="100"
        >
          <Row :gutter="8">
            <Col span="24" :md="8">
              <FormItem :label="$t('templatekey')" prop="template_key">
                <Input
                  v-model="ParametricObj.template_key"
                  :placeholder="`${this.$t('templatekey')}...`"
                  :disabled="title===$t('Edit')"
                ></Input>
              </FormItem>
            </Col>
            <Col span="24" :md="8">
              <FormItem :label="$t('Name')" prop="name">
                <Input v-model="ParametricObj.name" :placeholder="`${$t('Name')}...`"></Input>
              </FormItem>
            </Col>
            <Col span="24" :md="8">
              <FormItem :label="$t('subject')" prop="subject">
                <Input v-model="ParametricObj.subject" :placeholder="`${$t('subject')}...`"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="24" :md="8">
              <FormItem :label="$t('sender')" prop="from_name">
                <Input v-model="ParametricObj.from_name" :placeholder="`${$t('sender')}...`"></Input>
              </FormItem>
            </Col>
            <Col span="24" :md="8">
              <FormItem :label="$t('SenderMail')" prop="from_email">
                <Input v-model="ParametricObj.from_email" :placeholder="`${$t('SenderMail')}...`"></Input>
              </FormItem>
            </Col>
            <Col span="24" :md="8">
              <FormItem :label="$t('ReplyMail')">
                <Input
                  v-model="ParametricObj.reply_to_email"
                  :placeholder="`${$t('ReplyMail')}...`"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="24" :md="8">
              <FormItem :label="$t('Bcc')">
                <Input v-model="ParametricObj.bcc_users" :placeholder="`${$t('Bcc')}...`"></Input>
              </FormItem>
            </Col>
            <Col span="24" :md="8">
              <FormItem :label="$t('Bccmails')">
                <Input v-model="ParametricObj.bcc_emails" :placeholder="`${$t('Bccmails')}...`"></Input>
              </FormItem>
            </Col>
            
          </Row>
          <Row :gutter="8">
            <Col span="24" :md="12">
              <FormItem :label="$t('platform')" prop="used_system_cate_id">
                <Select
                  v-model="ParametricObj.used_system_cate_id"
                  clearable
                  multiple
                  filterable
                >
                  <Option
                    v-for="(item,index) in SystemOptions"
                    :value="item.key"
                    :key="index"
                  >{{ item.value }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="24" :md="12">
              <FormItem :label="$t('business')" prop="used_business_cate_id">
                <Select
                  v-model="ParametricObj.used_business_cate_id"
                  clearable
                  multiple
                  filterable
                >
                  <Option
                    v-for="(item,index) in BusienssOptions"
                    :value="item.key"
                    :key="index"
                  >{{ item.value }}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="24" :md="12">
              <FormItem :label="$t('Accepted')" prop="used_to_id">
                <Select
                  v-model="ParametricObj.used_to_id"
                  clearable
                  multiple
                  filterable
                >
                  <Option
                    v-for="(item,index) in UsedtoOptions"
                    :value="item.key"
                    :key="index"
                  >{{ item.value }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row
            type="flex"
            justify="space-between"
            align="middle"
            class="code-row-bg"
            style="background-color: #5cadff;color#fff"
          >
            <Col span="8">
              <h1 class="H1class">{{$t('emailTem')}}</h1>
            </Col>
            <Col span="8" style="text-align:right">
              <Button @click="showInsert">{{$t('InsertTemplate')}}</Button>
            </Col>
            <Col span="8" style="padding-top:18px;">
              <FormItem
                v-show="title===$t('Create')"
                :label="$t('admin.language')"
                style="margin-bottom:18px;margin-right:10px"
                :label-width="80"
                prop="lang"
                id="adminLang"
              >
                <Select
                  v-model="ParametricObj.lang"
                  filterable
                  label-in-value
                  @on-change="SelectLang"
                >
                  <Option
                    v-for="item in LangOptions"
                    :value="item.locale"
                    :key="item.id"
                  >{{ item.name }}</Option>
                </Select>
              </FormItem>
              <FormItem
                v-show="title===$t('Edit')"
                :label="$t('admin.language')"
                style="margin-bottom:18px;margin-right:10px"
                :label-width="80"
                prop="lang"
                id="adminLang2"
              >
                <Select
                  v-model="ParametricObj.lang"
                  filterable
                  label-in-value
                  @on-change="SelectLang"
                >
                  <Option
                    v-for="item in EditLangOptions"
                    :value="item.locale"
                    :key="item.id"
                    :label="item.name"
                  >
                    <span v-show="item.status===1" style="float:left;color:#19be6b">
                      <Icon type="md-checkmark-circle-outline" size="16"/>
                    </span>
                    <span v-show="item.status===0" style="float:left;color:#ff9900">
                      <Icon type="md-close" size="16"/>
                    </span>
                    <span style="margin-left:5px">{{ item.name }}</span>
                  </Option>
                </Select>
              </FormItem>
            </Col>
          </Row>

          <tinymce
            v-model="ParametricObj.html_template"
            :with-credentials="false"
            :editorHeight="dynamicHeight-328"
          ></tinymce>
        </Form>

        <div style="text-align:right;margin:15px">
          <Button type="dashed" @click="cancelAdd" style="margin-right:5px">{{$t('Cancel')}}</Button>
          <Button
            type="success"
            @click="editMailHtml"
            style="margin-right:5px"
            v-if="title===$t('Edit')"
          >{{$t('SaveLanguage')}}</Button>
          <Button type="primary" @click="do_Add">{{$t('Apply')}}</Button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage } from "@/utils/api";
import tinymce from "@/components/tinymce.vue";
export default {
  name: "email_template",
  components: {
    tinymce
  },
  data() {
    return {
      InsertTemSearch:"",
      focusWidth:"100%",
      columnsInsert: [
        {
          title: this.$t("templatekey"),
          align: "center",
          key: "template_key",
          align: "center"
        },
        {
          title: this.$t("Name"),
          key: "name",
          align: "center"
        },
        {
          title: this.$t("Language"),
          key: "locale",
          align: "center"
        }
      ],
      columnsLang: [
        {
          title: this.$t("admin.language"),
          align: "center",
          key: "locale"
        },
        {
          title: this.$t("Enabled"),
          key: "status",
          width: 150,
          align: "center",
          render: (h, params) => {
            let vm = this;
            return h("div", [
              h("Radio", {
                props: {
                  trueValue: 1,
                  falseValue: 2,
                  size: "large",
                  value: vm.dataLang[params.index].status
                },
                on: {
                  "on-change": event => {
                    vm.dataLang[params.index].status = event;
                  }
                }
              })
            ]);
          }
        },
        {
          title: this.$t("Disabled"),
          key: "status",
          width: 110,
          align: "center",
          render: (h, params) => {
            let vm = this;
            return h("div", [
              h("Radio", {
                props: {
                  trueValue: 2,
                  falseValue: 1,
                  size: "large",
                  value: vm.dataLang[params.index].status
                },
                on: {
                  "on-change": event => {
                    vm.dataLang[params.index].status = event;
                  }
                }
              })
            ]);
          }
        }
      ],
      spinShow: false,
      InsertModal: false,
      dataLang: [],
      dataInsert: [],
      templateOptions: [],
      AccountId: null,
      title: this.$t("Create"),
      MailListData: this.mockTableData(),
      tableColumns: [],
      tableColumnsChecked: [
        "templatekey",
        "Name",
        "subject",
        "platform",
        "business",
        "Accepted",
        "language",
        "text",
        "Operating"
      ],
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      modalType: false,
      modalSend: false,
      modalSeach: false,
      modalTypeLang: false,
      count: 0, //分页总数total
      seachParams: { limit: 20, page: 1, template_key: "", name: "", tags: [] }, //获取table列表时的参数
      seachTags: {
        used_system_cate: [],
        used_business_cate: [],
        used_to_cate: []
      },
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
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("templatekey")}`,
            trigger: "blur"
          }
        ],
        desc: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("description")}`,
            trigger: "blur"
          }
        ],
        subject: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("subject")}`,
            trigger: "blur"
          }
        ],
        name: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("Name")}`,
            trigger: "blur"
          }
        ],
        lang: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
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
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}}`,
            trigger: "blur"
          }
        ],
        to_name: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("to_name")}`,
            trigger: "blur"
          }
        ],
        to_email: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("to_email")}`,
            trigger: "blur"
          }
        ],
        from_name: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
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
            pattern: /\s\S+|S+\s|\S/,
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
    InsertTem(row){
      let successFuc = res => {
        this.ParametricObj.html_template = res.data.html;
        this.$nextTick(()=>{
        this.InsertModal=false;
      })
      };
      let elseFuc = () => {};
      AjaxApi("InsertTemHtml", {html_id:row.html_id}, successFuc, elseFuc);
    },
    InsertTemSearchFuc(){
        let params = {
          template_key:this.InsertTemSearch,
          name:this.InsertTemSearch
        }
       let successFuc = res => {
        this.dataInsert = res.data;
        this.$nextTick(()=>{
        this.InsertModal=true;
      })
      };
      let elseFuc = () => {};
      AjaxApi("InsertTemToSearch", params, successFuc, elseFuc);
    },
    showInsert(){
      this.dataInsert=[];
      this.InsertTemSearch = "";
      this.InsertTemSearchFuc();
    },
    cancelSearch() {
      this.seachParams = {
        limit: 20,
        page: 1,
        template_key: "",
        name: "",
        tags: []
      };
      this.seachTags = {
        used_system_cate: [],
        used_business_cate: [],
        used_to_cate: []
      };
      this.modalSeach = false;
    },
    Refresh() {
      this.spinShow = true;
      let successFuc = res => {
        res.data.data.forEach(item => {
          item.used_business_cate = item.used_business_cate + "";
          item.used_system_cate = item.used_system_cate + "";
          item.used_to_cate = item.used_to_cate + "";
        });
        this.MailListData = res.data.data;
        this.count = res.data.count;
        this.$nextTick(() => {
          this.spinShow = false;
        });
      };
      let elseFuc = () => {
        this.spinShow = false;
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
    mockTableData() {
      if (!this.MailListData) {
        return [];
      }
      let data = [];
      function getNum() {
        return Math.floor(Math.random() * 10000 + 1);
      }
      for (let i = 0; i < 10; i++) {
        data.push({
          // index: i + 1,
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
    },
    getTableColumns() {
      const tableColumnList = {
        // index: {
        //   type: "index",
        //   width: 60,
        //   fixed: "left",
        //   align: "center"
        // },
        templatekey: {
          title: this.$t("templatekey"),
          key: "template_key",
          minWidth: 130,
          align: "center",
          tooltip: true,
          sortable: true
        },
        Name: {
          title: this.$t("Name"),
          align: "center",
          minWidth: 120,
          key: "name",
          tooltip: true,
          sortable: true
        },
        subject: {
          title: this.$t("subject"),
          align: "center",
          minWidth: 120,
          key: "subject",
          tooltip: true,
          sortable: true
        },
        platform: {
          title: this.$t("platform"),
          align: "center",
          minWidth: 120,
          key: "used_system_cate",
          tooltip: true,
          sortable: true
        },
        business: {
          title: this.$t("business"),
          align: "center",
          key: "used_business_cate",
          minWidth: 120,
          tooltip: true,
          sortable: true
        },
        Accepted: {
          title: this.$t("Accepted"),
          align: "center",
          key: "used_to_cate",
          minWidth: 150,
          tooltip: true,
          sortable: true
        },
        language: {
          title: this.$t("admin.language"),
          minWidth: 100,
          fixed: "right",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  attrs: {
                    title: this.$t("admin.language")
                  },
                  props: {
                    type: "text",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px",
                    padding: 0,
                    width: "60px"
                  },
                  on: {
                    click: () => {
                      this.title = "";
                      this.AccountId = params.row.id;
                      this.dataLang = params.row.template_language;
                      this.modalTypeLang = true;
                    }
                  }
                },
                [
                  h("Icon", {
                    props: {
                      type: "md-globe",
                      size: "23"
                    }
                  })
                ]
              )
            ]);
          }
        },
        text: {
          title: this.$t("text"),
          minWidth: 100,
          fixed: "right",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  attrs: {
                    title: this.$t("send")
                  },
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px",
                    padding: 0,
                    width: "60px"
                  },
                  on: {
                    click: () => {
                      this.title = this.$t("send");
                      this.AccountId = params.row.id;
                      this.sendLangOptions = params.row.template_language;
                      this.modalSend = true;
                    }
                  }
                },
                [
                  h("Icon", {
                    props: {
                      type: "md-paper-plane",
                      size: "23"
                    }
                  })
                ]
              )
            ]);
          }
        },
        Operating: {
          title: this.$t("Operating"),
          minWidth: 140,
          fixed: "right",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  attrs: {
                    title:
                      params.row.status === 1
                        ? this.$t("Enabled")
                        : this.$t("Disabled")
                  },
                  props: {
                    type: params.row.status === 1 ? "success" : "dashed",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px",
                    padding: 0
                  },
                  on: {
                    click: () => {
                      this.title = "";
                      this.AccountId = params.row.id;
                      let _params = {
                        template_id: [params.row.id],
                        status: params.row.status === 1 ? 2 : 1
                      };
                      params.row.status === 1
                        ? (params.row.status = 2)
                        : (params.row.status = 1);
                      let successFuc = res => {};
                      let elseFuc = () => {
                        params.row.status === 1
                          ? (params.row.status = 2)
                          : (params.row.status = 1);
                      };
                      AjaxApi("UpdateMailStatus", _params, successFuc, elseFuc);
                    }
                  }
                },
                [
                  h("Icon", {
                    props: {
                      type:
                        params.row.status === 1
                          ? "md-checkbox-outline"
                          : "md-qr-scanner",
                      size: "20"
                    }
                  })
                ]
              ),
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
                    this.AccountId = params.row.id;
                    let _params = {
                      id: params.row.id
                    };
                    let successFuc = res => {
                      this.title = this.$t("Edit");
                      res.data.used_business_cate_id = res.data.used_business_cate_id.map(
                        current => {
                          current = current + "";
                          return current;
                        }
                      );
                      res.data.used_system_cate_id = res.data.used_system_cate_id.map(
                        current => {
                          current = current + "";
                          return current;
                        }
                      );
                      this.EditLangOptions = res.data.lang_options;
                      res.data.used_to_id = res.data.used_to_id.map(current => {
                        current = current + "";
                        return current;
                      });
                      this.ParametricObj = {
                        _method: "PATCH",
                        template_key: res.data.template_key,
                        name: res.data.name,
                        desc: res.data.desc,
                        subject: res.data.subject,
                        from_name: res.data.from_name,
                        from_email: res.data.from_email,
                        reply_to_email: res.data.reply_to_email,
                        bcc_users: res.data.bcc_users,
                        bcc_emails: res.data.bcc_emails,
                        used_system_cate_id: res.data.used_system_cate_id,
                        used_business_cate_id: res.data.used_business_cate_id,
                        used_to_id: res.data.used_to_id,
                        html_template: res.data.html_template,
                        lang: "en",
                        locale: "英文"
                      };
                      this.$nextTick(() => {
                        this.modalType = true;
                      });
                    };
                    let elseFuc = () => {};
                    AjaxApi("GetMailInfo", _params, successFuc, elseFuc);
                  }
                }
              })

              // h("Button", {
              //   //删除
              //   attrs: {
              //     title: this.$t("Delete")
              //   },
              //   props: {
              //     type: "error",
              //     shape: "circle",
              //     icon: "md-close-circle",
              //     size: "small"
              //   },
              //   on: {
              //     click: () => {
              //       let deletdata = {
              //         id: params.row.id,
              //         params: { _method: "DELETE" }
              //       };
              //       let successFuc = () => {
              //         this.getInitData();
              //         IsMessage("success", this.$t("Deleted"));
              //       };
              //       let elseFuc = () => {};
              //       AjaxApi("DeleteAdmin", deletdata, successFuc, elseFuc);
              //     }
              //   }
              // })
            ]);
          }
        }
      };

      let data = [];
      this.tableColumnsChecked.forEach(col => data.push(tableColumnList[col]));
      return data;
    },
    changeTableColumns() {
      this.tableColumns = this.getTableColumns();
    },
    addModel() {
      this.title = this.$t("Create");
      this.ParametricObj = {
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
      };
      this.$nextTick(() => {
        this.modalType = true;
      });
    },
    /* 按钮方法—————————————————————————————————————————————————————————— */
    searchFuc() {
      this.seachParams.page = 1;
      for (const key in this.seachTags) {
        if (this.seachTags.hasOwnProperty(key)) {
          this.seachParams.tags = this.seachParams.tags.concat(
            this.seachTags[key]
          );
        }
      }
      let successFuc = res => {
        res.data.data.forEach(item => {
          item.used_business_cate = item.used_business_cate + "";
          item.used_system_cate = item.used_system_cate + "";
          item.used_to_cate = item.used_to_cate + "";
        });
        this.MailListData = res.data.data;
        this.count = res.data.count;
        this.cancelSearch();
        this.$nextTick(() => {
          this.modalSeach = false;
        });
      };
      let elseFuc = () => {};
      AjaxApi("GetEmailTemList", this.seachParams, successFuc, elseFuc);
    },
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
        user_id: localStorage.getItem("userId"),
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
      this.$nextTick(() => {
        this.modalType = false;
      });
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
            value: key.toString(),
            label: res.data[key]
          });
        });
        this.StoreOptions = arrData;
      };
      let elseFuc = () => {};
      AjaxApi("StoreSelect", {}, successFuc, elseFuc);
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
        this.$nextTick(()=>{
          res.data.data.forEach(item => {
          item.used_business_cate = item.used_business_cate + "";
          item.used_system_cate = item.used_system_cate + "";
          item.used_to_cate = item.used_to_cate + "";
        });
        this.MailListData = res.data.data;
        this.count = res.data.count;
        })
        
      };
      let elseFuc = () => {};
      AjaxApi("GetEmailTemList", this.seachParams, successFuc, elseFuc);
    },
    //动态table高度
    DynamicHeightFuc(Isvh) {
      this.dynamicHeight = String(Isvh - 140);
    }
  },
  mounted() {
    this.changeTableColumns();
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
    },
    // InsertTemSearch: function(val) {
    //   val?this.$set(this.focusWidth,1,"100%"):this.$set(this.focusWidth,1,"50%")
    // }
  },
  created() {
    this.getInitData();
    this.getStoreSelect();
    this.getTemSelect();
    this.getLangSelect();
    this.getSystemSelect();
    this.getBusienssSelect();
    this.getUsedtoSelect();
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
.Tem_Input_clear {
  .ivu-form-item-content {
    .ivu-input {
      width: 25vw;
    }
  }
  .ivu-input-icon-clear {
    margin-right: 50px;
  }
}
[v-cloak] {
  display:none !important;
}
</style>