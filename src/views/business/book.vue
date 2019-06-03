<template>
  <div class="book">
    <div class="book_step">
      <Steps :current="activeName" class="thisFix">
        <Step content="搜索客户"></Step>
        <Step content="选择项目"></Step>
        <Step content="预约"></Step>
        <Step content="结账"></Step>
      </Steps>
    </div>
    <div class="book_content">
      <div v-show="activeName === 0">
        <firstStep ref="firstStep" @next="toNext"  />
      </div>
      <div v-show="activeName === 1">
        <secondStep ref="secondStep" @next="toNext"  />
      </div>
    </div>
    <div class="operationBtn">
      <Button type="primary" @click="toSubmit">下一步</Button>
      <Button type="success" @click="toRegister">先注册</Button>
    </div>
  </div>
</template>
<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage } from "@/utils/api";
import firstStep from "@/components/book/firstStep"
import secondStep from "@/components/book/secondStep"
export default {
  name: "book",
  data() {
    return {
      activeName: 1,
    }
  },
  components: {
    firstStep,
    secondStep
  },
  computed: {
    
  },
  methods: {
    toNext(){
      ++this.activeName
    },
    toSubmit(){
      switch(this.activeName){
        case 0:
            this.$refs.firstStep.submit()
            break;
        case 1:
            this.$refs.secondStep.submit()
            break;
      }
    },
    toRegister(){
      alert('待开发')
    }
  },
  mounted() {
    
  },
  watch: {
    
  },
  created() {}
};
</script>
<style  lang="less">
.book{
  .book_step{
    padding: 20px 0 20px 15%;
    //padding: 20px 0;
    .thisFix{
      width: 80%;
      margin: 0px auto;
      position: -webkit-sticky;
      position: sticky;
      top: 20vh;
      text-align: left;
      .ivu-steps-content{
        padding-left: 0;
        padding-top: 10px;
        font-weight: 700;
      }
    }
  }
  .book_content{
    margin-top: 50px;
  }
  .operationBtn{
    margin-top: 30px;
    .ivu-btn{
      width: 200px;
    }
  }
}

</style>