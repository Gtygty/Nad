<template>
    <div class="bindingEmail">
        <Form class="addEmail" ref="addEmail" :model="addEmailForm" :rules="addEmailRules" :label-width="80">
            <FormItem label="邮箱" prop="email">
                <Input v-model="addEmailForm.email" placeholder=""></Input>
            </FormItem>
            <FormItem label="验证码" prop="emailCode" class="appendBtn">
                <Input v-model="addEmailForm.emailCode" placeholder=""></Input>
                <Button type="primary" :disabled="emailTime===60 ? false : true" @click="sendCode">
                    {{emailTime===60? `发送验证码` :`${emailTime}s`}}
                </Button>
            </FormItem>
        </Form>
    </div>
</template>
<script>
export default {
    name: "bindingEmail",
    data () {
        return {
            addEmailForm: {
                email: '',
                emailCode: ''
            },
            addEmailRules: {
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
                emailCode: [
                    {
                        required: true,
                        type: "string",
                        message: '请输入验证码',
                        trigger: "blur"
                    },
                ]
            },
            emailTime: sessionStorage.getItem("emailTime") || 60,
        }
    },
    computed: {

    },
    mounted() {

    },
    methods: {
        resetForm(){
            this.$refs.addEmail.resetFields()
        },
        sendCode(){
            this.setTimeHandle()
        },
        setTimeHandle() {
            this.emailTime--;
            let interval = setInterval(() => {
                if (this.emailTime > 0) {
                    this.emailTime--;
                    sessionStorage.setItem("emailTime", this.emailTime);
                } else {
                    this.emailTime = 60;
                    clearInterval(interval);
                    sessionStorage.removeItem("emailTime");
                }
            }, 1000);
        },
    },
    components: {

    }
}
</script>
<style lang="less">
.bindingEmail{
    .addEmail{
        .appendBtn{
            .ivu-btn{
                width: 100px;
                height: 32px;
            }
            .ivu-input-wrapper{
                width: calc(100% - 104px);
            }
            
        }
    }
}
</style>
