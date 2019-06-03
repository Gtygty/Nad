<template>
  <div class="doctor">
    <Form :model="seach_params" inline style="text-align:left;height:40px" @submit.native.prevent>
      <FormItem>
        <Button type="primary" @click="addModel">{{$t('NewDoctor')}}</Button>
      </FormItem>
      <FormItem class="doctor_Input_clear">
        <Input
          search
          enter-button
          clearable
          v-model="seach_params.search_key"
          :placeholder="`${this.$t('search')} ${this.$t('title')}/${this.$t('Name')}...` "
          @on-search="searchFuc"
          @on-clear="searchFuc"
        ></Input>
      </FormItem>
    </Form>
    <div style="text-align:center">
      <Table
        class="m_t_10"
        border
        :columns="columns_btn"
        :data="storeListData"
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
    <!-- 新增 -->
    <div v-show="modalType_new">
      <Modal
        v-model="modalType_new"
        scrollable
        :title="$t('New')"
        label-width="50"
        @on-ok="do_Add"
        @on-cancel="cancelAdd"
        class-name="vertical-center-modal"
        width="700"
      >
        <div>
          <Form ref="resetForm" :model="doctorAddData" :rules="resetRule" :label-width="100">
            <Row :gutter="8">
              <Col span="23" :md="11">
                <FormItem :label="$t('title')" prop="title">
                  <Input v-model="doctorAddData.title" placeholder="title..."></Input>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                <FormItem :label="$t('firstname')" prop="first_name">
                  <Input v-model="doctorAddData.first_name" placeholder="firstname..."></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="8">
              <Col span="23" :md="11">
                <FormItem :label="$t('lastname')" prop="last_name">
                  <Input v-model="doctorAddData.last_name" placeholder="lastname..."></Input>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                <FormItem :label="$t('Storefront')" prop="store_id">
                  <Select v-model="doctorAddData.store_id" clearable filterable>
                    <Option
                      v-for="item in StoreOptions"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="8">
              <Col span="23" :md="11">
                <FormItem :label="$t('Status')">
                  <RadioGroup v-model="doctorAddData.status">
                    <Radio :label="1">{{$t('Enabled')}}</Radio>
                    <Radio :label="2">{{$t('Disabled')}}</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="23" :md="12"></Col>
            </Row>
          </Form>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelAdd">{{$t('Cancel')}}</Button>
          <Button type="primary" size="small" @click="do_Add">{{$t('Apply')}}</Button>
        </div>
      </Modal>
    </div>
    <!-- 编辑 -->
    <!-- <div v-show="modalType_edit"> -->
    <Modal
      v-model="modalType_edit"
      scrollable
      :title="$t('Edit')"
      label-width="50"
      @on-ok="do_Edit"
      @on-cancel="cancelEdit"
      class-name="vertical-center-modal"
      width="700"
    >
      <div>
        <Form
          ref="resetFormEdit"
          :model="doctorEditData"
          :rules="resetRule"
          :label-width="100"
        >
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('title')" prop="title">
                <Input v-model="doctorEditData.title" placeholder="title..."></Input>
              </FormItem>
            </Col>
            <Col span="23" :md="12">
              <FormItem :label="$t('firstname')" prop="first_name">
                <Input v-model="doctorEditData.first_name" placeholder="firstname..."></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('lastname')" prop="last_name">
                <Input v-model="doctorEditData.last_name" placeholder="lastname..."></Input>
              </FormItem>
            </Col>
            <Col span="23" :md="12">
              <FormItem :label="$t('Storefront')" prop="store_id">
                <Select v-model="doctorEditData.store_id" clearable filterable>
                  <Option
                    v-for="item in StoreOptions"
                    :value="item.value"
                    :key="item.value"
                  >{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem label="status">
                <RadioGroup v-model="doctorEditData.status">
                  <Radio :label="1">Normal</Radio>
                  <Radio :label="2">Disabled</Radio>
                </RadioGroup>
              </FormItem>
            </Col>
            <Col span="23" :md="12"></Col>
          </Row>
        </Form>
      </div>
      <div slot="footer">
        <Button size="small" type="dashed" @click="cancelEdit">{{$t('Cancel')}}</Button>
        <Button type="primary" size="small" @click="do_Edit">{{$t('Apply')}}</Button>
      </div>
    </Modal>
    <!-- </div> -->
  </div>
</template>

<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage,IsLoading } from "@/utils/api";
import uploadimg from "@/components/uploadImg/uploadImgAdd.vue";
export default {
  name: "doctor",
  components: {
    uploadimg
  },
  data() {
    return {
      value1: [],
      StoreOptions: [],
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      modalType_new: false,
      modalType_edit: false,
      count: 0, //分页总数total
      seach_params: { limit: 20, current_page: 1, search_key: "" }, //获取table列表时的参数
      storeListData: [], //店面数据（table使用）
      doctorAddData: {
        id: null,
        title: "",
        first_name: "",
        last_name: "",
        store_id: null,
        status: 1
      },
      doctorEditData: {
        id: null,
        title: "",
        first_name: "",
        last_name: "",
        store_id: null,
        status: 1
      },

      //iview列表按钮数据
      columns_btn: [
        {
          title: this.$t("title"),
          key: "title",
          align: "center",
          tooltip: true
        },
        {
          title: this.$t("AllName"),
          align: "center",
          key: "first_name",
          tooltip: true,
          render: (h, params) => {
            const row = params.row;
            const text = `${row.first_name}${row.last_name}`;
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
        {
          title: this.$t("Storefront"),
          align: "center",
          key: "store_name",
          tooltip: true
        },
        {
          title: this.$t("Status"),
          align: "center",
          key: "status",
          minWidth: 90,
          render: (h, params) => {
            const row = params.row;
            const color = row.status === 1 ? "cyan" : "gold";
            const text =
              row.status === 1 ? this.$t("Normal") : this.$t("Disabled");
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
          title: this.$t("Operating"),
          width: 150,
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
                    this.$nextTick(() => {
                      this.$refs["resetFormEdit"].resetFields();
                    });
                    this.doctorEditData = {
                      id: params.row.id,
                      title: params.row.title,
                      first_name: params.row.first_name,
                      last_name: params.row.last_name,
                      store_id: params.row.store_id,
                      status: params.row.status
                    };
                    this.modalType_edit = true;
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
                    let deletdata = {
                      id: params.row.id,
                      title: params.row.title,
                      first_name: params.row.first_name,
                      last_name: params.row.last_name,
                      store_id: params.row.store_id,
                      status: 3
                    };
                    let successFuc = () => {
                      IsMessage("success", this.$t("Deleted"));
                      this.getInitData();
                    };
                    let elseFuc = () => {};
                    AjaxApi(
                      "PostAddOrUpdateDoc",
                      deletdata,
                      successFuc,
                      elseFuc
                    );
                  }
                }
              })
            ]);
          }
        }
      ],
      resetRule: {
        id: [
          {
            required: true,
            type: "number",
            message: `${this.$t("PleaseEnterThe")}id`,
            trigger: "blur"
          }
        ],
        title: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("titles")}`,
            trigger: "blur"
          }
        ],
        first_name: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("firstname")}`,
            trigger: "blur"
          }
        ],
        last_name: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("lastname")}`,
            trigger: "blur"
          }
        ],
        store_id: [
          {
            required: true,
            type: "number",
            message: `${this.$t("PleaseChooseThe")}${this.$t("Storefront")}`,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    addModel() {
      this.doctorAddData = {
        title: "",
        first_name: "",
        last_name: "",
        store_id: null,
        status: 1
      };
      this.modalType_new = true;
    },
    /* 按钮方法—————————————————————————————————————————————————————————— */
    searchFuc() {
      IsLoading();
      this.seach_params.current_page = 1;
      let successFuc = res => {
        this.storeListData = res.data.data;
        this.count = res.data.count;
      };
      let elseFuc = res => {};
      AjaxApi("GetDocList", this.seach_params, successFuc, elseFuc);
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
      let params = {
        title: this.doctorAddData.title,
        first_name: this.doctorAddData.first_name,
        last_name: this.doctorAddData.last_name,
        store_id: this.doctorAddData.store_id,
        status: this.doctorAddData.status
      };
      let successFuc = () => {
        IsMessage("success", this.$t("addedSuccessfully"));
        this.cancelAdd();
        this.getInitData();
      };
      let elseFuc = () => this.cancelAdd();
      AjaxApi("PostAddOrUpdateDoc", params, successFuc, elseFuc);
    },
    //编辑弹窗  点击取消的回调（重置表单验证）
    cancelAdd() {
      this.modalType_new = false;
      this.$nextTick(() => {
        this.$refs["resetForm"].resetFields();
      });
    },
    do_Edit() {
      this.$refs.resetFormEdit.validate(valid => {
        if (valid) {
          this.this_do_Edit();
        }
      });
    },
    //表单验证后确定编辑
    this_do_Edit() {
      let params = {
        id: this.doctorEditData.id,
        title: this.doctorEditData.title,
        first_name: this.doctorEditData.first_name,
        last_name: this.doctorEditData.last_name,
        store_id: this.doctorEditData.store_id,
        status: this.doctorEditData.status
      };
      let successFuc = () => {
        IsMessage("success", this.$t("editedSuccessfully"));
        this.cancelEdit();
        this.getInitData();
      };
      let elseFuc = () => this.cancelEdit();
      AjaxApi("PostAddOrUpdateDoc", params, successFuc, elseFuc);
    },
    //编辑弹窗  点击取消的回调（重置表单验证）
    cancelEdit() {
      this.modalType_edit = false;
      this.$nextTick(() => {
        this.$refs["resetFormEdit"].resetFields();
      });
    },
    /* /按钮方法—————————————————————————————————————————————————————————— */

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
        this.storeListData = res.data.data;
        this.count = res.data.count;
      };
      let elseFuc = () => {};
      AjaxApi("GetDocList", this.seach_params, successFuc, elseFuc);
    },
    getStoreSelect() {
      let successFuc = res => {
        let arrData = [];
        Object.keys(res.data).forEach(function(key) {
          arrData.push({
            value: key * 1,
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
  }
};
</script>
<style  lang="less">
.doctor_Input_clear {
  .ivu-form-item-content {
    .ivu-input {
      width: 25vw;
    }
  }
  .ivu-input-icon-clear {
    margin-right: 50px;
  }
}
</style>