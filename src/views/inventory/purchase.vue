<template>
  <div class="purchase">
    <Form :model="seach_params" inline style="text-align:left;height:40px">
      <FormItem>
        <Button type="primary" @click="enterGoods">{{$t('Purchase')}}</Button>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="ReturnModal=true">{{$t('Return')}}</Button>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="seachModal=true">{{$t('Inquire')}}</Button>
      </FormItem>
    </Form>
    <div style="text-align:center">
      <Table
        class="m_t_10"
        border
        :columns="columns_purchase"
        :data="billListData"
        :no-data-text="loadingText ? loadingText : $t('NoData')"
        :height="dynamicHeight"
      ></Table>
      <div class="com-footer">
        <Page
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
    </div>
    <!-- 编辑 进货商品信息-->
    <div v-show="EnterEditModal">
      <Modal
        v-model="EnterEditModal"
        scrollable
        :title="$t('EditDetails')"
        label-width="50"
        @on-ok="do_AddOne"
        @on-cancel="cancelAddOne"
        width="700"
      >
        <div>
          <Form
            v-if="billEditData"
            ref="FormDetail"
            :model="billEditData"
            :rules="resetRule"
            :label-width="50"
            inline
          >
            <FormItem :label="$t('goods.GoodCode')" :label-width="labelWidth100" prop="goods_code">
              <Input
                v-model="billEditData.goods_code"
                placeholder="Code..."
                :disabled="editButtonDisable"
              ></Input>
            </FormItem>
            <FormItem :label="$t('goods.GoodName')" :label-width="labelWidth100" prop="goods_name">
              <Input
                v-model="billEditData.goods_name"
                placeholder="Name..."
                :disabled="editButtonDisable"
              ></Input>
            </FormItem>
            <FormItem :label="$t('IncomingStore')" :label-width="labelWidth100" prop="store_id">
              <Select
                label-in-value
                v-model="billEditData.store_id"
                clearable
                filterable
                style="width:162px"
                @on-change="chengestore"
              >
                <Option
                  v-for="item in StoreOptions"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('PurchaseUnitPrice')" :label-width="labelWidth100" prop="price">
              <InputNumber
                :min="0.01"
                :step="1"
                :precision="2"
                v-model="billEditData.price"
                style="width:162px"
              ></InputNumber>
            </FormItem>
            <FormItem :label="$t('QuantityOfPurchase')" :label-width="labelWidth100" prop="number">
              <InputNumber
                :min="1"
                :step="1"
                :precision="0"
                v-model="billEditData.number"
                style="width:162px"
              ></InputNumber>
            </FormItem>
            <FormItem :label="$t('Remarks')" :label-width="labelWidth100" prop="memo">
              <Input
                v-model="billEditData.memo"
                type="textarea"
                :rows="4"
                placeholder="Please enter a note..."
                style="width:458px"
              ></Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelAddOne">{{$t('Cancel')}}</Button>
          <Button type="primary" size="small" @click="do_AddOne">{{$t('Apply')}}</Button>
        </div>
      </Modal>
    </div>
    <!-- 查询 单据-->
    <div v-show="seachModal">
      <Modal
        v-model="seachModal"
        scrollable
        :title="$t('receiptInquire')"
        label-width="50"
        @on-ok="do_Search"
        @on-cancel="cancelSearch"
        width="700"
      >
        <div>
          <Form ref="FormSearch" :model="seach_params" :rules="resetRule" :label-width="50">
            <FormItem :label="$t('OrderCode')" :label-width="labelWidth100">
              <Input
                v-model="seach_params.bill_number"
                placeholder="OrderCode..."
                style="width:70%"
              ></Input>
            </FormItem>
            <FormItem :label="$t('OrderType')" :label-width="labelWidth100">
              <Select v-model="seach_params.type" style="width:70%" clearable>
                <Option value="1">{{$t('PurchaseOrder')}}</Option>
                <Option value="2">{{$t('ShipmentOrder')}}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('Founder')" :label-width="labelWidth100">
              <Select v-model="seach_params.operate_by" clearable filterable style="width:70%">
                <Option
                  v-for="item in PersonOptions"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
            <FormItem :label="$t('CreationDate')" :label-width="labelWidth100">
              <DatePicker
                type="datetime"
                placeholder="Start date"
                style="width:  32%"
                :value="seach_params.start_time"
                format="yyyy-MM-dd HH:mm:ss"
                @on-change="changeDate"
              ></DatePicker>&nbsp;&nbsp;&nbsp;---&nbsp;&nbsp;
              <DatePicker
                type="datetime"
                placeholder="End date"
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
    <!-- 采购 说明-->
    <div v-show="descriptionModal">
      <Modal
        v-model="descriptionModal"
        scrollable
        :title="$t('PurchaseInstructions')"
        label-width="50"
        @on-ok="do_AddBill"
        @on-cancel="cancelAddBill"
        width="700"
      >
        <div>
          <Form
            v-if="descriptionModal"
            ref="FormDescrip"
            :model="seach_params"
            :rules="resetRule"
            :label-width="50"
          >
            <FormItem
              :label="$t('PurchaseInstructions')"
              :label-width="labelWidth100"
              prop="descrip"
            >
              <Input
                type="textarea"
                :rows="4"
                v-model="seach_params.descrip"
                placeholder="Please enter the purchase instructions..."
                style="width:85%"
              ></Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelAddBill">{{$t('Cancel')}}</Button>
          <Button type="primary" size="small" @click="do_AddBill">{{$t('Apply')}}</Button>
        </div>
      </Modal>
    </div>
    <!-- 退货 说明-->
    <div v-show="ReturnDescModel">
      <Modal
        v-model="ReturnDescModel"
        scrollable
        :title="$t('Returnnote')"
        label-width="50"
        @on-ok="do_AddBill"
        @on-cancel="cancelOutBill"
        width="700"
      >
        <div v-if="ReturnDescModel">
          <Form
            v-if="ReturnDescModel"
            ref="FormOutDescrip"
            :model="purchaseData"
            :rules="resetRule"
            :label-width="50"
          >
            <FormItem :label="$t('Returnnote')" :label-width="labelWidth100" prop="descrip">
              <Input
                type="textarea"
                :rows="4"
                v-model="purchaseData.descrip"
                placeholder="Please enter the return instructions..."
                style="width:85%"
              ></Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelOut">{{$t('Cancel')}}</Button>
          <Button type="primary" size="small" @click="do_OutBill">{{$t('Apply')}}</Button>
        </div>
      </Modal>
    </div>
    <!-- 进货 -->
    <div v-show="enterModal">
      <Modal
        v-model="enterModal"
        scrollable
        :title="$t('Purchase')"
        label-width="50"
        @on-cancel="closeModalEnter"
        :mask-closable="false"
        width="1200"
        footer-hide
      >
        <div>
          <Row :gutter="16">
            <Col span="4">
              <Form
                :model="seach_params"
                style="text-align:left;height:40px"
                @submit.native.prevent
              >
                <FormItem class="purchase_Input_Add">
                  <Input
                    search
                    enter-button
                    clearable
                    :placeholder="$t('alertName')"
                    v-model="seach_params.nodeId"
                    @on-search="searchFucType"
                    @on-clear="searchFucType"
                    onkeypress="if(event.keyCode == 13) return false;"
                  ></Input>
                  <!-- <Input
                    search
                    enter-button
                    clearable
                    :placeholder="$t('alertName')"
                    v-model="seach_params.nodeId"
                    @on-focus="focusWidth='700px'"
                    @on-blur="focusWidth='100%';searchFucType(seach_params.nodeId)"
                    @on-search="searchFucType"
                    @on-clear="searchFucType"
                    onkeypress="if(event.keyCode == 13) return false;"
                    :style="{width: focusWidth}"
                  ></Input>-->
                </FormItem>
              </Form>
              <Tree :data="treatData" :render="renderContent"></Tree>
            </Col>
            <Col span="18">
              <Form :model="seach_params" inline style="text-align:left;height:40px">
                <FormItem class="purchase_seach_item">
                  <Input
                    v-model="seach_params.goodCode"
                    :placeholder="$t('alertCode')"
                    @on-enter="addGoods"
                    clearable
                  />
                </FormItem>
                <FormItem style="widtn:10vw">
                  <Button
                    @click="addGoods"
                    :disabled="seach_params.goodCode===''"
                  >{{$t('goods.Add')}}</Button>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="do_change">{{$t('submit')}}</Button>
                </FormItem>
              </Form>
              <div style="text-align:center">
                <Table
                  class="m_t_10"
                  border
                  :columns="columns_enter"
                  :data="enterGoodsData"
                  :height="dynamicHeight<500?200:dynamicHeight-200"
                ></Table>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
    <!-- 选择退货商品 -->
    <div v-show="ListForReturnModal">
      <Modal
        v-model="ListForReturnModal"
        scrollable
        :title="$t('returnedPurchase')"
        label-width="50"
        @on-cancel="closeModalReturn"
        class-name="ReturnModal"
        width="1200"
        footer-hide
      >
        <div>
          <Row>
            <Col :xs="24" :sm="24" :md="24" :lg="24">
              <Form inline class="FormOutGood">
                <FormItem :label="$t('StorefrontLabel')" :label-width="50" :model="outStoreParam">
                  <Select
                    label-in-value
                    v-model="outStoreParam.StoreId"
                    filterable
                    :placeholder="$t('Storefront')"
                    @on-change="chengestoreId"
                    style="width:100%"
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
              </Form>
              <div style="text-align:center">
                <Table
                  class="m_t_10"
                  border
                  :columns="columns_listForReturn"
                  :data="OutGoodsData"
                  :height="dynamicHeight<500?200:dynamicHeight-200"
                  :highlight-row="true"
                  @on-row-click="clickRow"
                ></Table>
                <div class="com-footer">
                  <Page
                    :total="outStoreParam.count"
                    :page-size="outStoreParam.limit"
                    :current="outStoreParam.page"
                    @on-change="CurrentChangeOut"
                    @on-page-size-change="PageSizeChangeOut"
                    show-elevator
                    show-sizer
                    show-total
                  />
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
    <!-- 退货弹窗 -->
    <div v-show="ReturnModal">
      <Modal
        v-model="ReturnModal"
        scrollable
        :title="$t('returnedPurchase')"
        label-width="50"
        @on-cancel="cancelOut"
        width="900"
        footer-hide
        class-name="ReturnModal"
      >
        <div>
          <Form inline class="form-item-margin0" @submit.native.prevent>
            <FormItem>
              <Button type="primary" @click="ShowOutGoods">{{$t('goods.Add')}}</Button>
            </FormItem>
            <FormItem>
              <Button type="error" @click="deleteGoods">{{$t('Delete')}}</Button>
            </FormItem>
            <FormItem class="purchase_Input_clear">
              <Input
                search
                enter-button
                clearable
                :placeholder="$t('alertCode')"
                v-model="ReturnSeach"
                @on-search="ReturnBySearchCode"
                onkeypress="if(event.keyCode == 13) return false;"
              ></Input>
            </FormItem>
            <FormItem style="float:right">
              <Button type="success" @click="SubmitReturn">{{$t('submit')}}</Button>
            </FormItem>
          </Form>
          <Table
            class="tableGoods"
            border
            ref="selection"
            :columns="columns_return"
            :data="ReturnGoodsData"
            :height="dynamicHeight<500?200:dynamicHeight-200"
            :highlight-row="true"
            @on-selection-change="selectGoods"
          ></Table>
        </div>
      </Modal>
    </div>
    <!-- 查看单据明细 -->
    <div v-show="DetailModal">
      <Modal
        v-model="DetailModal"
        scrollable
        :title="$t('ViewDetails')"
        label-width="50"
        width="1100"
        footer-hide
      >
        <div>
          <Table
            class="m_t_10"
            border
            :columns="columns_detail"
            :data="ViewListData"
            :height="dynamicHeight-100"
          ></Table>
          <div class="com-footer">
            <Page
              :total="params_detail.count"
              :page-size="params_detail.limit"
              :current="params_detail.page"
              @on-change="handleCurrentChangeChild"
              @on-page-size-change="handlePageSizeChangeChild"
              show-elevator
              show-sizer
              show-total
            />
          </div>
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
    <Drawer
      title="请选择序列码"
      :closable="false"
      :styles="styles"
      v-model="DrawerCheckSerialCode"
      @on-close="closeDrawer"
      :inner="true"
      :draggable="true"
      class-name="DrawerName"
      placement="left"
      :width="400"
    >
      <Checkbox
        :indeterminate="indeterminate"
        :value="checkAll"
        style="min-width:300px"
        @click.prevent.native="handleCheckAll"
      >全选</Checkbox>
      <CheckboxGroup v-model="RowcodeData" @on-change="checkAllGroupChange">
        <Checkbox
          v-for="(item,index) in CheckCodeData"
          :label="item"
          :key="item.index"
          style="min-width:300px"
        ></Checkbox>
        <label v-show="CheckCodeData.length>=100&&CheckCodeData.length!=freezeCode.length">
          <Button type="error" ghost size="small" @click="moreAndmore" long>{{$t('loadMore')}}</Button>
        </label>
      </CheckboxGroup>
      <div class="pur-drawer-footer">
        <Button type="primary" @click="UcodeToRew">{{$t('Apply')}}</Button>
      </div>
    </Drawer>
    <Drawer
      title="填写信息"
      :closable="false"
      @on-close="closeDrawer"
      v-model="DrawerEnterRemarks"
      class-name="DrawerName2"
      placement="left"
      :width="400"
    >
      <Form :model="RowData" ref="FormMemo" :rules="resetRule">
        <Row :gutter="32">
          <Col span="24">
            <FormItem :label="$t('returnRemarks')" label-position="top" prop="memo">
              <Input
                type="textarea"
                :autosize="{minRows: 2,maxRows: 5}"
                v-model="RowData.memo"
                placeholder="please enter a note"
              ></Input>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div class="pur-drawer-footer">
        <Button type="primary" @click="FucRemarks">{{$t('Apply')}}</Button>
      </div>
    </Drawer>
  </div>
</template>

<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage } from "@/utils/api";
import { mapGetters } from 'vuex'
export default {
  name: "purchase",
  data() {
    return {
      StoresList: {},
      focusWidth: "100%",
      // maxCount: 1000000,
      indeterminate: false, //选择序列码时判断全选按钮的显示状态
      checkAll: false, //判断选择序列码时是否全选
      typeGoods: 1, //判断进货退货的字段显示
      SerialCode: [], //序列码（查看详情）
      treatData: [], //进货时左侧树状数据
      treatDataInit: [], //深拷贝备份数据
      labelWidth100: 120,
      ViewListData: [], //详情table数据
      StoreOptions: [], //商店下拉数据
      PersonOptions: [], //创建人下拉数据
      //序列码私有样式
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      DrawerCheckSerialCode: false, //选择序列码Drawer
      DrawerEnterRemarks: false, //选择序列码后填写备注Drawer
      CheckCodeData: [], //多选框序列码数据（100个）
      freezeCode: [], //多选框序列码数据（全部）
      RowcodeData: [], //多选框序列码选中的数据
      outStoreParam: { count: 0, StoreId: "", limit: 20, page: 1 }, //退货时查询库存列表的参数
      ReturnGoodsData: [], //退货列表table的数据
      RowData: {}, //退货时选中某行的商品
      deletArr: [], //控制删除的数组
      ReturnSeach: "", //退货时输入框搜索值
      OutGoodsData: [], //选择商品退货table数据
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      descriptionModal: false, //采购说明
      seachModal: false, //搜索弹窗
      CodeListModal: false, //详情序列码列表
      enterModal: false, //进货
      ReturnModal: false, //退货
      ListForReturnModal: false, //选择退货商品弹窗
      EnterEditModal: false, //进货编辑商品信息
      editButtonDisable: true, //进货编辑商品信息时按钮禁用
      DetailModal: false, //查看单据明细
      ReturnDescModel: false, //退货说明
      purchaseData: { descrip: "" }, //退货说明参数
      seach_params: {
        with: "admin",
        limit: 20,
        page: 1,
        count: 0,
        nodeId: "",
        goodCode: "",
        bill_number: "",
        type: "",
        operate_by: "",
        start_time: "",
        end_time: "",
        descrip: ""
      }, //获取table列表时的参数
      params_detail: {
        id: null,
        count: 0,
        limit: 20,
        page: 1,
        goodCode: ""
      }, //获取详情table列表时的参数
      enterGoodsData: [], //进货数据
      billListData: [], //单据列表数据
      billEditData: {
        //进货商品编辑数据
        goods_id: null,
        price: null,
        number: 1,
        memo: "",
        goods_code: "",
        goods_name: "",
        store_id: "",
        store_name: "",
        currency: ""
      },
      columns_purchase: [
        {
          title: this.$t("OrderCode"),
          align: "center",
          key: "bill_number",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("OrderType"),
          align: "center",
          key: "type",
          minWidth: 80,
          render: (h, params) => {
            const row = params.row;
            const color = row.type === 1 ? "cyan" : "gold";
            const text =
              row.type === 1
                ? this.$t("PurchaseOrder")
                : this.$t("ShipmentOrder");
            return h(
              "Tag",
              {
                style: {
                  fontSize: "10px"
                },
                props: {
                  color: color
                }
              },
              text
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
                    title: this.$t("Details")
                  },
                  props: {
                    type: "success",
                    // shape: "circle",
                    // icon: "md-eye",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      let _params = {
                        with: "goods,store,purchase ",
                        id: params.row.id,
                        page: 1,
                        limit: 20
                      };
                      let successFuc = res => {
                        this.typeGoods = params.row.type;
                        this.columns_detail[2].title =
                          params.row.type === 1
                            ? this.$t("IncomingStore")
                            : this.$t("ShipmentStore");
                        this.columns_detail[3].title =
                          params.row.type === 1
                            ? this.$t("QuantityofPurchase")
                            : this.$t("QuantityofShipments");
                        this.ViewListData = res.data.data;
                        this.params_detail.count = res.data.count;
                        this.params_detail.id = params.row.id;
                        this.params_detail.page = 1;
                        this.params_detail.limit = 20;
                        this.$nextTick(() => {
                          this.DetailModal = true;
                        });
                      };
                      let elseFuc = res => {};
                      AjaxApi("GetPurchaseInfo", _params, successFuc, elseFuc);
                    }
                  }
                },
                this.$t("Details")
              )
            ]);
          }
        }
      ],
      columns_enter: [
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
          key: "store_name",
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
          title: this.$t("CurrencyUnit"),
          align: "center",
          key: "currency",
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
              h("Button", {
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
                    this.billEditData = {
                      _index: params.row._index,
                      price: params.row.price,
                      number: params.row.number,
                      memo: params.row.memo,
                      goods_id: params.row.goods_id,
                      goods_code: params.row.goods_code,
                      goods_name: params.row.goods_name,
                      store_id: params.row.store_id,
                      store_name: params.row.store_name,
                      currency: params.row.currency
                    };
                    this.EnterEditModal = true;
                  }
                }
              }),
              h("Button", {
                attrs: {
                  title: this.$t("Delete")
                },
                props: {
                  type: "error",
                  shape: "circle",
                  icon: "md-close-circle",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.enterGoodsData.splice(params.row._index, 1);
                  }
                }
              })
            ]);
          }
        }
      ],
      columns_return: [
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
          title: this.$t("Storefront"),
          align: "center",
          key: "stores_name",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("QuantityofShipments"),
          align: "center",
          key: "number",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("returnRemarks"),
          align: "center",
          key: "memo",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("CheckSerialCode"),
          align: "center",
          key: "unique_code",
          minWidth: 90,
          tooltip: true,
          // render: (h, params) => {
          //   return h("div", { class: "ivu-table-cell-tooltip ivu-tooltip" }, [
          //     h("div", { class: "ivu-tooltip-rel" }, [
          //       h(
          //         "span",
          //         {
          //           class: "ivu-table-cell-tooltip-content",
          //           props: {
          //             tooltip: true
          //           },
          //           domProps: {
          //             title: params.row.unique_code + ""
          //           }
          //         },
          //         params.row.unique_code + ""
          //       )
          //     ])
          //   ]);
          // }
          render: (h, params) => {
            return h("div", [
              h(
                "Button",
                {
                  attrs: {
                    title: this.$t("CheckSerialCode")
                  },
                  props: {
                    type: "primary",
                    // shape: "circle",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.clickOldFuc(params.row);
                      // this.SerialCode = params.row.unique_code;
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
      columns_listForReturn: [
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
          title: this.$t("Storefront"),
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
          title: this.$t("PurchaseUnitPrice"),
          align: "center",
          key: "price",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("goods.Currency"),
          align: "center",
          key: "currency",
          minWidth: 90,
          tooltip: true
        }
      ],
      columns_detail: [
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
          title: "",
          align: "center",
          key: "stores_name",
          minWidth: 90,
          tooltip: true
        },
        {
          title: "",
          align: "center",
          key: "number",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("goods.GoodPrice"),
          align: "center",
          key: "price",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("goods.Currency"),
          align: "center",
          key: "currency",
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
                    title: this.$t("SerialCode")
                  },
                  props: {
                    type: "primary",
                    // shape: "circle",
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
      resetRule: {
        goods_code: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("goods.GoodCode")}`,
            trigger: "blur"
          }
        ],
        goods_name: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("goods.GoodName")}`,
            trigger: "blur"
          }
        ],
        store_id: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseChooseThe")}${this.$t("IncomingStore")}`,
            trigger: "change"
          }
        ],
        price: [
          {
            required: true,
            type: "number",
            message: `${this.$t("PleaseEnterThe")}${this.$t("univalent")}`,
            trigger: "blur"
          }
        ],
        number: [
          {
            required: true,
            type: "number",
            message: `${this.$t("PleaseEnterThe")}${this.$t("Quantity")}`,
            trigger: "blur"
          }
        ],
        descrip: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t(
              "goods.Description"
            )}`,
            trigger: "blur"
          }
        ],
        memo: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            // message: `${this.$t("PleaseEnterThe")}${this.$t("returnRemarks")}`,
            message: `${this.$t("PleaseEnterThe")}`,
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
    onFocus() {
      this.focusWidth = "700px";
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
    // 退货商品列表change选择框时的方法 ，控制删除
    selectGoods(selection) {
      let arr = [];
      if (selection.length) {
        selection.forEach(element => {
          arr.push(element.id);
        });
      }
      this.deletArr = arr;
    },
    //删除商品
    deleteGoods() {
      if (this.deletArr.length) {
        let arr = [];
        for (let index = 0; index < this.ReturnGoodsData.length; index++) {
          if (!this.deletArr.includes(this.ReturnGoodsData[index].id)) {
            // this.editDataGoods.slice(index, 1);
            arr.push(this.ReturnGoodsData[index]);
          }
        }
        this.ReturnGoodsData = arr;
        this.deletArr = [];
      } else {
        IsMessage("warning", this.$t("mall.alert"));
      }
    },

    //填写退货备注之后添加次商品到退货列表
    FucRemarks() {
      this.$refs.FormMemo.validate(valid => {
        if (valid) {
          this.RowData.number = this.RowcodeData.length;
          this.RowData.unique_code = this.RowcodeData + "";
          let that = this;
          let found = this.ReturnGoodsData.find(function(element) {
            return element.id === that.RowData.id;
          });
          let foundIndex = this.ReturnGoodsData.indexOf(found);
          if (found && found.id === that.RowData.id) {
            this.ReturnGoodsData.splice(foundIndex, 1, this.RowData);
          } else {
            this.ReturnGoodsData.push(this.RowData);
          }
          this.closeDrawer();
          this.ListForReturnModal = false;
        }
      });
    },
    //选择序列码后弹出备注弹窗
    UcodeToRew() {
      if (this.RowcodeData.length) {
        this.DrawerEnterRemarks = true;
        this.deletArr = [];
      } else {
        IsAlert("error", this.$t("Error"), this.$t("AtLeast"));
      }
    },
    closeDrawer() {
      this.CheckCodeData = [];
      this.RowcodeData = [];
      this.DrawerCheckSerialCode = false;
      this.DrawerEnterRemarks = false;
    },
    //点击商品列表某一行，退货此商品
    clickRow(row) {
      if (
        this.ReturnGoodsData.find(function(i) {
          return i.id === row.id;
        })
      ) {
        let data = this.ReturnGoodsData.find(function(i) {
          return i.id === row.id;
        });
        this.RowData = {
          id: data.id,
          goods_name: data.goods_name,
          goods_id: data.goods_id,
          price: data.price,
          number: data.number,
          goods_code: data.goods_code,
          stores_name: data.stores_name,
          store_id: data.store_id,
          memo: data.memo,
          unique_code: []
        };
        this.RowcodeData = data.unique_code.split(",");
        this.freezeCode = row.unique_code;
        if (this.RowcodeData.length === row.unique_code.length) {
          this.indeterminate = false;
          this.checkAll = true;
        } else {
          this.indeterminate = false;
          this.checkAll = true;
        }
        // console.log(this.RowcodeData)
        // this.indeterminate = false;
        // this.checkAll = true;
        if (row.unique_code.length > 100) {
          this.CheckCodeData = row.unique_code.slice(0, 100);
        } else {
          this.CheckCodeData = row.unique_code;
        }
        this.DrawerCheckSerialCode = true;
      } else {
        this.RowData = {
          id: row.id,
          goods_name: row.goods_name,
          goods_id: row.goods_id,
          price: row.price,
          number: row.number,
          goods_code: row.goods_code,
          stores_name: row.stores_name,
          store_id: row.store_id,
          memo: "",
          unique_code: []
        };
        this.indeterminate = false;
        this.checkAll = false;
        this.freezeCode = row.unique_code;
        if (row.unique_code.length > 100) {
          this.CheckCodeData = row.unique_code.slice(0, 100);
        } else {
          this.CheckCodeData = row.unique_code;
        }
        this.DrawerCheckSerialCode = true;
      }
    },
    //序列码加载更多
    moreAndmore() {
      this.CheckCodeData = this.CheckCodeData.concat(
        this.freezeCode.slice(
          this.CheckCodeData.length,
          this.CheckCodeData.length + 100
        )
      );
    },
    //点击添加退货商品按钮
    ShowOutGoods() {
      this.outStoreParam = { count: 0, StoreId: "all", limit: 20, page: 1 };
      this.getOutGoodsList();
      // this.OutGoodsData = [];
      this.ListForReturnModal = true;
    },
    //点击退货商品列表某一行
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
    //退货弹窗搜索商品输入框
    ReturnBySearchCode() {
      if (!this.ReturnSeach) {
        return;
      }
      let params = {
        with: "goods,store",
        limit: 1,
        status: 1,
        page: 1,
        goods_code: this.ReturnSeach
      };
      let successFuc = res => {
        if (res.data.data) {
          this.ReturnSeach = "";
          this.clickRow(res.data.data[0]);
          return;
        }
        IsMessage("error", this.$t("NoData"));
      };
      let elseFuc = res => {
        this.ReturnSeach = "";
      };
      AjaxApi("GetInventoryListById", params, successFuc, elseFuc);
    },
    //点击退货弹窗提交按钮
    SubmitReturn() {
      if (!this.ReturnGoodsData.length) {
        IsMessage("error", this.$t("NoData"));
        return;
      }
      this.purchaseData = {
        descrip: ""
      };
      this.ReturnDescModel = true;
    },
    //确定退货
    do_OutBill() {
      this.$refs["FormOutDescrip"].validate(valid => {
        if (valid) {
          this.ReturnGoodsData.forEach(item => {
            delete item.stores_name;
            delete item.id;
          });
          let params = {
            purchase_data: this.ReturnGoodsData,
            memo: this.purchaseData.descrip
          };
          let successFuc = res => {
            IsAlert("success", this.$t("Successful"));
            this.cancelOut();
            this.getInitData();
          };
          let elseFuc = res => {};
          AjaxApi("GetInventoryBatReduce", params, successFuc, elseFuc);
        }
      });
    },
    //退货说明cancel
    cancelOutBill() {
      this.ReturnDescModel = false;
      this.purchaseData.descrip = "";
    },
    //退货cancel
    cancelOut() {
      this.ReturnSeach = "";
      this.ReturnDescModel = false;
      this.ReturnModal = false;
      this.purchaseData.descrip = "";
      this.ReturnGoodsData = [];
    },
    //商店下拉change事件
    chengestoreId(value) {
      this.outStoreParam.page = 1;
      this.getOutGoodsList();
    },
    //退货时获取商品列表
    getOutGoodsList() {
      let params = {
        with: "goods,store",
        limit: this.outStoreParam.limit,
        status: 1,
        page: this.outStoreParam.page,
        stores_id:
          this.outStoreParam.StoreId === "all" ? "" : this.outStoreParam.StoreId
      };
      let successFuc = res => {
        this.OutGoodsData = res.data.data;
        this.outStoreParam.count = res.data.count;
      };
      let elseFuc = res => {
        this.OutGoodsData = [];
        this.outStoreParam.count = 0;
      };
      AjaxApi("GetInventoryListById", params, successFuc, elseFuc);
    },
    closeModalReturn() {
      this.outStoreParam = { count: 0, StoreId: "", limit: 20, page: 1 }; //退货时查询库存列表的参数
      this.OutGoodsData = [];
    },
    closeModalEnter() {
      this.treatData = JSON.parse(JSON.stringify(this.treatDataInit));
      this.enterGoodsData = [];
      this.seach_params.nodeId = "";
    },
    //点击进货按钮
    enterGoods() {
      this.treatData = JSON.parse(JSON.stringify(this.treatDataInit));
      this.seach_params.goodCode = "";
      this.enterGoodsData = [];
      this.enterModal = true;
    },
    //点击添加单据左侧分类树结点的回调
    clickNode(node) {
      if (node.hasOwnProperty("goods_name")) {
        //点击商品
        let params = {
          id: node.id
        };
        let successFuc = res => {
          let index = localStorage.getItem("storeId");
          // this.maxCount = res.data[0].number*1?res.data[0].number * 1:10000000;
          this.billEditData = {
            price: !res.data[0].price ? 0 : res.data[0].price * 1,
            // number: !res.data[0].number ? 0 : res.data[0].number * 1,
            number: 1,
            memo: !res.data[0].goods_memo ? "" : res.data[0].goods_memo,
            goods_code: !res.data[0].goods_code ? "" : res.data[0].goods_code,
            goods_name: !res.data[0].goods_name ? "" : res.data[0].goods_name,
            goods_id: res.data[0].id,
            // store_id: !res.data[0].store_id
            //   ? localStorage.getItem("storeId").toString()
            //   : res.data[0].store_id.toString(),
            store_id: localStorage.getItem("storeId").toString(),
            store_name: this.StoresList[index],
            // store_name: !res.data[0].store_name ? "" : res.data[0].store_name,
            currency: !res.data[0].currency ? "" : res.data[0].currency
          };
          this.EnterEditModal = true;
        };
        let elseFuc = () => {};
        AjaxApi("GetGoodsByCode", params, successFuc, elseFuc);
      } else {
        node.expand = node.expand ? false : true;
      }
    },
    do_AddBill() {
      //编辑进货明细后确定添加进货单
      this.$refs.FormDescrip.validate(valid => {
        if (valid) {
          let params = {
            purchase_data: this.enterGoodsData,
            memo: this.seach_params.descrip
          };
          let successFuc = res => {
            IsAlert("success", this.$t("addedSuccessfully"));
            this.getInitData();
            this.descriptionModal = false;
            this.enterModal = false;
          };
          let elseFuc = res => {};
          AjaxApi("AddPurchase", params, successFuc, elseFuc);
        }
      });
    },
    cancelAddBill() {
      //取消编辑明细取消添加进货单
      this.seach_params.descrip = "";
      this.$nextTick(() => {
        // this.$refs.FormDescrip.resetFields();
        this.descriptionModal = false;
      });
    },
    chengestore(value) {
      if (value) {
        this.billEditData.store_id = value.value;
        this.billEditData.store_name = value.label;
      }
    },
    do_AddOne() {
      //编辑商品单据后添加一个商品到右侧列表
      this.$refs.FormDetail.validate(valid => {
        if (valid) {
          if (this.billEditData.hasOwnProperty("_index")) {
            //编辑
            this.enterGoodsData.splice(
              this.billEditData._index,
              1,
              this.billEditData
            );
          } else if (this.enterGoodsData.length) {
            let count_ = 0;
            let index_ = 0;
            // this.enterGoodsData.push(this.billEditData);
            // this.enterGoodsData.forEach(item => {
            //   if (
            //     item.goods_code === this.billEditData.goods_code &&
            //     item.store_id === this.billEditData.store_id
            //   ) {
            //     count_ = count_ + 1;
            //   }
            // });

            for (var key in this.enterGoodsData) {
              if (
                this.enterGoodsData[key].goods_code ===
                  this.billEditData.goods_code &&
                this.enterGoodsData[key].store_id === this.billEditData.store_id
              ) {
                count_ = count_ + 1;
                index_ = key;
              }
            }
            if (count_ > 0) {
              console.log(this.billEditData.memo);
              console.log(this.billEditData.price);
              console.log(this.enterGoodsData[index_].memo);
              console.log(this.enterGoodsData[index_].price);
              if (
                this.billEditData.price == this.enterGoodsData[index_].price &&
                this.billEditData.memo == this.enterGoodsData[index_].memo
              ) {
                this.billEditData.number =
                  this.billEditData.number + this.enterGoodsData[index_].number;
                this.enterGoodsData.splice(index_, 1, this.billEditData);
              } else {
                IsAlert("error", this.$t("Error"), this.$t("alertDoubleCode"));
              }
            } else {
              this.enterGoodsData.push(this.billEditData);
            }
            //新增
          } else {
            this.enterGoodsData.push(this.billEditData);
          }
          this.EnterEditModal = false;
        }
      });
    },
    cancelAddOne() {
      //取消添加一个商品到右侧列表
      this.$nextTick(() => {
        // this.$refs.FormDetail.resetFields();
        this.EnterEditModal = false;
      });
    },
    do_Search() {
      this.seach_params.limit = 20;
      this.seach_params.page = 1;
      this.seach_params.descrip = "";
      this.seach_params.count = 0;
      this.getInitData();
      this.cancelSearch();
    },
    cancelSearch() {
      this.seach_params = {
        //查询单据的参数
        with: "admin",
        limit: 20,
        page: 1,
        count: 0,
        bill_number: "",
        type: "",
        operate_by: "",
        start_time: "",
        end_time: "",
        descrip: ""
      };
      this.seachModal = false;
    },
    //树状节点数据处理
    nodeFuc(data) {
      let getArray = data => {
        for (var i in data) {
          if (data[i].hasOwnProperty("son")) {
            data[i].expand = false;
            data[i].title = data[i].category_name;
            if (data[i].son.length) {
              data[i].son.forEach(son => {
                son.title = son.goods_name;
              });
              data[i].children = data[i].children.concat(data[i].son);
            }
          }
          getArray(data[i].children);
        }
      };
      getArray(data);
      this.treatData = JSON.parse(JSON.stringify(data));
      this.treatDataInit = JSON.parse(JSON.stringify(data));
    },
    //进货树状
    renderContent(h, { root, node, data }) {
      const iFis = data.hasOwnProperty("category_name");
      const value = data;
      return h(
        "Button",
        {
          attrs: {
            title: data.title
          },
          style: {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width: iFis ? "calc(100% - 20px)" : "calc(100% - 20px)"
          },
          props: iFis
            ? {
                size: "small",
                type: "primary",
                icon: data.expand ? "ios-folder-open-outline" : "ios-folder"
              }
            : { size: "small", type: "warning", ghost: true },
          nativeOn: {
            click: () => {
              this.clickNode(value);
            }
          }
        },
        data.title
      );
    },
    //进货时搜索树状结点
    searchFucType(value) {
      this.treatData = JSON.parse(JSON.stringify(this.treatDataInit)); //重置树状节点的展开属性
      let successFuc = res => {
        if (!res.data.length) {
          IsAlert("warning", this.$t("Error"), this.$t("NoData"));
          return;
        }
        let getArray = data => {
          for (var i in data) {
            if (data[i].hasOwnProperty("son")) {
              data[i].expand = false;
              data[i].title = data[i].category_name;
              if (data[i].son.length) {
                data[i].son.forEach(son => {
                  son.title = son.goods_name;
                });
                data[i].children = data[i].children.concat(data[i].son);
              }
            }
            getArray(data[i].children);
          }
        };
        getArray(res.data);
        this.treatData = res.data;
      };
      let elseFuc = () => {};
      AjaxApi("GetGoodSearch", { search_key: value }, successFuc, elseFuc);
    },
    changeDate(model, date) {
      this.seach_params.start_time = model;
    },
    changeDateEnd(model, date) {
      this.seach_params.end_time = model;
    },
    addGoods() {
      //输入框有数据后添加一个商品到右侧
      let params = {
        goods_code: this.seach_params.goodCode
      };
      let successFuc = res => {
        // this.maxCount = res.data[0].number*1?res.data[0].number * 1:10000000;
        this.billEditData = {
          price: !res.data[0].price ? "" : res.data[0].price * 1,
          number: 1,
          memo: !res.data[0].goods_memo ? "" : res.data[0].goods_memo,
          goods_code: !res.data[0].goods_code ? "" : res.data[0].goods_code,
          goods_name: !res.data[0].goods_name ? "" : res.data[0].goods_name,
          goods_id: res.data[0].id,
          store_id: !res.data[0].store_id
            ? ""
            : res.data[0].store_id.toString(),
          store_name: !res.data[0].store_name ? "" : res.data[0].store_name,
          currency: !res.data[0].currency ? "" : res.data[0].currency
        };
        this.EnterEditModal = true;
      };
      let elseFuc = () => {
        this.seach_params.goodCode = "";
      };
      AjaxApi("GetGoodsByCode", params, successFuc, elseFuc);
    },
    //点击进货弹窗中的提交按钮
    do_change() {
      if (this.enterGoodsData.length) {
        this.descriptionModal = true;
      } else {
        IsAlert("error", this.$t("Error"), this.$t("alertAddOneFirst"));
      }
    },
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
    //退货分页跳转方法
    CurrentChangeOut(page) {
      this.outStoreParam.page = page;
      this.getOutGoodsList();
    },
    //退货分页页数改变
    PageSizeChangeOut(limit) {
      this.outStoreParam.limit = limit;
      this.getOutGoodsList();
    },
    //分页跳转方法Child
    handleCurrentChangeChild(page) {
      this.params_detail.page = page;
      let _params = {
        with: "goods,store,purchase ",
        id: this.params_detail.id,
        page: page,
        limit: 20
      };
      let successFuc = res => {
        this.ViewListData = res.data.data;
        this.params_detail.count = res.data.count;
      };
      let elseFuc = res => {};
      AjaxApi("GetPurchaseInfo", _params, successFuc, elseFuc);
    },
    //分页页数改变Child
    handlePageSizeChangeChild(limit) {
      this.params_detail.limit = limit;
      let _params = {
        with: "goods,store,purchase ",
        id: this.params_detail.id,
        page: this.params_detail.page,
        limit: limit
      };
      let successFuc = res => {
        this.ViewListData = res.data.data;
        this.params_detail.count = res.data.count;
      };
      let elseFuc = res => {};
      AjaxApi("GetPurchaseInfo", _params, successFuc, elseFuc);
    },
    //获取初始table数据
    getInitData() {
      let successFuc = res => {
        this.$store.commit('lOADINGTEXT', '');
        this.billListData = res.data.data;
        this.seach_params.count = res.data.count;
      };
      let elseFuc = res => {
        this.billListData = [];
        this.seach_params.count = 0;
      };
      AjaxApi("GetPurchaseList", this.seach_params, successFuc, elseFuc);
    },
    getStoreSelect() {
      //商店下拉
      let successFuc = res => {
        this.StoresList = res.data;
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
    getPersonSelect() {
      //创建人
      let successFuc = res => {
        let arrData = [];
        Object.keys(res.data).forEach(function(key) {
          arrData.push({
            value: key.toString(),
            label: res.data[key]
          });
        });
        this.PersonOptions = arrData;
      };
      let elseFuc = () => {};
      AjaxApi("GetUserOption", {}, successFuc, elseFuc);
    },
    getTreeNode() {
      //获取树状结点数据
      let successFuc = res => {
        this.nodeFuc(res.data);
      };
      let elseFuc = () => {};
      AjaxApi("GetPurchaseNode", {}, successFuc, elseFuc);
    },
    //动态table高度
    DynamicHeightFuc(Isvh) {
      this.dynamicHeight = String(Isvh - 180);
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
    this.getPersonSelect();
    this.getTreeNode();
  }
};
</script>

<style  lang="less" scoped>
.form-item-margin0 {
  .ivu-form-item {
    margin: 0 0 5px 0;
  }
}
.FormOutGood {
  .ivu-form-item {
    margin: 0 0 5px 0;
    .ivu-form-item-label {
      padding: 0 !important;
    }
  }
}
</style>
<style  lang="less">
.FormOutGood {
  .ivu-form-item {
    margin: 0 0 5px 0;
    .ivu-form-item-label {
      padding-right: 5px !important;
    }
  }
}
.ReturnModal {
  .ivu-modal-body {
    padding: 8px;
    .ivu-table-cell {
      padding: 0;
    }
  }
}
.purchase {
  .ivu-table-cell {
    padding: 0 !important;
  }
}
.purchase_Input_clear {
  .ivu-form-item-content {
    .ivu-input {
      width: 25vw;
    }
  }
  .ivu-input-icon-clear {
    margin-right: 50px;
  }
}
.purchase_Input_Add {
  .ivu-input-icon-clear {
    margin-right: 50px;
  }
}
.purchase_seach_item {
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
.pur-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
.DrawerName {
  z-index: 300000;
}
.DrawerName2 {
  z-index: 400000;
}
</style>