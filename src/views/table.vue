<template>
  <easytable ref="easytable" style="width:100%;" is-horizontal-resize :columns="columns" :table-data="tableData" row-hover-color="#eee" row-click-color="#edf7ff" @on-custom-comp="customCompFunc" title-bg-color="#f8f8f8" />
</template>

<script>
import Vue from 'vue'
import {
  mapGetters
} from 'vuex'
export default {
  data() {
    return {
      value: '',
      ppp: [],
      searchParams: {},
      tableData: [{
        "name": "",
        "tel": "",
        "hobby": "",
        "address": ""
      }, {
        "name": "赵伟",
        "tel": "156*****1987",
        "hobby": "钢琴、书法、唱歌",
        "address": "上海市黄浦区金陵东路569号17楼"
      }, {
        "name": "李伟",
        "tel": "182*****1538",
        "hobby": "钢琴、书法、唱歌",
        "address": "上海市奉贤区南桥镇立新路12号2楼"
      }, {
        "name": "孙伟",
        "tel": "161*****0097",
        "hobby": "钢琴、书法、唱歌",
        "address": "上海市崇明县城桥镇八一路739号"
      }, {
        "name": "周伟",
        "tel": "197*****1123",
        "hobby": "钢琴、书法、唱歌",
        "address": "上海市青浦区青浦镇章浜路24号"
      }, {
        "name": "吴伟",
        "tel": "183*****6678",
        "hobby": "钢琴、书法、唱歌",
        "address": "上海市松江区乐都西路867-871号"
      }],
      columns: [
        //   {
        //   field: 'custome',
        //   title: '序号',
        //   width: 50,
        //   titleAlign: 'center',
        //   columnAlign: 'center',
        //   formatter: function(rowData, rowIndex, pagingIndex, field) {
        //     return rowIndex < 3 ? '<span style="color:red;font-weight: bold;">' + (rowIndex + 1) + '</span>' : rowIndex + 1
        //   },
        //   isFrozen: true,
        //   isResize: true
        // },
        {
          field: 'name',
          title: '姓名',
          width: 80,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          componentName: 'table-operation',
        }, {
          field: 'tel',
          title: '手机号码',
          width: 150,
          titleAlign: 'center',
          columnAlign: 'center',
          isResize: true,
          componentName: 'table-operation',
        }, {
          field: 'hobby',
          title: '爱好',
          width: 150,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation',
          isResize: true
        }, {
          field: 'address',
          title: '地址',
          width: 230,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation',
          isResize: true
        }, {
          field: 'custome-adv',
          title: '操作',
          width: 200,
          titleAlign: 'center',
          columnAlign: 'center',
          componentName: 'table-operation',
          isResize: true
        }
      ]

    }
  },
  computed: {
    ...mapGetters([
      'isCollapsed',
    ]),
  },
  watch:{
    isCollapsed(){
      setTimeout(()=>{
        this.$refs.easytable.resize()
      },200)
    }
  },
  mounted() {
    this.$refs.easytable.resize()
    console.log(this);
    // this.$store.commit('SET',[124124])
  },
  methods: {
    customCompFunc(params) {
      console.log(params);
      switch (params.type) {
        case 'change':
          this.searchParams[params.field]=params.value
          break;
        case 'search':
          console.log(this.searchParams)
          break;
        default:
          break;
      }
    }
  }
}

// 自定义列组件
Vue.component('table-operation', {
  template: `
  <span v-if="index==0&&field!=='custome-adv'" style="width: 100%;background:#f8f8f8;text-align:center;">
    <Input v-model="value" placeholder="Enter something..." @on-change="change" style="width: 80%;"></Input>
  </span>
  <span v-else-if="index==0&&field==='custome-adv'" style="width: 100%;background:#f8f8f8;text-align:center;">
    <Button type="info" @click="search">搜索</Button>
  </span>
  <span v-else>
    {{rowData[field]}}
  </span>`,
  data() {
    return {
      value: ''
    }
  },
  created() {
    this.value = this.ppp[0]
  },
  computed: {
    ...mapGetters([
      'ppp',
    ]),
  },
  props: {
    rowData: {
      type: Object
    },
    field: {
      type: String
    },
    index: {
      type: Number
    }
  },
  methods: {
    change() {
      let params = {
        type: 'change',
        field: this.field,
        value: this.value
      };
      this.$emit('on-custom-comp', params);
    },
    search() {
      let params = {
        type: 'search'
      };
      this.$emit('on-custom-comp', params);
    },
  }
})
</script>

<style lang="css">
.v-table-header td, .v-table-body td, .v-table-footer td{
  height: 40px!important;
}
tbody .v-table-row:first-child{
  background: grey!important;
}
</style>
