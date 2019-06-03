<template>
    <div class="exportExcel">
        <Button type="warning" @click="toExportExcel">导出excel</Button>
    </div>
</template>
<script>
import { exportExcelMethod } from '@/utils/exportExcel'
export default {
    name: "exportExcel",
    data () {
        return {

        }
    },
    props: {
      tableData: {
        type: Array,
        default(){
          return []
        }
      },
      tableHead: {
        type: Array,
        default(){
          return []
        }
      }
    },
    computed: {

    },
    mounted() {
      
    },
    methods: {
      toExportExcel(){
        console.log('export-excel')
        console.log(this.tableData)
        let tDataLabels = this.tableHead.reduce( (arr,v) => {
          arr.push(v.title)
          return arr
        },[])
        let tDataKeys = this.tableHead.reduce( (arr,v) => {
          arr.push(v.key)
          return arr
        },[])
        console.log(tDataLabels)
        console.log(tDataKeys)
        exportExcelMethod(this.tableData,tDataLabels,tDataKeys,'test-excel')
      },
    },
    components: {

    }
}
</script>
<style lang="less">
.exportExcel{
  display: inline-block;
}
</style>
