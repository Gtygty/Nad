<template>
  <div class="inventory">
    <Form :model="seach_params" class="formInv">
      <Row type="flex" justify="space-between" class="code-row-bg">
        <Col span="12" style="text-align:left">
          <FormItem :label="$t('StorefrontLabel')" :label-width="50" :model="seach_params">
            <Select
              label-in-value
              v-model="seach_params.stores_id"
              filterable
              :placeholder="$t('Storefront')"
              @on-change="chengestore"
              style="width:240px"
            >
              <Option value="all" :label="$t('AllStorefronts')">
                <span>{{$t('AllStorefronts')}}</span>
              </Option>
              <Option
                v-for="item in StoreOptions"
                :value="item.value"
                :key="item.value"
              >{{ item.label }}</Option>
            </Select>
          </FormItem>
          <TimePicker
            confirm
            type="timerange"
            placement="bottom-end"
            placeholder="Select time"
            :open="open"
            v-if="timershow"
          >
            <Button @click="clickButime">{{$t('ShiftTime')}}</Button>
          </TimePicker>
        </Col>
        <Col span="12" style="text-align:right">
          <!-- <DatePicker
            :open="open"
            type="datetime"
            multiple
            placeholder="Select date"
            @click.middle.native="chengeDate($event)"
          >
            <Button @click="clickButime">排班日期</Button>
          </DatePicker>-->

          <FormItem>
            <Breadcrumb>
              <BreadcrumbItem>
                <Icon type="ios-home-outline"></Icon>
                {{category_name}}
              </BreadcrumbItem>
              <BreadcrumbItem>
                <Icon type="logo-buffer"></Icon>
                {{storeName}}
              </BreadcrumbItem>
            </Breadcrumb>
          </FormItem>
        </Col>
      </Row>
    </Form>

    <div style="text-align:center">
      <Table
        border
        :columns="columns"
        :data="GoodsData"
        :height="InfoList.length||historyList.length?dynamicHeight*.5-32:dynamicHeight"
        style="width:100%;top:0"
        :no-data-text="loadingText ? loadingText : $t('NoData')"
      ></Table>
      <div class="com-footer-right">
        <Page
          size="small"
          :total="listCount"
          :page-size="seach_params.limit"
          :current="seach_params.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handlePageSizeChange"
          show-elevator
          show-sizer
          show-total
        />
      </div>
      <Table
        v-if="InfoList.length||historyList.length"
        border
        :columns="InfoList.length?columns_Info:columns_history"
        :data="InfoList.length?InfoList:historyList"
        :height="dynamicHeight*.5"
        :no-data-text="loadingText ? loadingText : $t('NoData')"
      ></Table>
      <div class="com-footer-left" v-if="InfoList.length||historyList.length">
        <Page
          size="small"
          :total="InfoList.length?InfoCount:historyCount"
          :page-size="InfoList.length?InfoParams.limit:historyParams.limit"
          :current="InfoList.length?InfoParams.page:historyParams.page"
          @on-change="InfoList.length?InfoCurrentChange($event):historyCurrentChange($event)"
          @on-page-size-change="InfoList.length?InfoPageSizeChange($event):historyPageSizeChange($event)"
          show-elevator
          show-sizer
          show-total
        />
        <!-- <Tag style="float:left">{{$t('commoditylabel')}}{{rowGoodName}}</Tag>
        <Tag style="float:left">{{$t('storelabel')}}{{rowStoreName}}</Tag>
        <Tag color="error" style="float:left" @click.native="clickTag">{{$t('close')}}</Tag>-->
      </div>
    </div>
    <Drawer
      :title="$t('SerialCodeTitile')"
      :closable="false"
      :styles="styles"
      v-model="ModelDrawer"
      @on-close="closeDrawer"
      :inner="true"
      :draggable="true"
      class-name="Drawer-inventory"
      placement="left"
      :width="400"
    >
      <p v-for="(item,index) in UcodeData" :value="item" :key="item.index">
        <Tag checkable color="success" :checked="false" @on-change="changeTag" :name="item">{{item}}</Tag>
      </p>
      <div class="inventory-drawer-footer">
        <Button type="primary" @click="UcodeToRew">{{$t('Apply')}}</Button>
      </div>
    </Drawer>
    <Drawer
      :title="$t('Fillintheinformation')"
      :closable="false"
      @on-close="closeDrawer"
      v-model="ModelDrawer_child"
      class-name="Drawer-inventory"
      placement="left"
      :width="400"
    >
      <Form :model="memo" ref="FormMemo" :rules="resetRule">
        <Row :gutter="32">
          <Col span="24">
            <FormItem :label="$t('goods.Remarks')" label-position="top" prop="remarks">
              <Input
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                v-model="memo.remarks"
                placeholder="please enter remarks"
              />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="32">
          <Col span="24">
            <FormItem :label="$t('Returnnote')" label-position="top" prop="memo">
              <Input
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                v-model="memo.memo"
                placeholder="please enter return instructions"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="inventory-drawer-footer">
        <Button type="primary" @click="FucRemarks">{{$t('Apply')}}</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import {
  CODE_OK,
  IsAlert,
  AjaxApi,
  AsyncLoading,
  IsMessage,
  IsLoading
} from "@/utils/api";
import { mapGetters } from "vuex";
export default {
  name: "inventory",
  data() {
    return {
      open: false,
      timershow: false,
      dateText: "",
      memo: { remarks: "", memo: "" },
      InfoList: [], //详情table列表
      unique_code_store_id: null,
      InfoCount: 0,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      InfoParams: {
        goods_id: null,
        store_id: null,
        page: 1,
        limit: 20
      },
      historyList: [], //历史table列表
      historyCount: 0,
      historyParams: {
        store_id: "",
        goods_id: null,
        page: 1,
        limit: 20
      },
      listCount: 0, //总条数
      category_name: "所有类别",
      storeName: this.$t("AllStorefronts"), //主页面
      rowStoreName: "", //分页面
      rowGoodName: "",
      GoodsData: [],
      treatData: [], //分类树状数据
      treatData2: [],
      UcodeData: [],
      RowcodeData: [],
      RowData: {},
      StoreOptions: [], //商店下拉数据
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      ModelDrawer: false, //序列码
      ModelDrawer_child: false, //序列码
      descriptionModel: false, //采购说明
      modalHistory: false, //历史弹窗的状态
      seach_params: {
        with: "goods,store",
        limit: 20,
        page: 1,
        stores_id: "all"
      }, //获取table列表时的参数
      columns_Info: [
        {
          title: this.$t("ViewDetails"),
          align: "center",
          className: "demo-table-info",
          children: [
            // {
            //   type: "index",
            //   width: 60,
            //   align: "center"
            // },
            {
              title: "ID",
              align: "center",
              key: "id",
              width: 60,
              tooltip: true
            },
            {
              title: this.$t("Price"),
              align: "center",
              key: "price",
              minWidth: 90,
              tooltip: true
            },
            {
              title: this.$t("SerialCode"),
              align: "center",
              key: "unique_code",
              minWidth: 90,
              tooltip: true
            }
          ],
          renderHeader: (h, params) => {
            return h(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center"
                },
                attrs: {
                  class: this.$store.state.app.isCollapsed
                    ? "calc201"
                    : "calc200"
                }
              },
              [
                h(
                  "div",
                  {
                    style: {
                      // float:"left"
                      paddingRight: "10px",
                      paddingLeft: "10px"
                    }
                  },
                  `${this.$t("commoditylabel")}${this.rowGoodName}`
                ),
                h(
                  "div",
                  {
                    style: {
                      // float:"left"
                    }
                  },
                  `${this.$t("storelabel")}${this.rowStoreName}`
                ),
                h(
                  "Tag",
                  {
                    style: {
                      // float:"right"
                      marginLeft: "auto"
                    },
                    props: {
                      color: "error"
                    },
                    nativeOn: {
                      click: () => {
                        this.clickTag();
                      }
                    }
                  },
                  `${this.$t("close")}`
                )
              ]
            );
          }
        }
      ],
      columns_history: [
        {
          title: this.rowGoodName,
          align: "center",
          className: "demo-table-history",
          children: [
            {
              title: this.$t("ChangingRoute"),
              align: "center",
              key: "way",
              minWidth: 90,
              tooltip: true
            },
            {
              title: this.$t("OrderCode"),
              align: "center",
              key: "bill_number",
              minWidth: 90,
              tooltip: true
            },
            {
              title: this.$t("NumberBeforeChange"),
              align: "center",
              key: "last_number",
              minWidth: 90,
              tooltip: true
            },
            {
              title: this.$t("NumberOfChanges"),
              align: "center",
              key: "number",
              minWidth: 90,
              tooltip: true
            },
            {
              title: this.$t("NumberAfterChange"),
              align: "center",
              key: "balance_number",
              minWidth: 90,
              tooltip: true
            },
            {
              title: this.$t("Date"),
              align: "center",
              key: "created_at",
              minWidth: 90,
              tooltip: true
            }
          ],
          renderHeader: (h, params) => {
            return h(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center"
                },
                attrs: {
                  class: this.$store.state.app.isCollapsed
                    ? "calc201"
                    : "calc200"
                }
              },
              [
                h(
                  "div",
                  {
                    style: {
                      // float:"left"
                      paddingRight: "10px"
                    }
                  },
                  `${this.$t("commoditylabel")}${this.rowGoodName}`
                ),
                h(
                  "div",
                  {
                    style: {
                      // float:"left"
                    }
                  },
                  `${this.$t("storelabel")}${this.rowStoreName}`
                ),
                h(
                  "Tag",
                  {
                    style: {
                      // float:"right"
                      marginLeft: "auto"
                    },
                    props: {
                      color: "cyan"
                    },
                    nativeOn: {
                      click: () => {
                        this.clickTag();
                      }
                    }
                  },
                  `${this.$t("close")}`
                )
              ]
            );
          }
        }
      ],
      columns: [
        {
          title: this.$t("goods.GoodCode"),
          align: "center",
          key: "goods_code",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("goods.GoodName"),
          align: "center",
          key: "goods_name",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("storeName"),
          align: "center",
          key: "stores_name",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("InventoryQuantity"),
          align: "center",
          key: "number",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("CurrencyUnit"),
          align: "center",
          key: "currency",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("PurchaseUnitPrice"),
          align: "center",
          key: "price",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("Operating"),
          minWidth: 140,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  attrs: {
                    title: this.$t("ViewDetails")
                  },
                  props: {
                    type: "success",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      const Loading = AsyncLoading();
                      this.historyList = [];
                      this.InfoParams.page = 1;
                      this.InfoParams.limit = 20;
                      this.rowGoodName = params.row.goods_name;
                      this.rowStoreName = params.row.stores_name;
                      this.columns_Info[0].title = `${this.$t("ViewDetails")}:${
                        params.row.goods_name
                      }`;
                      this.InfoParams.goods_id = params.row.goods_id;
                      this.InfoParams.store_id = params.row.store_id;
                      let successFuc = res => {
                        Loading();
                        this.InfoList = res.data.data;
                        this.InfoCount = res.data.count;
                      };
                      let elseFuc = res => {
                        Loading();
                        IsMessage("warning", this.$t("NoData"));
                        this.InfoList = [];
                        this.InfoCount = 0;
                      };
                      AjaxApi(
                        "GetInventoryInfo",
                        this.InfoParams,
                        successFuc,
                        elseFuc
                      );
                    }
                  }
                },
                this.$t("ViewDetails")
              ),
              h(
                "Button",
                {
                  attrs: {
                    title: this.$t("ChangeHistory")
                  },
                  style: {
                    marginRight: "5px"
                  },
                  props: {
                    type: "warning",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      const Loading = AsyncLoading();
                      this.InfoList = [];
                      this.rowStoreName = params.row.stores_name;
                      this.rowGoodName = params.row.goods_name;
                      this.columns_history[0].title = `${this.$t(
                        "ChangeHistory"
                      )}:${params.row.goods_name}`;
                      this.historyParams.page = 1;
                      this.historyParams.limit = 20;
                      this.historyParams.goods_id = params.row.goods_id;
                      this.historyParams.store_id = params.row.store_id;
                      let successFuc = res => {
                        Loading();
                        this.historyList = res.data.data;
                        this.historyCount = res.data.count;
                      };
                      let elseFuc = res => {
                        Loading();
                        IsAlert("warning", this.$t("Error"), this.$t("NoData"));
                        this.historyList = [];
                        this.historyCount = 0;
                      };
                      AjaxApi(
                        "GetInventoryHisList",
                        this.historyParams,
                        successFuc,
                        elseFuc
                      );
                    }
                  }
                },
                this.$t("ChangeHistory")
              )
              //按钮退货
              // h(
              //   "Button",
              //   {
              //     attrs: {
              //       title: this.$t("returnedPurchase")
              //     },
              //     props: {
              //       type: "info",
              //       size: "small"
              //     },
              //     on: {
              //       click: () => {
              //         this.historyList = [];
              //         this.InfoList = [];
              //         this.RowData = {
              //           goods_name: params.row.goods_name,
              //           goods_id: params.row.goods_id,
              //           price: params.row.price,
              //           number: params.row.number,
              //           goods_code: params.row.goods_code,
              //           memo: "",
              //           store_id: params.row.store_id,
              //           unique_code: ""
              //         };
              //         this.unique_code_store_id = params.row.store_id;
              //         this.UcodeData = params.row.unique_code;
              //         this.ModelDrawer = true;
              //       }
              //     }
              //   },
              //   this.$t("returnedPurchase")
              // )
            ]);
          }
        }
      ],
      resetRule: {
        memo: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: "please enter return instructions",
            trigger: "blur"
          }
        ],
        remarks: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: "please enter remarks",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["loadingText"])
  },
  methods: {
    clickButime() {
      this.open = !this.open;
    },
    chengeDate(value) {
      this.timershow = true;
      this.dateText = value.srcElement.innerText;
    },
    FucRemarks() {
      this.$refs.FormMemo.validate(valid => {
        if (valid) {
          this.RowData.number = this.RowcodeData.length;
          this.RowData.unique_code = this.RowcodeData + "";
          this.RowData.memo = this.memo.remarks;
          let params = {
            purchase_data: [this.RowData],
            memo: this.memo.memo,
            store_id: this.RowData.store_id
          };
          let successFuc = res => {
            IsAlert("success", this.$t("Successful"));
            this.closeDrawer();
            this.getInitData();
          };
          let elseFuc = res => {};
          AjaxApi("GetInventoryReduce", params, successFuc, elseFuc);
          this.closeDrawer();
        }
      });
    },
    UcodeToRew() {
      if (this.RowcodeData.length) {
        this.ModelDrawer_child = true;
      } else {
        IsAlert("error", this.$t("AtLeast"));
      }
    },
    changeTag(checked, name) {
      if (checked) {
        this.RowcodeData.push(name);
      } else {
        for (let i = 0; i < this.RowcodeData.length; i++) {
          if (this.RowcodeData[i] == name) {
            this.RowcodeData.splice(i, 1);
            break;
          }
        }
      }
    },
    closeDrawer() {
      this.memo = { memo: "", remarks: "" };
      this.UcodeData = [];
      this.unique_code_store_id = null;
      this.RowcodeData = [];
      this.ModelDrawer = false;
      this.ModelDrawer_child = false;
    },
    clickTag() {
      this.InfoList = [];
      this.historyList = [];
    },

    chengestore(value) {
      IsLoading();
      this.storeName = value.label;
      this.InfoList = [];
      this.historyList = [];
      this.getInitData();
    },

    //分页跳转方法
    handleCurrentChange(page) {
      this.$store.commit("lOADINGTEXT", this.$t("LoadingText"));
      this.GoodsData = [];
      this.seach_params.page = page;
      this.getInitData();
    },
    //分页页数改变
    handlePageSizeChange(limit) {
      this.$store.commit("lOADINGTEXT", this.$t("LoadingText"));
      this.GoodsData = [];
      this.seach_params.limit = limit;
      this.getInitData();
    },
    //分页跳转方法
    historyCurrentChange(page) {
      this.historyParams.page = page;
      let successFuc = res => {
        this.historyList = res.data.data;
        this.historyCount = res.data.count;
      };
      let elseFuc = res => {};
      AjaxApi("GetInventoryHisList", this.historyParams, successFuc, elseFuc);
    },
    //分页页数改变
    historyPageSizeChange(limit) {
      this.historyParams.limit = limit;
      let successFuc = res => {
        this.historyList = res.data.data;
        this.historyCount = res.data.count;
      };
      let elseFuc = res => {};
      AjaxApi("GetInventoryHisList", this.historyParams, successFuc, elseFuc);
    },
    //分页跳转方法
    InfoCurrentChange(page) {
      this.InfoParams.page = page;
      let successFuc = res => {
        this.InfoList = res.data.data;
        this.InfoCount = res.data.count;
      };
      let elseFuc = res => {};
      AjaxApi("GetInventoryInfo", this.InfoParams, successFuc, elseFuc);
    },
    //分页页数改变
    InfoPageSizeChange(limit) {
      this.InfoParams.limit = limit;
      let successFuc = res => {
        this.InfoList = res.data.data;
        this.InfoCount = res.data.count;
      };
      let elseFuc = res => {};
      AjaxApi("GetInventoryInfo", this.InfoParams, successFuc, elseFuc);
    },
    //获取初始table数据
    getInitData() {
      let params = {
        with: this.seach_params.with,
        limit: this.seach_params.limit,
        page: this.seach_params.page,
        stores_id:
          this.seach_params.stores_id === "all"
            ? ""
            : this.seach_params.stores_id
      };
      let successFuc = res => {
        this.GoodsData = res.data.data;
        this.listCount = res.data.count;
      };
      let elseFuc = res => {
        this.GoodsData = [];
        this.listCount = 0;
      };
      AjaxApi("GetInventoryListById", params, successFuc, elseFuc);
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

    //动态table高度
    DynamicHeightFuc(Isvh) {
      this.dynamicHeight = String(Isvh - 150);
    }
  },
  mounted() {
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
    // if ("serviceWorker" in navigator) {
    //   console.log(navigator);
    // }
    this.getInitData();
    this.getStoreSelect();
  }
};
</script>

<style  lang="less" scoped>
.m_t_10 {
  margin-top: 10px;
}
// .block_block {
//   height: 25px;
//   text-align: right;
//   margin-top: 0;
//   border-right: 1px solid #e8eaec;
//   border-bottom: 1px solid #e8eaec;
//   border-left: 1px solid #e8eaec;
//   border-right-width: 1px;
//   border-right-style: solid;
//   border-right-color: rgb(232, 234, 236);
// }
</style>


<style  lang="less">
.ivu-table {
  .demo-table-info {
    background-color: #19be6b;
    color: #fff;
  }
  .demo-table-history {
    background-color: #ff6600;
    color: #fff;
  }
}

.inventory {
  .ivu-table-cell {
    padding: 0 !important;
  }
}
.formInv {
  .ivu-form-item {
    margin: 5px;
  }
}
.formSelect {
  text-align: left;
  height: 40px;
  .ivu-form-item {
    margin-bottom: 0;
  }
  .inventory_select_Add {
    .ivu-select-single .ivu-select-selection {
      width: 100%;
    }
  }
}
.inventory_seach_item {
  .ivu-input-wrapper {
    width: 22vw;
  }
}
.labelhistory {
  .ivu-form-item {
    margin-bottom: 0 !important;
  }
}
.inventory-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.Drawer-inventory {
  z-index: 3000;
}
.calc200 {
  width: calc(100vw - 235px);
}
.calc201 {
  width: calc(100vw - 35px);
}
</style>