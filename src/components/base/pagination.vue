<template>
<div class="pagination">
  <Page :total="Number(totalPage)" show-elevator show-sizer	size="small" show-total @on-change="currentChange" @on-page-size-change="sizeChange" :page-size-opts="[10,15,20,30,50,100, 200, 500]" :current="page" :page-size="pageSize"/>
</div>
</template>
<script>
export default {
  name: 'pagination',
  props: {
    totalPage: {
      type: [Number,String],
      default () {
        return 100
      }
    },
    page: {
      type: Number,
      default () {
        return 1
      }
    },
    pageSize: {
      type: Number,
      default () {
        return 50
      }
    }
  },
  methods: {
    sizeChange(val) {
      this.$emit('pageSize', val);
    },
    currentChange(val) {
      this.$emit('pageCurrent', val)
    }
  }
}
</script>
