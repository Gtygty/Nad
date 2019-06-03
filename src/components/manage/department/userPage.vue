<template lang="html">
  <div class="userPage">
    <Card style="height:100%;">
      <Row>
        <Col span="16" style="text-align:left;">
          <h2 style="display:inline-block;font-size:"><b>{{rootData.department_name}}</b><span style="color:#80848f;margin-left:5px;">({{rootData.staff_quantity}}人)</span></h2>
        </Col>
        <Col span="8" style="text-align:right;">
          <Button type="info" icon="plus" size="small" @click="btnClick('plus')"/>
          <Button type="info" size="small" :disabled="selectArr.length===0" @click="btnClick('batch')">批量处理</Button>
        </Col>
      </Row>
      <el-table ref="elTable" :data="tableData" style="width: 100%;margin-bottom:10px;" height="calc(100vh - 165px)" size="mini"  @selection-change="selection" :row-class-name="tableRowClassName">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="姓名" prop="user_name" align="center"/>
        <el-table-column label="邮箱" prop="email" align="center"/>
        <el-table-column label="用户组" prop="group_name" align="center" :render-header="renderHeader"/>
        <el-table-column label="上级" prop="parent_user_name" align="center" :render-header="renderHeader"/>
        <el-table-column label="操作" header-align="center" width="80">
          <template slot-scope="scope">
            <Button type="primary" icon="edit" size="small" @click="btnClick('edit',scope.row)"/>
          </template>
        </el-table-column>
      </el-table>
      <pagination :page="page" :pageSize="pageSize" :totalPage="totalPage"  @pageSize="sizeChange" @pageCurrent="pageCurrent"/>
      <Spin size="large" fix v-show="loading"/>
    </Card>
    <Modal ref="dialog" v-model="dialog" :title="dialogTitle" @on-ok="ok" :width="modalType==='batch'?330:650" :loading="modalLoding" @on-cancel="onCancel">
      <div v-show="modalType==='edit'" style="display:flex;margin-bottom:20px;">
        <Button :type="editTabs?'success':'ghost'" style="flex:1;border-radius:0;" @click="editTabsClick(true)">基本信息</Button>
        <Button :type="!editTabs?'success':'ghost'" style="flex:1;border-radius:0;" @click="editTabsClick(false)">修改密码</Button>
      </div>
      <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" inline>
        <Row v-show="modalType==='batch'">
          <Col span="24" style="text-align:left;">
            <FormItem label="批量处理">
            <Select v-model="batchOperate" style="width:200px" @on-change="batchChange">
              <Option value="">&nbsp;</Option>
              <Option value="update_password">更新密码</Option>
              <Option value="update_position">更新岗位</Option>
              <Option value="update_header">更新上级</Option>
              <Option value="update_group">更新用户组</Option>
              <Option value="update_status">更新状态</Option>
            </Select>
            </FormItem>
          </Col>
        </Row>
        <FormItem v-show="modalType!=='batch'&&editTabs" label="姓" prop="last_name">
          <Input v-model="formValidate.last_name" style="width:200px"/>
        </FormItem>
        <FormItem v-show="modalType!=='batch'&&editTabs" label="名" prop="first_name">
          <Input v-model="formValidate.first_name" style="width:200px"/>
        </FormItem>
        <FormItem v-show="modalType!=='batch'&&editTabs" label="邮箱" prop="email">
          <Input v-model="formValidate.email" style="width:200px"/>
        </FormItem>
        <FormItem v-show="modalType!=='batch'&&editTabs" label="手机" prop="mobile">
          <Input v-model="formValidate.mobile" style="width:200px"/>
        </FormItem>
        <FormItem v-show="modalType==='plus'||(modalType==='edit'&&!editTabs)||(modalType=='batch'&&batchOperate==='update_password')" label="密码" prop="password">
          <Input type="password" v-model="formValidate.password" style="width:200px"/>
        </FormItem>
        <FormItem v-show="modalType==='plus'||(modalType==='edit'&&!editTabs)||(modalType=='batch'&&batchOperate==='update_password')" label="确认密码" prop="confirm_password">
          <Input type="password" v-model="formValidate.confirm_password" style="width:200px"/>
        </FormItem>
        <FormItem v-show="(modalType!=='batch'||(modalType=='batch'&&batchOperate==='update_position'))&&editTabs" label="岗位" prop="position_id">
          <Select v-model="formValidate.position_id" style="width:200px" @on-change="positionChange">
            <Option value="">&nbsp;</Option>
            <Option v-for="item in positionOption" :value="item.position_id" :key="item.position_id">{{ item.position_name }}</Option>
            <Option value="add"><Icon type="plus-circled" style="margin-right:10px;vertical-align:top;"/>新增岗位</Option>
          </Select>
        </FormItem>
        <FormItem v-show="(modalType!=='batch'||(modalType=='batch'&&batchOperate==='update_header'))&&editTabs" label="上级" prop="parent_user_id">
          <Select v-model="formValidate.parent_user_id" style="width:200px">
            <Option value="">&nbsp;</Option>
            <Option v-for="item in userOption" :value="item.crm_user_id" :key="item.crm_user_id">{{ item.user_name }}</Option>
          </Select>
        </FormItem>
        <FormItem v-show="(modalType!=='batch'||(modalType=='batch'&&batchOperate==='update_group'))&&editTabs" label="用户组" prop="group_id">
          <Select v-model="formValidate.group_id" style="width:200px">
            <Option v-for="item in groupOption" :value="item.group_id" :key="item.group_id">{{ item.group_name }}</Option>
          </Select>
        </FormItem>
        <FormItem v-show="modalType=='batch'&&batchOperate==='update_status'" label="用户状态">
          <i-switch v-model="disableStatus" size="large" true-value="0" false-value="1">
            <span slot="open">启用</span>
            <span slot="close">禁用</span>
          </i-switch>
        </FormItem>
      </Form>
      <div slot="footer">
        <Row>
          <Col span="12" style="text-align:left;">
            <Button v-show="modalType==='edit'" :type="disableStatus==='0'?'error':'success'" @click="updateCrmUserStatus" :loading="disableLoading">{{disableStatus==='0'?'禁用':'启用'}}</Button>
          </Col>
          <Col :span="modalType==='edit'?12:24" style="text-align:right;">
            <Button type="text" @click="onCancel();dialog=false">取消</Button>
            <Button type="primary" @click="ok" :loading="btnLoading">确定</Button>
          </Col>
        </Row>
      </div>
    </Modal>
    <Modal v-model="filterModal" :title="filterTitle" @on-ok="filterChange" width="450">
      <div v-show="filterType==='parent_user_name'&&userIdArr.length>0" style="width:100%;margin-bottom:10px;">
        <Tag v-for="(v,i) in userIdArr" :key='i' closable color="green" @on-close="userIdArr.splice(i,1)">{{v.label}}</Tag>
        <Button type="error" @click="userIdArr=[]" style="flex:0 0 auto;">清空</Button>
      </div>
      <div style="display:flex">
        <Select v-model="groupIdArr" multiple filterable style="flex:1;" v-show="filterType==='group_name'">
          <Option v-for="item in groupOption" :value="item.group_id" :key="item.group_id">{{ item.group_name }}</Option>
        </Select>
        <Button v-show="filterType==='group_name'" type="error" @click="groupIdArr=[]" style="flex:0 0 auto;">清空</Button>
        <Tree v-show="filterType==='parent_user_name'" :data="userOption" :render="renderContent" style ="height:300px;overflow:auto;width:100%;"/>
        <!-- <Cascader v-model="cascaderArr" ref="cascader" v-show="filterType==='parent_user_name'" :data="userFilters" trigger="click" filterable change-on-select style="flex:1;" @on-change="cascaderChange"/> -->
        <!-- <Button type="error" @click="groupIdArr=[]" style="flex:0 0 auto;">清空</Button> -->
      </div>
    </Modal>
  </div>
</template>

<script>
import searchtable from "@/components/base/searchTable";
import pagination from "@/components/base/pagination";
import {
  getCrmUserPaged,
  getUserPagedFilterOption,
  addCrmUser,
  updateCrmUser,
  batchUpdateCrmUser,
  updateCrmUserPassword,
  updateCrmUserStatus
} from "@/api/manage";
export default {
  name: "userPage",
  props: {
    rootData: {
      type: Object,
      default() {
        return {};
      }
    },
    search: {
      type: String,
      default() {
        return "";
      }
    }
  },
  components: {
    searchtable,
    pagination
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (/^[0-9]*$/.test(value)) {
        callback();
      } else {
        callback(new Error("请输入正确的手机号"));
      }
    };
    const validatePasswordConfirm = (rule, value, callback) => {
      if (value !== this.formValidate.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      page: 1,
      pageSize: 50,
      totalPage: null,
      params: {
        order_by: "position_id",
        order_direction: "asc",
        group_id: [],
        parent_user_id: [],
        search: ""
      },
      tableData: [],
      loading: false,
      groupOption: [],
      userOption: [],
      userFilters: [],
      positionOption: [],
      filterType: "",
      groupIdArr: [],
      userIdArr: [],
      dialog: false,
      formValidate: {
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        password: "",
        confirm_password: "",
        position_id: "",
        parent_user_id: "",
        group_id: "",
        department_id: ""
      },
      ruleValidate: {
        first_name: [
          {
            required: true,
            message: "请输入名",
            trigger: "blur"
          }
        ],
        last_name: [
          {
            required: true,
            message: "请输入姓",
            trigger: "blur"
          }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            type: "email",
            message: "请输入正确的邮箱",
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            validator: validatePhone,
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 4,
            max: 15,
            message: "密码长度需在4~15个字符",
            trigger: "blur"
          }
        ],
        confirm_password: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: "blur"
          },
          {
            validator: validatePasswordConfirm,
            trigger: "blur"
          }
        ],
        parent_user_id: [
          {
            required: false,
            message: "请选择上级",
            trigger: "change"
          }
        ],
        position_id: [
          {
            required: false,
            message: "请选择岗位",
            trigger: "change"
          }
        ],
        group_id: [
          {
            required: true,
            message: "请选择用户组",
            trigger: "change"
          }
        ]
      },
      ruleEditArr: [
        "first_name",
        "last_name",
        "email",
        "mobile",
        "password",
        "confirm_password",
        "group_id"
      ],
      modalType: "",
      dialogTitle: "新建",
      selectArr: [],
      batchOperate: "",
      batchObj: {
        update_password: ["password", "confirm_password"],
        update_position: "position_id",
        update_header: "parent_user_id",
        update_group: "group_id"
        // update_status: 'is_disabled',
      },
      modalLoding: true,
      btnLoading: false,
      editTabs: true,
      disableStatus: "0",
      disableLoading: false,
      filterModal: false,
      filterTitle: ""
    };
  },
  watch: {
    rootData() {
      this.getCrmUserPaged(this.params);
    },
    search() {
      this.params.search = this.search;
    }
  },
  created() {
    this.onready();
  },
  methods: {
    async onready() {
      this.loading = true;
      await this.getUserPagedFilterOption();
      await this.getCrmUserPaged(this.params);
      this.loading = false;
    },
    async getCrmUserPaged(obj) {
      let params = {
        page_index: this.page,
        page_size: this.pageSize,
        department_id:
          this.rootData.department_id === "1"
            ? ""
            : this.rootData.department_id,
        ...obj
      };
      this.loading = true;
      let res = await getCrmUserPaged(params);
      if (res.code === 0) {
        this.page = res.data.page;
        this.totalPage = res.data.total;
        this.tableData = res.data.rows;
      } else {
        this.$Message.error(res.msg);
      }
      this.loading = false;
    },
    recursionOption(data, valueName, labelName) {
      let arr = [];
      let recursion = (option, param) => {
        option.forEach((v, i) => {
          param.push({
            value: v[valueName],
            label: v[labelName],
            children: []
          });
          if (v.children.length > 0) {
            recursion(v.children, param[i].children);
          }
        });
      };
      recursion(data, arr);
      return arr;
    },
    async getUserPagedFilterOption() {
      let res = await getUserPagedFilterOption();
      if (res.code === 0) {
        this.groupOption = res.data.group_option;
        this.userOption = res.data.user_option;
        // this.userFilters = this.recursionOption(res.data.user_option,'crm_user_id','user_name')
        this.positionOption = res.data.position_option;
      } else {
        this.$Message.error(res.msg);
      }
    },
    tableRowClassName({ row }) {
      if (row.is_disabled === "1") {
        return "table-disabled";
      }
      return "";
    },
    pageCurrent(val) {
      this.page = val;
      this.getCrmUserPaged(this.params);
    },
    sizeChange(val) {
      this.pageSize = val;
      this.getCrmUserPaged(this.params);
    },
    batchChange(val) {
      Object.keys(this.ruleValidate).forEach(v => {
        this.ruleValidate[v][0].required = false;
        this.$refs.formValidate.$children.find(prop => {
          return prop["prop"] === v;
        }).isRequired = false;
      });
      if (Array.isArray(this.batchObj[val])) {
        this.batchObj[val].forEach(v => {
          if (this.ruleValidate[v]) {
            this.ruleValidate[v][0].required = true;
            this.$refs.formValidate.$children.find(prop => {
              return prop["prop"] === v;
            }).isRequired = true;
          }
        });
      } else {
        if (this.ruleValidate[this.batchObj[val]]) {
          this.ruleValidate[this.batchObj[val]][0].required = true;
          this.$refs.formValidate.$children.find(v => {
            return v["prop"] === this.batchObj[val];
          }).isRequired = true;
        }
      }
    },
    btnClick(type, row) {
      this.editTabs = true;
      this.modalType = type;
      Object.keys(this.formValidate).forEach(v => {
        this.formValidate[v] = "";
      });
      Object.keys(this.ruleValidate).forEach(v => {
        this.ruleValidate[v][0].required = true;
        this.$refs.formValidate.$children.find(prop => {
          return prop["prop"] === v;
        }).isRequired = true;
      });
      this.ruleValidate.parent_user_id[0].required = false;
      this.ruleValidate.position_id[0].required = false;
      this.$refs.formValidate.$children.find(prop => {
        return prop["prop"] === "parent_user_id";
      }).isRequired = false;
      this.$refs.formValidate.$children.find(prop => {
        return prop["prop"] === "position_id";
      }).isRequired = false;
      delete this.formValidate.crm_user_id;
      switch (type) {
        case "plus":
          this.$refs.formValidate.$children.find(prop => {
            return prop["prop"] === "parent_user_id";
          }).isRequired = false;
          this.dialogTitle = "新建";
          break;
        case "edit":
          this.dialogTitle = "编辑";
          this.ruleValidate.parent_user_id[0].required = false;
          Object.keys(this.formValidate).forEach(v => {
            this.formValidate[v] = row[v];
          });
          this.ruleValidate.password[0].required = false;
          this.ruleValidate.confirm_password[0].required = false;
          this.$refs.formValidate.$children.find(prop => {
            return prop["prop"] === "password";
          }).isRequired = false;
          this.$refs.formValidate.$children.find(prop => {
            return prop["prop"] === "confirm_password";
          }).isRequired = false;
          this.disableStatus = row.is_disabled;
          this.formValidate.crm_user_id = row.crm_user_id;
          break;
        case "batch":
          this.disableStatus = "0";
          this.dialogTitle = "批量处理";
          break;
        default:
          break;
      }
      this.$nextTick(() => {
        this.dialog = true;
      });
    },
    ok() {
      switch (this.modalType) {
        case "plus":
          this.$refs.formValidate.validate(valid => {
            if (valid) {
              this.addCrmUser();
            } else {
              this.modalLoding = false;
              this.$nextTick(() => {
                this.modalLoding = true;
              });
            }
          });
          break;
        case "edit":
          this.$refs.formValidate.validate(valid => {
            if (valid) {
              if (this.editTabs) {
                this.updateCrmUser();
              } else {
                this.updateCrmUserPassword();
              }
            } else {
              this.modalLoding = false;
              this.$nextTick(() => {
                this.modalLoding = true;
              });
            }
          });
          break;
        case "batch":
          if (!this.batchOperate) {
            this.$Message.error("请选择需要批量处理内容");
            this.modalLoding = false;
            this.$nextTick(() => {
              this.modalLoding = true;
            });
            return;
          } else {
            let params = {
              crm_user_id: this.selectArr,
              batch_operate: this.batchOperate
            };
            if (Array.isArray(this.batchObj[this.batchOperate])) {
              this.batchObj[this.batchOperate].forEach(v => {
                params[v] = this.formValidate[v];
              });
            } else if (this.batchOperate) {
              params.is_disabled = this.disableStatus;
            } else {
              params[this.batchObj[this.batchOperate]] = this.formValidate[
                this.batchObj[this.batchOperate]
              ];
            }
            this.$refs.formValidate.validate(valid => {
              if (valid) {
                this.batchUpdateCrmUser(params);
              } else {
                this.modalLoding = false;
                this.$nextTick(() => {
                  this.modalLoding = true;
                });
              }
            });
          }
          break;
        default:
          break;
      }
    },
    async addCrmUser() {
      this.btnLoading = true;
      let res = await addCrmUser(this.formValidate);
      if (res.code === 0) {
        this.$Message.success("Success!");
        await this.getCrmUserPaged(this.params);
      } else {
        this.$Message.error(res.msg);
      }
      this.btnLoading = false;
      this.dialog = false;
    },
    async updateCrmUser() {
      this.btnLoading = true;
      let params = { ...this.formValidate };
      delete params.password;
      delete params.confirm_password;
      let res = await updateCrmUser(params);
      if (res.code === 0) {
        this.$Message.success("Success!");
        await this.getCrmUserPaged(this.params);
      } else {
        this.$Message.error(res.msg);
      }
      this.btnLoading = false;
      this.dialog = false;
    },
    async updateCrmUserPassword() {
      this.btnLoading = true;
      let params = {
        crm_user_id: this.formValidate.crm_user_id,
        password: this.formValidate.password,
        confirm_password: this.formValidate.confirm_password
      };
      let res = await updateCrmUserPassword(params);
      if (res.code === 0) {
        this.$Message.success("Success!");
        await this.getCrmUserPaged(this.params);
      } else {
        this.$Message.error(res.msg);
      }
      this.btnLoading = false;
      this.dialog = false;
    },
    async batchUpdateCrmUser(params) {
      this.btnLoading = true;
      let res = await batchUpdateCrmUser(params);
      if (res.code === 0) {
        this.$Message.success("Success!");
        await this.getCrmUserPaged(this.params);
      } else {
        this.$Message.error(res.msg);
      }
      this.btnLoading = false;
      this.dialog = false;
    },
    async updateCrmUserStatus() {
      this.disableLoading = true;
      let params = {
        crm_user_id: this.formValidate.crm_user_id,
        is_disabled: this.disableStatus
      };
      let res = await updateCrmUserStatus(params);
      if (res.code === 0) {
        this.$Message.success("Success!");
        await this.getCrmUserPaged(this.params);
      } else {
        this.$Message.error(res.msg);
      }
      this.disableLoading = false;
      this.dialog = false;
    },
    editTabsClick(state) {
      this.editTabs = state;
      this.ruleEditArr.forEach(v => {
        this.ruleValidate[v][0].required = state;
        this.$refs.formValidate.$children.find(prop => {
          return prop["prop"] === v;
        }).isRequired = state;
      });
      this.ruleValidate.password[0].required = !state;
      this.ruleValidate.confirm_password[0].required = !state;
      this.$refs.formValidate.$children.find(prop => {
        return prop["prop"] === "password";
      }).isRequired = !state;
      this.$refs.formValidate.$children.find(prop => {
        return prop["prop"] === "confirm_password";
      }).isRequired = !state;
    },
    selection(arr) {
      this.selectArr = arr.map(v => v.crm_user_id);
    },
    onCancel() {
      this.$refs.formValidate.resetFields();
    },
    propsSearch() {
      this.getCrmUserPaged(this.params);
    },
    positionChange(val) {
      console.log(val);
    },
    filterChange() {
      switch (this.filterType) {
        case "group_name":
          this.params.group_id = this.groupIdArr;
          break;
        case "parent_user_name":
          this.params.parent_user_id = this.userIdArr.map(v => v.id);
          break;
        default:
          break;
      }
      this.getCrmUserPaged(this.params);
    },
    filterClick(type) {
      this.filterType = type;
      switch (type) {
        case "group_name":
          this.filterTitle = "用户组筛选";
          break;
        case "parent_user_name":
          this.filterTitle = "上级筛选";
          break;
        default:
          break;
      }
      this.filterModal = true;
    },
    renderHeader(h, { column, $index }) {
      return h("span", {}, [
        column.label,
        h(
          "i",
          {
            class: "el-icon-arrow-down",
            style: {
              cursor: "pointer",
              fontSize: "12px"
            },
            on: {
              click: () => {
                this.filterClick(column.property);
              }
            }
          },
          []
        )
      ]);
    },
    renderContent(h, { root, node, data }) {
      return h(
        "span",
        {
          style: {
            fontSize: "14px",
            cursor: "pointer",
            height: "26px",
            lineHeight: "26px",
            display: "inline-block"
          }
        },
        [
          data.user_name,
          h(
            "Button",
            {
              props: {
                type: "info",
                icon: "plus",
                size: "small",
                shape: "circle"
              },
              style: {
                marginLeft: "3px",
                fontSize: "0",
                verticalAlign: "middle",
                width: "20px",
                height: "20px"
              },
              on: {
                click: () => {
                  if (
                    !this.userIdArr.map(v => v.id).includes(data.crm_user_id)
                  ) {
                    this.userIdArr.push({
                      id: data.crm_user_id,
                      label: data.user_name
                    });
                  } else {
                    this.$Message.error("已添加筛选");
                  }
                }
              }
            },
            []
          )
        ]
      );
    }
  }
};
</script>

<style lang="stylus" type="stylesheet/stylus">
.userPage {
  .flex-from {
    float: right;
  }

  .el-table .table-disabled {
    background: #FF6666;
    color: #fff;

    &:hover {
      color: #FF6666;
    }
  }
}
</style>
