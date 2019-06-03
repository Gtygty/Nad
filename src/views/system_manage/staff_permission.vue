<template>
<div class="staff_permission" v-if="docReady">
  <h3><Icon type="person-stalker" style="margin-right:10px;font-size:16px;"/>员工权限</h3>
  <article>
    <aside>
      <div style="padding:10px 0;">
        <Button type="text" size="small" @click="groupBtn('plus')"><Icon type="ios-people" style="vertical-align:top;margin-right:3px;font-size:20px;"/>新增用户组</Button>
      </div>
      <el-table ref="groupList" :data="groupData" :show-header="false" style="width:calc(100% - 10px);" height="calc(100% - 32px)" size="small" highlight-current-row @current-change="currentChange">
        <el-table-column align="left">
          <template slot-scope="scope">
            {{scope.row.group_name}}
            <Dropdown style="float:right;" @on-click="groupMoreClick" @on-visible-change="visibleChange($event,scope.row)">
              <Button type="text" icon="iconfont-down_b" size="small"/>
              <DropdownMenu slot="list">
                <DropdownItem name="edit">编辑用户组</DropdownItem>
                <DropdownItem name="del">删除用户组</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </template>
        </el-table-column>
      </el-table>
      <!-- <Tree :data="tree" :render="renderContent"/> -->
    </aside>
    <section>
      <h3>111</h3>
      <Tabs :value="activeVal">
        <TabPane label="角色成员" name="1">

        </TabPane>
        <TabPane label="功能权限" name="2">

        </TabPane>
      </Tabs>
    </section>
  </article>
  <Modal v-model="groupDialog" :title="groupTitle" @on-ok="groupOk" width="350" @on-cancel="$refs.groupForm.resetFields()" :loading="groupLoading">
    <Form ref="groupForm" :model="groupForm" :rules="groupRule" :label-width="80" inline>
      <FormItem label="组名" prop="group_name">
        <Input v-model="groupForm.group_name" style="width:200px"/>
      </FormItem>
      <FormItem label="描述">
        <Input v-model="groupForm.description" style="width:200px"/>
      </FormItem>
    </Form>
  </Modal>
</div>
</template>

<script>
import {
  getAllUserGroup,
  addUserGroup,
  updateUserGroup
} from '@/api/manage'
import staff from '@/components/manage/permission/staff'
export default {
  name: 'staff_permission',
  data() {
    return {
      docReady: false,
      activeVal: '1',
      groupData: [],
      currentRow:null,
      groupDialog:false,
      groupTitle:'',
      groupLoading:true,
      groupForm:{
        group_id:'',
        group_name:'',
        description:''
      },
      groupRule:{
        group_name:[{
          required:true,
          message: '请输入分组名',
          trigger: 'blur'
        }]
      }
    }
  },
  created() {
    this.onready()
  },
  watch:{
    currentRow() {
      if (this.currentRow) {
        console.log(111);
      }
    }
  },
  methods: {
    async onready() {
      this.$Message.loading({
        content: 'Loading...',
        duration: 0,
      })
      await this.getAllUserGroup()
      this.docReady = true
      this.$nextTick(()=>{
        this.$refs.groupList.setCurrentRow(this.currentRow)
      })
      this.$Message.destroy()
    },
    async getAllUserGroup() {
      let res = await getAllUserGroup()
      if (res.code === 0) {
        this.groupData = res.data
        if (this.groupData.length > 0) {
          this.currentRow = this.groupData[0];
        }
      } else {
        this.$Message.error(res.msg)
      }
    },
    async addUserGroup(){
      let params = {...this.groupForm}
      delete params.group_id
      let res = await addUserGroup(params)
      if (res.code === 0) {
        this.$Message.success('success')
        await this.getAllUserGroup()
        this.groupDialog=false
      }else{
        this.$Message.error(res.msg)
        this.groupLoading=false
        this.$nextTick(()=>{
          this.groupLoading=true
        })
      }
    },
    groupBtn(type,row){
      this.groupType=type
      switch (type) {
        case 'plus':
          this.groupTitle='新增分组'
          break;
        default:
          break;
      }
      this.groupDialog =true
    },
    groupOk(){
      switch (this.groupType) {
        case 'plus':
          this.$refs.groupForm.validate(valid=>{
            if (valid) {
              this.addUserGroup()
            }else{
              this.groupLoading=false
              this.$nextTick(()=>{
                this.groupLoading=true
              })
            }
          })
          break;
        default:
          break;
      }
    },
    currentChange(val){
      this.currentRow = val
      console.log(this.currentRow);
    },
    groupMoreClick(type) {
      this.groupBtn(type)
    },
    visibleChange(e,row){
      console.log(e);
      console.log(row);
    }
  }
}
</script>

<style lang="stylus" type="stylesheet/stylus">
.staff_permission{
  h3{
    font-size: 16px;
    text-align: left;
    line-height: 2;
    border-bottom: 1px solid #e9eaec;
    font-weight: bolder;
  }
  article{
    display: flex;
    height: calc(100% - 33px);
    aside{
      flex: 0 0 200px;
      width: 200px;
      border-right: 1px solid #e9eaec;
      text-align: left;
    }
    section{
      flex: 1;
      padding: 0 10px;
    }
  }
}
</style>
