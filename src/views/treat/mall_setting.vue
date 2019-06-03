<template>
  <div class="mall_setting">
    <Form ref="formInline" :model="seach_params" inline class="Inlineform">
      <!-- <FormItem>
        <Button type="primary" @click="newGood">{{$t("SetLabel")}}</Button>
      </FormItem>-->
      <FormItem>
        <ButtonGroup>
          <Button type="success" @click="changeStatus(1)">
            <Icon type="md-arrow-round-up"/>
            {{$t("Shelf")}}
          </Button>
          <Button type="error" @click="changeStatus(2)">
            {{$t("Obtained")}}
            <Icon type="md-arrow-round-down"/>
          </Button>
        </ButtonGroup>
      </FormItem>
    </Form>
    <Table
      class="m_t_10"
      border
      ref="tableRoot"
      :columns="columns"
      :data="GoodsListData"
      :height="dynamicHeight"
      @on-selection-change="selectTables"
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

    <!-- 编辑商品 -->
    <div v-show="model_edit">
      <Modal
        v-model="model_edit"
        scrollable
        :title="modeltitle"
        @on-ok="do_edit"
        @on-cancel="cancelEdit"
        class-name="mall_setting-center-modal"
        id="editGoods"
        width="700"
      >
        <div>
          <Form
            ref="resetForm"
            class="foodsedit"
            inline
            :model="mallParamsData"
            :rules="resetRule"
            :label-width="50"
          >
            <FormItem :label="$t('Code')" prop="goods_code">
              <Input v-model="mallParamsData.goods_code" placeholder="Code..." clearable></Input>
            </FormItem>
            <FormItem :label="$t('Name')" prop="goods_name">
              <Input v-model="mallParamsData.goods_name" placeholder="Name..." clearable></Input>
            </FormItem>
            <FormItem :label="$t('Currency')" prop="currency">
              <Input v-model="mallParamsData.currency" placeholder="Currency..." clearable></Input>
            </FormItem>
            <FormItem :label="$t('Price')" prop="price">
              <InputNumber
                :min="0"
                :step="1"
                v-model="mallParamsData.price"
                style="width:100%"
                clearable
              ></InputNumber>
            </FormItem>
            <FormItem :label="$t('Duration')" prop="duration">
              <InputNumber :min="0" :step="1" v-model="mallParamsData.duration" style="width:100%"></InputNumber>
            </FormItem>
            <FormItem :label="$t('goods.Sort')" prop="sort">
              <InputNumber :min="0" :step="1" v-model="mallParamsData.sort" style="width:100%"></InputNumber>
            </FormItem>
            <FormItem :label="$t('unit')" prop="unit_id">
              <Select v-model="mallParamsData.unit_id">
                <Option
                  v-for="item in unitList"
                  :value="item.id"
                  :key="item.id"
                >{{ item.unit_name }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('Category')" prop="category_id">
              <Select v-model="mallParamsData.category_id">
                <Option
                  v-for="item in unitList"
                  :value="item.id"
                  :key="item.id"
                >{{ item.unit_name }}</Option>
              </Select>
            </FormItem>
            <FormItem v-show="modeltitle===$t('New')" :label="$t('goods.GoodType')" prop="type">
              <Select v-model="mallParamsData.type">
                <Option :value="1">{{$t('MedicalSupplies')}}</Option>
                <Option :value="2">{{$t('NursingProject')}}</Option>
                <Option :value="3">{{$t('NursingPackage')}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('goods.Description')" prop="goods_desc">
              <Input
                v-model="mallParamsData.goods_desc"
                type="textarea"
                :autosize="{minRows: 1,maxRows:1}"
                placeholder="Description..."
              ></Input>
            </FormItem>
            <FormItem :label="$t('goods.Remarks')" prop="goods_memo">
              <Input
                v-model="mallParamsData.goods_memo"
                type="textarea"
                :autosize="{minRows: 1,maxRows:1}"
                placeholder="Remarks..."
              ></Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelEdit">{{$t('Cancel')}}</Button>
          <Button type="primary" size="small" @click="do_edit">{{$t('Apply')}}</Button>
        </div>
      </Modal>
    </div>
    <Drawer
      :title="$t('SelectLabel')"
      :closable="false"
      @on-close="closeDrawer"
      v-model="ModelDrawer"
      class-name="Drawer-mall"
      placement="left"
      :width="400"
    >
      <Form :model="tagParam">
        <Row :gutter="32">
          <Col span="24">
            <FormItem :label="$t('SelectLabel')" label-position="top">
              <Select v-model="tagParam.tags_id " multiple filterable>
                <Option
                  v-for="(item,index) in tagList"
                  :value="item.value"
                  :key="index"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="mall-drawer-footer">
        <Button type="primary" @click="FucRemarks">{{$t('Apply')}}</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage } from "@/utils/api";
export default {
  name: "mall_setting",
  data() {
    return {
      modeltitle: this.$t('New'),
      ModelDrawer: false,
      tagParam: { goods_id: null, tags_id: [] },
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      StatusId: [], //控制上下架的id串
      tagList: [], //
      model_edit: false, //编辑弹窗状态
      count: 0, //分页总数total
      seach_params: {
        limit: 20,
        page: 1
      }, //获取table列表时的参数
      GoodsListData: [], //页面右侧商品数据
      unitList: [], //单位列表
      //编辑弹窗分类的数据
      mallParamsData: {},
      //主页面
      columns: [
        { type: "selection", width: 40, align: "center" },
        {
          title: this.$t("goods.GoodName"),
          align: "center",
          key: "goods_name",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("goods.GoodCode"),
          align: "center",
          key: "goods_code",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("Label"),
          align: "center",
          key: "tags",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("Status"),
          align: "center",
          key: "status",
          minWidth: 90,
          tooltip: true,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  attrs: {
                    title: this.$t("Status")
                  },
                  props: {
                    type: params.row.status === "已上架" ? "success" : "error",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      let _params = {
                        stand_status: params.row.status === "已上架" ? 2 : 1,
                        goods_id: [params.row.goods_id]
                      };
                      let successFuc = res => {
                        params.row.status =
                          params.row.status === "已上架" ? "未上架" : "已上架";
                        IsAlert("success", this.$t("Successful"));
                        this.$refs.tableRoot.selectAll(false);
                      };
                      let elseFuc = () => {};
                      AjaxApi("SetMallStatus", _params, successFuc, elseFuc);
                    }
                  }
                },
                params.row.status
              )
            ]);
          }
        },
        {
          title: this.$t("goods.CategoryName"),
          align: "center",
          key: "goods_category_name",
          minWidth: 90
        },
        {
          title: this.$t("mall.MallPrice"),
          align: "center",
          key: "price",
          minWidth: 120,
          tooltip: true
        },
        {
          title: this.$t("Duration"),
          align: "center",
          key: "duration",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("Operating"),
          minWidth: 130,
          align: "center",
          render: (h, params) => {
            return h(
              "Poptip",
              {
                props: {
                  trigger: "hover",
                  placement: "left"
                }
              },
              [
                h(
                  "Button",
                  {
                    props: {
                      type: "primary"
                    }
                  },
                  this.$t("Operating")
                ),
                h(
                  "div",
                  {
                    slot: "content"
                  },
                  [
                    h(
                      "Button",
                      {
                        attrs: {
                          title: this.$t("goods.Edit")
                        },
                        props: {
                          type: "primary",
                          size: "small"
                        },
                        style: {
                          marginRight: "5px"
                        },
                        on: {
                          click: () => {
                            this.modeltitle = "编辑";
                            this.mallParamsData = {};
                            this.model_edit = true;
                          }
                        }
                      },
                      this.$t("goods.Edit")
                    ),
                    h(
                      "Button",
                      {
                        attrs: {
                          title: this.$t("SetLabel")
                        },
                        props: {
                          type: "warning",
                          size: "small"
                        },
                        on: {
                          click: () => {
                            this.tagParam.goods_id = params.row.goods_id;
                            this.tagParam.tags_id = [];
                            let arr = params.row.tags.split(",")
                            arr.forEach(item =>{
                              if (this.tagList.find(function(element) {
                                return element.label ===item;
                              })) {
                              let found = this.tagList.find(function(element) {
                                return element.label ===item;
                              });
                              this.tagParam.tags_id.push(found.value)
                              }
                            })
                            console.log(this.tagParam.tags_id);
                            this.ModelDrawer = true;
                          }
                        }
                      },
                      this.$t("SetLabel")
                    )
                  ]
                )
              ]
            );
          }
        }
      ],
      resetRule: {
        goods_code: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("Code")}`,
            trigger: "blur"
          }
        ],
        goods_name: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("Name")}`,
            trigger: "blur"
          }
        ],
        price: [
          {
            required: true,
            type: "number",
            message: `${this.$t("PleaseEnterThe")}${this.$t("Price")}`,
            trigger: "change"
          }
        ],
        duration: [
          {
            required: true,
            type: "number",
            message: `${this.$t("PleaseEnterThe")}${this.$t("Duration")}`,
            trigger: "change"
          }
        ],
        category_id: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message:`${this.$t("PleaseChooseThe")}${this.$t("Category")}`,
            trigger: "change"
          }
        ],
        unit_id: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseChooseThe")}${this.$t("Unit")}`,
            trigger: "change"
          }
        ],
        image_src: [
          {
            required: true,
            message:`${this.$t("PleaseChooseThe")}${this.$t("Picture")}`,
            trigger: "blur"
          }
        ],
        sort: [
          {
            required: true,
            type: "number",
            message: `${this.$t("PleaseEnterThe")}${this.$t("goods.Sort")}`,
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true,
            type: "number",
            message: `${this.$t("PleaseChooseThe")}${this.$t("goods.GoodType")}`,
            trigger: "blur"
          }
        ],
        currency: [
          {
            required: true,
            message: `${this.$t("PleaseEnterThe")}${this.$t("CurrencyUnit")}`,
            trigger: "blur"
          }
        ],
        goods_memo: [
          {
            required: true,
            message: `${this.$t("PleaseEnterThe")}${this.$t("Remarks")}`,
            trigger: "blur"
          }
        ],
        goods_desc: [
          {
            required: true,
            message: `${this.$t("PleaseEnterThe")}${this.$t("description")}`,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    FucRemarks() {
      let successFuc = () => {
        IsAlert("success", this.$t("Successful"));
        this.closeDrawer();
        this.getInitData();
      };
      let elseFuc = () => {};
      AjaxApi("SetMallTags", this.tagParam, successFuc, elseFuc);
    },
    closeDrawer() {
      this.ModelDrawer = false;
      this.tagParam = { tags_id: [], goods_id: null };
    },
    newGood() {
      this.modeltitle = this.$t('New');
      this.mallParamsData = {};
      this.model_edit = true;
    },

    /** 编辑方法———————————————————————————————————————————————————— */
    //编辑弹窗  点击确定的回调（表单验证）
    do_edit() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.this_do_edit();
        }
      });
    },
    //表单验证后确定编辑
    this_do_edit() {
      let successFuc = () => {
        this.modeltitle === this.$t('Edit')
          ? IsAlert("success", this.$t('editedSuccessfully'))
          : IsAlert("success", this.$t('addedSuccessfully'));
        this.getGoodsData();
        this.cancelEdit();
      };
      let elseFuc = () => this.cancelEdit();
      AjaxApi("UpdateTreat", {}, successFuc, elseFuc);
    },
    //编辑弹窗  点击取消的回调（重置表单验证）
    cancelEdit() {
      this.model_edit = false;
      this.$nextTick(() => {
        this.$refs["resetForm"].resetFields();
      });
    },

    /** ？编辑方法———————————————————————————————————————————————————— */

    //控制选择上下架
    selectTables(selection) {
      this.StatusId = [];
      if (selection.length) {
        selection.forEach(element => {
          this.StatusId.push(element.goods_id);
        });
      }
    },
    //批量上下架
    changeStatus(status) {
      if (this.StatusId.length) {
        let params = {
          stand_status: status,
          goods_id: this.StatusId
        };
        let successFuc = res => {
          this.GoodsListData.forEach(element => {
            if (this.StatusId.includes(element.goods_id)) {
              element.status = status === 1 ? "已上架" : "未上架";
            }
          });
          IsAlert("success", this.$t("Successful"));
          this.$refs.tableRoot.selectAll(false);
        };
        let elseFuc = () => {};
        AjaxApi("SetMallStatus", params, successFuc, elseFuc);
      } else {
        IsMessage("success", this.$t("mall.alert"));
      }
    },
    //主页面搜索方法
    searchGoods() {
      this.seach_params.current_page = 1;
      // this.getInitData();
      let successFuc = res => {
        this.GoodsListData = res.data.goods;
        this.count = res.data.count;
      };
      let elseFuc = () => {};
      AjaxApi("GetCategoryList", this.seach_params, successFuc, elseFuc);
    },

    getTagSelect() {
      let successFuc = res => {
        let arrData = [];
        res.data.forEach(i => {
          arrData.push({
            value: i.id.toString(),
            label: i.tag_value
          });
        });
        this.tagList = arrData;
      };
      let elseFuc = () => {};
      AjaxApi("GetMallTags", { type: 1 }, successFuc, elseFuc);
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
        if (res.data.data) {
          res.data.data.forEach(item => {
            item.tags = item.tags + "";
          });
        }
        this.GoodsListData = res.data.data;
        this.count = res.data.count;
      };
      let elseFuc = () => {};
      AjaxApi("GetShoppingMallList", this.seach_params, successFuc, elseFuc);
    },

    //动态table高度
    DynamicHeightFuc(Isvh) {
      this.dynamicHeight = String(Isvh - 220);
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
    this.getInitData();
    this.getTagSelect();
  }
};
</script>

<style scoped lang="less">
.Inlineform {
  text-align: left;
  height: 40px;
  .ivu-form-item {
    margin: 0;
  }
}
.m_t_10 {
  margin-left: 0;
}
.sider {
  /* 顶替内联样式 */
  height: 80vh;
  padding: 0;
  text-align: left;
  background-color: #ffffff;
}
</style>
<style lang="less">
.foodsedit {
  .ivu-form-item-content {
    width: 260px;
  }
}
.mall_setting {
  .ivu-table-cell {
    padding: 0 !important;
  }
}
.mall_setting-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
.treat_Input_clear {
  .ivu-input-icon-clear {
    margin-right: 50px;
  }
}
.btn_visible {
  // position: absolute;
  // left: 120px;
  // top: 5px;
  margin: 5px 0 0 8px;
}
.ivu-layout-has-sider {
  background-color: #ffffff !important;
}
.work_reminder {
  background-color: #ffffff !important;
}
.ivu-layout {
  background-color: #ffffff !important;
}
.ivu-layout-footer {
  background-color: #ffffff !important;
}
#childGoodsModel {
  .ivu-table-wrapper {
    margin-bottom: 5px;
  }
  .ivu-modal-body {
    padding: 5px;
    .ivu-form-item {
      margin-bottom: 5px;
    }
  }
}
#editGoods {
  .ivu-card-body {
    padding: 0 !important;
  }
}
.mall-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.Drawer-mall {
  z-index: 3000;
}
</style>