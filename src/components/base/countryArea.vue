<template>
    <div class="countryArea">
        <Select v-model="areaCode" class="areaSelect" @on-change="changeArea">
          <img :src="areaImg" height="30" slot="prefix" />
          <Option v-for="(item,index) in countryOptions" :value="item.code" :key="index">
            <img :src="item.image" width="30" style="vertical-align: middle;margin-right: 5px;" />
            <span>{{`${item.label}&nbsp;（+${item.code}）`}}</span>
          </Option>
      </Select>
    </div>
</template>
<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage } from "@/utils/api";
import { getCountry } from "@/api/business/book"
export default {
    name: "countryArea",
    data () {
        return {
          areaCode: '86',
          areaImg: '',
          countryOptions: [],
        }
    },
    computed: {

    },
    mounted() {
      this.getReady()
    },
    methods: {
      async getReady(){
        let v = await getCountry()
        if(v.code === '2000'){
          this.countryOptions = v.data
          this.areaImg = v.data[0].image
        }else{
          IsMessage.error(v.message)
        }
      },
      changeArea(val){
        this.areaImg = this.countryOptions.filter( v => v.code === val)[0].image;
        this.$emit('update:areaCode',val)
      }
    },
    components: {

    }
}
</script>
<style lang="less">
.countryArea{
  display: inline-block;
  .areaSelect{
    width: 70px;
  }
  .ivu-select-single .ivu-select-selection .ivu-select-placeholder, .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
    visibility: hidden;
    display: none!important;
  }
  .ivu-select-single .ivu-select-prefix{
    padding: 0;
  }
  .ivu-select-arrow{
    right: 5px;
  }
  .ivu-select-selection{
    height: 32px;
    border-color: #dcdee2;
    box-shadow: none;
  }
  .ivu-form-item-error .ivu-select-arrow{
    color: black;
  }
}
</style>
