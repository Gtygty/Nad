<template>
<div class="department_staff" v-if="onready">
  <div class="main">
    <Card class="main-left">
      <Input type="text" v-model="search" size="small" style="width:calc(100% - 32px)" @keyup.enter.native="$refs.userPage.propsSearch()" placeholder="搜索姓名,邮箱,电话..." clearable/>
      <Button type="primary" icon="search" size="small" @click="$refs.userPage.propsSearch()" />
      <p v-show="search" style="color:#80848f">包含“<span style="color:#2d8cf0">{{search}}</span>”的成员</p>
      <Tree :data="tree" :render="renderContent" expand/>
    </Card>
    <userPage ref="userPage" class="main-right" :rootData="rootData" :search="search"/>
  </div>
  <Modal v-model="positionDialog" title="查看岗位" width="80" :transfer="false" style="text-align:left;">
    <div>
      <Button type="primary" icon="plus" size="small" @click="positionBtn('plus',departmentId)" />
      <!-- <Table style="width:100%;margin-top:10px;" :columns="columns" :data="positionArr" /> -->
    </div>
    <div slot="footer">
      <Page :total="totalPage" />
    </div>
    <Modal v-model="positionEditDialog" :title="positionTitle" width="300" :loading="positionDialogLoading" @on-ok="positionOk">
      <Form v-if="positionType!=='del'" ref="positionForm" :model="positionForm" :rules="positionRule" :label-width="80">
        <FormItem label="岗位名称" prop="position_name">
          <Input v-model="positionForm.position_name" />
        </FormItem>
        <FormItem v-show="positionType==='edit'" label="描述" prop="description">
          <Input v-model="positionForm.description" />
        </FormItem>
      </Form>
      <p v-else style="font-size:14px;color:#ed3f14;">{{`是否删除${positionRow.position_name}`}}</p>
    </Modal>
  </Modal>
  <Modal v-model="treeEditDialog" :title="title" @on-ok="ok" width="300" :loading="editDialogLoading">
    <Form v-if="editType!=='del'" ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
      <FormItem label="部门名称" prop="department_name">
        <Input v-model="formValidate.department_name" />
      </FormItem>
      <FormItem v-show="editType==='edit'" label="描述" prop="description">
        <Input v-model="formValidate.description" />
      </FormItem>
    </Form>
    <p v-else style="font-size:14px;color:#ed3f14;">{{`是否删除${rowDate.department_name}`}}</p>
  </Modal>
</div>
</template>
<script>
import {
  getAllDepartment,
  getAllPositionPaged,
  addDepartment,
  updateDepartment,
  deleteDepartment,
  addPosition,
  updatePosition,
  deletePosition
} from '@/api/manage'
import userPage from '@/components/manage/department/userPage'
export default {
  name: 'department_staff',
  created() {
    this.getData()
  },
  components: {
    userPage
  },
  data() {
    return {
      tree: [],
      onready: false,
      positionDialog: false,
      allPositionArr: [],
      positionArr: [],
      page: 1,
      pageSize: 50,
      totalPage: null,
      editType: '',
      positionType: '',
      position: '',
      title: '',
      positionTitle: '',
      treeEditDialog: false,
      formValidate: {
        department_name: '',
        description: ''
      },
      ruleValidate: {
        department_name: [{
          required: true,
          message: '请填写部门名称',
          trigger: 'blur'
        }],
      },
      positionForm: {
        position_name: '',
        description: ''
      },
      positionRule: {
        position_name: [{
          required: true,
          message: '请填写岗位名称',
          trigger: 'blur'
        }],
      },
      rowDate: {},
      positionRow: {},
      positionEditDialog: false,
      departmentId: '',
      propId: '',
      editDialogLoading: true,
      positionDialogLoading: true,
      search: '',
      pageTitle:'',
      nodeKey:0,
      rootData:{}
    }
  },
  computed: {

  },
  methods: {
    async getData() {
      this.$Message.loading({
        content: 'Loading...',
        duration: 0,
      })
      this.getAllPositionPaged()
      await this.getAllDepartment()
      this.onready = true
      this.$Message.destroy()
    },
    async getAllDepartment() {
      let res = await getAllDepartment()
      if (res.code === 0) {
        this.rootData = res.data[0]
        this.tree = res.data
        this.tree[0].expand=true
      } else {
        this.$Message.error(res.msg)
      }
    },
    async getAllPositionPaged() {
      let res = await getAllPositionPaged({
        page_size: this.pageSize,
        page_index: this.page
      })
      if (res.code === 0) {
        this.allPositionArr = res.data.rows
      } else {
        this.$Message.error(res.msg)
      }
    },
    showPosition(data) {
      this.departmentId = data.department_id
      if (data.children.length > 0) {
        return
      }
      let arr = []
      this.allPositionArr.forEach(v => {
        if (data.department_id === v.department_id) {
          arr.push(v)
        }
      })
      this.positionArr = arr
      this.positionDialog = true
    },
    ok() {
      switch (this.editType) {
        case 'plus':
          this.$refs.formValidate.validate(valid => {
            if (valid) {
              this.addDepartment({
                department_name: this.formValidate.department_name,
                parent_department_id: this.rowDate.department_id,
                description: this.formValidate.description,
              })
            } else {
              this.editDialogLoading = false
              this.$nextTick(() => {
                this.editDialogLoading = true
              })
            }
          })
          break;
        case 'edit':
          this.$refs.formValidate.validate(valid => {
            if (valid) {
              this.updateDepartment({
                department_id: this.rowDate.department_id,
                department_name: this.formValidate.department_name,
                parent_department_id: this.rowDate.parent_department_id,
                description: this.formValidate.description,
              })
            } else {
              this.editDialogLoading = false
              this.$nextTick(() => {
                this.editDialogLoading = true
              })
            }
          })
          break;
        case 'del':
          this.deleteDepartment({
            department_id: this.rowDate.department_id
          })
          break;
        default:
          break;
      }
    },
    positionOk() {
      switch (this.positionType) {
        case 'plus':
          this.$refs.positionForm.validate(valid => {
            if (valid) {
              this.addPosition({
                position_name: this.positionForm.position_name,
                description: this.positionForm.description,
              })
            } else {
              this.positionDialogLoading = false
              this.$nextTick(() => {
                this.positionDialogLoading = true
              })
            }
          })
          break;
        case 'edit':
          this.$refs.positionForm.validate(valid => {
            if (valid) {
              this.updatePosition({
                position_id: this.positionRow.position_id,
                position_name: this.positionForm.position_name,
                description: this.positionForm.description,
              })
            } else {
              this.positionDialogLoading = false
              this.$nextTick(() => {
                this.positionDialogLoading = true
              })
            }
          })
          break;
        case 'del':
          this.deletePosition({
            position_id: this.positionRow.position_id
          })
          break;
        default:
          break;
      }
    },

    async addDepartment(params) {
      let res = await addDepartment(params)
      if (res.code === 0) {
        await this.getAllDepartment()
      } else {
        this.$Message.error(res.msg)
      }
      this.treeEditDialog = false
    },
    async updateDepartment(params) {
      let res = await updateDepartment(params)
      if (res.code === 0) {
        await this.getAllDepartment()
      } else {
        this.$Message.error(res.msg)
      }
      this.treeEditDialog = false
    },
    async deleteDepartment(params) {
      let res = await deleteDepartment(params)
      if (res.code === 0) {
        await this.getAllDepartment()
      } else {
        this.$Message.error(res.msg)
      }
      this.treeEditDialog = false
    },
    async addPosition(params) {
      let res = await addPosition(params)
      if (res.code === 0) {
        await this.getAllPositionPaged()
        let arr = []
        this.allPositionArr.forEach(v => {
          if (this.departmentId === v.department_id) {
            arr.push(v)
          }
        })
        this.positionArr = arr
      } else {
        this.$Message.error(res.msg)
      }
      this.positionEditDialog = false
    },
    async updatePosition(params) {
      let res = await updatePosition(params)
      if (res.code === 0) {
        await this.getAllPositionPaged()
        let arr = []
        this.allPositionArr.forEach(v => {
          if (this.departmentId === v.department_id) {
            arr.push(v)
          }
        })
        this.positionArr = arr
      } else {
        this.$Message.error(res.msg)
      }
      this.positionEditDialog = false
    },
    async deletePosition(params) {
      let res = await deletePosition(params)
      if (res.code === 0) {
        await this.getAllPositionPaged()
        let arr = []
        this.allPositionArr.forEach(v => {
          if (this.departmentId === v.department_id) {
            arr.push(v)
          }
        })
        this.positionArr = arr
      } else {
        this.$Message.error(res.msg)
      }
      this.positionEditDialog = false
    },
    positionBtn(type, data) {
      this.positionType = type
      this.$refs.positionForm.resetFields()
      switch (type) {
        case 'plus':
          this.positionTitle = '新增岗位'
          break;
        case 'edit':
          this.positionRow = data
          this.positionForm.position_name = data.position_name
          this.positionForm.description = data.description
          this.positionTitle = '编辑岗位'
          break;
        case 'del':
          this.positionRow = data
          this.positionTitle = '删除岗位'
          break;
        default:
          break;
      }
      this.positionEditDialog = true
    },
    treeEdit(type, data) {
      this.editType = type
      this.rowDate = data
      this.$refs.formValidate.resetFields()
      switch (type) {
        case 'plus':
          this.title = `${data.department_name}新增部门`
          break;
        case 'edit':
          this.formValidate.department_name = data.department_name
          this.formValidate.description = data.description
          this.title = `编辑${data.department_name}`
          break;
        case 'del':
          this.title = `删除${data.department_name}`
          break;
        default:
          break;
      }
      this.treeEditDialog = true
    },
    renderContent(h, {
      root,
      node,
      data
    }) {
      return h('span', {
        style: {
          fontSize: '14px',
          cursor: 'pointer',
          height: '26px',
          lineHeight: '26px',
          display: 'inline-block'
        },
        props:{
          expand:true
        },
        'class': {
          staffTree:true,
          active:this.nodeKey === data.nodeKey
        },
        on: {
          dblclick: () => {
            this.showPosition(data)
          },
          click: () => {
            if (this.nodeKey===data.nodeKey) {
              return
            }
            this.nodeKey = data.nodeKey
            this.rootData=data
          }
        }
      }, [
        data.department_name,
        h('Dropdown', {
          style: {
            marginLeft: '5px',
            height: '26px',
            lineHeight: '26px',
          },
          props: {
            transfer: true
          }
        }, [h('Button', {
          props: {
            type: 'text',
            icon: 'iconfont-down_b',
            size: 'small'
          },
          style:{
            verticalAlign:'top',
          }
        }, []), h('DropdownMenu', {
          props: {
            slot: 'list'
          },
          slot: "list"
        }, [h('div', {
          style: {
            padding: '0 20px'
          }
        }, [
          h('Button', {
            props: {
              type: 'primary',
              icon: 'plus',
              size: 'small'
            },
            'class': 'staffTree-btn',
            on: {
              click: () => {
                this.treeEdit('plus', data)
              }
            },
          }),
          h('Button', {
            props: {
              type: 'info',
              icon: 'edit',
              size: 'small'
            },
            'class': 'staffTree-btn',
            style: {
              marginLeft: '5px',
            },
            on: {
              click: () => {
                this.treeEdit('edit', data)
              }
            },
          }),
          h('Button', {
            props: {
              type: 'error',
              icon: 'trash-a',
              size: 'small'
            },
            'class': 'staffTree-btn',
            style: {
              marginLeft: '5px',
              display: data.nodeKey === 0 ? 'none' : 'inline-block'
            },
            on: {
              click: () => {
                this.treeEdit('del', data)
              }
            }
          })
        ])])])
      ])
    }
  }
}
</script>

<style lang="stylus" type="stylesheet/stylus">
.department_staff{
  .staffTree{
    // &:hover{
    //   .staffTree-btn{
    //     opacity: 1;
    //   }
    // }
    &.active{
      color: #19be6b
    }
    .staffTree-btn{
      vertical-align: middle;
      // opacity: 0;
      // transition: opacity .5s cubic-bezier(.55,0,.1,1);
    }
  }
  .main{
    width: 100%;
    display: flex;
    height: 100%;
    .main-left{
      text-align: left;
      flex: 0 0 200px;
      width: 200px;
      height: 100%;
      overflow-y: auto;
    }
    .main-right{
      flex: 1;
      height: 100%;
    }
  }
  .ivu-tree{
    .ivu-tree-arrow{
      line-height: 22px;
    }
  }
}
</style>
