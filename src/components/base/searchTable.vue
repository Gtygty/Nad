<template>
  <el-table :data="tableData" style="width: 100%;" height="calc(100vh - 220px)" fit size="mini" >
    <el-table-column v-for="(v,i) in tableHead" :key="i" :label="v.title" header-align="center">
      <template slot-scope="scope">
        <template v-if="scope.$index===0&&v.field!=='adv'">
          <Input v-model="searchParams[v.field]" size="small" style="width:80%;"/>
        </template>
        <template v-else-if="scope.$index===0&&v.field==='adv'">
          <Button type="info" @click="search">搜索</Button>
        </template>
        <template v-else-if="scope.$index!==0&&v.field==='adv'">
          <Button type="info" icon="edit" size="small" @click="btnClick('edit')"/>
          <Button type="error" icon="trash-a" size="small" @click="btnClick('del')"/>
        </template>
        <template v-else>
          {{scope.row[v.field]}}
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import Vue from 'vue'
import {
  mapGetters
} from 'vuex'
export default {
  name:'searchTable',
  props:{
    data:{
      type:Array,
      default(){
        return []
      }
    },
    tableHead:{
      type:Array,
      default(){
        return []
      }
    },
    titleRows:{
      type:Array,
      default(){
        return []
      }
    },
    loading:{
      type:Boolean,
      default(){
        return false
      }
    }
  },
  data() {
    return {
      tableData:[],
      searchParams: {},
    }
  },
  watch:{
    isCollapsed(){
      setTimeout(()=>{
        this.$refs.easytable.resize()
      },200)
    },
    data(){
      if (this.data.length>0) {
        let obj={}
        Object.keys(this.data[0]).forEach(v=>{
          obj[v]=''
        })
        this.tableData=[obj,...this.data]
      }
    }
  },
  mounted() {
  },
  methods: {
    search(){
      console.log(this.searchParams);
    }
  }
}
</script>

<style lang="stylus" type="stylesheet/stylus">
.el-table{
  overflow-y: auto;
  .el-table__header-wrapper{
    thead{
      tr{
        background: #f7f7f7;
        line-height: 30px;
      }
    }
  }
  .el-table__body-wrapper{
    tbody{
      tr{
        td{
          line-height: 30px;
          // width: 100%;
        }
      }
    }
  }
}
</style>
