<template>
  <div class="nurse" v-cloak>
    <Form :model="seach_params" inline style="text-align:left;height:40px" @submit.native.prevent>
      <FormItem>
        <Button type="primary" @click="addModel">{{$t('Create')}}</Button>
      </FormItem>
      <FormItem>
        <Input
          style="width:250px"
          clearable
          v-model="seach_params.search_key"
          :placeholder="$t('nurse.searchkey')"
          @on-clear="searchFuc"
        ></Input>
      </FormItem>
      <FormItem>
        <Select
          v-model="seach_params.year "
          style="width:250px"
          clearable
          :placeholder="$t('nurse.YearsSelect')"
          @on-change="searchFuc"
        >
          <Option :value="0">{{$t('nurse.Year0')}}</Option>
          <Option :value="1">{{$t('nurse.Year1')}}</Option>
          <Option :value="2">{{$t('nurse.Year3')}}</Option>
          <Option :value="3">{{$t('nurse.Year5')}}</Option>
        </Select>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="searchFuc">{{$t('search')}}</Button>
      </FormItem>
    </Form>
    <div style="text-align:center">
      <Table
        class="m_t_10"
        border
        :columns="columns_btn"
        :data="nurseListData"
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
    <Modal
      v-model="modalType_new"
      scrollable
      :title="$t('New')"
      label-width="50"
      @on-ok="do_Add"
      @on-cancel="cancelAdd"
      class-name="nurse-center-modal"
      width="700"
    >
      <div>
        <Form
        v-if="modalType_new"
          ref="resetForm"
          :model="nurseAddData"
          :rules="resetRule"
          id="nurse"
          :label-width="labelWidth100"
        >
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('title')" prop="title">
                <Select clearable v-model="nurseAddData.title" :placeholder="`${$t('title')}...`">
                  <Option :value="0">{{$t("Mr")}}</Option>
                  <Option :value="1">{{$t("Mrs")}}</Option>
                  <Option :value="2">{{$t("Ms")}}</Option>
                  <Option :value="3">{{$t("Miss")}}</Option>
                  <Option :value="4">{{$t("Dr")}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="23" :md="12">
              <FormItem label="GMC" prop="gmc_number">
                <Input clearable v-model="nurseAddData.gmc_number" placeholder="GMC..."></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('firstname')" prop="first_name">
                <Input
                  clearable
                  v-model="nurseAddData.first_name"
                  :placeholder="`${$t('firstname')}...`"
                ></Input>
              </FormItem>
            </Col>
            <Col span="23" :md="12">
              <FormItem :label="$t('lastname')" prop="last_name">
                <Input
                  clearable
                  v-model="nurseAddData.last_name"
                  :placeholder="`${$t('lastname')}...`"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('nurse.mobile')" prop="mobile">
                <Input
                  clearable
                  v-model="nurseAddData.mobile"
                  :placeholder="`${$t('nurse.mobile')}...`"
                ></Input>
              </FormItem>
            </Col>
            <Col span="23" :md="12">
              <FormItem :label="$t('email')" prop="email">
                <Input clearable v-model="nurseAddData.email" :placeholder="`${$t('email')}...`"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('nurse.address')" prop="address">
                <Input
                  clearable
                  v-model="nurseAddData.address"
                  :placeholder="`${$t('address')}...`"
                ></Input>
              </FormItem>
            </Col>
            <Col span="23" :md="12">
              <FormItem :label="$t('nurse.Years')" prop="years_id">
                <Select
                  v-model="nurseAddData.years_id "
                  style="width:100%"
                  clearable
                  :placeholder="$t('nurse.YearsSelect')"
                >
                  <Option :value="0">{{$t('nurse.Year0')}}</Option>
                  <Option :value="1">{{$t('nurse.Year1')}}</Option>
                  <Option :value="2">{{$t('nurse.Year3')}}</Option>
                  <Option :value="3">{{$t('nurse.Year5')}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('nurse.birth')" prop="dob">
                <DatePicker
                  type="date"
                  :options="disabledData"
                  :placeholder="`${$t('nurse.birth')}...`"
                  style="width: 100%"
                  :value="nurseAddData.dob"
                  format="yyyy-MM-dd"
                  @on-change="nurseAddData.dob=$event"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="23" :md="12">
              <FormItem :label="$t('nurse.LastVaccination')" prop="up_to_date_vaccination">
                <Input
                  clearable
                  v-model="nurseAddData.up_to_date_vaccination"
                  :placeholder="`${$t('nurse.LastVaccination')}...`"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('Status')" class="ivu-form-item-required">
                <RadioGroup v-model="nurseAddData.status">
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
        <Button size="small" type="dashed" @click="cancelAdd">{{$t("Cancel")}}</Button>
        <Button type="primary" size="small" @click="do_Add">{{$t("Apply")}}</Button>
      </div>
    </Modal>
    <!-- 编辑 -->
    <Modal
      v-model="modalType_edit"
      scrollable
      :title="$t('Edit')"
      label-width="50"
      @on-ok="do_Edit"
      @on-cancel="cancelEdit"
      class-name="nurse-center-modal"
      width="700"
    >
      <div>
        <Form
          v-if="modalType_edit"
          ref="resetFormEdit"
          :model="nurseEditData"
          :rules="resetRule"
          :label-width="labelWidth100"
        >
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('title')" prop="title">
                <Select clearable v-model="nurseEditData.title" :placeholder="`${$t('title')}...`">
                  <Option :value="0">{{$t("Mr")}}</Option>
                  <Option :value="1">{{$t("Mrs")}}</Option>
                  <Option :value="2">{{$t("Ms")}}</Option>
                  <Option :value="3">{{$t("Miss")}}</Option>
                  <Option :value="4">{{$t("Dr")}}</Option>
                </Select>
              </FormItem>
            </Col>
            <Col span="23" :md="12">
              <FormItem label="GMC" prop="gmc_number">
                <Input clearable v-model="nurseEditData.gmc_number" placeholder="GMC..."></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('firstname')" prop="first_name">
                <Input
                  clearable
                  v-model="nurseEditData.first_name"
                  :placeholder="`${$t('firstname')}...`"
                ></Input>
              </FormItem>
            </Col>
            <Col span="23" :md="12">
              <FormItem :label="$t('lastname')" prop="last_name">
                <Input
                  clearable
                  v-model="nurseEditData.last_name"
                  :placeholder="`${$t('lastname')}...`"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('nurse.mobile')" prop="mobile">
                <Input
                  clearable
                  v-model="nurseEditData.mobile"
                  :placeholder="`${$t('nurse.mobile')}...`"
                ></Input>
              </FormItem>
            </Col>
            <Col span="23" :md="12">
              <FormItem :label="$t('email')" prop="email">
                <Input clearable v-model="nurseEditData.email" :placeholder="`${$t('email')}...`"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('nurse.address')" prop="address">
                <Input
                  clearable
                  v-model="nurseEditData.address"
                  :placeholder="`${$t('nurse.address')}...`"
                ></Input>
              </FormItem>
            </Col>
            <Col span="23" :md="12">
              <FormItem :label="$t('nurse.Years')" prop="years_id">
                <!-- <InputNumber
                  :min="0"
                  :max="99"
                  :step="1"
                  :precision="0"
                  v-model="nurseEditData.years_id"
                  style="width:100%"
                ></InputNumber>-->
                <Select
                  v-model="nurseEditData.years_id "
                  style="width:100%"
                  clearable
                  :placeholder="$t('nurse.YearsSelect')"
                >
                  <Option :value="0">{{$t('nurse.Year0')}}</Option>
                  <Option :value="1">{{$t('nurse.Year1')}}</Option>
                  <Option :value="2">{{$t('nurse.Year3')}}</Option>
                  <Option :value="3">{{$t('nurse.Year5')}}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('nurse.birth')" prop="dob">
                <DatePicker
                  type="date"
                  :options="disabledData"
                  :placeholder="`${$t('nurse.birth')}...`"
                  style="width: 100%"
                  :value="nurseEditData.dob"
                  format="yyyy-MM-dd"
                  @on-change="nurseEditData.dob=$event"
                ></DatePicker>
              </FormItem>
            </Col>
            <Col span="23" :md="12">
              <FormItem :label="$t('nurse.LastVaccination')" prop="up_to_date_vaccination">
                <Input
                  clearable
                  v-model="nurseEditData.up_to_date_vaccination"
                  :placeholder="`${$t('nurse.LastVaccination')}...`"
                ></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="8">
            <Col span="23" :md="11">
              <FormItem :label="$t('Status')" class="ivu-form-item-required">
                <RadioGroup v-model="nurseEditData.status">
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
        <Button size="small" type="dashed" @click="cancelEdit">{{$t("Cancel")}}</Button>
        <Button type="primary" size="small" @click="do_Edit">{{$t("Apply")}}</Button>
      </div>
    </Modal>
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
            <TabPane :label="$t('nurse.Dailytime')" name="1"></TabPane>
            <TabPane :label="$t('nurse.Specifictime')" name="2"></TabPane>
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
            <Row>
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
                  :clearable="false"
                  :editable="false"
                ></TimePicker>
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
                :clearable="false"
                :editable="false"
                :options="OnMonth"
              ></DatePicker>
            </Row>
            <Row>
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
                  :clearable="false"
                  :editable="false"
                ></TimePicker>
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
          <Button size="small" type="dashed" @click="cancelTimePick">{{$t("Cancel")}}</Button>
          <Button type="primary" size="small" @click="do_TimePick">{{$t("Apply")}}</Button>
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
        <schedulingModal ref="schedulingModalRef" scheType="nurse" />
      </Modal>
    </div>
  </div>
</template>

<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage, IsLoading } from "@/utils/api";
import uploadimg from "@/components/uploadImg/uploadImgAdd.vue";
import schedulingModal from "@/components/modal/schedulingModal.vue";
export default {
  name: "nurse",
  components: {
    uploadimg,
    schedulingModal
  },
  data() {
    return {
      disabledData: {
        //生日不可选的时间
        disabledDate(date) {
          // return date && date.valueOf() < Date.now() - 86400000;
          return date && date.valueOf() > Date.now();
        }
      },
      modalCrew: false,
      nurse_id: null,
      weekGroup: [],
      Tab: "1",
      dateTime: [
        new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1 < 10
            ? "0" + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1) +
          "-" +
          (new Date().getDate() < 10
            ? "0" + new Date().getDate()
            : new Date().getDate()),
        new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1 < 10
            ? "0" + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1) +
          "-" +
          (new Date().getDate() < 10
            ? "0" + new Date().getDate()
            : new Date().getDate())
      ],
      baseTime: [
        new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1 < 10
            ? "0" + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1) +
          "-" +
          (new Date().getDate() < 10
            ? "0" + new Date().getDate()
            : new Date().getDate()),
        new Date().getFullYear() +
          "-" +
          (new Date().getMonth() + 1 < 10
            ? "0" + (new Date().getMonth() + 1)
            : new Date().getMonth() + 1) +
          "-" +
          (new Date().getDate() < 10
            ? "0" + new Date().getDate()
            : new Date().getDate())
      ],
      AddTimePickerTab1: ["00:00", "04:00"],
      AddTimePickerTab2: ["00:00", "04:00"],
      weekdata: this.$t("nurse.weekdata"),
      labelWidth100: 100,
      value1: [],
      // DocAdress: [],
      DocOptions: [],
      StoreOptions: [],
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      modalType_new: false,
      modalType_edit: false,
      modalType_time: false,
      count: 0, //分页总数total
      seach_params: { limit: 20, page: 1, search_key: "", year: null }, //获取table列表时的参数
      nurseListData: [], //护士数据（table使用）
      timePickData: [
        { time: "00:00~22:00", week: "1", weekName: this.$t("Mon") }
      ],
      datePickData: [
        { time: "00:00~22:00", week: "1", date: "2019-08-25~2019-08-30" }
      ],
      OnMonth: {
        disabledDate(date) {
          return (
            date.valueOf() < Date.now() - 86400000 ||
            date.valueOf() > Date.now() + 2592000000
          );
        }
      },
      nurseAddData: {
        id: null,
        years_id: null,
        title: null,
        first_name: "",
        last_name: "",
        dob: "",
        gmc_number: "",
        up_to_date_vaccination: "",
        mobile: "",
        email: "",
        status: 1,
        address: null
      },
      nurseEditData: {
        id: null,
        years_id: null,
        title: null,
        first_name: "",
        last_name: "",
        dob: "",
        gmc_number: "",
        email: "",
        up_to_date_vaccination: "",
        mobile: "",
        status: 1,
        address: 1
      },
      columns_Timepick: [
        {
          title: this.$t("nurse.week"),
          align: "center",
          key: "weekName",
          width: 150,
          tooltip: true
        },
        {
          title: this.$t("nurse.timelimit"),
          align: "center",
          key: "time",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("Operating"),
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", [
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
          title: this.$t("nurse.timelimit"),
          align: "center",
          key: "time",
          width: 150,
          tooltip: true
        },
        {
          title: this.$t("nurse.Daterange"),
          align: "center",
          key: "date",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("Operating"),
          width: 100,
          align: "center",
          render: (h, params) => {
            return h("div", [
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
                    this.datePickData.splice(params.row._index, 1);
                  }
                }
              })
            ]);
          }
        }
      ],
      //iview列表按钮数据
      columns_btn: [
        {
          title: this.$t("AllName"),
          align: "center",
          key: "first_name",
          minWidth: 90,
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
          title: this.$t("nurse.title"),
          align: "center",
          key: "title_name",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("nurse.birth"),
          align: "center",
          key: "dob",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("nurse.GMC"),
          align: "center",
          key: "gmc_number",
          minWidth: 60,
          tooltip: true
        },
        {
          title: this.$t("nurse.LastVaccination"),
          align: "center",
          key: "up_to_date_vaccination",
          minWidth: 90,
          tooltip: true
        },
        {
          title: this.$t("nurse.address"),
          align: "center",
          key: "address",
          minWidth: 60,
          tooltip: true
        },
        {
          title: this.$t("nurse.Years"),
          align: "center",
          key: "years_of_experience",
          minWidth: 80,
          tooltip: true
        },
        {
          title: this.$t("nurse.mobile"),
          align: "center",
          key: "mobile",
          minWidth: 60,
          tooltip: true
        },
        {
          title: this.$t("email"),
          align: "center",
          key: "email",
          minWidth: 60,
          tooltip: true
        },
        {
          title: this.$t("Status"),
          align: "center",
          key: "status",
          minWidth: 80,
          render: (h, params) => {
            const row = params.row;
            const color = row.status === 1 ? "cyan" : "gold";
            const text =
              row.status === 1 ? this.$t("Normal") : this.$t("Disabled");
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
                    this.nurseEditData = {
                      id: params.row.id,
                      years_id: params.row.years_id,
                      title: params.row.title,
                      first_name: params.row.first_name,
                      last_name: params.row.last_name,
                      dob: params.row.dob,
                      gmc_number: params.row.gmc_number,
                      up_to_date_vaccination: params.row.up_to_date_vaccination,
                      mobile: params.row.mobile,
                      status: params.row.status,
                      address: params.row.address
                    };
                    this.modalType_edit = true;
                  }
                }
              }),
              h("Button", {
                attrs: {
                  title: this.$t("Scheduling")
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
                    this.nurse_id = params.row.id;
                    let geteve = {
                      nurse_id: params.row.id
                    };
                    let getdate = {
                      nurse_id: params.row.id
                    };
                    let successFuc = res => {
                      if (res.data.length) {
                        res.data.forEach(item => {
                          this.timePickData.push({
                            time: item.time,
                            week: item.week + "",
                            weekName: this.weekdata[item.week - 1].label
                          });
                        });
                      }

                      let elseFucDat = () => {};

                      AjaxApi(
                        "GetTimeDate",
                        getdate,
                        successFucDat,
                        elseFucDat
                      );
                    };
                    let successFucDat = res => {
                      if (res.data.length) {
                        res.data.forEach(item => {
                          this.datePickData.push({
                            time: `${item.from}~${item.to}`,
                            date: `${item.start_date.substr(
                              0,
                              10
                            )}~${item.end_date.substr(0, 10)}`
                          });
                        });
                      }
                    };
                    let elseFuc = () => {};
                    AjaxApi("GetTimeEve", geteve, successFuc, elseFuc);
                    this.modalType_time = true; */
                    this.modalCrew = true;
                    this.nurse_id = params.row.id;
                    this.$nextTick(() => {
                      this.$refs.schedulingModalRef.getReady(params.row.id);
                    });
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
                      id: params.row.id
                    };
                    let successFuc = () => {
                      IsMessage("success", this.$t("Deleted"));
                      this.getInitData();
                    };
                    let elseFuc = () => {};
                    AjaxApi("DeleteNurse", deletdata, successFuc, elseFuc);
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
            message: `${this.$t("PleaseEnterThe")}ID`,
            trigger: "blur"
          }
        ],
        years_id: [
          {
            required: true,
            type: "number",
            message: `${this.$t("PleaseEnterThe")}${this.$t("nurse.Years")}`,
            trigger: "change"
          }
        ],
        address: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("address")}`,
            trigger: "blur"
          }
        ],
        title: [
          {
            required: true,
            type: "number",
            message: `${this.$t("PleaseEnterThe")}${this.$t("title")}`,
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
        mobile: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("mobile")}`,
            trigger: "blur"
          }
        ],
        up_to_date_vaccination: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t(
              "nurse.LastVaccination"
            )}`,
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
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("WrongFormat")}`,
            trigger: "blur"
          }
        ],
        dob: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseChooseThe")}${this.$t("Date")}`,
            trigger: "change"
          }
        ],
        gmc_number: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}GMC`,
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
      this.Tab = "1";
      this.weekGroup = [];
      this.AddTimePickerTab1 = ["00:00", "04:00"];
      this.AddTimePickerTab2 = ["00:00", "04:00"];
      this.dateTime = this.baseTime;
      this.modalType_time = false;
    },
    do_TimePick() {
      if (this.timePickData.length) {
        let params = { nurse_id: this.nurse_id, arrange_data: [] };
        this.timePickData.forEach(i => {
          let arr = i.time.split("~");
          params.arrange_data.push([
            {
              from: arr[0],
              to: arr[1],
              date_type: i.week
            }
          ]);
        });
        let successFuc = res => {
          IsMessage("success", this.$t("Successful"));
          this.cancelTimePick();
        };
        let elseFuc = () => {};
        AjaxApi("SetTimeEve", params, successFuc, elseFuc);
      }
      if (this.datePickData.length) {
        let params = { nurse_id: this.nurse_id, arrange_data: [] };
        this.datePickData.forEach(i => {
          let arr = i.time.split("~");
          let dat = i.date.split("~");
          params.arrange_data.push({
            from: arr[0],
            to: arr[1],
            start_date: `${dat[0]} 14:31:31`,
            end_date: `${dat[1]} 14:31:32`
          });
        });
        let successFuc = res => {
          if (!this.timePickData.length) {
            IsMessage("success", this.$t("Successful"));
          }
          this.cancelTimePick();
        };
        let elseFuc = () => {};
        AjaxApi("SetTimeDate", params, successFuc, elseFuc);
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
            weekName: this.weekdata[i * 1 - 1].label
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
      if (!ifis) {
        concatArr.push({
          time: `${this.AddTimePickerTab2[0]}~${this.AddTimePickerTab2[1]}`,
          date: `${this.dateTime[0]}~${this.dateTime[1]}`
        });
      }
      this.datePickData = this.datePickData.concat(concatArr);
    },
    changeDate(model, date) {
      this.nurseAddData.dob = model;
    },
    changeDateEdit(model, date) {
      this.nurseEditData.dob = model;
    },
    addModel() {
      this.nurseAddData = {
        id: null,
        years_id: null,
        title: null,
        first_name: "",
        last_name: "",
        email: "",
        dob: "",
        gmc_number: "",
        up_to_date_vaccination: "",
        mobile: "",
        status: 1,
        address: ""
      };
      this.modalType_new = true;
    },
    /* 按钮方法—————————————————————————————————————————————————————————— */
    searchFuc() {
      IsLoading();
      this.seach_params.page = 1;
      let successFuc = res => {
        this.nurseListData = res.data.data;
        this.count = res.data.count;
      };
      let elseFuc = res => {
        this.nurseListData = [];
        this.count = 0;
      };
      AjaxApi("GetNurseList", this.seach_params, successFuc, elseFuc);
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
      let params = {
        years_id: this.nurseAddData.years_id,
        title: this.nurseAddData.title,
        first_name: this.nurseAddData.first_name,
        last_name: this.nurseAddData.last_name,
        dob: this.nurseAddData.dob,
        gmc_number: this.nurseAddData.gmc_number,
        up_to_date_vaccination: this.nurseAddData.up_to_date_vaccination,
        mobile: this.nurseAddData.mobile,
        email: this.nurseAddData.email,
        status: this.nurseAddData.status,
        address: this.nurseAddData.address
      };
      let successFuc = () => {
        IsMessage("success", this.$t("addedSuccessfully"));
        this.cancelAdd();
        this.getInitData();
      };
      let elseFuc = () => this.cancelAdd();
      AjaxApi("AddOrNurse", params, successFuc, elseFuc);
    },
    //编辑弹窗  点击取消的回调（重置表单验证）
    cancelAdd() {
      // this.$nextTick(() => {
      //   this.$refs["resetForm"].resetFields();
      // });
      this.modalType_new = false;
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
        id: this.nurseEditData.id,
        years_id: this.nurseEditData.years_id,
        title: this.nurseEditData.title,
        first_name: this.nurseEditData.first_name,
        last_name: this.nurseEditData.last_name,
        dob: this.nurseEditData.dob,
        gmc_number: this.nurseEditData.gmc_number,
        up_to_date_vaccination: this.nurseEditData.up_to_date_vaccination,
        mobile: this.nurseEditData.mobile,
        status: this.nurseEditData.status,
        address: this.nurseEditData.address,
        email: this.nurseEditData.email
      };
      let successFuc = () => {
        IsMessage("success", this.$t("editedSuccessfully"));
        this.cancelEdit();
        this.getInitData();
      };
      let elseFuc = () => this.cancelEdit();
      AjaxApi("AddOrNurse", params, successFuc, elseFuc);
    },
    //编辑弹窗  点击取消的回调（重置表单验证）
    cancelEdit() {
      this.modalType_edit = false;
      // this.$nextTick(() => {
      //   this.$refs["resetFormEdit"].resetFields();
      // });
    },
    /* /按钮方法—————————————————————————————————————————————————————————— */

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
        this.nurseListData = res.data.data;
        this.count = res.data.count;
      };
      let elseFuc = res => {
        this.nurseListData = [];
        this.count = 0;
      };
      AjaxApi("GetNurseList", this.seach_params, successFuc, elseFuc);
    },
    // getDocAdress() {
    //   let successFuc = res => {
    //     let arrData = [];
    //     Object.keys(res.data).forEach(function(key) {
    //       arrData.push({
    //         value: key * 1,
    //         label: res.data[key]
    //       });
    //     });
    //     this.DocAdress = arrData;
    //   };
    //   let elseFuc = () => {};
    //   AjaxApi("DocAdress", {}, successFuc, elseFuc);
    // },
    getDocOptios() {
      let successFuc = res => {
        let arrData = [];
        Object.keys(res.data).forEach(function(key) {
          arrData.push({
            value: key * 1,
            label: res.data[key]
          });
        });
        this.DocOptions = arrData;
      };
      let elseFuc = () => {};
      AjaxApi("DocSelect", {}, successFuc, elseFuc);
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
    // this.getDocAdress();
    this.getDocOptios();
    this.getStoreSelect();
  }
};
</script>
<style  lang="less">
.nurse-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
.nurse-center-time {
  display: flex;
  // align-items: center;
  // justify-content: center;

  // .ivu-modal {
  //   top: -10%;
  // }
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
  }
}
.nurse {
  .ivu-table-cell {
    padding: 0 !important;
  }
}
.nurse_Input_clear {
  .ivu-form-item-content {
    .ivu-input {
      // width: 25vw;
      min-width: 245px;
    }
  }
  .ivu-input-icon-clear {
    margin-right: 50px;
  }
}
.crew_modal {
  .ivu-modal-footer {
    display: none;
  }
}
</style>