<template>
  <div class="email_history">
    <transition name="com-fade">
      <div v-if="!modalType">
        <Row class="m_b_5">
          <Col span="5" style="display: flex; align-items: center;">
            <span class="m_r_5 m_l_5">{{$t('Template')}}</span>
            <Select
              v-model="seachParams.template_id"
              clearable
              filterable
              style="width:calc(100% - 60px);"
            >
              <Option
                v-for="(item,index) in templateOptions"
                :value="item.id"
                :key="index"
              >{{ item.name }}</Option>
            </Select>
          </Col>
          <Col span="5" style="display: flex; align-items: center;">
            <span class="m_r_5 m_l_5">{{$t('Status')}}</span>
            <Select
              v-model="seachParams.status"
              clearable
              filterable
              style="width:calc(100% - 50px);"
            >
              <Option :value="1">{{$t('success')}}</Option>
              <Option :value="2">{{$t('failure')}}</Option>
            </Select>
          </Col>
          <Col span="5" style="display: flex; align-items: center;">
            <span class="m_r_5">{{$t('to_email')}}</span>
            <Input
              v-model="seachParams.to_email"
              type="textarea"
              :autosize="{minRows: 1,maxRows: 1}"
              :placeholder="`${$t('to_email')}...`"
              style="width:calc(100% - 60px);"
            ></Input>
          </Col>
          <Col span="6" style="display: flex; align-items: center;">
            <span class="m_r_5 m_l_5">{{$t('sent_date')}}</span>
            <DatePicker
              type="datetimerange"
              :options="dateOptions"
              placeholder="Select date"
              style="width:calc(100% - 70px);"
              @on-change="changeDate"
            ></DatePicker>
          </Col>
          <Col span="3" style="display: flex; align-items: center;justify-content: flex-end">
            <Button class="m_l_10" type="primary" @click="searchFuc">{{$t('search')}}</Button>
          </Col>
        </Row>
        <Dropdown trigger="hover" class="com-toolbar com-right">
          <Icon type="md-settings" size="16"/>
          <DropdownMenu slot="list" style="text-align:left;margin-left:10px">
            <Checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
              <!-- <Checkbox label="from_email">{{$t('from_email')}}</Checkbox> -->
              <Checkbox label="from_name">{{$t('from_name')}}</Checkbox>
              <!-- <Checkbox label="to_email">{{$t('to_email')}}</Checkbox> -->
              <Checkbox label="to_name">{{$t('to_name')}}</Checkbox>
              <Checkbox label="bcc">{{$t('bcc')}}</Checkbox>
              <Checkbox label="subject">{{$t('subject')}}</Checkbox>
            </Checkbox-group>
          </DropdownMenu>
        </Dropdown>
        <div style="text-align:center;width:100%">
          <Spin fix v-if="spinShow" style="z-index:1000">
            <Icon type="ios-loading" size="18" class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
          </Spin>
          <Table border :columns="tableColumns" :data="MailHisData" :height="dynamicHeight"></Table>
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
      <div v-if="modalType" style="text-align: left;">
        <Row type="flex" justify="space-between">
          <Col span="12">
            <h1 class="H2class">{{$t('Preview')}}</h1>
          </Col>
        </Row>
        <Row>
          <Col span="9">
            <h1 class="H3class">{{$t('subject')}}</h1>
          </Col>
          <Col span="10" style="padding-top:10px;font-size:16px">{{viewData.subject}}</Col>
          <Col span="5" style="display: flex;justify-content: flex-end;padding-top:10px;">
            <Button
              type="info"
              size="small"
              class="m_r_5"
              icon="ios-paper-plane"
              @click="SendButtonFuc"
            >{{$t('SendButton')}}</Button>
            <Button
              type="warning"
              size="small"
              class="m_r_10"
              icon="ios-redo"
              @click="ForwardButtonFuc"
            >{{$t('ForwardButton')}}</Button>
          </Col>
        </Row>
        <div class="dashline"></div>
        <Row>
          <Col span="9">
            <h1 class="H3class">{{$t('from_email')}}</h1>
          </Col>
          <Col span="12" style="padding-top:10px;font-size:16px">{{viewData.from_email}}</Col>
        </Row>
        <div class="dashline"></div>
        <Row>
          <Col span="9">
            <h1 class="H3class">{{$t('to_email')}}</h1>
          </Col>
          <Col span="12" style="padding-top:10px;font-size:16px">{{viewData.to_email}}</Col>
        </Row>
        <div class="dashline"></div>
        <Row>
          <Col span="9">
            <h1 class="H3class">{{$t('bcc')}}</h1>
          </Col>
          <Col span="12" style="padding-top:10px;font-size:16px">{{viewData.bcc}}</Col>

          <div class="dashline"></div>
        </Row>
        <Row>
          <Col span="24">
            <div class="content" v-html="viewData.msg"></div>
            <Button type="text" @click="downHtml" class="com-affix-bottom">
              <Icon style="color:#2d8cf0" type="md-cloud-download" size="40"/>
            </Button>
          </Col>
        </Row>
        <div style="text-align:right;margin:15px" class="com-affix-right">
          <Button type="primary" @click="cancelView" style="margin-right:5px">
            <Icon type="ios-arrow-back"/>
            {{$t('goback')}}
          </Button>
        </div>
      </div>
    </transition>
     <!-- send -->
    <div v-show="modalSend">
      <Modal
        v-model="modalSend"
        scrollable
        :title="$t('ForwardButton')"
        label-width="50"
        @on-ok="validate_Send"
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
            <FormItem :label="$t('to_email')" prop="to_email">
              <Input
                v-model="SendObj.to_email"
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                :placeholder="`${$t('to_email')}...`"
                style="width:95%"
              ></Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="modalSend=false">{{$t('Cancel')}}</Button>
          <Button type="primary" size="small" @click="validate_Send">{{$t('Apply')}}</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage, IsLoading } from "@/utils/api";
import { downloadFile } from "@/utils";
export default {
  name: "email_history",
  data() {
    return {
      resetRule: {
        to_email: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("to_email")}`,
            trigger: "blur"
          }
        ]
      },
      dateOptions: {
        shortcuts: [
          {
            text: "1 week",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            }
          },
          {
            text: "1 month",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            }
          },
          {
            text: "3 months",
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            }
          }
        ]
      },
      viewData: {
        lang: "",
        from_email: "",
        to_email: "",
        subject: "",
        msg: "",
        bcc: ""
      },
      spinShow: false,
      modalSend: false,
      AccountId: null,
      MailHisData: this.mockTableData(),
      templateOptions: [],
      tableColumns: [],
      tableColumnsChecked: [
        "from_name",
        "to_name",
        "bcc",
        "subject",
        "status",
        "sent_date",
        "Operating"
      ],
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      modalType: false,
      modalTypeLang: false,
      count: 0, //分页总数total
      SendObj : {
        data_email: "",
        to_email: "",
        to_name: ""
      },
      seachParams: {
        limit: 20,
        page: 1,
        to_email: "",
        template_id: "",
        start_time: "",
        end_time: "",
        status: null
      } //获取table列表时的参数
    };
  },
  methods: {
    ForwardButtonFuc(){
      this.SendObj={
        data_email: "",
        to_email: "",
        to_name: ""
      },
      this.$nextTick(()=>{
        this.modalSend = true;
      })
    },
      validate_Send() {
      this.$refs.resetFormSend.validate(valid => {
        if (valid) {
          this.do_Send();
        }
      });
    },
    do_Send() {
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
        lang: this.viewData.lang
      };
      let successFuc = res => {
        IsMessage("success", this.$t("Successful"));
        this.modalSend=false;
      };
      let elseFuc = res => {
        IsMessage("success", res.message);
        this.modalSend=false;
      };
      AjaxApi("TextSend", _params, successFuc, elseFuc);
    },
    changeDate(data) {
      this.seachParams.start_time = data[0];
      this.seachParams.end_time = data[1];
    },
    SendButtonFuc() {
      let _params = {
        template_id: this.AccountId,
        user_id: localStorage.getItem("userId"),
        data_email: [
          { to_name: this.viewData.to_email, to_email: this.viewData.to_email }
        ],
        lang: this.viewData.lang
      };
      let successFuc = res => {
        IsMessage("success", this.$t("Successful"));
      };
      let elseFuc = res => {
        IsMessage("info", res.message);
      };
      AjaxApi("TextSend", _params, successFuc, elseFuc);
    },
    downHtml() {
      let debug = [this.viewData.msg];
      let blob = new Blob(debug, {
        type: "text/html"
      });
      const url = URL.createObjectURL(blob);
      downloadFile(url, "index.html");
    },
    Refresh() {
      this.spinShow = true;
      let successFuc = res => {
        this.MailHisData = res.data.data;
        this.count = res.data.count;
        this.$nextTick(() => {
          this.spinShow = false;
        });
      };
      let elseFuc = () => {
        this.spinShow = false;
      };
      AjaxApi("GetEmailHistory", this.seachParams, successFuc, elseFuc);
    },
    mockTableData() {
      if (!this.MailHisData) {
        return [];
      }
      let data = [];
      function getNum() {
        return Math.floor(Math.random() * 10000 + 1);
      }
      for (let i = 0; i < 10; i++) {
        data.push({
          from_name: getNum(),
          to_name: getNum(),
          bcc: getNum(),
          subject: getNum(),
          status: getNum(),
          sent_date: getNum(),
          Operating: getNum()
        });
      }
      return data;
    },
    getTableColumns() {
      const tableColumnList = {
        from_name: {
          title: this.$t("from_name"),
          align: "center",
          minWidth: 150,
          key: "from_name",
          tooltip: true,
          sortable: true,
          render: (h, params) => {
            const row = params.row;
            const text = `<${row.from_name}>${row.from_email}`;
            return h(
              "span",
              {
                style: {
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap"
                },
                domProps: {
                  title: text
                }
              },
              text
            );
          }
        },
        to_name: {
          title: this.$t("to_name"),
          align: "center",
          minWidth: 120,
          key: "to_name",
          tooltip: true,
          sortable: true,
          render: (h, params) => {
            const row = params.row;
            const text = `<${row.to_name}>${row.to_email}`;
            return h(
              "span",
              {
                style: {
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap"
                },
                domProps: {
                  title: text
                }
              },
              text
            );
          }
        },
        bcc: {
          title: this.$t("bcc"),
          align: "center",
          key: "bcc",
          minWidth: 120,
          tooltip: true,
          sortable: true
        },
        subject: {
          title: this.$t("subject"),
          align: "center",
          key: "subject",
          minWidth: 150,
          tooltip: true,
          sortable: true
        },
        status: {
          title: this.$t("Status"),
          align: "center",
          key: "status",
          minWidth: 120,
          sortable: true,
          render: (h, params) => {
            const row = params.row;
            const color = row.status === 1 ? "#19be6b" : "#ed4014";
            const text =
              row.status === 1
                ? this.$t("sendsuccess")
                : this.$t("sendfailure");
            return h(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "center"
                }
              },
              [
                h(
                  "span",
                  {
                    style: {
                      fontSize: "10px",
                      color: color
                    }
                  },
                  text
                ),
                h(
                  "Tooltip",
                  {
                    style: {
                      cursor:"pointer",
                      color: color,
                      marginLeft: "2px"
                    },
                    props: {
                      content: row.msg ? row.msg : "None",
                      placement: "left",
                      maxWidth: 500
                    }
                  },
                  [
                    h("Icon", {
                      'class': {
                                  "com-hide-ab": Boolean(row.status===1),
                                },
                      props: {
                        type: "md-alert",
                        size: "20"
                      }
                    })
                  ]
                )
              ]
            );
          }
        },
        sent_date: {
          title: this.$t("sent_date"),
          align: "center",
          key: "sent_date",
          minWidth: 150,
          tooltip: true,
          sortable: true
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
                    title: this.$t("send")
                  },
                  props: {
                    type: "info",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px",
                    padding: 0,
                    width: "30px"
                  },
                  on: {
                    click: () => {
                      let _params = {
                        id: params.row.id
                      };
                      let successFuc = res => {
                        this.AccountId = res.data.template_id;
                        this.viewData = {
                          lang: res.data.lang,
                          from_email: params.row.from_email,
                          to_email: params.row.to_email,
                          subject: params.row.subject,
                          bcc: params.row.bcc,
                          msg: res.data.html
                        };
                        this.$nextTick(() => {
                          this.modalType = true;
                        });
                      };
                      let elseFuc = () => {};
                      AjaxApi("GetHtmlById", _params, successFuc, elseFuc);
                    }
                  }
                },
                [
                  h("Icon", {
                    props: {
                      type: "md-paper-plane",
                      size: "24"
                    }
                  })
                ]
              )
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
      this.modalType = true;
    },
    searchFuc() {
      IsLoading();
      this.seachParams.page = 1;
      let successFuc = res => {
        this.MailHisData = res.data.data;
        this.count = res.data.count;
      };
      let elseFuc = res => {
        this.MailHisData = [];
        this.count = 0;
      };
      AjaxApi("GetEmailHistory", this.seachParams, successFuc, elseFuc);
    },
    cancelView() {
      this.getInitData();
    },

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
    getTemSelect() {
      let successFuc = res => {
        this.templateOptions = res.data;
      };
      let elseFuc = () => {};
      AjaxApi("GetTemOptions", {}, successFuc, elseFuc);
    },
    //获取初始table数据
    getInitData() {
      let successFuc = res => {
        this.MailHisData = res.data.data;
        this.count = res.data.count;
        this.$nextTick(() => {
          this.modalType = false;
        });
      };
      let elseFuc = () => {};
      AjaxApi("GetEmailHistory", this.seachParams, successFuc, elseFuc);
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
    }
  },
  created() {
    this.getInitData();
    this.getTemSelect();
  }
};
</script>

<style  lang="less" scoped>
.H2class {
  color: black;
  font-weight: bold;
  line-height: 63px;
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
.H3class {
  color: black;
  font-weight: bold;
  line-height: 33px;
  padding-left: 15px;
  font-size: 18px;
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
.dashline {
  border-top: 1px dashed #e8e8e8;
  display: block;
  height: 0;
  width: 100%;
  margin: 4px 0;
  clear: both;
}
</style>
<style  lang="less">
// .btn-toolbar {
//   .ivu-checkbox-group-item {
//     display: block;
//   }
//   cursor: pointer;
//   position: absolute;
//   top: 48px;
//   right: 10px;
//   z-index: 10;
//   padding: 3px;
//   margin: 0;
//   background: #fff;
// }
// .pull-right {
//   float: right !important;
// }
</style>
<style scoped>
/* v-html样式 */
.content >>> div {
  width: 100% !important;
  clear: both;
}
.content {
  margin-top: 50px;
  padding: 20px;
  width: 100%;
  clear: both;
  overflow: hidden;
}
</style>