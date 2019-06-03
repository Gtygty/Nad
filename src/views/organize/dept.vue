<template>
  <div class="dept">
    <Table
      class="m_t_10"
      border
      :columns="columns_btn"
      :data="DepartmentData"
      :height="dynamicHeight"
    ></Table>
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
</template>

<script>
import { CODE_OK, IsAlert } from "@/utils/api";
export default {
  name: "dept",
  data() {
    return {
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      count: 0, //分页总数total
      seach_params: { limit: 20, current_page: 1 }, //获取table列表时的参数
      DepartmentData: [], //部门数据（table使用）

      //iview列表按钮数据
      columns_btn: [
        {
          type: "index",
          width: 60,
          align: "center"
        },
        {
          title: "ID",
          align: "center",
          key: "id"
        },
        // {
        //   title: "名称",
        //   key: "admin_name",
        //   align: "center",
        //   tooltip: true,
        //   render: (h, params) => {
        //     return h("div", [
        //       h("Icon", {
        //         props: {
        //           type: "person"
        //         }
        //       }),
        //       h("strong", params.row.admin_name)
        //     ]);
        //   }
        // },
        {
          title: "部门名称",
          align: "center",
          key: "department_name"
        }
      ]
    };
  },

  methods: {
    /* 按钮方法—————————————————————————————————————————————————————————— */

    /* /按钮方法—————————————————————————————————————————————————————————— */

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
      this.$store.dispatch("GetDepartmentList", this.seach_params).then(res => {
        this.DepartmentData = res.data;
        this.count = res.count;
      });
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

<style scoped>
.m_t_10 {
  margin-top: 10px;
}
</style>
