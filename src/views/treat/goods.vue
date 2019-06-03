<template>
  <div class="goods" v-cloak>
    <transition name="com-fade">
      <Layout v-show="!model_edit" v-cloak>
        <Sider
          breakpoint="lg"
          ref="side1"
          hide-trigger
          collapsible
          :collapsed-width="0"
          v-model="isCollapsed"
          class="sider"
          width="160"
          @on-collapse="toggleSider"
        >
          <Input
            ref="test"
            class="treat_Input_clear_small"
            search
            enter-button
            clearable
            style="padding-right:7px;padding-top:2px"
            size="small"
            v-model="seach_params.category_name"
            :placeholder="this.$t('goods.searchTreatName')"
            @on-search="searchTreat"
            @on-clear="searchTreat"
          ></Input>
          <Tree ref="treeTreat" :data="categoryTree" :render="renderContent"></Tree>
        </Sider>
        <Layout>
          <Content>
            <Form
              ref="formInline"
              :model="seach_params"
              inline
              class="Inlineform"
              @submit.native.prevent
            >
              <FormItem>
                <ButtonGroup>
                  <Button type="primary" v-show="sideStatus===true" @click.native="collapsedSider">
                    <Icon type="ios-arrow-back"></Icon>
                    {{$t("goods.ClassificationList")}}
                  </Button>
                  <Button type="primary" v-show="sideStatus===false" @click.native="collapsedSider">
                    {{$t("goods.ClassificationList")}}
                    <Icon type="ios-arrow-forward"></Icon>
                  </Button>
                </ButtonGroup>
                <Button type="primary" @click="newGood">{{$t("goods.Create")}}</Button>
              </FormItem>
              <FormItem>
                <ButtonGroup>
                  <Button type="success" @click="changeStatus(2)">
                    <Icon type="md-arrow-round-up"/>
                    {{$t("BatchOn")}}
                  </Button>
                  <Button type="warning" @click="changeStatus(3)">
                    <Icon type="md-arrow-round-down"/>
                    {{$t("BatchOff")}}
                  </Button>
                  <!-- <Button type="error" @click="deleteList">
                    {{$t("goods.BatchDeletion")}}
                    <Icon type="md-close-circle"/>
                  </Button>-->
                </ButtonGroup>
              </FormItem>
              <FormItem class="treat_Input_clear">
                <Input
                  search
                  enter-button
                  clearable
                  v-model="seach_params.search_key"
                  :placeholder="`${this.$t('goods.searchGoodName')}`"
                  @on-search="searchGoods"
                  @on-clear="searchGoods"
                ></Input>
              </FormItem>
            </Form>
            <Table
              v-cloak
              class="m_t_10"
              border
              ref="tableRoot"
              :columns="columns_goods"
              :data="GoodsListData"
              :height="dynamicHeight*1+60+''"
              @on-selection-change="selectTables"
               :no-data-text="loadingText?loadingText:this.$t('NoData')"
            ></Table>
            <div class="com-footer">
              <Page
                :total="count"
                :page-size="seach_params.limit"
                :current="seach_params.page"
                @on-change="handleCurrentChange"
                @on-page-size-change="handlePageSizeChange"
                show-elevator
                show-sizer
                show-total
              />
            </div>
          </Content>
        </Layout>
      </Layout>
    </transition>
    <!-- 编辑商品 -->
    <transition name="fade" v-cloak>
      <div v-show="model_edit">
        <div style="text-align:right;margin:15px" class="com-affix-right">
          <Button type="primary" @click="cancelEdit" style="margin-right:5px">
            <Icon type="ios-arrow-back"/>
            {{$t('goback')}}
          </Button>
        </div>
        <!-- <Modal
        v-model="model_edit"
        scrollable
        :title="modeltitle"
        @on-ok="do_edit"
        @on-cancel="cancelEdit"
        id="editGoods"
        :mask-closable="false"
        width="700"
        :z-index="600"
        >-->
        <div>
          <h4 class="com-footer-left">{{modeltitle}}</h4>
          <Form
            v-if="model_edit"
            ref="resetForm"
            :model="editGoodData"
            :rules="resetRule"
            :label-width="90"
          >
            <Row :gutter="8">
              <Col span="24" :md="6">
                <FormItem :label="$t('goods.GoodCode')" prop="goods_code">
                  <Input
                    v-model="editGoodData.goods_code"
                    :placeholder="`${this.$t('goods.GoodCode')}`"
                    clearable
                  ></Input>
                </FormItem>
              </Col>
              <Col span="24" :md="6">
                <FormItem :label="$t('goods.GoodName')" prop="goods_name">
                  <Input
                    v-model="editGoodData.goods_name"
                    :placeholder="`${this.$t('goods.GoodName')}`"
                    clearable
                  ></Input>
                </FormItem>
              </Col>
              <Col span="24" :md="6">
                <FormItem :label="$t('goods.Currency')" prop="currency">
                  <Select v-model="editGoodData.currency">
                    <Option value="￥">￥</Option>
                    <Option value="￡">￡</Option>
                    <Option value="$">&nbsp;$</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="24" :md="6">
                 <FormItem :label="$t('goods.GoodPrice')" prop="price">
                  <InputNumber
                    :min="0"
                    :step="1"
                    v-model="editGoodData.price"
                    style="width:100%"
                    clearable
                  ></InputNumber>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="8">
              <Col span="24" :md="6">
                <FormItem :label="$t('goods.GoodDuration')">
                  <InputNumber
                    :min="0"
                    :step="1"
                    v-model="editGoodData.duration"
                    style="width:100%"
                  ></InputNumber>
                </FormItem>
              </Col>
              <Col span="24" :md="6">
                <FormItem :label="$t('goods.Sort')" prop="sort">
                  <InputNumber :min="0" :step="1" v-model="editGoodData.sort" style="width:100%"></InputNumber>
                </FormItem>
              </Col>
              <Col span="24" :md="6">
               <FormItem :label="$t('goods.GoodUnit')" prop="unit_id">
                  <Select v-model="editGoodData.unit_id">
                    <Option
                      v-for="item in unitList"
                      :value="item.id"
                      :key="item.id"
                    >{{ item.unit_name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="24" :md="6">
                 <FormItem :label="$t('goods.CategoryName')" prop="category_id">
                  <Cascader
                    :data="cateList"
                    change-on-select
                    filterable
                    @on-change="changeCascader"
                    v-model="editGoodData.category_id"
                  ></Cascader>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="8">
              <Col span="24" :md="6">
                <FormItem :label="$t('UseCrowd')" prop="user_limited">
                  <Select v-model="editGoodData.user_limited">
                    <Option :value="0">{{$t("AllPerson")}}</Option>
                    <Option :value="1">{{$t("OnlyYou")}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="24" :md="6">
                <FormItem :label="$t('ServiceMethod')" prop="book_type_limited">
                  <Select v-model="editGoodData.book_type_limited">
                    <Option :value="0">{{$t("AllPerson")}}</Option>
                    <Option :value="1">{{$t("OnlyToStore")}}</Option>
                    <Option :value="2">{{$t("OnlyOnSite")}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="24" :md="6">
                <FormItem v-show="modeltitle!==$t('Edit')" :label="$t('goods.GoodType')" prop="type">
                  <Select v-model="editGoodData.type">
                    <Option :value="1">{{$t("goods.MedicalSupplies")}}</Option>
                    <Option :value="2">{{$t("goods.NursingProject")}}</Option>
                    <Option :value="3">{{$t("goods.NursingPackage")}}</Option>
                  </Select>
                </FormItem>
              </Col>
             
            </Row>
            <Row :gutter="8">
              <Col span="24" :md="12">
                <FormItem :label="$t('goods.Remarks')" prop="goods_memo" class="calcWidth">
                  <Input
                    v-model="editGoodData.goods_memo"
                    type="textarea"
                    :autosize="{minRows:5,maxRows:5}"
                    :placeholder="this.$t('goods.Remarks')"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="24" :md="6">
              </Col>
              <Col span="24" :md="6">
               <FormItem :label="$t('goods.Picture')" prop="image_src">
                  <uploadimg @emitSuccess="handImgSuccessEdit" :imageSrc="editGoodData.image_src"></uploadimg>
                  <!-- <Button
                    class="btn_visible"
                    type="primary"
                    @click.native="visible=true"
                  >{{$t('goods.View')}}</Button> -->
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24" :md="24">
                <FormItem :label="$t('goods.Description')" prop="goods_desc" class="calcWidth">
                  <tinymce
                    v-model="editGoodData.goods_desc"
                    :with-credentials="false"
                    :editorHeight="clientHeight-500"
                  ></tinymce>
                </FormItem>
              </Col>
            </Row>
            <Card v-show="editGoodData.type !== 1">
              <p slot="title">{{$t('goods.GoodsList')}}</p>
              <Button slot="extra" size="small" type="success" @click="addGoods">{{$t('goods.Add')}}</Button>
              <Button
                slot="extra"
                size="small"
                type="error"
                @click="deletGoods"
                style="margin-left:5px"
              >{{$t('goods.Delete')}}</Button>
              <Table
                border
                ref="selection"
                :columns="columns_good"
                :data="editDataGoods"
                height="200"
                @on-selection-change="selectGoodsCard"
              ></Table>
            </Card>
          </Form>
        </div>
        <div class="com-footer-right">
          <Button size="large" type="dashed" @click="cancelEdit">{{$t('goods.Cancel')}}</Button>
          <Button type="primary" size="large" @click="do_edit" class="m_l_10">{{$t('goods.Apply')}}</Button>
        </div>
        <!-- </Modal> -->
      </div>
    </transition>
    <!-- 添加商品弹窗添加商品弹窗添加商品弹窗添加商品弹窗添加商品弹窗添加商品弹窗添加商品弹窗添加商品弹窗 -->
    <Modal
      id="childGoodsModel"
      v-model="model_goods"
      :title="$t('goods.AddTo')"
      @on-ok="checkGoods"
      @on-cancel="cancelCheckGoods"
      width="700"
    >
      <Form
        ref="formInline"
        :model="goods_params"
        inline
        style="text-align:left"
        @submit.native.prevent
      >
        <FormItem class="treat_Input_clear">
          <Input
            search
            enter-button
            clearable
            v-model="goods_params.goods_name"
            :placeholder="this.$t('goods.searchGoodName')"
            @on-search="searchGoodsChild"
          ></Input>
        </FormItem>
      </Form>
      <Table
        border
        ref="selectionGood"
        :columns="columns_goodsData"
        :height="dynamicHeight*1-200+''"
        :data="goodsData"
        @on-selection-change="selectGoods"
      ></Table>
      <div class="com-footer-right">
        <Page
          simple
          :total="count_child"
          :page-size="goods_params.limit"
          :current="goods_params.page"
          @on-change="CurrentChange"
          @on-page-size-change="PageSizeChange"
          show-elevator
          show-sizer
          show-total
        />
      </div>
    </Modal>
    <!-- 查看图片 -->
    <Modal :title="$t('goods.Picture')" v-model="visible">
      <img :src="editGoodData.image_src" v-if="visible" style="width: 100%">
    </Modal>
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
                  v-for="(item,index) in allTagOptions"
                  :value="item.id"
                  :key="index"
                >{{ item.tag_value }}</Option>
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
import {
  CODE_OK,
  IsAlert,
  IsLoading,
  AjaxApi,
  IsMessage,
  AsyncLoading,
  getTreeDeepArr
} from "@/utils/api";
import uploadimg from "@/components/uploadImg/uploadImgFormData.vue";
import tinymce from "@/components/tinymce.vue";
import { mapGetters } from 'vuex'
export default {
  name: "goods",
  components: {
    uploadimg,
    tinymce
  },
  data() {
    return {
      modeltitle: this.$t("New"),
      ModelDrawer: false,
      allTagOptions: [],
      tagParam: { goods_id: null, tags_id: [] },
      treeWidth: null,
      file_img: new FormData(), //formdata图片
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      addList: [], //添加商品列表
      deletArr: [], //编辑弹窗中添加商品的列表
      StatusId: [], //控制上下架的id串
      sideStatus: false, //sider状态
      isCollapsed: true, //侧边栏状态
      visible: false, //图片查看弹窗
      model_edit: false, //编辑弹窗状态
      model_goods: false, //添加商品弹窗状态
      count: 0, //分页总数total
      count_child: 0, //分页总数total
      seach_params: {
        with: "goods_category,unit",
        category_id: 0,
        limit: 20,
        page: 1,
        search_key: "",
        category_name: "",
        goods_name: ""
      }, //获取table列表时的参数
      goods_params: {
        category_id: 0,
        limit: 20,
        page: 1,
        goods_name: ""
        // search_goods: ""
      }, //获取商品时的参数
      categoryTree: [], //页面左侧分类数据
      GoodsListData: [], //页面右侧商品数据
      goodsData: [], //添加商品弹窗的table数据
      unitList: [], //单位列表
      cateList: [], //分类列表
      //编辑弹窗分类的数据
      editGoodData: {
        id: "",
        goods_code: "",
        goods_name: "",
        goods_memo: "",
        duration: 0,
        price: 0,
        type: 1,
        sort: 0,
        image_src: "",
        currency: "",
        goods_desc: "",
        unit_id: "",
        p_num: "",
        user_limited: null,
        book_type_limited: null,
        category_id: []
      },
      //编辑弹窗商品的数据
      editDataGoods: [],
      //编辑弹窗中的商品列表，分类type为1时才显示
      columns_good: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: this.$t("goods.GoodType"),
          align: "center",
          key: "type",
          minWidth: 90,
          render: (h, params) => {
            const row = params.row;
            const color =
              row.type === 1 ? "cyan" : row.type === 2 ? "green" : "gold";
            const text =
              row.type === 1
                ? this.$t("goods.MedicalSupplies")
                : row.type === 2
                ? this.$t("goods.NursingProject")
                : this.$t("goods.NursingPackage");
            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: this.$t("Name"),
          key: "goods_name",
          align: "center",
          tooltip: true
        },
        {
          title: this.$t("Quantity"),
          key: "count",
          align: "center",
          render: (h, params) => {
            return h("InputNumber", {
              props: {
                value: params.row.count,
                min: 1
              },
              style: {
                width: "100%"
              },
              on: {
                input: val => {
                  this.editDataGoods[params.row._index].count = val;
                }
              }
            });
          }
        },
        {
          title: this.$t("Price"),
          key: "price",
          align: "center"
        }
      ],
      //添加商品弹窗
      columns_goodsData: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        // {
        //   type: "index",
        //   width: 60,
        //   align: "center"
        // },
        {
          title: this.$t("Code"),
          key: "goods_code",
          align: "center",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("Name"),
          key: "goods_name",
          align: "center",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("goods.Currency"),
          key: "currency",
          align: "center"
        },
        {
          title: this.$t("unit"),
          key: "unit",
          align: "center"
        },
        {
          title: this.$t("Price"),
          key: "price",
          align: "center"
        }
      ],
      //主页面
      columns_goods: [
        { type: "selection", width: 40, align: "center", fixed: "left" },
        {
          title: "ID",
          align: "center",
          key: "id",
          minWidth: 50,
          tooltip: true,
          fixed: "left"
        },
        {
          title: this.$t("goods.GoodCode"),
          align: "center",
          key: "goods_code",
          minWidth: 150,
          tooltip: true,
          fixed: "left"
        },
        {
          title: this.$t("goods.GoodName"),
          align: "center",
          key: "goods_name",
          minWidth: 150,
          tooltip: true
        },
        {
          title: this.$t("goods.GoodType"),
          align: "center",
          key: "type",
          minWidth: 120,
          render: (h, params) => {
            const row = params.row;
            const color =
              row.type === 1 ? "cyan" : row.type === 2 ? "green" : "gold";
            const text =
              row.type === 1
                ? this.$t("goods.MedicalSupplies")
                : row.type === 2
                ? this.$t("goods.NursingProject")
                : this.$t("goods.NursingPackage");
            return h(
              "Tag",
              {
                props: {
                  color: color
                }
              },
              text
            );
          }
        },
        {
          title: this.$t("goods.ReleaseStatus"),
          align: "center",
          key: "status",
          minWidth: 120,
          tooltip: true,
          render: (h, params) => {
            const row = params.row;
            const color =
              row.status === 1
                ? "error"
                : row.status === 2
                ? "success"
                : "warning";
            const text =
              row.status === 1
                ? this.$t("goods.NotRelease")
                : row.status === 2
                ? this.$t("onSale")
                : row.status === 3
                ? this.$t("offSale")
                : "Error Status";
            return h(
              "Poptip",
              {
                props: {
                  confirm: true,
                  title: this.$t("ChangeStatusTit"),
                  placement: "right"
                },
                on: {
                  "on-ok": () => {
                    let _params = {
                      ids: [row.id],
                      action: null
                    };
                    let status = null;
                    switch (row.status) {
                      case 1:
                        _params.action = 2;
                        break;
                      case 2:
                        _params.action = 3;
                        break;
                      case 3:
                        _params.action = 2;
                        break;
                      default:
                        return;
                    }
                    let successFuc = () => {
                      row.status = _params.action;
                      IsAlert("success", this.$t("Successful"));
                    };
                    let elseFuc = () => {};
                    AjaxApi("UpdateActions", _params, successFuc, elseFuc);
                  }
                }
              },
              [
                h(
                  "Button",
                  {
                    props: {
                      type: color,
                      size: "small"
                    }
                  },
                  text
                )
              ]
            );
          }
        },
        {
          title: this.$t("goods.GoodUnit"),
          align: "center",
          minWidth: 60,
          key: "unit",
          tooltip: true
        },
        {
          title: this.$t("goods.GoodDuration"),
          align: "center",
          key: "duration",
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
          title: this.$t("goods.CategoryName"),
          align: "center",
          key: "goods_category",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("goods.Operation"),
          minWidth: 160,
          align: "center",
          // fixed: 'right',
          render: (h, params) => {
            return h("div", [
              h(
                "Poptip",
                {
                  props: {
                    trigger: "hover",
                    placement: "left"
                  },
                  style: {
                    zIndex: 1000
                    // position:"relative"
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
                              let params_ = {
                                with: "treat,treat_package",
                                id: params.row.id,
                                type: params.row.type
                              };
                              let successFuc = res => {
                                this.modeltitle = this.$t("Edit");
                                this.file_img = new FormData();
                                this.editGoodData = {
                                  id: params.row.id,
                                  goods_code: params.row.goods_code,
                                  currency: params.row.currency,
                                  sort: params.row.sort,
                                  goods_memo: params.row.goods_memo,
                                  goods_name: params.row.goods_name,
                                  duration: params.row.duration,
                                  price: params.row.price * 1,
                                  type: params.row.type,
                                  image_src: params.row.image_src,
                                  goods_desc: params.row.goods_desc,
                                  unit_id: params.row.unit_id + "",
                                  user_limited: res.data[0].user_limited,
                                  book_type_limited:
                                    res.data[0].book_type_limited,
                                  p_num: "",
                                  category_id: getTreeDeepArr(
                                    params.row.category_id,
                                    this.cateList
                                  )
                                };
                                this.editDataGoods = [];
                                if (res.data[0].goods_treat.length) {
                                  res.data[0].goods_treat.forEach(element => {
                                    this.editDataGoods.push({
                                      type: element.goods.type,
                                      package_id: element.p,
                                      // goods_code: element.goods.goods_code,
                                      // currency: element.goods.currency,
                                      count: element.number,
                                      price: element.goods.price,
                                      goods_name: element.goods.goods_name
                                    });
                                  });
                                } else {
                                }
                                this.$nextTick(() => {
                                  this.model_edit = true;
                                });
                              };
                              let elseFuc = res => {};
                              AjaxApi(
                                "GetGoodsDetail",
                                params_,
                                successFuc,
                                elseFuc
                              );
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
                              this.tagParam.goods_id = params.row.id;
                              this.tagParam.tags_id = [];
                              let _params = {
                                id: params.row.id,
                                tag_type: "goods"
                              };
                              let successFuc = res => {
                                this.tagParam.tags_id = res.data;
                                this.ModelDrawer = true;
                              };
                              let elseFuc = () => {
                                this.tagParam.tags_id = [];
                                this.ModelDrawer = true;
                              };
                              AjaxApi(
                                "GetGoodTags",
                                _params,
                                successFuc,
                                elseFuc
                              );
                            }
                          }
                        },
                        this.$t("SetLabel")
                      )
                    ]
                  )
                ]
              ),
              h(
                "Button",
                {
                  attrs: {
                    title: this.$t("goods.Delete")
                  },
                  props: {
                    type: "error"
                  },
                  style: {
                    marginLeft: "5px"
                  },
                  on: {
                    click: () => {
                      let params_ = {
                        id: params.row.id,
                        type: params.row.type
                      };
                      let successFuc = () => {
                        // this.GoodsListData.splice(params.row._index, 1);
                        // this.count--;
                        this.getInitData();
                        IsAlert(
                          "success",
                          this.$t("success"),
                          this.$t("Deleted")
                        );
                      };
                      let elseFuc = () => {};
                      AjaxApi("DeleteGoods", params_, successFuc, elseFuc);
                    }
                  }
                },
                this.$t("goods.Delete")
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
            type: "array",
            message: `${this.$t("PleaseChooseThe")}${this.$t("Category")}`,
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
            message: `${this.$t("PleaseChooseThe")}${this.$t("Picture")}`,
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
            message: `${this.$t("PleaseChooseThe")}${this.$t(
              "goods.GoodType"
            )}`,
            trigger: "blur"
          }
        ],
        user_limited: [
          {
            required: true,
            type: "number",
            message: `${this.$t("PleaseChooseThe")}${this.$t("UseCrowd")}`,
            trigger: "blur"
          }
        ],
        book_type_limited: [
          {
            required: true,
            type: "number",
            message: `${this.$t("PleaseChooseThe")}${this.$t("ServiceMethod")}`,
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
            message: `${this.$t("PleaseEnterThe")}${this.$t("goods.Remarks")}`,
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
  computed: {
    ...mapGetters(["loadingText"])
  },
  methods: {
    FucRemarks() {
      let successFuc = () => {
        IsMessage("success", this.$t("Successful"));
        this.getInitData();
        this.$nextTick(()=>{
          this.closeDrawer();
        })
      };
      let elseFuc = () => {};
      AjaxApi("SetMallTags", this.tagParam, successFuc, elseFuc);
    },
    closeDrawer() {
      this.ModelDrawer = false;
      this.tagParam = { tags_id: [], goods_id: null };
    },
    changeCascader(value, selectedData) {
      let sss = getTreeDeepArr(value[value.length - 1], this.cateList);
    },
    newGood() {
      this.modeltitle = this.$t("New");
      this.editGoodData = {
        id: "",
        goods_code: "",
        goods_name: "",
        goods_memo: "",
        duration: null,
        price: null,
        type: 1,
        sort: null,
        user_limited: null,
        book_type_limited: null,
        image_src: "",
        currency: "",
        goods_desc: "",
        unit_id: "",
        p_num: "",
        category_id: []
      };
      this.editDataGoods = [];
      this.file_img = new FormData();
      this.$nextTick(() => {
        this.model_edit = true;
      });
    },
    // 点击添加单据左侧分类树结点的回调
    clickTreeNode(node) {
      IsLoading();
      // const Loading = AsyncLoading();
      this.seach_params.category_name = "";
      // this.seach_params.search_goods = "";
      this.seach_params.category_id = node.id;
      let successFuc = res => {
        // Loading();
        res.data.goods.count
          ? (_ => {
              this.GoodsListData = res.data.goods.data;
              this.count = res.data.goods.count;
            })()
          : (_ => {
              this.GoodsListData = [];
              this.count = 0;
              IsMessage("info", this.$t("NoData"), 1);
            })();
      };
      let elseFuc = () => {};
      AjaxApi("GetCategoryList", this.seach_params, successFuc, elseFuc);
    },
    renderContent(h, { root, node, data }) {
      const selected = data.selected;
      const iFis = data.children.length === 0;
      const value = data;
      return h(
        "Button",
        {
          attrs: {
            title: data.title
          },
          style:{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            width:  iFis
            ? "calc(100% - 20px)"
            : "calc(100% - 20px)"
          },
          props: iFis
            ? {
                size: "small",
                ghost: selected ? true : false,
                type: "primary"
              }
            : {
                size: "small",
                type: "primary",
                ghost: selected ? true : false,
                icon: data.expand ? "ios-folder-open-outline" : "ios-folder"
              },
          nativeOn: {
            click: () => {
              root.forEach((i, index) => {
                i.node.selected = false;
                if (index !== 0) {
                  i.node.expand =
                    i.node.id === node.node.parent_id ? i.node.expand : false;
                }
              });
              data.expand = data.expand ? false : true;
              data.selected = data.selected ? false : true;
              this.clickTreeNode(data);
            }
          }
        },
        data.title
      );
    },
    nodeFuc(data) {
      let getArray = data => {
        for (var i in data) {
          data[i].expand = true;
          data[i].selected = false;
          data[i].title = data[i].category_name;
          getArray(data[i].children);
        }
      };
      getArray(data);
      let tree = [
        {
          title: this.$t("allcategories"),
          children: data,
          id: 0,
          selected: true,
          expand: true,
          parent_id: 0,
          status: 1
        }
      ];
      this.categoryTree = JSON.parse(JSON.stringify(tree));
      // this.categoryTreeCopy = JSON.parse(JSON.stringify(tree));
    },
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
      let p_num = [];
      let _params = this.file_img;
      let fucName = "CreatNewGoods";
      if (this.editDataGoods.length) {
        this.editDataGoods.forEach(element => {
          p_num.push(`${element.package_id}_${element.count}`);
        });
      }
      this.file_img.append("goods_code", this.editGoodData.goods_code);
      this.file_img.append("goods_name", this.editGoodData.goods_name);
      this.file_img.append("goods_memo", this.editGoodData.goods_memo);
      this.file_img.append("goods_desc", this.editGoodData.goods_desc);
      this.file_img.append("unit_id", this.editGoodData.unit_id);
      this.file_img.append("price", this.editGoodData.price);
      this.file_img.append("currency", this.editGoodData.currency);
      this.file_img.append("duration", this.editGoodData.duration);
      this.file_img.append("sort", this.editGoodData.sort);
      this.file_img.append("user_limited", this.editGoodData.user_limited);
      this.file_img.append(
        "book_type_limited",
        this.editGoodData.book_type_limited
      );
      this.file_img.append(
        "category_id",
        this.editGoodData.category_id[this.editGoodData.category_id.length - 1]
      );
      this.file_img.append("type", this.editGoodData.type);
      this.file_img.append("p_num", p_num + "");

      let successFuc = () => {
        this.modeltitle === this.$t("Edit")
          ? IsMessage("success", this.$t("editedSuccessfully"))
          : IsMessage("success", this.$t("addedSuccessfully"));
        // this.getGoodsData();
        this.getInitData();
        this.cancelEdit();
      };
      let elseFuc = res => {
        let nextData = new FormData();
        nextData.append("image_src", this.file_img.get("image_src"));
        this.file_img = nextData;
      };
      if (this.modeltitle === this.$t("Edit")) {
        //判断是编辑还是新增，新增不传id
        // this.file_img.append("id", this.editGoodData.id);
        this.file_img.append("_method", "PATCH");
        fucName = "UpdateTreat";
        _params = {
          id: this.editGoodData.id,
          params: this.file_img
        };
      }
      AjaxApi(fucName, _params, successFuc, elseFuc);
    },
    //编辑弹窗  点击取消的回调（重置表单验证）
    cancelEdit() {
      this.model_edit = false;
      this.file_img = new FormData();
      // this.$nextTick(() => {
      //   this.$refs["resetForm"].resetFields();
      // });
    },
    // 编辑弹窗商品列表change选择框时的方法 ，控制删除
    selectGoodsCard(selection) {
      let arr = [];
      if (selection.length) {
        selection.forEach(element => {
          arr.push(element.package_id);
        });
      }
      this.deletArr = arr;
    },
    //删除商品
    deletGoods() {
      if (this.editDataGoods.length && this.deletArr.length) {
        let arr = [];
        for (let index = 0; index < this.editDataGoods.length; index++) {
          if (!this.deletArr.includes(this.editDataGoods[index].package_id)) {
            arr.push(this.editDataGoods[index]);
          }
        }
        this.editDataGoods = arr;
      } else {
        IsMessage("warning", this.$t("mall.alert"));
      }
    },
    //上传图片
    handImgSuccessEdit(res) {
      this.editGoodData.image_src = res.upImg;
      this.file_img = res.formData;
    },
    //点击“添加商品”按钮 的方法
    addGoods() {
      let params = {
        limit: 20,
        page: 1,
        type: this.editGoodData.type - 1,
        goods_name: this.goods_params.goods_name
        // search_goods: this.goods_params.search_goods
      };
      let successFuc = res => {
        if (res.data.goods.count) {
          this.goodsData = [];
          res.data.goods.data.forEach(element => {
            this.goodsData.push({
              type: element.type,
              package_id: element.id,
              goods_code: element.goods_code,
              currency: element.currency,
              count: 1,
              price: element.price,
              goods_name: element.goods_name,
              unit: element.unit
            });
          });
          this.count_child = res.data.goods.count;
          this.model_goods = this.model_goods ? this.model_goods : true;
        } else {
          IsMessage("error", this.$t("NoSuchItem"));
        }
      };
      let elseFuc = () => {};
      AjaxApi("GetCategoryList", params, successFuc, elseFuc);
    },
    //添加商品弹窗  点击确定的回调
    checkGoods() {
      if (this.goodsData.length) {
        for (let index = 0; index < this.goodsData.length; index++) {
          if (this.addList.includes(this.goodsData[index].package_id)) {
            this.editDataGoods.push(this.goodsData[index]);
          } else {
            // this.editDataGoods[index]._checked = false;
          }
        }
      }
    },
    //添加商品弹窗  点击取消的回调
    cancelCheckGoods() {
      this.goods_params = {
        category_id: 0,
        limit: 10,
        page: 1,
        // search_goods: "",
        goods_name: ""
      };
    },
    //添加商品弹窗商品列表change选择框时的方法
    selectGoods(selection) {
      let arr = [];
      if (selection.length) {
        selection.forEach(element => {
          arr.push(element.package_id);
        });
        this.addList = arr;
      }
    },
    //控制选择上下架
    selectTables(selection) {
      this.StatusId = [];
      if (selection.length) {
        selection.forEach(element => {
          this.StatusId.push(element.id);
        });
      }
    },
    //批量删除
    deleteList(status) {
      if (this.StatusId.length) {
        IsLoading();
        let params = {
          ids: this.StatusId
        };
        let successFuc = res => {
          this.getInitData();
          IsMessage("success", this.$t("goods.IsSuccess"));
          this.$refs.tableRoot.selectAll(false);
        };
        let elseFuc = () => {};
        AjaxApi("DeleteGoods", params, successFuc, elseFuc);
      } else {
        IsAlert("warning", this.$t("goods.DeleteAlert"));
      }
    },
    //批量上下架
    changeStatus(status) {
      if (this.StatusId.length) {
        IsLoading();
        let params = {
          action: status,
          ids: this.StatusId
        };
        let successFuc = res => {
          this.getInitData();
          // this.$nextTick(()=>{
          IsAlert("success", this.$t("goods.IsSuccess"));
          this.$refs.tableRoot.selectAll(false);
          // })
        };
        let elseFuc = () => {};
        AjaxApi("UpdateActions", params, successFuc, elseFuc);
      } else {
        IsAlert("warning", this.$t("goods.DeleteAlert"));
      }
    },
    //左侧分类列表展示与隐藏
    collapsedSider() {
      this.$refs.side1.toggleCollapse();
      this.sideStatus = this.sideStatus ? false : true;
    },
    toggleSider(status) {
      this.sideStatus = !status;
    },
    //主页面搜索方法
    searchGoods() {
      IsLoading();
      this.seach_params.page = 1;
      // this.getInitData();
      let successFuc = res => {
        res.data.goods.count
          ? (_ => {
              this.GoodsListData = res.data.goods.data;
              this.count = res.data.goods.count;
            })()
          : (_ => {
              this.GoodsListData = [];
              this.count = 0;
              IsMessage("info", this.$t("NoData"), 2);
            })();
      };
      let elseFuc = () => {};
      AjaxApi("GetCategoryList", this.seach_params, successFuc, elseFuc);
    },
    //主页面搜索分类方法
    searchTreat() {
      this.seach_params.page = 1;
      this.seach_params.category_id = null;
      // this.getInitData();
      let successFuc = res => {
        if (res.data.goods.count) {
          this.nodeFuc(res.data.goodsCategory);
          this.GoodsListData = res.data.goods.data;
          this.count = res.data.goods.count;
        } else {
          IsMessage(
            "error",
            `${this.$t("Category")}${this.seach_params.category_name}${this.$t(
              "NoGoods"
            )}`,
            2
          );
        }
      };
      let elseFuc = () => {};
      AjaxApi("GetCategoryList", this.seach_params, successFuc, elseFuc);
    },
    //套餐添加商品页面搜索方法
    searchGoodsChild() {
      this.goods_params.page = 1;
      this.addGoods();
    },
    //分页跳转方法
    handleCurrentChange(page) {
      this.$store.commit('lOADINGTEXT', this.$t('LoadingText'));
      this.GoodsListData=[];
      this.seach_params.page = page;
      this.seach_params.category_id ? this.getGoodsData() : this.getInitData();
    },
    //分页页数改变
    handlePageSizeChange(limit) {
      this.$store.commit('lOADINGTEXT', this.$t('LoadingText'));
      this.GoodsListData=[];
      this.seach_params.limit = limit;
      this.seach_params.category_id ? this.getGoodsData() : this.getInitData();
    },
    //子页面分页跳转方法
    CurrentChange(page) {
      this.goods_params.page = page;
      this.addGoods();
    },
    //子页面分页页数改变
    PageSizeChange(limit) {
      this.goods_params.limit = limit;
      this.addGoods();
    },
    //获取右侧goods table数据
    getGoodsData() {
      IsLoading();
      let successFuc = res => {
        this.$store.commit('lOADINGTEXT', '');
        res.data.goods.count
          ? (_ => {
              this.GoodsListData = res.data.goods.data;
              this.count = res.data.goods.count;
            })()
          : (_ => {
              this.GoodsListData = [];
              this.count = 0;
              IsMessage("info", this.$t("NoData"), 1);
            })();
      };
      let elseFuc = () => {};
      AjaxApi("GetCategoryList", this.seach_params, successFuc, elseFuc);
    },
    //获取初始table数据
    getInitData() {
      let successFuc = res => {
        this.$store.commit('lOADINGTEXT', '');
        this.GoodsListData = res.data.goods.data;
        this.count = res.data.goods.count;
        this.$nextTick(()=>{this.nodeFuc(res.data.goodsCategory);})//防止快速切换页面时i18n报错TypeError: Cannot read property '_t' of null
      };
      let elseFuc = () => {
        this.GoodsListData = [];
        this.categoryTree = [];
        this.count = 0;
      };
      AjaxApi("GetCategoryList", this.seach_params, successFuc, elseFuc);
    },
    //获取单位下拉框列表
    getDetilUnit() {
      let successFuc = res => {
        res.data.forEach(i => {
          i.id = i.id + "";
        });
        this.unitList = res.data;
      };
      let elseFuc = () => {};
      AjaxApi("GetUnit", {}, successFuc, elseFuc);
    },
    //获取分类下拉框列表
    getCateList() {
      let successFuc = res => {
        let getArray = data => {
          for (var i in data) {
            data[i].value = data[i].id + "";
            data[i].label = data[i].category_name;
            data[i].id = data[i].id + "";
            getArray(data[i].children);
          }
        };
        getArray(res.data);
        let section = res.data;
        this.cateList = JSON.parse(JSON.stringify(section));
      };
      let elseFuc = () => {};
      AjaxApi("GetCateList", {}, successFuc, elseFuc);
    },
    getTagSelect() {
      let successFuc = res => {
        this.allTagOptions = res.data;
      };
      let elseFuc = () => {};
      AjaxApi("GetMallTags", { type: 1 }, successFuc, elseFuc);
    },
    //动态table高度
    DynamicHeightFuc(Isvh) {
      this.dynamicHeight = String(Isvh - 220);
    }
  },
  mounted() {
    // this.$nextTick(() => {
      // let cur = this.$refs["treeTreat"];
      // console.log(cur);
      // let curHeight = cur.height;
      // console.log(curHeight);
    // });
    // this.treeWidth = this.$refs["treeTreat"].offsetWidth;
    // console.log(this.$refs["test"]);

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
    this.getDetilUnit();
    this.getTagSelect();
    this.getCateList();
  }
};
</script>

<style scoped lang="less">
.calcWidth {
  .ivu-form-item-content {
    width: calc(100%-90px);
  }
}
.Inlineform {
  text-align: left;
  // height: 40px;
  margin-bottom: 6px;
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
.goods {
  .ivu-table-cell {
    padding: 0 !important;
  }
  .ivu-poptip-confirm {
    .ivu-poptip-body {
      .ivu-icon {
        left: 20px;
      }
    }
  }
  // .ivu-poptip-content{
  //   z-index: 10000;
  //   .ivu-poptip-body{
  //     z-index: 10000;
  //   }
  // }
}
.treat_Input_clear {
  .ivu-input-icon-clear {
    margin-right: 50px;
  }
  .ivu-input {
    height: 30px;
  }
}
.treat_Input_clear_small {
  .ivu-input-icon-clear {
    margin-right: 50px;
  }
  .ivu-input {
    height: 28px;
  }
}
.btn_visible {
  margin: 25px 0 0 8px;
  float: left;
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
  z-index: 300000;
}
</style>