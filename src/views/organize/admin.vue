<template>
  <div class="admin">
    <Form :model="seach_params" inline style="text-align:left;height:40px">
      <FormItem>
        <Button type="primary" @click="addModel">{{$t('New')}}</Button>
      </FormItem>
      <!-- <FormItem class="users_Input_clear">
        <Input
          search
          enter-button
          clearable
          v-model="seach_params.store_name"
          placeholder="搜索..."
          @on-search="searchFuc"
      ></Input>-->
      <!-- </FormItem> -->
    </Form>
    <Dropdown trigger="hover" class="btn-toolbar pull-right">
      <Icon type="md-settings" size="16"/>
      <DropdownMenu slot="list" style="text-align:left;margin-left:10px">
        <Checkbox-group v-model="tableColumnsChecked" @on-change="changeTableColumns">
          <Checkbox label="Account">{{$t('Account')}}</Checkbox>
          <Checkbox label="accountName">{{$t('accountName')}}</Checkbox>
          <Checkbox label="mobile">{{$t('mobile')}}</Checkbox>
          <Checkbox label="email">{{$t('email')}}</Checkbox>
          <Checkbox label="storeName">{{$t('storeName')}}</Checkbox>
          <Checkbox label="lastlogindate">{{$t('lastlogindate')}}</Checkbox>
        </Checkbox-group>
      </DropdownMenu>
    </Dropdown>
    <div style="text-align:center;width:100%">
      <Table
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
        :title="title"
        label-width="50"
        @on-ok="do_Add"
        @on-cancel="cancelAdd"
        class-name="admin-center-modal"
        :mask-closable="false"
        width="700"
      >
        <div>
          <Form
            v-if="modalType_new"
            ref="resetForm"
            :model="AddData"
            :rules="resetRule"
            :label-width="120"
          >
            <Row :gutter="8" type="flex" justify="start">
              <Col span="23" :md="11">
                <FormItem :label="$t('username')" prop="admin_name">
                  <Input v-model="AddData.admin_name" :placeholder="`${$t('username')}...`"></Input>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                <FormItem :label="$t('email')" prop="email">
                  <Input v-model="AddData.email" :placeholder="`${$t('email')}...`"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="8">
              <Col span="23" :md="11">
              <FormItem :label="$t('MobileAreaCode')" prop="mobile_area">
                  <!-- <Input v-model="AddData.mobile_area" :placeholder="`${$t('MobileAreaCode')}...`"></Input> -->
                  <Select clearable v-model="AddData.mobile_area" :placeholder="`${$t('MobileAreaCode')}...`">
                    <Option value="+86">+86</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                <FormItem :label="$t('mobile')" prop="mobile">
                  <Input v-model="AddData.mobile" :placeholder="`${$t('mobile')}...`"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="8">
              <Col span="23" :md="11">
                <FormItem :label="$t('Password')" prop="password" v-if="title===$t('Create')">
                  <Input v-model="AddData.password" :placeholder="`${$t('Password')}...`"></Input>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                <FormItem
                  :label="$t('ConfirmPassword')"
                  prop="password_confirmation"
                  v-if="title===$t('Create')"
                >
                  <Input
                    v-model="AddData.password_confirmation"
                    :placeholder="`${$t('ConfirmPassword')}...`"
                  ></Input>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="8">
              <Col span="23" :md="11">
                <FormItem :label="$t('ViewInstitution')" prop="view_institution">
                  <Cascader
                    :data="StoreOptions"
                    v-model="AddData.view_institution"
                    change-on-select
                    filterable
                  ></Cascader>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                <FormItem :label="$t('Storefront')" prop="store_id">
                  <Cascader
                    :data="StoreOptions"
                    v-model="AddData.store_id"
                    change-on-select
                    filterable
                  ></Cascader>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="8">
              <Col span="23" :md="23">
                <FormItem :label="$t('Group')" prop="group_id">
                  <Select
                    v-model="AddData.group_id"
                    clearable
                    multiple
                    filterable
                  >
                    <Option
                      v-for="item in GroupOptions"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="23" :md="12">
                
                <FormItem :label="$t('locked')" prop="is_locked">
                  <RadioGroup v-model="AddData.is_locked">
                    <Radio label="1">Yes</Radio>
                    <Radio label="0">Not</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row :gutter="8">
              <Col span="23" :md="23">
                
                 <FormItem :label="$t('Remarks')" prop="memo">
                  <Input
                    v-model="AddData.memo"
                    type="textarea"
                    :autosize="{minRows: 2,maxRows: 5}"
                    :placeholder="`${$t('Remarks')}...`"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="23" :md="23">
               <FormItem :label="$t('Avatar')" prop="avatar">
                  <uploadimg @emitSuccess="handImgSuccess" :imageSrc="AddData.avatar"></uploadimg>
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
    <!-- 修改密码-->
    <div v-show="modalType_newPassword">
      <Modal
        v-model="modalType_newPassword"
        scrollable
        :title="$t('Password')"
        label-width="50"
        @on-ok="do_Password"
        @on-cancel="cancelPassword"
        class-name="admin-center-modal"
        :mask-closable="false"
        width="700"
      >
        <div>
          <Form
            v-if="modalType_newPassword"
            ref="resetPass"
            :model="PasswordData"
            :rules="resetRule"
            :label-width="120"
            inline
          >
            <FormItem :label="$t('oldPassword')" prop="old_password">
              <Input
                :type="oldtype"
                v-model="PasswordData.old_password"
                :placeholder="`${$t('oldPassword')}...`"
                :icon="eye_old"
                @on-click="seeOldPassWord"
              ></Input>
            </FormItem>
            <FormItem :label="$t('Password')" prop="password">
              <Input
                :type="passwordtype"
                v-model="PasswordData.password"
                :placeholder="`${$t('Password')}...`"
                :icon="eye"
                @on-click="seePassWord"
              ></Input>
            </FormItem>
            <FormItem :label="$t('ConfirmPassword')" prop="password_confirmation">
              <Input
                :type="confirmtype"
                v-model="PasswordData.password_confirmation"
                :placeholder="`${$t('ConfirmPassword')}...`"
                :icon="eye_confim"
                @on-click="seeConfirmPassWord"
              ></Input>
            </FormItem>
          </Form>
        </div>
        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelPassword">{{$t('Cancel')}}</Button>
          <Button type="primary" size="small" @click="do_Password">{{$t('Apply')}}</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import {
  CODE_OK,
  IsAlert,
  AjaxApi,
  IsMessage,
  getTreeDeepArr
} from "@/utils/api";
import uploadimg from "@/components/uploadImg/uploadImgFormData.vue";
export default {
  name: "admin",
  components: {
    uploadimg
  },
  data() {
    const validatePasswordConfirm = (rule, value, callback) => {
      if (!this.title) {
        if (value !== this.PasswordData.password) {
          callback(new Error(this.$t("passwordsame")));
        } else if (!value) {
          callback(
            new Error(
              `${this.$t("PleaseEnterThe")}${this.$t("ConfirmPassword")}`
            )
          );
        } else {
          callback();
        }
      } else {
        if (value !== this.AddData.password) {
          callback(new Error(this.$t("passwordsame")));
        } else if (!value) {
          callback(
            new Error(
              `${this.$t("PleaseEnterThe")}${this.$t("ConfirmPassword")}`
            )
          );
        } else {
          callback();
        }
      }
    };
    return {
      childrenData: [],
      oldtype: "password",
      passwordtype: "password",
      confirmtype: "password",
      eye: "md-eye",
      eye_old: "md-eye",
      eye_confim: "md-eye",
      AccountId: null,
      title: this.$t("Create"),
      file_img: new FormData(), //formdata图片
      userListData: this.mockTableData2(),
      tableColumns2: [],
      tableColumnsChecked: [
        "Account",
        "accountName",
        "mobile",
        "email",
        "storeName",
        "lastlogindate",
        "Operating"
      ],
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      modalType_new: false,
      modalType_newPassword: false,
      count: 0, //分页总数total
      seach_params: { limit: 20, page: 1, store_name: "" }, //获取table列表时的参数
      // userListData: [], //数据（table使用）
      StoreOptions: [],
      GroupOptions: [],
      PasswordData: {
        admin_name: "",
        password: "",
        password_confirmation: "",
        old_password: ""
      },
      AddData: {
        admin_name: "",
        mobile_area: "",
        email: "",
        mobile: "",
        password: "",
        password_confirmation: "",
        is_locked: "0",
        group_id: [],
        store_id: [],
        view_institution: [],
        memo: "",
        avatar: ""
      },
      resetRule: {
        admin_name: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("username")}`,
            trigger: "blur"
          }
        ],
        mobile_area: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("MobileAreaCode")}`,
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: `${this.$t("PleaseEnterThe")}${this.$t("email")}`,
            trigger: "blur"
          },
          {
            required: true,
            type: "email",
            message: this.$t("WrongFormat"),
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
        old_password: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("oldPassword")}`,
            trigger: "blur"
          },
          { min: 6, message: this.$t("atleast6"), trigger: "blur" }
        ],
        password: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("Password")}`,
            trigger: "blur"
          },
          { min: 6, message: this.$t("atleast6"), trigger: "blur" }
        ],
        password_confirmation: [
          {
            required: true,
            type: "string",
            validator: validatePasswordConfirm,
            // message: this.$t("passwordsame"),
            trigger: "blur"
          }
        ],
        is_locked: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: this.$t("PleaseEnterThe"),
            trigger: "blur"
          }
        ],
        group_id: [
          {
            required: true,
            type: "array",
            message: `${this.$t("PleaseChooseThe")}${this.$t("Group")}`,
            trigger: "change"
          }
        ],
        view_institution: [
          {
            required: true,
            type: "array",
            message: `${this.$t("PleaseChooseThe")}${this.$t(
              "ViewInstitution"
            )}`,
            trigger: "change"
          }
        ],
        memo: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("Remarks")}`,
            trigger: "blur"
          }
        ],
        avatar: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseChooseThe")}${this.$t("Avatar")}`,
            trigger: "change"
          }
        ],
        store_id: [
          {
            required: true,
            type: "array",
            message: `${this.$t("PleaseChooseThe")}${this.$t("Storefront")}`,
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    seePassWord() {
      this.eye = this.eye === "md-eye" ? "md-eye-off" : "md-eye";
      this.passwordtype =
        this.passwordtype === "password" ? "text" : "password";
    },
    seeOldPassWord() {
      this.eye_old = this.eye_old === "md-eye" ? "md-eye-off" : "md-eye";
      this.oldtype = this.oldtype === "password" ? "text" : "password";
    },
    seeConfirmPassWord() {
      this.eye_confim = this.eye_confim === "md-eye" ? "md-eye-off" : "md-eye";
      this.confirmtype = this.confirmtype === "password" ? "text" : "password";
    },
    mockTableData2() {
      let data = [];
      function getNum() {
        return Math.floor(Math.random() * 10000 + 1);
      }
      for (let i = 0; i < 10; i++) {
        data.push({
          index: i + 1,
          fav: 0,
          Account: getNum(),
          accountName: getNum(),
          mobile: getNum(),
          email: getNum(),
          storeName: getNum(),
          lastlogindate: getNum(),
          Operating: getNum()
        });
      }
      return data;
    },
    getTable2Columns() {
      const tableColumnList = {
        index: {
          type: "index",
          width: 60,
          fixed: "left",
          align: "center"
        },
        Account: {
          title: this.$t("Account"),
          key: "admin_account",
          minWidth: 120,
          align: "center",
          tooltip: true,
          sortable: true
        },
        accountName: {
          title: this.$t("accountName"),
          align: "center",
          minWidth: 120,
          key: "admin_name",
          tooltip: true,
          sortable: true
        },
        mobile: {
          title: this.$t("mobile"),
          align: "center",
          minWidth: 120,
          key: "mobile",
          tooltip: true,
          sortable: true
        },
        email: {
          title: this.$t("email"),
          align: "center",
          minWidth: 120,
          key: "email",
          tooltip: true,
          sortable: true
        },
        storeName: {
          title: this.$t("storeName"),
          align: "center",
          key: "store",
          minWidth: 120,
          tooltip: true,
          sortable: true
        },
        lastlogindate: {
          title: this.$t("lastlogindate"),
          align: "center",
          key: "last_login_date",
          minWidth: 150,
          tooltip: true,
          sortable: true
        },
        Operating: {
          title: this.$t("Operating"),
          minWidth: 140,
          fixed: "right",
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
                    this.AccountId = params.row.id;
                    let _params = {
                      id: params.row.id,
                      params: {}
                    };
                    let successFuc = res => {
                      this.title = this.$t("Edit");
                      this.AddData = {
                        admin_name: res.data[0].admin_name,
                        mobile_area: res.data[0].mobile_area,
                        email: res.data[0].email,
                        mobile: res.data[0].mobile,
                        password: res.data[0].password,
                        password_confirmation: res.data[0].password,
                        is_locked: res.data[0].is_locked + "",
                        group_id: res.data[0].group_id.map(
                          group_id => group_id + ""
                        ),
                        store_id:
                          res.data[0].store_id === 0
                            ? []
                            : getTreeDeepArr(
                                res.data[0].store_id,
                                this.childrenData
                              ),
                        view_institution:
                          res.data[0].view_institution === 0
                            ? []
                            : getTreeDeepArr(
                                res.data[0].view_institution,
                                this.childrenData
                              ),
                        memo: res.data[0].memo,
                        avatar: res.data[0].avatar
                      };
                      this.modalType_new = true;
                    };
                    let elseFuc = () => {};
                    AjaxApi("GetAdminInfo", _params, successFuc, elseFuc);
                  }
                }
              }),
              h("Button", {
                attrs: {
                  title: this.$t("Password")
                },
                props: {
                  type: "info",
                  shape: "circle",
                  icon: "md-finger-print",
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    this.title = "";
                    this.oldtype = "password";
                    this.passwordtype = "password";
                    this.confirmtype = "password";
                    this.eye = "md-eye";
                    this.eye_old = "md-eye";
                    this.eye_confim = "md-eye";
                    this.AccountId = params.row.id;

                    this.PasswordData = {
                      admin_name: params.row.admin_name,
                      old_password: "",
                      password: "",
                      password_confirmation: ""
                    };
                    this.modalType_newPassword = true;
                    // let _params = {
                    // id: params.row.id,
                    // params:{}
                    // };
                    // let successFuc = res => {
                    //     this.PasswordData = {
                    //     admin_name: res.data[0].admin_name,
                    //     old_password: "",
                    //     password: "",
                    //     password_confirmation: "",
                    //   };
                    //   this.modalType_newPassword = true;
                    // };
                    // let elseFuc = () => {};
                    // AjaxApi("GetAdminInfo", _params, successFuc, elseFuc);
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
                      params: { _method: "DELETE" }
                    };
                    let successFuc = () => {
                      this.getInitData();
                      IsMessage("success", this.$t("Deleted"));
                    };
                    let elseFuc = () => {};
                    AjaxApi("DeleteAdmin", deletdata, successFuc, elseFuc);
                  }
                }
              })
            ]);
          }
        }
      };

      let data = [tableColumnList.index];
      this.tableColumnsChecked.forEach(col => data.push(tableColumnList[col]));
      return data;
    },
    changeTableColumns() {
      this.tableColumns2 = this.getTable2Columns();
    },
    // toggleFav (index) {
    //     this.userListData[index].fav = this.userListData[index].fav === 0 ? 1 : 0;
    // },
    addModel() {
      this.title = this.$t("Create");
      this.file_img = new FormData(); //formdata图片
      this.AddData = {
        admin_name: "",
        mobile_area: "",
        email: "",
        mobile: "",
        password: "",
        password_confirmation: "",
        is_locked: "0",
        group_id: [],
        store_id: [],
        view_institution: [],
        memo: "",
        avatar: ""
      };
      this.modalType_new = true;
    },
    /* 按钮方法—————————————————————————————————————————————————————————— */
    searchFuc() {
      this.seach_params.page = 1;
      let successFuc = res => {
        this.userListData = res.data.data;
        this.count = res.data.count;
      };
      let elseFuc = res => {
        if (res.code === "2004") {
          this.userListData = [];
          this.count = 0;
        }
      };
      AjaxApi("GetDocList", this.seach_params, successFuc, elseFuc);
    },
    do_Password() {
      this.$refs.resetPass.validate(valid => {
        if (valid) {
          this.this_do_Password();
        }
      });
    },
    this_do_Password() {
      let successFuc = () => {
        IsMessage("success", this.$t("Successful"));
        this.cancelPassword();
        this.getInitData();
      };
      let elseFuc = () => {};
      let params = {
        id: this.AccountId,
        params: this.PasswordData
      };
      AjaxApi("ChangeAdminPassword", params, successFuc, elseFuc);
    },
    do_Add() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.this_do_Add();
        }
      });
    },
    //上传图片
    handImgSuccess(res) {
      this.AddData.avatar = res.upImg;
      this.file_img = res.formData;
    },
    //表单验证后确定编辑
    this_do_Add() {
      let index = this.AddData.store_id.length - 1;
      let store_id = !this.AddData.store_id.length
        ? 0
        : Number(this.AddData.store_id[index]);
      let index_ = this.AddData.view_institution.length - 1;
      let view_institution = !this.AddData.view_institution.length
        ? 0
        : Number(this.AddData.view_institution[index_]);
      this.AddData.admin_name
        ? this.file_img.append("admin_name", this.AddData.admin_name)
        : {};
      this.AddData.mobile_area
        ? this.file_img.append("mobile_area", this.AddData.mobile_area)
        : {};
      this.AddData.mobile
        ? this.file_img.append("mobile", this.AddData.mobile)
        : {};
      this.AddData.email
        ? this.file_img.append("email", this.AddData.email)
        : {};
      this.AddData.is_locked
        ? this.file_img.append("is_locked", this.AddData.is_locked)
        : {};
      this.AddData.group_id
        ? this.file_img.append("group_id", this.AddData.group_id + "")
        : {};
      this.AddData.store_id ? this.file_img.append("store_id", store_id) : {};
      this.AddData.view_institution
        ? this.file_img.append("view_institution", view_institution)
        : {};
      this.AddData.memo ? this.file_img.append("memo", this.AddData.memo) : {};
      let successFuc = () => {
        IsMessage("success", this.$t("Successful"));
        this.cancelAdd();
        this.getInitData();
      };
      let elseFuc = () => {
        this.file_img = new FormData(); //formdata图片
      };
      if (this.title === this.$t("Create")) {
        this.AddData.password
          ? this.file_img.append("password", this.AddData.password)
          : {};
        this.AddData.password_confirmation
          ? this.file_img.append(
              "password_confirmation",
              this.AddData.password_confirmation
            )
          : {};
        this.AddData.avatar
          ? this.file_img.append("avatar", this.file_img.get("image_src"))
          : {};
        this.file_img.get("image_src") ? this.file_img.delete("image_src") : {};
        AjaxApi("CreatAdmin", this.file_img, successFuc, elseFuc);
      } else {
        this.file_img.append("_method", "PATCH");
        this.file_img.get("image_src")
          ? this.file_img.append("avatar", this.file_img.get("image_src"))
          : this.file_img.append("avatar", this.AddData.avatar);
        this.file_img.get("image_src") ? this.file_img.delete("image_src") : {};
        let params = {
          id: this.AccountId,
          params: this.file_img
        };
        AjaxApi("EditAdmin", params, successFuc, elseFuc);
      }
    },
    //编辑弹窗  点击取消的回调（重置表单验证）
    cancelAdd() {
      this.modalType_new = false;
      // this.$nextTick(() => {
      //   this.$refs["resetForm"].resetFields();
      // });
    },
    cancelPassword() {
      this.modalType_newPassword = false;
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
    getGroupSelect() {
      let successFuc = res => {
        let arrData = [];
        Object.keys(res.data).forEach(function(key) {
          arrData.push({
            value: key.toString(),
            label: res.data[key]
          });
        });
        this.GroupOptions = arrData;
      };
      let elseFuc = () => {};
      AjaxApi("GetGroupOpList", {}, successFuc, elseFuc);
    },
    getStoreSelect() {
      let successFuc = res => {
        //更改数据为tree组件可用的属性
        var a = JSON.stringify(res.data)
          .replace(/id/g, "value")
          .replace(/store_name/g, "label");
        var b = JSON.parse(a);
        this.StoreOptions = b;
        this.childrenData = res.data;
      };
      let elseFuc = () => {};
      AjaxApi("PostTreeList", {}, successFuc, elseFuc);
    },
    //获取初始table数据
    getInitData() {
      let successFuc = res => {
        this.userListData = res.data.data;
        this.count = res.data.count;
      };
      let elseFuc = () => {};
      AjaxApi("GetAdminList", this.seach_params, successFuc, elseFuc);
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
    this.getInitData();
    this.getGroupSelect();
    this.getStoreSelect();
  }
};
</script>
<style  lang="less">
.users_Input_clear {
  .ivu-form-item-content {
    .ivu-input {
      width: 25vw;
    }
  }
  .ivu-input-icon-clear {
    margin-right: 50px;
  }
}
.btn-toolbar {
  cursor: pointer;
  position: absolute;
  top: 48px;
  right: 10px;
  z-index: 10;
  padding: 3px;
  margin: 0;
  background: #fff;
}
.pull-right {
  float: right !important;
}
.admin-center-modal {
  display: flex;
  align-items: center;
  justify-content: center;

  .ivu-modal {
    top: 0;
  }
}
</style>