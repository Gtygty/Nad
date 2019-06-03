<template>
    <div class="firstStep">
      <Row :gutter="20">
        <i-col span="10" style="text-align: right;">
          <Select v-model="operateVal" class="operate" @on-change="operateChange">
            <Option v-for="(item,index) in operateOptions" :value="item.value" :key="index">{{ item.label }}</Option>
          </Select>
        </i-col>
        <i-col span="14" style="text-align: left;">
          <Form :label-width="0" class="resetForm" ref="resetForm" :rules="resetRule" :model="resetForm" @submit.native.prevent>
            <FormItem prop="mobile" v-show="operateVal === 'mobile'" class="areaItem">
              <countryArea :areaCode.sync="areaCodeVal" />
              <Input v-model="resetForm.mobile" :placeholder="`${$t('mobile')}...`" style="width: 250px;">
                <span slot="prefix" class="prefixSpan">{{`+${areaCodeVal}`}}</span>
              </Input>
              <Button type="primary" icon="ios-search" @click="toSearch"></Button>
            </FormItem>
            <FormItem prop="email" v-show="operateVal === 'email'">
              <Input v-model="resetForm.email" :placeholder="`${$t('email')}...`" style="width: 250px;">
                <Icon type="md-mail" slot="prefix" />
              </Input>
              <Button type="primary" icon="ios-search" @click="toSearch"></Button>
            </FormItem>
          </Form>
        </i-col>
      </Row>
      <Row :gutter="20" class="userView">
        <i-col span="9" style="text-align: right;">
          <ul class="ulLabel">
            <li>客户</li>
            <li>手机</li>
            <li>邮箱</li>
          </ul>
        </i-col>
        <i-col span="15" style="text-align: left;">
          <ul class="ulValue">
            <li>Meng</li>
            <li>
              <span>1512345678</span>
              <Button type="primary" @click="addMobile">添加手机</Button>
            </li>
            <li>
              <span>123112@qq.com</span>
              <Button type="primary" @click="addEmail">添加邮箱</Button>
            </li>
          </ul>
        </i-col>
      </Row>
      <h4 style="text-align: center;margin: 30px auto;">对不起，搜索不到该客户！</h4>
      <div v-show="modalVisible">
        <Modal
          v-model="modalVisible"
          scrollable
          :title="modalObj.title"
          label-width="50"
          class-name="check_modal"
          :mask-closable="false"
          @on-cancel="cancel"
          width="500">
            <bindingMobile ref="mobileRef" v-show="modalObj.modalType === 'mobile'" />
            <bindingEmail ref="emailRef" v-show="modalObj.modalType === 'email'" />
        </Modal>
      </div>
    </div>
</template>
<script>
import countryArea from "@/components/base/countryArea"
import bindingMobile from "@/components/book/bindingMobile"
import bindingEmail from "@/components/book/bindingEmail"
export default {
    name: "firstStep",
    data() {
      return {
        operateVal: 'mobile',
        resetForm: {
          mobile: '',
          email: ''
        },
        resetRule: {
          mobile: [
              { required: true, trigger: ['blur', 'change'], validator: this.validateMobile }
          ],
          email: [
            {
              required: true,
              type: "string",
              pattern: /\s\S+|S+\s|\S/,
              message: `${this.$t("PleaseEnterThe")}${this.$t("email")}`,
              trigger: "blur"
            },
            {
              type: "email",
              message: `${this.$t("WrongFormat")}`,
              trigger: "blur"
            }
          ],
        },
        areaCodeVal: '86',
        modalVisible: false,
        modalObj: {
          modalType: '',
          title: ''
        },
      }
    },
    components: {
      countryArea,bindingMobile,bindingEmail
    },
    watch: {
      
    },
    computed: {
      operateOptions(){
        return [
          { label: '手机', value: 'mobile' },
          { label: '邮箱', value: 'email' }
        ]
      }
    },
    mounted() {
      
    },
    methods: {
      submit(){
        this.$emit('next');
      },
      addMobile(){
        this.modalVisible = true
        this.modalObj = {
          modalType: 'mobile',
          title: '添加手机'
        }
      },
      addEmail(){
        this.modalVisible = true
        this.modalObj = {
          modalType: 'email',
          title: '添加邮箱'
        }
      },
      operateChange(){
        this.$refs.resetForm.resetFields()
      },
      toSearch(){
        this.$refs.resetForm.validate( (valid) => {
          if(valid){
            switch(this.operateVal){
              case 'mobile':

                break;

                break;
            }
          }
        })
      },
      cancel(){
        this.modalVisible = false
        this.$nextTick( () => {
          switch(this.modalObj.modalType){
            case 'mobile':
              this.$refs.mobileRef.resetForm();
              break;
            case 'email':
              this.$refs.emailRef.resetForm();
              break;
          }
        })
      },
      /* 手机验证 */
      validateMobile(rule, value, callback){
        if(value === ''){
          callback(new Error(`${this.$t("PleaseEnterThe")}${this.$t("mobile")}`));
        }else{
          let ptn;
          if(this.areaCodeVal === '86'){
              ptn = /^1[3456789]\d{9}$/;
          }else{
              ptn = /^\d*$/;
          }
          var res = ptn.test(value);
          if(!res){
            callback(new Error(`${this.$t("WrongFormat")}`));
          }else{
            callback();
          }
        }
      },
    }
}
</script>
<style lang="less">
.firstStep{
  .operate{
    width: 100px;
    text-align: left;
  }
  .resetForm{
    .ivu-icon-ios-close-circle{
      &:before{
        content: '';
      }
    }
  }
  .userView{
    margin-top: 30px;
    ul{
      li{
        line-height: 40px;
      }
    }
    .ulLabel{
      li{
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
}
.check_modal{
  .ivu-modal-body{
    padding: 50px;
  }
}
</style>
