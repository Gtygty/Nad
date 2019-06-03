<template>
  <div class="to_assign_customer">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="UserId" label="用户标识" align="center" />
      </el-table-column>
      <el-table-column prop="UserName" label="用户名" align="center" />
      </el-table-column>
      <el-table-column prop="Email" label="邮箱" align="center" />
      <el-table-column prop="EmailVerified" label="邮箱验证" align="center">
        <template slot-scope="scope">
          {{scope.row.EmailVerified?'是':'否'}}
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import {
  mapGetters
} from 'vuex'
export default {
  name: 'to_assign_customer',
  data() {
    return {
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'wsParams',
      'wsResMsg',
    ]),
  },
  watch: {
    wsResMsg() {
      let obj = this.wsResMsg
      if (obj.n === 'getOmsUsers') {
        let res = JSON.parse(obj.o)
        if (res['result'] === false) {
          this.$Message.error(res.errormsg);
        } else {
          this.tableData = res
        }
      }
    }
  },
  created() {
    this.getOmsUsers()
  },
  methods: {
    getOmsUsers() {
      let WSparams = {
        n: 'getOmsUsers',
        o: JSON.stringify({
          OMSId: 1
        }),
        ...this.wsParams
      }
      // this.$socket.send(JSON.stringify(WSparams))
    }
  }
}
</script>

<style lang="stylus" type="stylesheet/stylus">
</style>
