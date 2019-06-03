<template>
  <div class="store">
    <Row>
      <Col span="3" style="text-align:left">
        <Button type="primary" @click="addModel">{{$t('Create')}}</Button>
      </Col>
    </Row>
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
          :current="seach_params.page"
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
        :title="$t('Create')"
        @on-ok="do_Add"
        @on-cancel="cancelAdd"
        width="700"
      >
        <div>
          <Form ref="resetForm" :model="storeAddData" :rules="resetRule" :label-width="80">
            <Row :gutter="16">
              <Col span="23" :md="12">
                <FormItem :label="$t('ParentStore')">
                  <Cascader
                    :data="LevelData"
                    v-model="storeAddData.parent_id"
                    change-on-select
                    filterable
                  ></Cascader>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                <FormItem :label="$t('storeName')" prop="store_name">
                  <Input v-model="storeAddData.store_name" :placeholder="`${$t('storeName')}...`"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="23" :md="12">
                <FormItem :label="$t('StoreType')" class="ivu-form-item-required">
                  <RadioGroup v-model="storeAddData.store_type">
                    <Radio :label="1">{{$t('DirectStore')}}</Radio>
                    <Radio :label="2">{{$t('FranchiseStore')}}</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                <FormItem :label="$t('StoreAddress')" prop="address">
                  <Input v-model="storeAddData.address" :placeholder="`${$t('StoreAddress')}...`"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="23" :md="12">
                <FormItem :label="$t('contact')">
                  <Input v-model="storeAddData.contact" :placeholder="`${$t('contact')}...`"></Input>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                <FormItem :label="$t('tel')" prop="tel">
                  <Input v-model="storeAddData.tel" :placeholder="`${$t('tel')}...`"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="23" :md="12">
              <FormItem :label="$t('business_hours')" prop="business_hours">
                  <Input v-model="storeAddData.business_hours" :placeholder="`${$t('business_hours')}...`"></Input>
                  <!-- <TimePicker v-model="storeAddData.business_hours"  format="HH:mm" type="timerange" placement="bottom-end" :placeholder="`${$t('business_hours')}...`" style="width: 100%"></TimePicker> -->
                </FormItem>
              </Col>
              <Col span="23" :md="12">
              <FormItem :label="$t('goods.Picture')" prop="image_src">
                  <uploadimg @emitSuccess="handImgSuccessAdd" :imageSrc="storeAddData.image_src"></uploadimg>
                  <!-- <Button class="btn_visible" type="primary" @click.native="visible=true">查看大图</Button> -->
                </FormItem>
              </Col>
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
    <div v-show="modalType_edit">
      <Modal
        v-model="modalType_edit"
        scrollable
        :title="$t('Edit')"
        @on-ok="do_Edit"
        @on-cancel="cancelEdit"
        width="700"
      >
        <div>
          <Form ref="resetFormEdit" :model="storeEditData" :rules="resetRule" :label-width="110">
            <Row :gutter="16">
              <Col span="23" :md="12">
                <FormItem :label="$t('ParentStore')" prop="parent_id">
                  <Cascader
                    :data="LevelData"
                    v-model="storeEditData.parent_id"
                    change-on-select
                    filterable
                  ></Cascader>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                <FormItem :label="$t('storeName')" prop="store_name">
                  <Input v-model="storeEditData.store_name" :placeholder="`${$t('storeName')}...`"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="23" :md="12">
                <FormItem :label="$t('StoreType')" class="ivu-form-item-required">
                  <RadioGroup v-model="storeEditData.store_type">
                    <Radio :label="1">{{$t('DirectStore')}}</Radio>
                    <Radio :label="2">{{$t('FranchiseStore')}}</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                <FormItem :label="$t('StoreAddress')" prop="address">
                  <Input v-model="storeEditData.address" :placeholder="`${$t('StoreAddress')}...`"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="23" :md="12">
                <FormItem :label="$t('contact')">
                  <Input v-model="storeEditData.contact" :placeholder="`${$t('contact')}...`"></Input>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                <FormItem :label="$t('tel')" prop="tel">
                  <Input v-model="storeEditData.tel" :placeholder="`${$t('tel')}...`"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="23" :md="12">
              <FormItem :label="$t('business_hours')" prop="business_hours">
                  <Input v-model="storeEditData.business_hours" :placeholder="`${$t('business_hours')}...`"></Input>
                  <!-- <TimePicker v-model="storeEditData.business_hours"  format="HH:mm" type="timerange" placement="bottom-end" :placeholder="`${$t('business_hours')}...`" style="width: 100%"@on-change="storeEditData.business_hours=$event"></TimePicker> -->
                </FormItem>
              </Col>
              <Col span="23" :md="12">
              <FormItem :label="$t('Status')" class="ivu-form-item-required">
                  <RadioGroup v-model="storeEditData.status">
                    <Radio :label="1">{{$t('Enabled')}}</Radio>
                    <Radio :label="2">{{$t('Disabled')}}</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="23" :md="12">
                <FormItem :label="$t('goods.Picture')" prop="image_src">
                  <uploadimg @emitSuccess="handImgSuccessEdit" :imageSrc="storeEditData.image_src"></uploadimg>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                
              </Col>
            </Row>
          </Form>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelEdit">{{$t('Cancel')}}</Button>
          <Button type="primary" size="small" @click="do_Edit">{{$t('Apply')}}</Button>
        </div>
      </Modal>
    </div>
    <!-- 排班 -->
    <div v-show="modalType_time">
      <Modal
        v-model="modalType_time"
        scrollable
        :title="$t('Scheduling')"
        label-width="50"
        @on-ok="do_TimePick"
        @on-cancel="cancelTimePick"
        class-name="nurse-center-time"
        width="800"
      >
        <div class="cardTime">
          <Tabs v-model="Tab" on-click="clickTab">
            <TabPane label="每日时段" name="1"></TabPane>
            <TabPane label="特定时段" name="2"></TabPane>
          </Tabs>
          <Card v-show="Tab==='1'">
            <Row class="rowNurse">
              <CheckboxGroup v-model="weekGroup">
                <Checkbox
                  v-for="item in weekdata"
                  :label="item.value"
                  :key="item.value"
                >{{item.label}}</Checkbox>
              </CheckboxGroup>
            </Row>
            <Row :gutter="16">
              <Col span="7">
                <TimePicker
                  :value="AddTimePickerTab1"
                  v-model="AddTimePickerTab1"
                  format="HH:mm"
                  type="timerange"
                  placement="bottom-end"
                  placeholder="Select time"
                  :steps="[0, 30, 59]"
                  style="width:100%"
                  @on-change="changeTimepick"
                  :editable="false"
                  :clearable="false"
                ></TimePicker>
              </Col>
              <Col span="4" style="text-align:right;padding:0;line-height:35px">
                容客量：
                <InputNumber :min="1" :step="1" v-model="numvalue1"  :precision="0" style="width:50%"></InputNumber>
              </Col>
              <Col span="4" class="colAdd">
                <Button
                  size="small"
                  type="info"
                  icon="md-add "
                  shape="circle"
                  @click="AddTimePicker1"
                ></Button>
              </Col>
            </Row>
          </Card>
          <Card v-show="Tab==='2'">
            <Row class="rowNurse">
              <DatePicker
                :value="dateTime"
                type="daterange"
                placement="bottom-end"
                placeholder="Select date"
                style="width: 220px"
                @on-change="dateTime=$event"
                :editable="false"
                :clearable="false"
                :options="OnMonth"
              ></DatePicker>
            </Row>
            <Row :gutter="16">
              <Col span="7">
                <TimePicker
                  :value="AddTimePickerTab2"
                  format="HH:mm"
                  type="timerange"
                  placement="bottom-end"
                  placeholder="Select time"
                  :steps="[0, 30, 59]"
                  style="width:100%"
                  @on-change="changeTimepick"
                  :editable="false"
                  :clearable="false"
                ></TimePicker>
              </Col>
              <Col span="4" style="text-align:right;padding:0;line-height:35px">
                容客量：
                <InputNumber :min="1" :precision="0" v-model="numvalue2" style="width:50%"></InputNumber>
              </Col>
              <Col span="4" class="colAdd">
                <Button
                  size="small"
                  type="info"
                  icon="md-add "
                  shape="circle"
                  @click="AddTimePicker2"
                ></Button>
              </Col>
            </Row>
          </Card>
          <Table
            class="m_t_10"
            border
            :columns="Tab==='1'?columns_Timepick:columns_Datepick"
            :data="Tab==='1'?timePickData:datePickData"
            height="400"
          ></Table>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelTimePick">取消</Button>
          <Button type="primary" size="small" @click="do_TimePick">确定</Button>
        </div>
      </Modal>
    </div>
    <div v-show="modalCrew">
      <Modal
        v-model="modalCrew"
        scrollable
        :title="$t('Scheduling')"
        label-width="50"
        class-name="crew_modal"
        :mask-closable="false"
        @on-cancel="cancel"
        width="800">
        <schedulingModal ref="schedulingModalRef" scheType="store" />
      </Modal>
    </div>
  </div>
</template>

<script>
import {
  CODE_OK,
  IsAlert,
  AjaxApi,
  getTreeDeepArr,
  IsMessage
} from "@/utils/api";
import uploadimg from "@/components/uploadImg/uploadImgFormData.vue";
import schedulingModal from "@/components/modal/schedulingModal.vue";
export default {
  name: "store",
  components: {
    uploadimg,schedulingModal
  },
  data() {
     const validateParent = (rule, value, callback) => {
      if (value.length!==0 && (value.toString()===this.validateId.toString())) {
        callback(new Error(this.$t('BindSelf')));
      } else {
        callback();
      }
    };
    return {
      modalCrew: false,
      validateId:null,
      numvalue1: 1,
      numvalue2: 1,
      store_id: null,
      weekGroup: [],
      Tab: "1",
      dateTime: [],
      AddTimePickerTab1: ["00:00", "04:00"],
      AddTimePickerTab2: ["00:00", "04:00"],
      OnMonth: {
        disabledDate(date) {
          return (
            date.valueOf() < Date.now() - 86400000 ||
            date.valueOf() > Date.now() + 2592000000
          );
        }
      },
      weekdata: this.$t('nurse.weekdata'),
      // weekdata: [
      //   { value: "1", label: "星期一" },
      //   { value: "2", label: "星期二" },
      //   { value: "3", label: "星期三" },
      //   { value: "4", label: "星期四" },
      //   { value: "5", label: "星期五" },
      //   { value: "6", label: "星期六" },
      //   { value: "7", label: "星期天" }
      // ],
      modalType_time: false,
      timePickData: [
        { time: "00:00~22:00", week: "1", weekName: this.$t("Mon") , capacity: 4 }
      ],
      datePickData: [
        {
          time: "00:00~22:00",
          week: "1",
          date: "2019-08-25~2019-08-30",
          capacity: 4
        }
      ],
      file_img: new FormData(), //formdata图片
      value1: [],
      childrenData: [],
      LevelData: [], //层级选择器数据
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      modalType_new: false,
      modalType_edit: false,
      count: 0, //分页总数total
      seach_params: { limit: 20, page: 1 }, //获取table列表时的参数
      storeListData: [], //店面数据（table使用）
      storeAddData: {
        // id: "",
        contact: "",
        tel: "",
        business_hours: "",
        image_src: "",
        store_name: "",
        address_id: null,
        address: "",
        store_type: null,
        parent_id: [],
        status: 1
      },
      storeEditData: {
        id: "",
        contact: "",
        tel: "",
        business_hours: "",
        image_src: "",
        store_name: "",
        address_id: null,
        address: "",
        store_type: null,
        parent_id: [],
        status: 1
      },

      columns_Timepick: [
        {
          title: this.$t('nurse.week'),
          align: "center",
          key: "weekName",
          width: 150,
          tooltip: true
        },
        {
          title: this.$t('nurse.timelimit'),
          align: "center",
          key: "time",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t('nurse.Capacity'),
          align: "center",
          key: "capacity",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t('Operating'),
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Button", {
                attrs: {
                  title: this.$t('Delete')
                },
                props: {
                  type: "error",
                  shape: "circle",
                  icon: "md-close-circle",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.timePickData.splice(params.row._index, 1);
                  }
                }
              })
            ]);
          }
        }
      ],
      columns_Datepick: [
        {
          title: this.$t('nurse.timelimit'),
          align: "center",
          key: "time",
          width: 150,
          tooltip: true
        },
        {
          title: this.$t('nurse.Daterange'),
          align: "center",
          key: "date",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t('Capacity'),
          align: "center",
          key: "capacity",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t('Operating'),
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Button", {
                attrs: {
                  title: this.$t('Delete'),
                },
                props: {
                  type: "error",
                  shape: "circle",
                  icon: "md-close-circle",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.datePickData.splice(params.row._index, 1);
                  }
                }
              })
            ]);
          }
        }
      ],
      columns_btn: [
        {
          title: this.$t('Name'),
          key: "store_name",
          minWidth: 70,
          align: "center",
          tooltip: true
        },
        {
          title: this.$t('goods.Picture'),
          align: "center",
          key: "image_src",
          minWidth: 100,
          render: (h, params) => {
            return h("img", {
              style: {
                width: "50px",
                height: "auto"
              },
              attrs: {
                src: params.row.image_src
              }
            });
          }
        },
        {
          title: this.$t('goods.GoodType'),
          align: "center",
          key: "store_type",
          minWidth: 90,
          render: (h, params) => {
            const row = params.row;
            const color = row.store_type === 1 ? "cyan" : "gold";
            const text = row.store_type === 1 ? this.$t('DirectStore') : this.$t('FranchiseStore');
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
          title: this.$t('Status'),
          align: "center",
          key: "status",
          minWidth: 90,
          render: (h, params) => {
            const row = params.row;
            const color = row.status === 1 ? "cyan" : "gold";
            const text = row.status === 1 ? this.$t('Enabled') : this.$t('Disabled');
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
          title: this.$t('nurse.address'),
          align: "center",
          key: "address",
          tooltip: true
        },
        {
          title: this.$t('Operating'),
          minWidth: 150,
          align: "center",
          render: (h, params) => {
            return h("div", [
              h("Button", {
                attrs: {
                  title: this.$t('Edit'),
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
                    this.getTreeData();
                    this.file_img = new FormData();
                    let parent_id =
                      params.row.parent_id === 0
                        ? []
                        : getTreeDeepArr(
                            params.row.parent_id,
                            this.childrenData
                          );
                    this.validateId=params.row.id === 0
                        ? []
                        : getTreeDeepArr(
                            params.row.id,
                            this.childrenData
                          );;
                    this.storeEditData = {
                      contact: params.row.contact,
                      tel: params.row.tel,
                      business_hours: params.row.business_hours,
                      id: params.row.id,
                      image_src: params.row.image_src,
                      store_name: params.row.store_name,
                      address: params.row.address,
                      address_id: params.row.address_id,
                      store_type: params.row.store_type,
                      parent_id: parent_id,
                      status: params.row.status
                    };
                    this.modalType_edit = true;
                  }
                }
              }),
              h("Button", {
                attrs: {
                  title: this.$t('Scheduling')
                },
                props: {
                  type: "info",
                  shape: "circle",
                  icon: "md-time",
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    /* this.timePickData = [];
                    this.datePickData = [];
                    this.store_id = params.row.id;
                    let geteve = {
                      store_id: params.row.id
                    };
                    let getdate = {
                      store_id: params.row.id
                    };
                    let successFuc = res => {
                      if (res.data.length) {
                        res.data.forEach(item => {
                          this.timePickData.push({
                            time: item.time,
                            week: item.week + "",
                            capacity: item.capacity,
                            weekName: this.weekdata[item.week - 1].label
                          });
                        });
                      }
                      AjaxApi(
                        "GetStoreTimeSpe",
                        getdate,
                        successFucDat,
                        elseFucDat
                      );
                    };
                    let elseFuc = () => {};
                    let successFucDat = res => {
                      if (res.data.length) {
                        res.data.forEach(item => {
                          this.datePickData.push({
                            time: `${item.from}~${item.to}`,
                            capacity: item.capacity,
                            date: `${item.start_date.substr(
                              0,
                              10
                            )}~${item.end_date.substr(0, 10)}`
                          });
                        });
                      }
                    };
                    let elseFucDat = () => {};
                    AjaxApi("GetStoreTimeEve", geteve, successFuc, elseFuc); */
                    this.modalCrew = true;
                    this.nurse_id = params.row.id;
                    this.$nextTick( () => {
                      this.$refs.schedulingModalRef.getReady(params.row.id)
                    })
                  }
                }
              })
              // h("Button", {
              //   attrs: {
              //     title: "删除店面"
              //   },
              //   props: {
              //     type: "error",
              //     shape: "circle",
              //     icon: "md-close-circle",
              //     size: "small"
              //   },
              //   on: {
              //     click: () => {}
              //   }
              // })
            ]);
          }
        }
      ],
      resetRule: {
        contact: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("contact")}`,
            trigger: "blur"
          }
        ],
        tel: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("tel")}`,
            trigger: "blur"
          },
          { type: 'string', pattern: /^1[0-9]{10}$|^[569][0-9]{7}$/, message: `${this.$t("WrongFormat")}`}
        ],
        business_hours: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("business_hours")}`,
            trigger: "blur"
          }
        ],
        store_name: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("storeName")}`,
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("StoreAddress")}`,
            trigger: "blur"
          }
        ],
        parent_id: [
          // {
          //   required: true,
          //   type: "array",
          //   message: "请选择父类店面",
          //   trigger: "change"
          // }
           {
            validator: validateParent,
            trigger: "change"
          }
        ],
        image_src: [
          {
            required: true,
            message: `${this.$t("PleaseChooseThe")}${this.$t("goods.Picture")}`,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    cancel(){
      this.$nextTick( () => {
        this.$refs.schedulingModalRef.initializeData()
      })
    },
    changeDatePick(famat, date) {
      this.dateTime = famat;
    },
    cancelTimePick() {
      this.modalType_time = false;
      this.Tab = "1";
      this.weekGroup = [];
    },
    do_TimePick() {
      if (this.timePickData.length) {
        let params = { store_id: this.store_id, arrange_data: [] };
        this.timePickData.forEach(i => {
          let arr = i.time.split("~");
          params.arrange_data.push([
            {
              from: `${arr[0]}:00`,
              to: `${arr[1]}:00`,
              date_type: i.week,
              capacity: i.capacity
            }
          ]);
        });
        let successFuc = res => {
          IsMessage("success", this.$t("Successful"));
          this.cancelTimePick();
        };
        let elseFuc = () => {};
        AjaxApi("SetStoreTimeEve", params, successFuc, elseFuc);
      }
      if (this.datePickData.length) {
        let params = { store_id: this.store_id, arrange_data: [] };
        this.datePickData.forEach(i => {
          let arr = i.time.split("~");
          let dat = i.date.split("~");
          params.arrange_data.push({
            from: arr[0],
            to: arr[1],
            start_date: `${dat[0]} 14:31:31`,
            end_date: `${dat[1]} 14:31:32`,
            capacity: i.capacity
          });
        });
        let successFuc = res => {
          if (!this.timePickData.length) {
            IsMessage("success", this.$t("Successful"));
          }
          this.cancelTimePick();
        };
        let elseFuc = () => {};
        AjaxApi("SetStoreTimeSpe", params, successFuc, elseFuc);
      }
      if (!this.timePickData.length && !this.datePickData.length) {
        IsMessage("error", this.$t("PleaseSet"));
      }
    },
    changeTimepick(time) {
      let first_time = new Date(`2019/04/22 ${time[0]}:00`).getTime();
      let second_time = new Date(`2019/04/22 ${time[1]}:00`).getTime();
      if (second_time - first_time < 14400000) {
        let date = new Date(
          new Date(`2019/04/22 ${time[0]}:00`).getTime() + 14400000
        );
        let h =
          date.getHours() < 10
            ? "0" + date.getHours() + ":"
            : date.getHours() + ":";
        let m =
          date.getMinutes() < 10
            ? "0" + date.getMinutes() + ":"
            : date.getMinutes();
        if (this.Tab === "1") {
          this.AddTimePickerTab1 = [time[0], h + m];
        } else {
          this.AddTimePickerTab2 = [time[0], h + m];
        }
      }
    },
    clickTab(name) {
      this.Tab = name;
    },
    AddTimePicker1() {
      let concatArr = [];
      let ifis = false;
      this.weekGroup.some(i => {
        this.timePickData.some(item => {
          if (
            item.week === i &&
            item.time ===
              `${this.AddTimePickerTab1[0]}~${this.AddTimePickerTab1[1]}`
          ) {
            IsMessage("error", `${item.weekName}${this.$t("alertSameTime")}`);
            ifis = true;
            return ifis;
          }
          return ifis;
        });
      });
      if (!ifis) {
        this.weekGroup.forEach(i => {
          concatArr.push({
            time: `${this.AddTimePickerTab1[0]}~${this.AddTimePickerTab1[1]}`,
            week: i,
            weekName: this.weekdata[i * 1 - 1].label,
            capacity: this.numvalue1
          });
        });
      }
      this.timePickData = this.timePickData.concat(concatArr);
      this.weekGroup = [];
    },
    AddTimePicker2() {
      let concatArr = [];
      let ifis = false;
      this.datePickData.some(item => {
        if (item.date === `${this.dateTime[0]}~${this.dateTime[1]}`) {
          if (
            item.time ===
            `${this.AddTimePickerTab2[0]}~${this.AddTimePickerTab2[1]}`
          ) {
            IsMessage("error", `${item.date}${this.$t("alertSameTime")}`);
            ifis = true;
          }
        }
        return ifis;
      });
      if (!ifis && this.dateTime[0]) {
        concatArr.push({
          time: `${this.AddTimePickerTab2[0]}~${this.AddTimePickerTab2[1]}`,
          date: `${this.dateTime[0]}~${this.dateTime[1]}`,
          capacity: this.numvalue2
        });
      }
      this.datePickData = this.datePickData.concat(concatArr);
    },
    addModel() {
      this.getTreeData();
      this.file_img = new FormData();
      this.validateId=null;
      this.storeAddData = {
        contact: "",
        tel: "",
        business_hours: "",
        image_src: "",
        store_name: "",
        address_id: null,
        address: "",
        store_type: 1,
        parent_id: [],
        status: 1
      };
      this.modalType_new = true;
    },
    do_Add() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.this_do_Add();
        }
      });
    },
    //表单验证后确定新增
    this_do_Add() {
      let index = this.storeAddData.parent_id.length - 1;
      let parent_id = !this.storeAddData.parent_id.length
        ? 0
        : Number(this.storeAddData.parent_id[index]);
      this.file_img.append("store_name", this.storeAddData.store_name);
      this.file_img.append("contact", this.storeAddData.contact);
      this.file_img.append("tel", this.storeAddData.tel);
      this.file_img.append("business_hours", this.storeAddData.business_hours);
      this.file_img.append("address", this.storeAddData.address);
      this.file_img.append("store_type", this.storeAddData.store_type);
      this.file_img.append("parent_id", parent_id);
      let successFuc = () => {
        IsAlert("success", this.$t("addedSuccessfully"));
        this.cancelAdd();
        this.getInitData();
      };
      let elseFuc = () => this.cancelAdd();
      AjaxApi("PostNewStore", this.file_img, successFuc, elseFuc);
    },
    //编辑弹窗  点击取消的回调（重置表单验证）
    cancelAdd() {
      this.modalType_new = false;
      this.$nextTick(() => {
        this.$refs["resetForm"].resetFields();
      });
    },
    do_Edit() {
      console.log(this.storeEditData.business_hours)
      this.$refs.resetFormEdit.validate(valid => {
        if (valid) {
          this.this_do_Edit();
        }
      });
    },
    //表单验证后确定编辑
    this_do_Edit() {
      let index = this.storeEditData.parent_id.length - 1;
      let parent_id = !this.storeEditData.parent_id.length
        ? 0
        : Number(this.storeEditData.parent_id[index]);
      this.file_img.append("_method", "PATCH");
      this.file_img.append("store_name", this.storeEditData.store_name);
      this.file_img.append("contact", this.storeEditData.contact);
      this.file_img.append("tel", this.storeEditData.tel);
      this.file_img.append("business_hours", this.storeEditData.business_hours);
      this.file_img.append("address", this.storeEditData.address);
      this.file_img.append("address_id", this.storeEditData.address_id);
      this.file_img.append("store_type", this.storeEditData.store_type);
      this.file_img.append("status", this.storeEditData.status);
      this.file_img.append("parent_id", parent_id);
      let successFuc = () => {
        IsAlert("success", this.$t("editedSuccessfully"));
        this.cancelEdit();
        this.getInitData();
      };
      let elseFuc = () => this.cancelEdit();
      let id = this.storeEditData.id;
      let query = {
        params: this.file_img,
        id: id
      };
      AjaxApi("PostEditStore", query, successFuc, elseFuc);
    },
    //编辑弹窗  点击取消的回调（重置表单验证）
    cancelEdit() {
      this.modalType_edit = false;
      this.$nextTick(() => {
        this.$refs["resetFormEdit"].resetFields();
      });
    },
    /* /按钮方法—————————————————————————————————————————————————————————— */
    //上传图片
    handImgSuccessAdd(res) {
      this.storeAddData.image_src = res.upImg;
      this.file_img = res.formData;
    },
    handImgSuccessEdit(res) {
      this.storeEditData.image_src = res.upImg;
      this.file_img = res.formData;
    },
    //分页跳转方法
    handleCurrentChange(page) {
      this.seach_params.page = page;
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
      AjaxApi("GetStoreList", this.seach_params, successFuc, elseFuc);
    },
    getTreeData() {
      let successFuc = res => {
        //更改数据为tree组件可用的属性
        var a = JSON.stringify(res.data)
          .replace(/id/g, "value")
          .replace(/store_name/g, "label");
        var b = JSON.parse(a);
        this.LevelData = b;
        this.childrenData = res.data;
      };
      let elseFuc = () => {};
      AjaxApi("PostTreeList", {}, successFuc, elseFuc);
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
    this.getTreeData();
  }
};
</script>

<style  lang="less" scoped>
.inputfile {
  opacity: 0;
}
.m_t_10 {
  margin-top: 10px;
}
</style>
<style lang="less">
.nurse-center-time {
  display: flex;
  .ivu-modal-body {
    padding: 10px;
  }
}
.cardTime {
  .colAdd {
    padding-top: 4px;
    padding-left: 4px;
  }
  .ivu-col {
    height: 32px;
    margin-bottom: 8px;
  }
  .ivu-icon {
    margin-top: -1px;
    margin-right: 1px;
  }

  .ivu-card-head {
    padding: 5px 15px;
    // text-align: center;
  }
  .ivu-tabs-bar {
    margin-bottom: 0;
  }
  .rowNurse {
    margin-bottom: 15px;
    height: 32px;
  }
}
</style>
