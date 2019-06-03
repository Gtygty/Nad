<template>
  <div class="transfer">
    <Form :model="seach_params" inline style="text-align:left;height:40px">
      <FormItem>
        <Button type="primary" @click="Transfer_in">{{$t('CallIn')}}</Button>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="Transfer_out">{{$t('CallOut')}}</Button>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="seachModel=true">{{$t('Inquire')}}</Button>
      </FormItem>
    </Form>
    <div style="text-align:center">
      <Table
        border
        :columns="columns_view"
        :data="billListData"
        :height="transferInfoData.length?dynamicHeight*.5-32:dynamicHeight"
         :no-data-text="loadingText ? loadingText : $t('NoData')"
      ></Table>
      <div class="com-footer-right">
        <Page
          size="small"
          :total="seach_params.count"
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
        v-show="transferInfoData.length"
        border
        :columns="columns_Info"
        :data="transferInfoData"
        :height="dynamicHeight*.5"
      ></Table>
      <div class="com-footer-right" v-show="transferInfoData.length">
        <Tag color="error" style="float:left" @click.native="clickTag">{{$t('close')}}</Tag>
        <Tag style="float:left">{{$t('OrderCode')}}{{bill_number}}</Tag>
        <Page
          class="com-footer-right-item"
          size="small"
          :total="transferInfoCount"
          :page-size="transferInfoParams.limit"
          :current="transferInfoParams.page"
          @on-change="handleCurrentChange"
          @on-page-size-change="handlePageSizeChange"
          show-elevator
          show-sizer
          show-total
        />
      </div>
    </div>
    <!-- 查询 单据-->
    <div v-show="seachModel">
      <Modal
        v-model="seachModel"
        scrollable
        :title="$t('SingleInquiryNo')"
        label-width="50"
        @on-ok="do_Search"
        @on-cancel="cancelSearch"
        width="700"
      >
        <div>
          <Form
            ref="FormSearch"
            :model="seach_params"
            :rules="resetRule"
            :label-width="100"
            label-position="left"
          >
            <FormItem :label="`${$t('OrderCode')} :`">
              <Input v-model="seach_params.bill_number" placeholder="code..." style="width:70%"></Input>
            </FormItem>
            <FormItem :label="`${$t('CreationDate')} :`">
              <DatePicker
                type="datetime"
                placeholder="Start Date"
                style="width:  32%"
                :value="seach_params.start_time"
                format="yyyy-MM-dd HH:mm:ss"
                @on-change="changeDate"
              ></DatePicker>&nbsp;&nbsp;&nbsp;---&nbsp;&nbsp;
              <DatePicker
                type="datetime"
                placeholder="End Date"
                style="width: 32%"
                :value="seach_params.end_time"
                format="yyyy-MM-dd HH:mm:ss"
                @on-change="changeDateEnd"
              ></DatePicker>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelSearch">{{$t('Cancel')}}</Button>
          <Button type="primary" size="small" @click="do_Search">{{$t('Apply')}}</Button>
        </div>
      </Modal>
    </div>
    <!-- 序列码 -->
    <div v-show="CodeListModal">
      <Modal v-model="CodeListModal" scrollable :title="$t('SerialCode')" width="700" footer-hide>
        <div>
          <Card
            v-if="SerialCode.length"
            class="box-card-down"
            v-for="(item, index) in SerialCode"
            :key="index"
            :bordered="false"
          >{{item}}</Card>
          <Card v-if="!SerialCode.length" class="box-card-down" :bordered="false">{{$t('NoData')}}</Card>
        </div>
      </Modal>
    </div>
    <!-- 调入界面 -->
    <div v-show="model_edit">
      <Modal
        v-model="model_edit"
        scrollable
        :title="transferTitle"
        :label-width="labelWidth100"
        @on-ok="enterGoods"
        @on-cancel="cancelTransfer"
        id="editGoods"
        width="700"
        footer-hide
      >
        <div>
          <Form inline style="text-align:left;height:40px" class="inlineBut">
            <FormItem>
              <Button type="primary" @click>{{$t('DocImport')}}</Button>
            </FormItem>
            <FormItem style="float:right">
              <Button type="success" @click="AddBill">{{$t('submit')}}</Button>
            </FormItem>
          </Form>
          <Form
            ref="FormBill"
            :model="billData"
            :rules="resetRule"
            :label-width="labelWidth90"
            inline
            label-position="left"
          >
            <FormItem :label="$t('OrderCode')">
              <Input placeholder="code..." style="width:178px" disabled></Input>
            </FormItem>
            <FormItem :label="$t('TransferTime')" prop="transfer_time">
              <DatePicker
                type="datetime"
                :placeholder="$t('TransferTime')"
                :options="disabledData"
                style="width: 178px"
                :value="billData.transfer_time"
                format="yyyy-MM-dd HH:mm:ss"
                @on-change="changeDateBill"
              ></DatePicker>
            </FormItem>
            <FormItem :label="$t('TransferStore')" prop="to_store_id">
              <Select
                v-model="billData.to_store_id"
                clearable
                filterable
                style="width:178px"
                @on-change="chengestoreto"
              >
                <Option
                  v-for="item in StoreOptions"
                  :disabled="item.value===billData.from_store_id"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('RecallStore')" prop="from_store_id">
              <Select
                v-model="billData.from_store_id"
                clearable
                filterable
                style="width:178px"
                @on-change="chengestorefrom"
              >
                <Option
                  v-for="item in StoreOptions"
                  :disabled="item.value===billData.to_store_id"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('Remarks')" prop="memo">
              <Input
                v-model="billData.memo"
                type="textarea"
                :rows="4"
                :placeholder="$t('alertNote')"
                style="width:458px"
              ></Input>
            </FormItem>
          </Form>
          <Form inline style="text-align:left;height:40px" @submit.native.prevent>
            <FormItem>
              <Button
                type="primary"
                @click="enterGoods"
                :disabled="!billData.from_store_id"
              >{{$t('goods.Add')}}</Button>
            </FormItem>
            <FormItem>
              <Button
                type="error"
                @click="deleteGoods"
                :disabled="!deletArr.length"
              >{{$t('Delete')}}</Button>
            </FormItem>
            <FormItem class="transfe_Input_Add">
              <Input
                :disabled="!billData.from_store_id"
                search
                enter-button
                clearable
                :placeholder="$t('alerttheCode')"
                v-model="seach_goods_code"
                @on-search="searchFucType"
                onkeypress="if(event.keyCode == 13) return false;"
              ></Input>
            </FormItem>
          </Form>
          <Table
            class="tableGoods"
            border
            ref="selection"
            :columns="columns_Good"
            :data="transfer_data"
            height="200"
            @on-selection-change="selectGoods"
          ></Table>
        </div>
      </Modal>
    </div>
    <!-- 选择商品 -->
    <div v-show="modalType_enter">
      <Modal
        v-model="modalType_enter"
        scrollable
        :title="$t('SelectProduct')"
        label-width="50"
        @on-cancel="closeModalEnter"
        width="1100"
        footer-hide
      >
        <div>
          <Form inline style="text-align:left;height:40px">
            <FormItem class="transfe_seach_item">
              <Input
                v-model="seach_goods_code"
                :placeholder="$t('alertCode')"
                clearable
                onkeypress="if(event.keyCode == 13) return false;"
              />
            </FormItem>
            <FormItem style="widtn:10vw">
              <Button
                @click="searchFucType(seach_goods_code)"
                :disabled="seach_goods_code===''"
              >{{$t('goods.Add')}}</Button>
            </FormItem>
          </Form>
          <Table
            id="Ucode"
            border
            highlight-row
            @on-row-click="clickRow"
            :columns="columns_view_add"
            :data="enterGoodsData"
            :height="dynamicHeight<500?200:dynamicHeight-200"
          ></Table>
          <div class="com-footer">
            <Page
              :total="transferInCount"
              :page-size="transferInData.limit"
              :current="transferInData.page"
              @on-change="transferInCurrentChange"
              @on-page-size-change="transferInPageSizeChange"
              show-elevator
              show-sizer
              show-total
            />
          </div>
        </div>
      </Modal>
    </div>
    <Drawer
      :title="$t('SerialCodeTitile')"
      :closable="false"
      :styles="styles"
      v-model="Drawer_UniqueCode"
      @on-close="closeDrawer"
      :inner="true"
      :draggable="true"
      class-name="Drawer"
      placement="left"
      :width="400"
    >
      <!-- <p v-for="(item,index) in UcodeData" :value="item" :key="item.index">
        <Tag checkable color="success" :checked="false" @on-change="changeTag" :name="item">{{item}}</Tag>
      </p>-->
      <Checkbox
        :indeterminate="indeterminate"
        :value="checkAll"
        style="min-width:300px"
        @click.prevent.native="handleCheckAll"
      >全选</Checkbox>
      <CheckboxGroup v-model="RowcodeData" @on-change="checkAllGroupChange">
        <Checkbox
          v-for="(item,index) in UcodeData"
          :label="item"
          :key="item.index"
          style="min-width:300px"
        ></Checkbox>
        <label v-show="UcodeData.length>=100&&UcodeData.length!=freezeCode.length">
          <Button type="error" ghost size="small" @click="moreAndmore" long>{{$t('loadMore')}}</Button>
        </label>
      </CheckboxGroup>
      <div class="demo-drawer-footer">
        <Button type="primary" @click="UcodeToRew">{{$t('Apply')}}</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { CODE_OK, IsAlert, AjaxApi, IsLoading, IsMessage } from "@/utils/api";
import { getNow } from "@/utils";
import { mapGetters } from 'vuex'
export default {
  name: "transfer",
  data() {
    return {
      indeterminate: false, //选择序列码时判断全选按钮的显示状态
      checkAll: false, //判断选择序列码时是否全选
      // UcodeData: [], //多选框序列码数据（100个）
      freezeCode: [], //多选框序列码数据（全部）
      RowcodeData: [], //多选框序列码选中的数据
      transferTitle: this.$t("StockTransfer"),
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      bill_number: "",
      disabledData: {
        //调拨日期不可选的时间
        disabledDate(date) {
          // return date && date.valueOf() < Date.now() - 86400000;
          return date && date.valueOf() > Date.now();
        }
      },
      seach_goods_code: "", //
      CodeListModal: false, //详情序列码列表
      SerialCode: [],
      RowcodeNum: 0, //选中的code数量
      RowData: {}, //选中的商品
      deletArr: [], //
      // RowcodeData: [], //选中的code
      transfer_data: [], //选择的商品列表
      billData: {
        transfer_time: "",
        to_store_id: "",
        from_store_id: localStorage.getItem("storeId") + "",
        memo: ""
      }, //单据数据
      UniqueCode: [],
      labelWidth90: 90,
      labelWidth100: 120,
      UcodeData: [], //当前行序列码
      StoreOptions: [],
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      Drawer_UniqueCode: false, //选择序列码抽屉
      model_edit: false, //调入调出界面
      seachModel: false, //搜索
      modalType_enter: false, //选择商品
      transferInCount: 0,
      transferInfoCount: 0,
      transferInfoData: [],
      transferInfoParams: {
        with: "goods",
        id: null,
        page: 1,
        limit: 20
      },
      transferInData: {
        with: "goods,store",
        stores_id: localStorage.getItem("storeId"),
        status: 1,
        // stores_id: 11,
        page: 1,
        limit: 20
      },
      seach_params: {
        with: "admin,fromStore,toStore",
        limit: 20,
        page: 1,
        count: 0,
        bill_number: "",
        start_time: "",
        end_time: ""
      }, //获取table列表时的参数
      seachGood_params: {
        with: "admin,fromStore,toStore",
        limit: 20,
        page: 1,
        goodCode: "",
        bill_number: ""
      }, //获取table列表时的参数
      enterGoodsData: [], //商品列表数据
      billListData: [], //单据数据
      billEditData: {
        //单据商品详细编辑数据
        goods_id: null,
        price: null,
        number: null,
        memo: "",
        goods_code: "",
        goods_name: "",
        store_id: "",
        store_name: "",
        currency: ""
      },
      columns_Info: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
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
          title: this.$t("TransferQuantity"),
          align: "center",
          key: "number",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("univalent"),
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
          tooltip: true,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  attrs: {
                    title: this.$t("SerialCode")
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
                      this.SerialCode = params.row.unique_code;
                      this.CodeListModal = true;
                    }
                  }
                },
                this.$t("SerialCode")
              )
            ]);
          }
        }
      ],
      columns_Good: [
        {
          type: "selection",
          width: 40,
          align: "center"
        },
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: this.$t("Code"),
          align: "center",
          key: "goods_code",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("Name"),
          align: "center",
          key: "goods_name",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("TransferQuantity"),
          align: "center",
          key: "number",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("CheckSerialCode"),
          align: "center",
          key: "unique_code",
          minWidth: 90,
          tooltip: true,
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  attrs: {
                    title: this.$t("SerialCode")
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
                      this.clickOldFuc(params.row);
                      // this.SerialCode = params.row.unique_code.split(",");
                      // this.CodeListModal = true;
                    }
                  }
                },
                this.$t("CheckSerialCode")
              )
            ]);
          }
        }
      ],
      columns_view: [
        {
          title: this.$t("OrderCode"),
          align: "center",
          key: "bill_number",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("CallOut"),
          align: "center",
          key: "from_store",
          minWidth: 90,
          tooltip: true,
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  fontSize: "10px"
                }
              },
              params.row.from_store.store_name
            );
          }
        },
        {
          title: this.$t("CallIn"),
          align: "center",
          key: "to_store",
          minWidth: 90,
          tooltip: true,
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  fontSize: "10px"
                }
              },
              params.row.to_store.store_name
            );
          }
        },
        {
          title: this.$t("Founder"),
          align: "center",
          key: "admin",
          minWidth: 90,
          tooltip: true,
          render: (h, params) => {
            return h(
              "div",
              {
                style: {
                  fontSize: "10px"
                }
              },
              params.row.admin.admin_name
            );
          }
        },
        {
          title: this.$t("TransferTime"),
          align: "center",
          key: "transfer_time",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("CreationTime"),
          align: "center",
          key: "created_at",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("Remarks"),
          align: "center",
          key: "memo",
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
                      this.bill_number = params.row.bill_number;
                      this.transferInfoParams.page = 1;
                      this.transferInfoParams.limit = 20;
                      this.transferInfoParams.id = params.row.id;
                      let successFuc = res => {
                        this.transferInfoData = res.data.data;
                        this.transferInfoCount = res.data.count;
                        this.modalInfo = true;
                      };
                      let elseFuc = res => {};
                      AjaxApi(
                        "GetTransferInfo",
                        this.transferInfoParams,
                        successFuc,
                        elseFuc
                      );
                    }
                  }
                },
                this.$t("ViewDetails")
              )
            ]);
          }
        }
      ],
      columns_view_add: [
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
          title: this.$t("IncomingStore"),
          align: "center",
          key: "stores_name",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("QuantityOfPurchase"),
          align: "center",
          key: "number",
          minWidth: 120,
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
          title: this.$t("Currency"),
          align: "center",
          key: "currency",
          minWidth: 90,
          tooltip: true
        }
      ],
      resetRule: {
        transfer_time: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseChooseThe")} ${this.$t("TransferTime")}`,
            trigger: "blur"
          }
        ],
        to_store_id: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseChooseThe")} ${this.$t(
              "TransferStore"
            )}`,
            trigger: "blur"
          }
        ],
        from_store_id: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseChooseThe")} ${this.$t("RecallStore")}`,
            trigger: "blur"
          }
        ],
        memo: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")} ${this.$t("Remarks")}`,
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
    //点击商品列表某一行
    clickOldFuc(row) {
      let params = {
        with: "goods,store",
        limit: 1,
        status: 1,
        page: 1,
        id: row.id
      };
      let successFuc = res => {
        this.clickRow(res.data.data[0]);
      };
      let elseFuc = res => {};
      AjaxApi("GetInventoryListById", params, successFuc, elseFuc);
    },
    //序列码加载更多
    moreAndmore() {
      this.UcodeData = this.UcodeData.concat(
        this.freezeCode.slice(
          this.UcodeData.length,
          this.UcodeData.length + 100
        )
      );
    },
    //序列码多选框change事件，控制全选与否
    checkAllGroupChange(data) {
      if (data.length === this.freezeCode.length) {
        this.indeterminate = false;
        this.checkAll = true;
      } else if (data.length > 0) {
        this.indeterminate = true;
        this.checkAll = false;
      } else {
        this.indeterminate = false;
        this.checkAll = false;
      }
    },
    //控制序列码全选
    handleCheckAll() {
      if (this.indeterminate) {
        this.checkAll = false;
      } else {
        this.checkAll = !this.checkAll;
      }
      this.indeterminate = false;

      if (this.checkAll) {
        this.RowcodeData = this.freezeCode;
      } else {
        this.RowcodeData = [];
      }
    },
    clickTag() {
      this.transferInfoData = [];
    },
    // 商品列表change选择框时的方法 ，控制删除
    selectGoods(selection) {
      let arr = [];
      if (selection.length) {
        selection.forEach(element => {
          arr.push(element.goods_code);
        });
      }
      this.deletArr = arr;
    },
    //删除商品
    deleteGoods() {
      if (this.deletArr.length) {
        let arr = [];
        for (let index = 0; index < this.transfer_data.length; index++) {
          if (!this.deletArr.includes(this.transfer_data[index].goods_code)) {
            // this.editDataGoods.slice(index, 1);
            arr.push(this.transfer_data[index]);
          }
        }
        this.transfer_data = arr;
        this.deletArr = [];
      } else {
        IsAlert("warning", this.$t("Error"), this.$t("mall.alert"));
      }
    },
    Transfer_out() {
      this.transferTitle = this.$t("StockRecall");
      this.deletArr = [];
      this.transfer_data = [];
      this.billData = {
        transfer_time: getNow(),
        to_store_id: "",
        from_store_id: localStorage.getItem("storeId") + "",
        memo: ""
      }; //单据数据
      this.model_edit = true;
    },
    Transfer_in() {
      this.transferTitle = this.$t("StockTransfer");
      this.deletArr = [];
      this.transfer_data = [];
      this.billData = {
        transfer_time: getNow(),
        to_store_id: localStorage.getItem("storeId") + "",
        from_store_id: "",
        memo: ""
      }; //单据数据
      this.model_edit = true;
    },
    UcodeToRew() {
      if (this.RowcodeData.length) {
        this.RowData.number = this.RowcodeData.length;
        this.RowData.unique_code = this.RowcodeData + "";
        // this.RowData.unique_code = this.RowData.unique_code + "";
        let that = this;
        let found = this.transfer_data.find(function(element) {
          return element.goods_code === that.RowData.goods_code;
        });
        let foundIndex = this.transfer_data.indexOf(found);
        if (found && found.goods_code === that.RowData.goods_code) {
          this.transfer_data.splice(foundIndex, 1, this.RowData);
        } else {
          this.transfer_data.push(this.RowData);
        }
        // this.transfer_data.push(this.RowData);
        this.closeDrawer();
        this.modalType_enter = false;
        this.deletArr = [];
      } else {
        IsAlert("error", this.$t("Error"), this.$t("AtLeast"));
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
      this.UcodeData = [];
      this.RowcodeData = [];
      this.Drawer_UniqueCode = false;
    },
    clickRow(currentRow, oldCurrentRow) {
      if (
        this.transfer_data.find(function(i) {
          return i.goods_code === currentRow.goods_code;
        })
      ) {
        // IsAlert("error", this.$t("Error"), this.$t("alertDouble"));
        let data = this.transfer_data.find(function(i) {
          return i.goods_code === currentRow.goods_code;
        });
        this.RowData = {
          id: currentRow.id,
          goods_name: data.goods_name,
          goods_id: data.goods_id,
          price: data.price,
          number: data.number,
          goods_code: data.goods_code,
          unique_code: []
        };
        this.RowcodeData = data.unique_code.split(",");
        this.freezeCode = currentRow.unique_code;
        if (this.RowcodeData.length === currentRow.unique_code.length) {
          this.indeterminate = false;
          this.checkAll = true;
        } else {
          this.indeterminate = false;
          this.checkAll = true;
        }
        if (currentRow.unique_code.length > 100) {
          this.UcodeData = currentRow.unique_code.slice(0, 100);
        } else {
          this.UcodeData = currentRow.unique_code;
        }
        this.Drawer_UniqueCode = true;
      } else {
        this.RowData = {
          id: currentRow.id,
          goods_name: currentRow.goods_name,
          goods_id: currentRow.goods_id,
          price: currentRow.price,
          number: currentRow.number,
          goods_code: currentRow.goods_code,
          // memo: currentRow.memo,
          unique_code: []
        };
        this.indeterminate = false;
        this.checkAll = false;
        this.freezeCode = currentRow.unique_code;
        if (currentRow.unique_code.length > 100) {
          this.UcodeData = currentRow.unique_code.slice(0, 100);
        } else {
          this.UcodeData = currentRow.unique_code;
        }
        // this.UcodeData = currentRow.unique_code;
        this.Drawer_UniqueCode = true;
      }
    },
    AddBill() {
      this.$refs.FormBill.validate(valid => {
        if (valid) {
          this.do_Do();
        }
      });
    },
    do_Do() {
      if (!this.transfer_data.length) {
        IsAlert("error", this.$t("Error"), this.$t("alertAdd"));
      } else {
        let params = {
          transfer_data: this.transfer_data,
          memo: this.billData.memo,
          from_store_id: this.billData.from_store_id,
          to_store_id: this.billData.to_store_id,
          transfer_time: this.billData.transfer_time
        };
        let successFuc = res => {
          IsAlert("success", this.$t("Successful"));
          this.getInitData();
          this.model_edit = false;
        };
        let elseFuc = res => {};
        AjaxApi("AddTransferBill", params, successFuc, elseFuc);
      }
    },
    closeModalEnter() {},
    cancelTransfer() {
      this.$nextTick(() => {
        this.$refs.FormBill.resetFields();
        this.model_edit = false;
        this.transfer_data = [];
        this.deletArr = [];
      });
    },
    enterGoods() {
      let params = this.transferInData;
      let successFuc = res => {
        if (res.data.length === 0) {
          IsAlert("error", this.$t("Error"), this.$t("ErrorStore"));
          return;
        }
        this.transferInCount = res.data.count;
        res.data.data.forEach(i => {
          i.ucode = [];
        });
        this.enterGoodsData = res.data.data;
        this.modalType_enter = true;
      };
      let elseFuc = res => {};
      AjaxApi("GetInventoryListById", params, successFuc, elseFuc);
    },
    chengestorefrom(value) {
      this.billData.from_store_id = value;
      this.transferInData.stores_id = value;
    },
    chengestoreto(value) {
      this.billData.to_store_id = value;
    },
    do_Search() {
      IsLoading();
      this.seach_params.limit = 20;
      this.seach_params.page = 1;
      this.seach_params.count = 0;
      let successFuc = res => {
        this.billListData = res.data.data;
        this.seach_params.count = res.data.count;
      };
      let elseFuc = res => {
        IsMessage("error", this.$t("NoData"));
        return;
        // this.billListData = [];
        // this.seach_params.count = 0;
      };
      AjaxApi("GetTransferList", this.seach_params, successFuc, elseFuc);
      // this.getInitData();
      this.cancelSearch();
    },
    cancelSearch() {
      this.seach_params = {
        //查询单据的参数
        with: "admin,fromStore,toStore",
        limit: 20,
        page: 1,
        count: 0,
        bill_number: "",
        start_time: "",
        end_time: ""
      };
      this.seachModel = false;
    },
    searchFucType(value) {
      if (!value) {
      } else if (
        this.transfer_data.find(function(i) {
          return i.goods_code === value;
        })
      ) {
        IsAlert("error", this.$t("Error"), this.$t("alertDouble"));
      } else {
        let params = {
          with: this.transferInData.with,
          goods_code: value,
          stores_id: this.transferInData.stores_id,
          status: 1,
          page: 1,
          limit: 20
        };
        let successFuc = res => {
          let obj = res.data.data[0];
          this.RowData = {
            goods_name: obj.goods_name,
            goods_id: obj.goods_id,
            price: obj.price,
            number: obj.number,
            goods_code: obj.goods_code,
            unique_code: []
          };
          this.UcodeData = obj.unique_code;
          this.Drawer_UniqueCode = true;
          this.seach_goods_code = "";
        };
        let elseFuc = res => {
          this.seach_goods_code = "";
        };
        AjaxApi("GetInventoryListById", params, successFuc, elseFuc);
      }
    },
    changeDate(model, date) {
      this.seach_params.start_time = model;
    },
    changeDateEnd(model, date) {
      this.seach_params.end_time = model;
    },
    changeDateBill(model, date) {
      this.billData.transfer_time = model;
    },
    /* 按钮方法—————————————————————————————————————————————————————————— */

    /* /按钮方法—————————————————————————————————————————————————————————— */

    //分页跳转方法
    handleCurrentChange(page) {
      this.$store.commit('lOADINGTEXT', this.$t('LoadingText'));
      this.billListData = [];
      this.seach_params.page = page;
      this.getInitData();
    },
    //分页页数改变
    handlePageSizeChange(limit) {
      this.$store.commit('lOADINGTEXT', this.$t('LoadingText'));
      this.billListData = [];
      this.seach_params.limit = limit;
      this.getInitData();
    },
    //分页跳转方法Child
    transferInCurrentChange(page) {
      this.transferInData.page = page;
      this.enterGoods();
    },
    //分页页数改变Child
    transferInPageSizeChange(limit) {
      this.transferInData.limit = limit;
      this.enterGoods();
    },
    //获取初始table数据
    getInitData() {
      let successFuc = res => {
        this.billListData = res.data.data;
        this.seach_params.count = res.data.count;
      };
      let elseFuc = res => {
        this.billListData = [];
        this.seach_params.count = 0;
      };
      AjaxApi("GetTransferList", this.seach_params, successFuc, elseFuc);
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
    this.getInitData();
    this.getStoreSelect();
  }
};
</script>

<style  lang="less" scoped>
.m_t_10 {
  margin-top: 10px;
}
.block_block {
  height: 25px;
  text-align: right;
  margin-top: 0;
  // border-right: 1px solid #e8eaec;
  // border-bottom: 1px solid #e8eaec;
  // border-left: 1px solid #e8eaec;
  // border-right-width: 1px;
  // border-right-style: solid;
  // border-right-color: rgb(232, 234, 236);
}
</style>
<style  lang="less">
.trans-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    .ivu-modal-body {
      padding: 5px 16px 0 16px;
      .ivu-table-cell {
        padding: 0;
      }
    }
    top: 0;
    .ivu-form-item-label {
      padding: 10px 0 10px 0;
    }
    .inlineBut {
      .ivu-form-item {
        margin: 0;
      }
    }
  }
}
.tableGoods {
  .ivu-table-cell-with-selection {
    padding: 0;
  }
}
.transfer-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
.transfer {
  .ivu-table-cell {
    padding: 0 !important;
  }
}
#Ucode {
  .ivu-table-cell {
    padding: 0 !important;
  }
  .ivu-select-selection {
    height: 47px;
  }
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder,
  .ivu-select-single .ivu-select-selection .ivu-select-selected-value {
    line-height: 47px;
  }
}
.transfe_Input_clear {
  .ivu-form-item-content {
    .ivu-input {
      width: 25vw;
    }
  }
  .ivu-input-icon-clear {
    margin-right: 50px;
  }
}
.transfe_Input_Add {
  // .ivu-form-item-content {
  //   .ivu-input {
  //     width: 25vw;
  //   }
  // }
  .ivu-input-icon-clear {
    margin-right: 50px;
  }
}
.transfe_seach_item {
  .ivu-input-wrapper {
    width: 22vw;
  }
}
.box-card-down {
  background-color: #add8f7;
  padding: 0;
  line-height: 24px;
  color: black;
  height: 24px;
  margin: 5px auto;
  text-align: center;
  min-width: 400px;
  max-width: 600px;
  margin-bottom: 10px;
  .ivu-card-body {
    margin-bottom: 0;
    padding: 0;
  }
  .ivu-tag {
    display: block;
    text-align: center;
    font-size: 12px;
  }
}
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.Drawer {
  z-index: 3000000;
}
</style>