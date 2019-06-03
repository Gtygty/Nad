<template>
  <div class="access">
    <Row>
      <Col span="3" style="text-align:left">
        <Button type="primary" @click="addModel">新增分组</Button>
      </Col>
    </Row>
    <Table class="m_t_10" border :columns="columns_btn" :data="GroupData" :height="dynamicHeight"></Table>
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

    <!-- 组选择用户 -->
    <div v-if="modal_groupuser">
      <Modal
        v-model="modal_groupuser"
        scrollable
        title="组选择用户"
        @on-ok="setUsers"
        @on-cancel="cancelSetUsers"
      >
        <Row>
          <Col span="5">
            <CellGroup>
              <Cell
                v-for="(item,index) in department"
                :key="index"
                :title="item.department_name?item.department_name:'无名字'"
                @click.native="clickCell(index,item.id)"
                :selected="if_cell_select[index]"
              />
            </CellGroup>
          </Col>
          <Col span="17">
            <Card style="width:350px" class="isuser">
              <p slot="title">
                <Icon type="md-body"></Icon>组内用户
              </p>
              <CheckboxGroup v-model="inner_admin_this">
                <Checkbox
                  v-for="(i,index) in inner_admin"
                  :key="index"
                  :label="i.id"
                  style="padding:5px 5px;"
                >
                  <span>{{i.admin_name?i.admin_name:'无名字'}}</span>
                </Checkbox>
              </CheckboxGroup>
            </Card>
            <Card style="width:350px" class="isuser">
              <p slot="title">
                <Icon type="ios-body-outline"></Icon>组外用户
              </p>
              <CheckboxGroup v-model="out_admin_this">
                <Checkbox
                  v-for="(i,index) in out_admin"
                  :key="index"
                  :label="i.id"
                  style="padding:5px 5px;"
                >
                  <span>{{i.admin_name}}</span>
                </Checkbox>
              </CheckboxGroup>
            </Card>
          </Col>
        </Row>

        <div slot="footer">
          <Button size="small" type="dashed" @click="cancelSetUsers">取消</Button>
          <Button type="primary" size="small" @click="setUsers">确定</Button>
        </div>
      </Modal>
    </div>
    <!-- 分组权限 -->
    <Modal
      v-model="modal_group_permission"
      scrollable
      title="分组权限"
      @on-ok=" setFeature"
      @on-cancel="cancelSetFeature"
    >
      <div>
        <table class="table table-hover table-striped table-bordered">
          <!-- style="border-collapse:collapse!important;box-sizing: border-box;" -->
          <tbody v-for="(item,index) in checked" :key="index" :label="item.id">
            <tr style="box-sizing: border-box;">
              <th class="text-middle text-right w-150px" style="box-sizing: border-box;">
                <!-- style="width: 100px!important;vertical-align: middle!important;text-align: right;border: 1px solid #cbd0db;" -->
                <Checkbox
                  :indeterminate="indeterminate[index]"
                  v-model="checkAll[index]"
                  @on-change="handleCheckAll(index)"
                >{{item.feature_name}}</Checkbox>
              </th>
              <td
                id="index"
                class="pv-10px"
                style="border: 1px solid #cbd0db;vertical-align: middle;width:405px!important;"
              >
                <div class="group-item">
                  <div class="checkbox-primary checkbox-inline">
                    <CheckboxGroup v-model="checkedF" @on-change="checkBoxChange(index)">
                      <Checkbox
                        v-for="(i,index) in item.children"
                        :key="index"
                        :label="i.id"
                        style="padding:5px 5px;min-width:100px"
                      >
                        <span>{{i.feature_name}}</span>
                      </Checkbox>
                    </CheckboxGroup>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div slot="footer">
        <Button size="small" type="info" @click="modal_add_feature=true" style="float:left">新增权限</Button>
        <Button size="small" type="dashed" @click="cancelSetFeature">取消</Button>
        <Button type="primary" size="small" @click=" setFeature">确定</Button>
      </div>
    </Modal>
    <Modal
      v-model="modal_group_add"
      scrollable
      title="新增分组"
      @on-ok="addGroup"
      @on-cancel="modal_group_add=false"
    >
      <div>
        <Form
          v-if="modal_group_add"
          :model="addData"
          :label-width="80"
          :rules="resetRule"
          ref="resetFormAdd"
        >
          <FormItem label="分组名称" prop="group_name">
            <Input v-model="addData.group_name" placeholder="分组名称..."></Input>
          </FormItem>
          <FormItem label="分组描述" prop="group_desc">
            <Input
              v-model="addData.group_desc"
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="分组描述..."
            ></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button size="small" type="text" @click="modal_group_add=false">{{$t('Cancel')}}</Button>
        <Button type="primary" size="small" @click="addGroup" class="m_l_10">{{$t('Apply')}}</Button>
      </div>
    </Modal>
    <!-- 编辑分组 -->
    <Modal
      v-model="modal_group"
      scrollable
      title="编辑分组"
      @on-ok="editGroup"
      @on-cancel="modal_group=false"
    >
      <div>
        <Form v-if="modal_group" :model="editData" :label-width="80" ref="resetFormEdit" :rules="resetRule">
          <FormItem label="分组名称" prop="group_name">
            <Input v-model="editData.group_name" placeholder="分组名称..."></Input>
          </FormItem>
          <FormItem label="分组描述" prop="group_desc">
            <Input
              v-model="editData.group_desc"
              type="textarea"
              :autosize="{minRows: 2,maxRows: 5}"
              placeholder="分组描述..."
            ></Input>
          </FormItem>
        </Form>
      </div>
      <div slot="footer">
        <Button size="small" type="text" @click="modal_group=false">{{$t('Cancel')}}</Button>
        <Button type="primary" size="small" @click="editGroup" class="m_l_10">{{$t('Apply')}}</Button>
      </div>
    </Modal>
    <!-- 分组详情 -->
    <Modal v-model="modal_group_view" scrollable title="分组详情">
      <div>
        <Form :model="viewData" :label-width="80">
          <FormItem label="分组名称:">{{viewData.group_name}}</FormItem>
          <FormItem label="分组描述:">{{viewData.group_desc}}</FormItem>
        </Form>
      </div>
    </Modal>
    <!-- 新增权限 -->
    <Modal
      v-model="modal_add_feature"
      scrollable
      title="新增权限"
      @on-ok="addNewFeature"
      @on-cancel="cancelNewFeature"
    >
      <div>
        <Form :model="featureData" :label-width="80">
          <FormItem label="父级权限:">
            <Select v-model="featureData.parent_id">
              <Option value="0">无</Option>
              <Option
                v-for="(item,index) in checked"
                :key="index"
                :label="item.feature_name"
                :value="item.id"
              >{{item.feature_name}}</Option>
            </Select>
          </FormItem>
          <FormItem label="权限名称:">
            <Input v-model="featureData.feature_name" placeholder="权限名称"></Input>
          </FormItem>
          <FormItem label="唯一标识:">
            <Input v-model="featureData.feature_key" placeholder="唯一标识"></Input>
          </FormItem>
        </Form>
      </div>
    </Modal>
  </div>
</template>

<script>
import { CODE_OK, IsAlert } from "@/utils/api";
export default {
  name: "access",
  data() {
    return {
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      btnLoading: { user: [], delete: [], permission: [] },
      count: 0, //分页总数total
      seach_params: { limit: 20, current_page: 1 }, //获取table列表时的参数
      modal_group: false, //编辑用户组弹窗的状态
      modal_group_add: false, //新增用户组弹窗的状态
      modal_group_view: false, //查看用户组弹窗的状态
      modal_group_permission: false, //设置用户组权限弹窗的状态
      modal_add_feature: false, //新增用户组权限弹窗的状态
      modal_groupuser: false, //组选择用户弹窗的状态
      GroupData: [], //用户组数据（table使用）
      beforeData: {}, //编辑用户组时判断是否数据更改
      editData: {}, //编辑用户组时的model数据
      addData: {
        group_name: "",
        group_desc: "",
        status: 1
      }, //新增用户组时的model数据
      viewData: {}, //查看用户组时的model数据
      //新增权限时的参数
      featureData: {
        feature_name: "",
        feature_key: "",
        parent_id: ""
      },
      checkAll: [], //多选框为全选的标识
      indeterminate: [], //多选框为非全选的标识

      group_id: 0, //设置用户组权限时的组id参数
      checked: [], //多选框，权限数据
      checkedF: [], //多选框，2级权限数据
      department: [], //部门
      inner_admin: [], //组内用户
      inner_admin_this: [], //组内用户
      out_admin: [], //组外用户
      out_admin_this: [], //组外用户
      if_cell_select: [],
      checkedChild: [],
      checkAllGroup: [],

      //iview列表按钮数据
      columns_btn: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "分组名称",
          key: "group_name",
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.group_name)
            ]);
          }
        },
        {
          title: "分组描述",
          align: "center",
          tooltip: true,
          key: "group_desc"
        },
        {
          title: "用户",
          align: "center",
          key: "admin"
        },
        {
          title: "操作",
          minWidth: 150,
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
                    this.beforeData = JSON.parse(JSON.stringify(params.row));
                    this.editData = JSON.parse(JSON.stringify(params.row));
                    this.modal_group = true;
                  }
                }
              }),
              // h(
              //   "Button",
              //   {
              //     attrs: {
              //       title: "查看用户组"
              //     },
              //     props: {
              //       type: "info",
              //       size: "small"
              //     },
              //     style: {
              //       marginRight: "5px"
              //     },
              //     on: {
              //       click: () => {
              //         this.viewData = JSON.parse(JSON.stringify(params.row));
              //         this.modal_group_view = true;
              //       }
              //     }
              //   },
              //   "查看"
              // ),
              h("Button", {
                attrs: {
                  title: "组分配用户"
                },
                props: {
                  type: "info",
                  shape: "circle",
                  loading: this.btnLoading.user[params.row._index],
                  icon: "md-contacts",
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    this.btnLoading.user.splice(params.row._index, 1, true);
                    let prames = {
                      group_id: params.row.id
                    };
                    this.$store
                      .dispatch("GetGroupDepartment", prames)
                      .then(res => {
                        if (res.code === CODE_OK) {
                          this.group_id = params.row.id;
                          this.department = [];
                          this.inner_admin = [];
                          this.inner_admin_this = [];
                          this.out_admin = [];
                          this.if_cell_select = [];
                          for (
                            let index = 0;
                            index < res.data.department.length;
                            index++
                          ) {
                            this.if_cell_select.push(false);
                          }
                          for (
                            let index = 0;
                            index < res.data.inner_admin.length;
                            index++
                          ) {
                            this.inner_admin_this.push(
                              res.data.inner_admin[index].id
                            );
                          }
                          this.department = JSON.parse(
                            JSON.stringify(res.data.department)
                          );
                          this.inner_admin = JSON.parse(
                            JSON.stringify(res.data.inner_admin)
                          );
                          this.out_admin = JSON.parse(
                            JSON.stringify(res.data.out_admin)
                          );
                          this.modal_groupuser = true;
                        } else {
                          IsAlert("error", "获取用户列表失败！", res.message);
                        }
                        this.btnLoading.user.splice(
                          params.row._index,
                          1,
                          false
                        );
                      })
                      .catch(error => {
                        IsAlert("error", "服务器错误！", error);
                        this.btnLoading.user.splice(
                          params.row._index,
                          1,
                          false
                        );
                      });
                  }
                }
              }),
              h("Button", {
                attrs: {
                  title: this.$t("setPro")
                },
                props: {
                  type: "warning",
                  shape: "circle",
                  icon: "md-lock",
                  loading: this.btnLoading.permission[params.row._index],
                  size: "small"
                },
                style: {
                  marginRight: "5px"
                },
                on: {
                  click: () => {
                    this.btnLoading.permission.splice(
                      params.row._index,
                      1,
                      true
                    );
                    let prames = {
                      group_id: params.row.id
                    };
                    this.$store
                      .dispatch("GetGroupFeature", prames)
                      .then(res => {
                        if (res.code === CODE_OK) {
                          this.indeterminate = [];
                          this.checkAll = [];
                          this.checked = [];
                          this.checked = JSON.parse(JSON.stringify(res.data));
                          this.checked.forEach(v => {
                            let ifCheckeAll = 0;
                            for (
                              let index = 0;
                              index < v.children.length;
                              index++
                            ) {
                              if (v.children[index].checked === 1) {
                                this.checkedF.push(v.children[index].id);
                                ifCheckeAll = ifCheckeAll + 1;
                              }
                            }
                            v.checked === 1 && ifCheckeAll !== v.children.length
                              ? this.indeterminate.push(true)
                              : this.indeterminate.push(false);
                            v.checked === 1 && ifCheckeAll === v.children.length
                              ? this.checkAll.push(true)
                              : this.checkAll.push(false);
                          });
                          this.group_id = params.row.id;
                          this.modal_group_permission = true;
                        } else {
                          IsAlert(
                            "error",
                            this.$t("OperationFailed"),
                            res.message
                          );
                        }
                        this.btnLoading.permission.splice(
                          params.row._index,
                          1,
                          false
                        );
                      })
                      .catch(error => {
                        IsAlert("error", "Service Error!", error);
                        this.btnLoading.permission.splice(
                          params.row._index,
                          1,
                          false
                        );
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
                  loading: this.btnLoading.delete[params.row._index],
                  icon: "md-close-circle",
                  size: "small"
                },
                on: {
                  click: () => {
                    this.remove(params.row.id, params.row.group_name);
                  }
                }
              })
            ]);
          }
        }
      ],
      resetRule: {
        group_name: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("Name")}`,
            trigger: "blur"
          }
        ],
        group_desc: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("description")}`,
            trigger: "blur"
          }
        ]
      }
    };
  },

  methods: {
    /* 按钮方法—————————————————————————————————————————————————————————— */
    //编辑用户组
    editGroup() {
      this.$refs.resetFormEdit.validate(valid => {
        if (valid) {
          if (
            JSON.stringify(this.beforeData) === JSON.stringify(this.editData)
          ) {
            IsAlert("warning", this.$t("dataNotChan"));
          } else {
            let prames = {
              id: this.editData.id,
              group_name: this.editData.group_name,
              group_desc: this.editData.group_desc,
              status: this.editData.status
            };
            this.$store
              .dispatch("EditGroup", prames)
              .then(res => {
                if (res.code === CODE_OK) {
                  this.getInitData();
                  this.beforeData = JSON.parse(JSON.stringify(this.editData));
                  IsAlert("success", this.$t("Successful"));
                } else {
                  IsAlert("error", this.$t("OperationFailed"), res.message);
                }
              })
              .catch(error => {
                IsAlert("error", "Service Error!", error);
              });
          }
        }
      });
    },
    //设置用户组权限
    setFeature() {
      for (let index = 0; index < this.checked.length; index++) {
        if (this.checkAll[index] || this.indeterminate[index]) {
          this.checkedF.push(this.checked[index].id);
        }
      }
      let prames = {
        feature_ids: Array.from(new Set(this.checkedF)) + "",
        group_id: this.group_id
      };
      this.$store
        .dispatch("AddGroupFeature", prames)
        .then(res => {
          if (res.code === CODE_OK) {
            this.modal_group_permission = false;
            IsAlert("success", this.$t("Successful"));
            console.log(666);
            this.getInitData();
          } else {
            IsAlert("error", this.$t("OperationFailed"), res.message);
          }
        })
        .catch(error => {
          IsAlert("error", "Service Error!", error);
        });
    },
    //取消设置用户组权限
    cancelSetFeature() {
      this.checked = [];
      this.checkedF = [];
      this.modal_group_permission = false;
    },
    //设置组用户
    setUsers() {
      let prames = {
        group_id: this.group_id,
        admin_inner_id: this.inner_admin_this + "",
        admin_out_id: this.out_admin_this + ""
      };
      this.$store
        .dispatch("SetUserByDepart", prames)
        .then(res => {
          if (res.code === CODE_OK) {
            IsAlert("success", this.$t("Successful"));
            this.modal_groupuser = false;
            this.getInitData();
          } else {
            IsAlert("error", this.$t("OperationFailed"), res.message);
          }
        })
        .catch(error => {
          IsAlert("error", "Service Error!", error);
        });
    },
    //取消设置组用户
    cancelSetUsers() {
      this.inner_admin_this = [];
      this.out_admin_this = [];
      this.modal_groupuser = false;
    },

    //删除用户组按钮
    remove(ids, name) {
      // this.GroupData.splice(index, 1);
      this.$Modal.confirm({
        title: `${this.$t("doDelete")}${name}?`,
        content: `<p>${this.$t("deleteNone")}</p>`,
        okText: `${this.$t("Delete")}`,
        cancelText: `${this.$t("Cancel")}`,
        onOk: () => {
          this.deleteGroup(ids);
        },
        onCancel: () => {}
      });
    },

    //确定删除用户组
    deleteGroup(ids) {
      let prames = {
        ids: ids
      };
      this.$store
        .dispatch("DeleteGroup", prames)
        .then(res => {
          if (res.code === CODE_OK) {
            IsAlert("success", this.$t("Deleted"));
            this.getInitData();
          } else {
            IsAlert("error", this.$t("OperationFailed"), res.message);
          }
        })
        .catch(error => {
          IsAlert("error", "Service Error!", error);
        });
    },
    /* /按钮方法—————————————————————————————————————————————————————————— */
    //用户组新增权限
    addNewFeature() {
      if (
        !this.featureData.feature_name ||
        !this.featureData.parent_id ||
        !this.featureData.feature_key
      ) {
        IsAlert("warning", this.$t("NewDataEm"));
      } else {
        let prames = {
          feature_name: this.featureData.feature_name,
          parent_id: this.featureData.parent_id,
          feature_key: this.featureData.feature_key,
          status: "1"
        };
        this.$store
          .dispatch("AddNewFeature", prames)
          .then(res => {
            if (res.code === CODE_OK) {
              IsAlert("success", this.$t("addedSuccessfully"));
              this.modal_add_feature = false;
              // this.getInitData();
            } else {
              IsAlert("error", this.$t("OperationFailed"), res.message);
            }
          })
          .catch(error => {
            IsAlert("error", "Service Error!", error);
          });
      }
    },
    //用户组取消新增权限
    cancelNewFeature() {
      this.featureData = {
        feature_name: "",
        parent_id: "",
        feature_key: ""
      };
      this.modal_add_feature = false;
    },
    //设置用户组一级权限时的change函数
    handleCheckAll(i) {
      if (this.checkAll[i]) {
        for (let index = 0; index < this.checked[i].children.length; index++) {
          if (!this.checkedF.includes(this.checked[i].children[index].id)) {
            this.checkedF.push(this.checked[i].children[index].id);
          }
        }
        this.indeterminate[i] = false;
        this.checkAll[i] = true;
      } else {
        for (let index = 0; index < this.checked[i].children.length; index++) {
          if (this.checkedF.includes(this.checked[i].children[index].id)) {
            let id = this.checkedF.indexOf(this.checked[i].children[index].id);
            this.checkedF.splice(id, 1);
          }
        }
      }
    },
    //设置用户组二级权限时的change函数
    checkBoxChange(i) {
      let mix = 0;
      for (let index = 0; index < this.checked[i].children.length; index++) {
        if (this.checkedF.includes(this.checked[i].children[index].id)) {
          mix = mix + 1;
        }
      }
      if (mix === this.checked[i].children.length) {
        this.indeterminate[i] = false;
        this.checkAll[i] = true;
      } else if (mix > 0) {
        this.indeterminate[i] = true;
        this.checkAll[i] = false;
      } else {
        this.indeterminate[i] = false;
        this.checkAll[i] = false;
      }
    },

    //新增用户组按钮
    addModel() {
      this.addData = {
        group_name: "",
        group_desc: "",
        status: 1
      };
      this.modal_group_add = true;
    },

    //确定新增用户组
    addGroup() {
      this.$refs.resetFormAdd.validate(valid => {
        if (valid) {
          if (!this.addData.group_name || !this.addData.group_desc) {
            IsAlert("warning", this.$t("NewDataEm"));
          } else {
            let prames = {
              group_name: this.addData.group_name,
              group_desc: this.addData.group_desc,
              status: this.addData.status
            };
            this.$store
              .dispatch("AddGroup", prames)
              .then(res => {
                if (res.code === CODE_OK) {
                  IsAlert("success", this.$t("addedSuccessfully"));
                  this.getInitData();
                } else {
                  IsAlert("error", this.$t("OperationFailed"), res.message);
                }
              })
              .catch(error => {
                IsAlert("error", "Service Error!", error);
              });
          }
        }
      });
    },
    //点击部门
    clickCell(i, id) {
      this.if_cell_select = [];
      for (let index = 0; index < this.department.length; index++) {
        if (index === i) {
          this.if_cell_select.push(true);
        } else {
          this.if_cell_select.push(false);
        }
      }
      this.getUserByDepart(id);
    },

    //根据部门获取用户
    getUserByDepart(id) {
      let prames = {
        group_id: this.group_id,
        department_id: id
      };
      this.$store
        .dispatch("GetUserByDepart", prames)
        .then(res => {
          if (res.code === CODE_OK) {
            this.inner_admin = JSON.parse(JSON.stringify(res.data.inner_admin));
            this.out_admin = JSON.parse(JSON.stringify(res.data.out_admin));
          } else {
            IsAlert("error", this.$t("OperationFailed"), res.message);
          }
        })
        .catch(error => {
          IsAlert("error", "Service Error!", error);
        });
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
      this.$store.dispatch("GetGroup", this.seach_params).then(res => {
        for (let index = 0; index < res.data.length; index++) {
          this.btnLoading.user.push(false);
          this.btnLoading.permission.push(false);
          this.btnLoading.delete.push(false);
        }
        this.count = res.count;
        this.GroupData = res.data;
      });
    },
    DynamicHeightFuc(Isvh) {
      this.dynamicHeight = String(Isvh - 200);
    }
  },
  mounted() {
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
  }
};
</script>

<style scoped>
.table-bordered {
  border: 1px solid #cbd0db;
}
.table {
  width: 100%;
  margin-bottom: 1px;
}
table {
  max-width: 100%;
  background-color: transparent;
}
table {
  border-spacing: 0;
  border-collapse: collapse;
}

.table-striped > tbody > tr:nth-child(2n + 1) > td,
.table-striped > tbody > tr:nth-child(2n + 1) > th {
  background-color: #f9f9f9;
}
.table-bordered td,
.table-bordered th {
  border: 1px solid #cbd0db;
}
.table td,
.table th {
  padding: 8px 10px;
  line-height: 1.42857143;
  vertical-align: top;
  border-bottom: 1px solid #cbd0db;
  -webkit-transition: background 0.2s cubic-bezier(0.175, 0.885, 0.32, 1);
  -o-transition: background 0.2s cubic-bezier(0.175, 0.885, 0.32, 1);
  transition: background 0.2s cubic-bezier(0.175, 0.885, 0.32, 1);
}
.text-middle {
  vertical-align: middle !important;
}
.text-right {
  text-align: right;
}
th {
  text-align: left;
}
.table tbody > tr > td,
.table thead > tr > th {
  vertical-align: middle;
}
.m_t_10 {
  margin-top: 10px;
}
</style>
<style  lang="less" >
.isuser {
  margin-bottom: 5px;
  .ivu-card-head {
    padding: 5px 14px;
  }
}
</style>