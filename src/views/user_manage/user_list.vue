<template>
  <div class="user_list">
    <div>
      <!-- <exportExcel :tableData="mockTableData2()" :tableHead="getTable2Columns()" />
      <importExcel @on-selected-file="setExcelData" /> -->
      <!-- <upLoadBtn idName="excelLoad" color="success" size="small" accept=".xlsx" @fileUpload="fileUpload" :fileChangeLoading="fileChangeLoading" style="display:inline-block;margin:0 0 10px 5px; " /> -->
    </div>
    <Row style="margin: 20px 0 10px 0;">
      <i-col span="12" style="text-align: left;">
        <Button type="primary">{{$t('View')}}</Button>
        <Button type="primary">{{$t('Delete')}}</Button>
        <Dropdown @on-click="toOperate">
          <Button type="primary">
              {{$t('aof')}}&nbsp;<Icon type="ios-arrow-down"></Icon>
          </Button>
          <DropdownMenu slot="list">
              <DropdownItem v-for="(item,index) in operateOptions" :key="index" :name="item.value">{{item.label}}</DropdownItem>
          </DropdownMenu>
      </Dropdown>
      </i-col>
      <i-col span="12" style="text-align: right;">
        <Button type="primary">查看</Button>
      </i-col>
    </Row>
    <div style="text-align:center;width:100%">
      <Table
        v-cloak
        class="m_t_10"
        border
        :columns="tableColumns2"
        :data="userListData"
        :height="dynamicHeight"
      ></Table>
      <div class="com-footer">
        <Page
          :total="count"
          :page-size="seach_params.limit"
          :current="seach_params.current_page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handlePageSizeChange"
          show-elevator
          show-sizer
          show-total
        />
      </div>
    </div>
    <Modal
      v-model="userModal"
      scrollable
      :title="userModalObj.title"
      label-width="50"
      class-name="user_modal"
      :mask-closable="false"
      @on-cancel="cancel"
      width="800">
        <userImportModal />
    </Modal>
    <!-- 弹窗-->
      <Modal
        v-model="modalType"
        scrollable
        :title="moadlTitle"
        @on-ok="do_Apply"
        @on-cancel="do_Cancel"
        :mask-closable="false"
        width="700"
      >
        <div>
          <Form
            v-if="modalType"
            ref="resetForm"
            :model="paramsData"
            :rules="resetRule"
            :label-width="110"
          >
            <Row :gutter="16">
              <Col span="18" :md="18">
                <FormItem :label="$t('title')" prop="title">
                  <Input v-model="paramsData.title" :placeholder="`${$t('title')}...`"></Input>
                </FormItem>
              </Col>
              <Col span="18" :md="18">
                <FormItem :label="$t('firstname')" prop="firstname">
                  <Input v-model="paramsData.firstname" :placeholder="`${$t('firstname')}...`"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="23" :md="18">
                <FormItem :label="$t('lastname')" prop="lastname">
                  <Input v-model="paramsData.lastname" :placeholder="`${$t('lastname')}...`"></Input>
                </FormItem>
              </Col>
              <Col span="23" :md="18">
                <FormItem :label="$t('nurse.birth')" prop="dob">
                  <!-- <Input v-model="paramsData.dob" :placeholder="`${$t('dob')}...`"></Input> -->
                  <DatePicker
                  type="date"
                  :options="disabledData"
                  :placeholder="`${this.$t('nurse.birth')}...`"
                  style="width: 100%"
                  :value="paramsData.dob"
                  format="yyyy-MM-dd"
                  @on-change="paramsData.dob=$event"
                ></DatePicker>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="18" :md="18">
                <FormItem :label="$t('email')" prop="email">
                  <Input v-model="paramsData.email" :placeholder="`${$t('email')}...`"></Input>
                </FormItem>
              </Col>
              <Col span="6" :md="6">
                <FormItem :label-width="0">
                  <Button
                    type="primary"
                    @click="getVerificationCode"
                    :loading="buttonLoading"
                    :disabled="showtime"
                  >
                    {{capitalize}}
                    <Time :time="timeNow" :interval="1" v-if="showtime"/>
                  </Button>
                </FormItem>
              </Col>
              <Col span="18" :md="18">
                <FormItem :label="$t('emailCode')" prop="emailCode">
                  <Input v-model="paramsData.emailCode" :placeholder="`${$t('emailCode')}...`"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="18" :md="18">
                <Row>
                  <Col span="10" :md="10" style="padding-right:10px">
                    <FormItem :label="$t('mobile')" prop="AreaCode">
                      <Input
                        prefix="md-add"
                        v-model="paramsData.AreaCode"
                        :placeholder="`${$t('AreaCode')}...`"
                      ></Input>
                    </FormItem>
                  </Col>
                  <Col span="14" :md="14">
                    <FormItem :label-width="0" prop="mobile">
                      <Input v-model="paramsData.mobile" :placeholder="`${$t('mobile')}...`"></Input>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span="6" :md="6">
                <FormItem :label-width="0">
                  <Button
                    type="primary"
                    @click="getVerificationCode"
                    :loading="buttonLoading"
                    :disabled="showtime"
                  >
                    {{capitalize}}
                    <Time :time="timeNow" :interval="1" v-show="showtime"/>
                  </Button>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="23" :md="18">
                <FormItem :label="$t('mobileCode')" prop="mobileCode">
                  <Input v-model="paramsData.mobileCode" :placeholder="`${$t('mobileCode')}...`"></Input>
                </FormItem>
              </Col>
              <Col span="23" :md="18">
                <FormItem :label="$t('PostCode')" prop="PostCode">
                  <Input v-model="paramsData.PostCode" :placeholder="`${$t('PostCode')}...`"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="23" :md="18">
                <FormItem :label="$t('Memo')" prop="Memo">
                  <Input v-model="paramsData.Memo" :placeholder="`${$t('Memo')}...`"></Input>
                </FormItem>
              </Col>
              <Col span="18" :md="18">
                <FormItem :label="$t('address')" prop="address">
                  <Row>
                    <Col
                      span="15"
                      :md="18"
                      v-for="(item,index) in paramsData.address"
                      :key="index"
                      class="m_b_10"
                    >
                      <Row>
                        <Col span="18" :md="21">
                          <Input
                            v-if="index===paramsData.address.length-1"
                            v-model="paramsData.address[index]"
                            :placeholder="`${$t('address')}...`"
                            :readonly="index!==paramsData.address.length-1"
                          ></Input>
                          <span
                            v-if="index!==paramsData.address.length-1"
                          >{{paramsData.address[index]}}</span>
                        </Col>
                        <Col span="3" :md="2" class="m_l_10">
                          <Icon
                            type="md-close-circle"
                            size="30"
                            color="#ed4014"
                            style="cursor: pointer;"
                            @click="minusAdress(index)"
                          />
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      span="6"
                      :md="5"
                      class="m_l_5"
                      v-show="paramsData.address.length!==0&&paramsData.address[paramsData.address.length-1].length!==0||paramsData.address.length===0"
                    >
                      <Icon
                        type="md-add-circle"
                        size="30"
                        color="#2d8cf0"
                        style="cursor: pointer;"
                        @click="addAdress"
                      />
                    </Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div slot="footer" style="text-align:center">
          <Button type="primary" @click="do_Apply">{{$t('Apply')}}</Button>
          <Button type="text" @click="do_Cancel">{{$t('Cancel')}}</Button>
        </div>
      </Modal>
  </div>
</template>

<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage } from "@/utils/api";
import exportExcel from "@/components/excel/exportExcel"
import importExcel from "@/components/excel/importExcel"
import upLoadBtn from "@/components/excel/upLoadBtn"
import userImportModal from "@/components/modal/userImportModal"
export default {
  name: "user_list",
  data() {
    return {
      disabledData: {
        //生日不可选的时间
        disabledDate(date) {
          // return date && date.valueOf() < Date.now() - 86400000;
          return date && date.valueOf() > Date.now();
        }
      },
      userListData: this.mockTableData2(),
      tableColumns2: [],
      tableColumnsChecked: [
        "index",
        "title",
        "firstname",
        "mobile",
        "email",
        "Operating"
      ],
      clientHeight: null, //浏览器窗口高度
      // capitalize:this.$t('VerificationCode'),
      dynamicHeight: 400, //table动态高度
      modalType_new: false,
      buttonLoading: false,
      modalType: false,
      count: 0, //分页总数total
      seach_params: { limit: 20, current_page: 1, search_key: "" }, //获取table列表时的参数
      AddData: {},
      EditData: {},
      operateVal: '',
      userModal: false,
      userModalObj: {
        modalType: '',
        title: ''
      },
      // userListData: [], //数据（table使用）
      timeNow: new Date(),
      showtime: false,
      moadlTitle: this.$t("Registration"),
      paramsData: {
        title: "",
        Memo: "",
        address: [],
        PostCode: "",
        mobileCode: "",
        mobile: "",
        AreaCode: "",
        emailCode: "",
        email: "",
        dob: "",
        lastname: "",
        firstname: ""
      },
      resetRule: {
        title: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("title")}`,
            trigger: "blur"
          }
        ],
        Memo: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("Memo")}`,
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            type: "array",
            message: `${this.$t("PleaseEnterThe")}${this.$t("address")}`,
            trigger: "blur"
          }
        ],
        PostCode: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("PostCode")}`,
            trigger: "blur"
          }
        ],
        mobileCode: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("mobileCode")}`,
            trigger: "blur"
          }
        ],
        AreaCode: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("AreaCode")}`,
            trigger: "blur"
          },
          {
            type: "string",
            pattern: /^(283|282|281|280|269|268|267|266|265|264|263|262|261|260|259|258|257|256|255|254|253|252|251|250|249|248|247|246|245|244|243|242|241|240|239|238|237|236|235|234|233|232|231|230|229|228|227|226|225|224|223|222|221|220|219|218|217|216|215|214|213|212|211|210|98|95|94|93|92|91|90|86|84|82|81|66|65|64|63|62|61|60|58|57|56|55|54|53|52|51|49|48|47|46|45|44|43|41|40|39|36|34|33|32|31|30|27|20|7|1)$/,
            message: `${this.$t("WrongFormat")}`
          }
        ],
        mobile: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("mobile")}`,
            trigger: "blur"
          },
           {
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            pattern: /^[0-1]([0-9])[0-9]{9}$/,
            message: `${this.$t("WrongFormat")}`
          }
        ],
        emailCode: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("emailCode")}`,
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("email")}`,
            trigger: "blur"
          },
          {
            type: "email",
            message: `${this.$t("WrongFormat")}`,
            trigger: "blur"
          }
        ],
        dob: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseChooseThe")}${this.$t("nurse.birth")}`,
            trigger: "blur"
          }
        ],
        lastname: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("lastname")}`,
            trigger: "blur"
          }
        ],
        firstname: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("firstname")}`,
            trigger: "blur"
          }
        ]
      }
    }
  },
  components: {
    exportExcel,importExcel,upLoadBtn,userImportModal
  },
  computed: {
    operateOptions(){
      return [
        { label: this.$t('backend.lock'), value: 'lock' },
        { label: this.$t('backend.unlock'), value: 'unlock' },
        { label: this.$t('backend.sendMsg'), value: 'msg' },
        { label: this.$t('backend.sendEmail'), value: 'email' },
        { label: this.$t('backend.sendCoupon'), value: 'coupon' },
        { label: this.$t('backend.importClient'), value: 'import' },
        { label: this.$t('backend.exportClient'), value: 'export' },
        { label: this.$t('backend.importHead'), value: 'head' }
      ]
    },
    capitalize: function() {
      if (this.showtime) {
        return "";
      } else {
        return this.$t("VerificationCode");
      }
    }
  },
  methods: {
    setExcelData(){
      
    },
    toOperate(v){
      console.log(v);
      switch(v){
        case 'import':
          this.userModal = true
          this.userModalObj = {
            modalType: 'import',
            title: '客户导入'
          }
          break;
      }
    },
    cancel(){
      this.userModal = false
      this.operateVal = ''
    },
    do_Apply() {
      this.$refs.resetForm.validate(valid => {
        if (
          this.paramsData.address[this.paramsData.address.length - 1].length ===
          0
        ) {
          this.paramsData.address.splice(this.paramsData.address.length - 1, 1);
        }
        if (valid) {
          this.validateAll();
        }
      });
    },
    do_Cancel() {
      this.paramsData = {
        title: "",
        Memo: "",
        address: [],
        PostCode: "",
        mobileCode: "",
        mobile: "",
        AreaCode: "",
        emailCode: "",
        email: "",
        dob: "",
        lastname: "",
        firstname: ""
      };
      this.modalType = false;
    },
    validateAll() {},
    addAdress() {
      this.paramsData.address.push("");
    },
    minusAdress(i) {
      this.paramsData.address.splice(i, 1);
    },
    getVerificationCode() {
      let now = () => {
        this.timeNow = new Date();
        return this.timeNow.setTime(this.timeNow.getTime() - 1000);
      };
      this.timeNow = now();
      this.showtime = true;
      setTimeout(() => {
        this.showtime = false;
        this.timeNow = now();
      }, 5000);
      // setTimeout(()=>{ this.buttonLoading =false;this.showtime = true; setTimeout(()=>{ this.showtime = false; },5000);},1000);
    },

    mockTableData2() {
      let data = [];
      function getNum() {
        return Math.floor(Math.random() * 10000 + 1);
      }
      for (let i = 0; i < 10; i++) {
        data.push({
          id: getNum(),
          title: getNum(),
          first_name: getNum(),
          mobile: getNum(),
          email: getNum(),
          Operating: getNum()
        });
      }
      return data;
    },
    getTable2Columns() {
      const tableColumnList = {
        index: {
          title: "UserID",
          minWidth: 110,
          maxWidth: 200,
          key: "id",
          align: "center",
          sortable: true,
          render: (h, params) => {
            const row = params.row;
            const color = row.status === 1 ? "#00924c" : "#d75000";
            return h(
              "div",
              {
                style: {
                  display: "flex",
                  justifyContent: "flex-start"
                }
              },
              [
                h(
                  "Tooltip",
                  {
                    style: {
                      cursor: "pointer",
                      color: color,
                      marginLeft: "2px"
                    },
                    props: {
                      content: `${this.$t("LockReason")}:${row.status_display}`,
                      disabled: row.status === 1 ? true : false,
                      placement: "right",
                      maxWidth: 500
                    }
                  },
                  [
                    h("Icon", {
                      props: {
                        type: row.status === 1 ? "md-unlock" : "md-lock",
                        size: "24"
                      }
                    })
                  ]
                ),
                h("Icon", {
                  class: {
                    "com-hide-ab": Boolean(row.facebook_bind_status === 0)
                  },
                  props: {
                    type: "logo-facebook",
                    size: "24"
                  },
                  style: {
                    color: "#3b5998"
                  }
                }),
                h("Icon", {
                  class: {
                    "com-hide-ab": Boolean(row.google_bind_status === 0)
                  },
                  props: {
                    type: "logo-google",
                    size: "24"
                  },
                  style: {
                    color: "#db4a39"
                  }
                }),
                h(
                  "span",
                  {
                    style: {
                      paddingTop: "5px",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                      overflow: "hidden"
                    },
                    domProps: {
                      title: row.id
                    }
                  },
                  row.id
                )
              ]
            );
          }
        },
        title: {
          title: this.$t("title"),
          key: "title",
          minWidth: 120,
          align: "center",
          tooltip: true,
          sortable: true
        },
        firstname: {
          title: this.$t("Name"),
          align: "center",
          minWidth: 120,
          key: "firstname",
          tooltip: true,
          sortable: true,
          render: (h, params) => {
            const row = params.row;
            const text = `${row.first_name} ${row.last_name}`;
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
        // Status:{
        //   title: this.$t("Status"),
        //   align: "center",
        //   width: 120,
        //   key: "status",
        //   tooltip: true,
        //   sortable: true,
        //   render: (h, params) => {
        //     const row = params.row;
        //     const color = row.status === 1 ? "#5cadff" : "#ff9900";
        //     return h(
        //       "div",
        //       {
        //         style: {
        //           display: "flex",
        //           justifyContent: "flex-start"
        //         }
        //       },
        //       [
        //         h(
        //           "Tooltip",
        //           {
        //             style: {
        //               // display: row.status === 1 ? "none" : "bolck",
        //               cursor:"pointer",
        //               color: color,
        //               marginLeft: "2px"
        //             },
        //             props: {
        //               content: row.status !== 1 ? `${this.$t('LockReason')}:${row.status_display}` : "Unlock",
        //               placement: "left",
        //               maxWidth: 500
        //             }
        //           },
        //           [
        //             h("Icon", {
        //               props: {
        //                 type: row.status === 1?"md-unlock":"md-lock",
        //                 size: "20"
        //               }
        //           })
        //           ]
        //         ),
        //         h("Icon", {
        //               props: {
        //                 type: "logo-facebook",
        //                 size: "20"
        //               },
        //               style:{
        //                 display: row.facebook_bind_status === 0? "none" : "bolck",
        //                 color:"blue",
        //               }
        //         }),
        //         h("Icon", {
        //               props: {
        //                 type: "logo-google",
        //                 size: "20"
        //               },
        //               style:{
        //                 display: row.google_bind_status === 0 ? "none" : "bolck",
        //                 color:"red",
        //               }
        //         }),
        //       ]
        //     );
        //   }
        // },
        mobile: {
          title: this.$t("mobile"),
          align: "center",
          key: "mobile",
          minWidth: 120,
          tooltip: true,
          sortable: true
        },
        email: {
          title: this.$t("email"),
          align: "center",
          // fixed: "right",
          key: "email",
          minWidth: 120,
          tooltip: true,
          sortable: true
        },
        Operating: {
          title: this.$t("Operating"),
          minWidth: 60,
          fixed: "right",
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Button", {
                attrs: {
                  title: this.$t("Registration")
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
                    this.modalType = true;
                    this.paramsData.title = params.row.title;
                    this.paramsData.firstname = params.row.first_name;
                    this.paramsData.lastname = params.row.last_name;
                    // let _params = {

                    // };
                    // let successFuc = res => {
                    // };
                    // let elseFuc = () => {};
                    // AjaxApi("", _params, successFuc, elseFuc);
                  }
                }
              })
            ]);
          }
        }
      };
      let data = [];
      this.tableColumnsChecked.forEach(col => data.push(tableColumnList[col]));
      return data;
    },
    changeTableColumns() {
      this.tableColumns2 = this.getTable2Columns();
    },
    //分页跳转方法
    handleCurrentChange(current_page) {
      this.seach_params.current_page = current_page;
      this.getInitData();
    },
    //分页页数改变
    handlePageSizeChange(limit) {
      this.seach_params.limit = limit;
      this.getInitData();
    },
    //获取初始table数据
    getInitData() {
      let successFuc = res => {
        this.$nextTick(() => {
          this.userListData = res.data.data;
          this.count = res.data.count;
        });
      };
      let elseFuc = () => {};
      AjaxApi("GetUsersList", this.seach_params, successFuc, elseFuc);
    },
    //动态table高度
    DynamicHeightFuc(Isvh) {
      this.dynamicHeight = String(Isvh - 180);
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
    timeNow: function() {
      console.log(this.timeNow);
    }
  },
  created() {
    this.userListData = [];
    this.getInitData();
  }
};
</script>
<style  lang="less">
.btn-toolbarUser {
  cursor: pointer;
  position: absolute;
  top: 9px;
  right: 15px;
  z-index: 10;
  padding: 3px;
  margin: 0;
  background: #fff;
}
.pull-right {
  float: right !important;
}
</style>