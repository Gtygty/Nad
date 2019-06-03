<template>
    <div class="bindingMobile">
        <Form class="addMobile" ref="addMobile" :model="addMobileForm" :rules="addMobileRules" :label-width="80">
            <FormItem label="手机" prop="mobile" class="areaItem">
                <countryArea :areaCode.sync="areaCodeVal" />
                <Input v-model="addMobileForm.mobile" placeholder="">
                    <span slot="prefix" class="prefixSpan">{{`+${areaCodeVal}`}}</span>
                </Input>
            </FormItem>
            <FormItem label="验证码" prop="mobileCode" class="appendBtn">
                <Input v-model="addMobileForm.mobileCode" placeholder=""></Input>
                <Button type="primary" :disabled="mobileTime===60 ? false : true" @click="sendCode">
                    {{mobileTime===60? `发送验证码` :`${mobileTime}s`}}
                </Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
import countryArea from "@/components/base/countryArea"
export default {
    name: "bindingMobile",
    data () {
        return {
            addMobileForm: {
                mobile: '',
                mobileCode: ''
            },
            addMobileRules: {
                mobile: [
                    { required: true, trigger: ['blur', 'change'], validator: this.validateMobile }
                ],
                mobileCode: [
                    {
                        required: true,
                        type: "string",
                        message: '请输入验证码',
                        trigger: "blur"
                    },
                ]
            },
            areaCodeVal: '86',
            mobileTime: sessionStorage.getItem("mobileTime") || 60,
        }
    },
    computed: {

    },
    created(){
        if (sessionStorage.getItem("mobileTime")) {
            this.setTimeHandle();
        }
    },
    mounted() {

    },
    methods: {
        resetForm(){
            this.$refs.addMobile.resetFields()
        },
        sendCode(){
            this.setTimeHandle()
        },
        setTimeHandle() {
            this.mobileTime--;
            let interval = setInterval(() => {
                if (this.mobileTime > 0) {
                    this.mobileTime--;
                    sessionStorage.setItem("mobileTime", this.mobileTime);
                } else {
                    this.mobileTime = 60;
                    clearInterval(interval);
                    sessionStorage.removeItem("mobileTime");
                }
            }, 1000);
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
    },
    components: {
        countryArea
    }
}
</script>
<style lang="less">
.bindingMobile{
    .addMobile{
        .appendBtn{
            .ivu-btn{
                width: 100px;
                height: 32px;
            }
            .ivu-input-wrapper{
                width: calc(100% - 104px);
            }
        }
        .areaItem{
            .ivu-input-wrapper{
                width: calc(100% - 74px);
            }
        }
    }
}
</style>
