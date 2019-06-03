<template>
  <div class="user_list" v-cloak>
    <Dropdown trigger="hover" class="btn-toolbarUser pull-right">
      <Icon type="md-settings" size="16"/>
      <DropdownMenu slot="list" style="text-align:left;margin-left:10px">
        <Checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
          <Checkbox label="title">{{$t('title')}}</Checkbox>
          <Checkbox label="firstname">{{$t('Name')}}</Checkbox>
          <Checkbox label="mobile">{{$t('mobile')}}</Checkbox>
          <Checkbox label="email">{{$t('email')}}</Checkbox>
        </Checkbox-group>
      </DropdownMenu>
    </Dropdown>
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
  </div>
</template>

<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage } from "@/utils/api";
export default {
  name: "user_list",
  data() {
    return {
      userListData: this.mockTableData2(),
      tableColumns2: [],
      tableColumnsChecked: ["index", "title", "firstname", "mobile", "email"],
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      modalType_new: false,
      modalType_edit: false,
      count: 0, //分页总数total
      seach_params: { limit: 20, current_page: 1, search_key: "" }, //获取table列表时的参数
      // userListData: [], //数据（table使用）
      AddData: {},
      EditData: {},
      resetRule: {
        title: [
          {
            required: true,
            type: "string",
            message: "请输入标题",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    mockTableData2() {
      let data = [];
      function getNum() {
        return Math.floor(Math.random() * 10000 + 1);
      }
      for (let i = 0; i < 10; i++) {
        data.push({
          fav: 0,
          index: getNum(),
          title: getNum(),
          firstname: getNum(),
          // Status: getNum(),
          mobile: getNum(),
          email: getNum()
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
          key: "first_name",
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
          fixed: "right",
          key: "email",
          minWidth: 120,
          tooltip: true,
          sortable: true
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
    }
  },
  created() {
    this.userListData=[]
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