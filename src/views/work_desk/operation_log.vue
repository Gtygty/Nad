<template>
  <div class="operation_log">
    <Form :model="seach_params" inline style="text-align:left;height:40px" @submit.native.prevent>
      <FormItem class="log_Input_clear">
        <Input
          search
          enter-button
          clearable
          v-model="seach_params.search_key"
          placeholder="搜索..."
          @on-search="searchFuc"
          @on-clear="searchFuc"
        ></Input>
      </FormItem>
    </Form>
    <div style="text-align:center">
      <Table border :columns="columns_btn" :data="logListData" :height="dynamicHeight" :no-data-text="loadingText ? loadingText : $t('NoData')"></Table>
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
    </div>
  </div>
</template>

<script>
import { CODE_OK, IsAlert, AjaxApi } from "@/utils/api";
import { mapGetters } from 'vuex'
export default {
  name: "operation_log",
  data() {
    return {
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      modalType_new: false,
      modalType_edit: false,
      count: 0, //分页总数total
      seach_params: { limit: 20, current_page: 1, search_key: "" }, //获取table列表时的参数
      logListData: [], //log数据（table使用）

      //iview列表按钮数据
      columns_btn: [
        // {
        //   type: "index",
        //   width: 40,
        //   align: "center"
        // },
        {
          title: "Id",
          align: "center",
          key: "id",
          width: 60,
          // minWidth: 40,
          tooltip: true
        },
        {
          title: "UserId",
          align: "center",
          key: "user_id",
          // minWidth: 90,
          width: 60,
          tooltip: true
        },
        {
          title: "CreatedBy",
          align: "center",
          key: "created_by",
          width: 70,
          tooltip: true
        },
        {
          title: "Platform",
          align: "center",
          key: "platform",
          width: 70,
          tooltip: true
        },
        {
          title: "Path",
          align: "center",
          key: "path",
          width: 150,
          tooltip: true
        },
        {
          title: "Method",
          align: "center",
          key: "method",
          width: 70,
          tooltip: true
        },
        {
          title: "IP",
          align: "center",
          key: "ip",
          width: 100,
          tooltip: true
        },
        {
          title: "Input",
          align: "center",
          key: "input",
          minWidth: 90,
          tooltip: true
        },
        {
          title: "CreatedAt",
          align: "center",
          key: "created_at",
          width: 190,
          tooltip: true
        }
      ]
    };
  },
 computed: {
    ...mapGetters(["loadingText"])
  },
  methods: {
    //分页跳转方法
    handleCurrentChange(current_page) {
      this.$store.commit('lOADINGTEXT', this.$t('LoadingText'));
      this.logListData = [];
      this.seach_params.current_page = current_page;
      this.getInitData();
    },
    //分页页数改变
    handlePageSizeChange(limit) {
      this.$store.commit('lOADINGTEXT', this.$t('LoadingText'));
      this.logListData = [];
      this.seach_params.limit = limit;
      this.getInitData();
    },
    searchFuc() {
      this.seach_params.current_page = 1;
      let successFuc = res => {
        this.logListData = res.data.data;
        this.count = res.data.count;
      };
      let elseFuc = res => {
        this.logListData = [];
        this.count = 0;
      };
      AjaxApi("GetLogList", this.seach_params, successFuc, elseFuc);
    },
    //获取初始table数据
    getInitData() {
      let successFuc = res => {
        this.$store.commit('lOADINGTEXT', '');
        this.logListData = res.data.data;
        this.count = res.data.count;
      };
      let elseFuc = res => {
        this.logListData = [];
        this.count = 0;
      };
      AjaxApi("GetLogList", this.seach_params, successFuc, elseFuc);
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
  }
};
</script>
<style  lang="less">
.operation_log {
  .ivu-table-cell {
    padding: 5px !important;
  }
}
.log_Input_clear {
  .ivu-form-item-content {
    .ivu-input {
      width: 25vw;
    }
  }
  .ivu-input-icon-clear {
    margin-right: 50px;
  }
}
</style>