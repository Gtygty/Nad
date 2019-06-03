<template>
<div class="my_customer" v-if="docReady">
  <el-table :data="tableData" style="width: 100%;margin-bottom:10px;" height="calc(100vh - 125px)" size="mini" @sort-change="sortChange">
    <el-table-column show-overflow-tooltip v-for="(v,i) in tableHead" :key="i" :prop="v.key" :label="v.label" header-align="center" :align="v.key==='user_name_email'?'left':'center'" :width="v.key==='created_date_china'&&140||v.key==='user_name_email'&&220"
        :sortable="v.key==='created_date_china'">
      <template slot-scope="scope">
        <template v-if="v.key==='user_name_email'">
          <Icon :type="scope.row.email_verified==='1'?'checkmark-circled':'help-circled'" :style="`color:${scope.row.email_verified==='1'?'#19be6b':'#bbbec4'}`"/>
          {{scope.row[v.key]}}
        </template>
        <template v-else-if="v.key==='account_verified_level'">
          <Button v-if="scope.row.is_exist_verified_info" type="text" @click="infoClick(scope.row)" style="color:#2d8cf0;padding:0;">{{scope.row[v.key]}}</Button>
          <span v-else>{{scope.row[v.key]}}</span>
        </template>
        <template v-else>
          {{scope.row[v.key]}}
        </template>
      </template>
    </el-table-column>
  </el-table>
  <pagination :page="page" :pageSize="pageSize" :totalPage="totalPage"  @pageSize="sizeChange" @pageCurrent="pageCurrent"/>
  <Spin size="large" fix v-show="loading"/>
  <Modal v-model="infoModal" @on-ok="infoOk" width="650" :loading="infoModalLoading">
      <Tabs @on-click="tabsClick">
        <TabPane label="基本信息" name="1">
          <div style="position:relative;">
            <Form v-if="infoModal" ref="infoForm" :model="infoForm" :rules="infoRule" :label-width="80" inline>
              <FormItem v-for="(item,index) in infoArr" :label="item.label" :prop="item.prop" :key="index">
                <Input v-if="item.component===0" v-model="infoForm[item.prop]" style="width:200px;" />
                <Select v-else-if="item.component===1" v-model="infoForm[item.prop]" style="width:200px">
                  <Option v-for="(v,i) in item.option" :value="v.code" :key="i">{{ v.name }}</Option>
                </Select>
                <DatePicker v-else :type="item.type" :value="infoForm.bod" :format="item.format" style="width:200px;" />
              </FormItem>
             </Form>
             <Spin size="large" fix v-if="infoModalLoding"/>
          </div>
        </TabPane>
        <TabPane label="KYC" name="2">
          <div style="position:relative;">
            <el-table :data="kycData" style="width: 100%;" height="350px" size="mini">
              <el-table-column  show-overflow-tooltip label="缩略图" header-align="center" align="center" width="60">
                <template slot-scope="scope">
                  <img :src="`${baseURL}/${scope.row.file_path}`" width="40"/>
                </template>
              </el-table-column>
              <el-table-column prop="proof_type_desc_cn" label="证件类型" align="center"/>
              <el-table-column prop="kyc_status_desc_cn" label="KYC状态" align="center"/>
              <el-table-column prop="upload_by_user" label="上传来源" align="center"/>
              <el-table-column show-overflow-tooltip prop="upload_date" label="上传时间" align="center"/>
              <el-table-column  show-overflow-tooltip label="操作" align="center" width="60">
                <template slot-scope="scope">
                  {{'操作'}}
                </template>
              </el-table-column>
            </el-table>
            <Spin size="large" fix v-if="kycLoading"/>
          </div>
        </TabPane>
      </Tabs>
  </Modal>
</div>
</template>

<script>
import {
  getMyCustomerPaged,
  getBillingInfo,
  getKycFile
} from '@/api/customer'
import countriesCodes from './country'
import pagination from '@/components/base/pagination'
export default {
  name: 'my_customer',
  components: {
    pagination
  },
  data() {
    return {
      docReady: false,
      tableData: [],
      page: 1,
      pageSize: 50,
      totalPage: null,
      params: {
        order_by: 'created_date_china',
        order_direction: 'desc',
      },
      tableHead: [{
          key: 'user_name_email',
          label: '邮箱/登录名'
        }, {
          key: 'name',
          label: '姓名'
        }, {
          key: 'tel',
          label: '电话'
        }, {
          key: 'customer_type',
          label: '客户类型'
        }, {
          key: 'account_status_name',
          label: '账户状态'
        }, {
          key: 'account_verified_level',
          label: '验证级别'
        },
        // {
        //   key: 'assigned_by_user',
        //   label: '指派人'
        // }, {
        //   key: 'assigned_to_user',
        //   label: '指派给'
        // }, {
        //   key: 'track_user',
        //   label: '跟踪人'
        // },
        {
          key: 'track_status_name',
          label: '跟踪状态'
        }, {
          key: 'customer_data_source',
          label: '数据来源'
        }, {
          key: 'created_date_china',
          label: '创建日期'
        },

      ],
      loading: false,
      infoModal: false,
      infoModalLoding: false,
      kycLoading:false,
      infoName: '1',
      infoRow: {},
      infoForm: {
        billing_city: '',
        billing_country: '',
        billing_state: '',
        billing_street_address: '',
        billing_street_number: '',
        billing_street_type: '',
        created_date: '',
        dob: '',
        email: '',
        first_name: '',
        id: '',
        last_name: '',
        telephone: '',
        user_id: '',
        zip_code_postcode: ''
      },
      infoArr: [{
        label: '姓',
        prop: 'last_name',
        component: 0
      }, {
        label: '名',
        prop: 'last_name',
        component: 0
      }, {
        label: '出生日期',
        prop: 'dob',
        component: 2,
        type:'date',
        format:'dd/MM/yyyy'
      }, {
        label: '电话',
        prop: 'telephone',
        component: 0,
      }, {
        label: '邮箱',
        prop: 'email',
        component: 0,
      }, {
        label: '街道类型',
        prop: 'billing_street_type',
        component: 0,
      }, {
        label: '街道号',
        prop: 'billing_street_number',
        component: 0,
      }, {
        label: '街道名称',
        prop: 'billing_street_address',
        component: 0,
      }, {
        label: '城市',
        prop: 'billing_city',
        component: 0,
      }, {
        label: '省份',
        prop: 'billing_state',
        component: 0,
      }, {
        label: '国家',
        prop: 'billing_country',
        component: 1,
        option: countriesCodes
      }, {
        label: '邮编',
        prop: 'zip_code_postcode',
        component: 0,
      }],
      infoRule: {
        last_name: [{
          required: true,
          message: '请输入姓',
          trigger: 'blur'
        }],
        first_name: [{
          required: true,
          message: '请输入名',
          trigger: 'blur'
        }],
        dob: [{
          required: true,
          message: '请选择生日',
          trigger: 'change'
        }],
        telephone: [{
          required: true,
          message: '请输入电话',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }, {
          type: 'email',
          message: '请输入正确的邮箱',
          trigger: 'blur'
        }],
        billing_street_type: [{
          required: true,
          message: '请输入街道类型',
          trigger: 'blur'
        }],
        billing_street_number: [{
          required: true,
          message: '请输入街道号',
          trigger: 'blur'
        }],
        billing_city: [{
          required: true,
          message: '请输入城市',
          trigger: 'blur'
        }],
        billing_city: [{
          required: true,
          message: '请输入城市',
          trigger: 'blur'
        }],
        billing_state: [{
          required: true,
          message: '请输入省份',
          trigger: 'blur'
        }],
        billing_country: [{
          required: true,
          message: '请输入国家',
          trigger: 'blur'
        }],
        zip_code_postcode: [{
          required: true,
          message: '请输入邮编',
          trigger: 'blur'
        }],
      },
      kycData: [],
      baseURL: process.env.BASE_API,
      infoModalLoading:true
    }
  },
  created() {
    this.onready()
  },
  methods: {
    async onready() {
      this.$Message.loading({
        content: 'Loading...',
        duration: 0,
      })
      await this.getMyCustomerPaged(this.params)
      this.docReady = true
      this.$Message.destroy()
    },
    async getMyCustomerPaged(obj) {
      let params = {
        page_index: this.page,
        page_size: this.pageSize,
        ...obj
      }
      this.loading = true
      let res = await getMyCustomerPaged(params)
      if (res.code === 0) {
        this.page = res.data.page
        this.totalPage = res.data.total
        this.tableData = res.data.rows
      } else {
        this.$Message.error(res.msg)
      }
      this.loading = false
    },
    async getBillingInfo() {
      this.infoModalLoding = true
      let res = await getBillingInfo({
        user_id: this.infoRow.user_id
      })
      if (res.code === 0) {
        if (res.data) {
          this.infoForm = res.data
        }
      } else {
        this.$Message.error(res.msg)
      }
      this.infoModalLoding = false
    },
    async getKycFile() {
      this.kycLoading = true
      let res = await getKycFile({
        user_id: this.infoRow.user_id
      })
      if (res.code === 0) {
        this.kycData = res.data
      } else {
        this.$Message.error(res.msg)
      }
      this.kycLoading = false
    },
    pageCurrent(val) {
      this.page = val
      this.getMyCustomerPaged(this.params)
    },
    sizeChange(val) {
      this.pageSize = val
      this.getMyCustomerPaged(this.params)
    },
    sortChange({
      column,
      prop,
      order
    }) {
      this.params.order_by = prop
      this.params.order_direction = order.substring(0, 4)
      this.getMyCustomerPaged(this.params)
    },
    infoClick(row) {
      this.infoRow = row
      this.infoModal = true
      this.infoName = '1'
      this.getBillingInfo()
      this.getKycFile()
    },
    tabsClick(){
      switch (this.infoName) {
        case '1':
          this.getBillingInfo()
          break;
        case '2':
        this.kycLoading = true
          this.getKycFile()
          break;
        default:
          break;
      }
    },
    infoOk() {
      switch (this.infoName) {
        case '1':

          break;
        case '2':
          this.infoModal=false
          break;
        default:
          break;
      }
    }
  }
}
</script>

<style lang="stylus" type="stylesheet/stylus">
.ivu-modal-close{
  z-index: 5000;
}
</style>
