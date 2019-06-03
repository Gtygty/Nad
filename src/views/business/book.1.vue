<template>
  <div class="book">
    <!-- <p>当前正在进行第 {{ current + 1 }} 步</p> -->
    
<!--     
     <Affix :offset-top="550">
        <Steps :current="current" direction="vertical" class="thisFix">
            <Step title="搜索客户"></Step>
            <Step title="选择项目"></Step>
            <Step title="预约"></Step>
            <Step title="结账"></Step>
          </Steps>
    </Affix> -->
    <!-- <div>
      <Row :gutter="16">
        <Col :md="3" style="width:150px;" class="thisFix">
          <Steps :current="current" direction="vertical">
            <Step title="搜索客户"></Step>
            <Step title="选择项目"></Step>
            <Step title="预约"></Step>
            <Step title="结账"></Step>
          </Steps>
        </Col>
        <Col :md="18" style="text-align:center;">
          <p v-show="current===0" class="labelOne">查询CRM中的申请/MTM中的账号</p>
          <Form
            v-show="current===0"
            :label-width="0"
            ref="resetForm"
            :rules="resetRule"
            :model="paramsData"
            @submit.native.prevent
          >
            <FormItem prop="email" class="com-error-tip">
              <Input
                v-model="paramsData.email"
                :placeholder="`${$t('email')}...`"
                clearable
                style="width:50%"
              ></Input>
            </FormItem>
            <FormItem prop="mobile" class="com-error-tip">
              <Input
                v-model="paramsData.mobile"
                :placeholder="`${$t('mobile')}...`"
                clearable
                style="width:50%"
              ></Input>
            </FormItem>
          </Form>
          <div class="colInfo" style="padding: 15px;width:300px;margin:0 auto 24px auto" v-show="current===1">
              <div class="demo-avatar">
                <Avatar v-if="!/^ *$/.test(userInfoData.avatar)" size="large" :src="userInfoData.avatar" />
                <Avatar v-else size="large" class="randomIcon">{{userInfoData.admin_name}}</Avatar>
                <p class="account-name">{{userInfoData.admin_name}}</p>
                  <div class="divider"></div>
                      <Row type="flex" justify="start" align="top"  class="account-detail-desc">
                          <Col span="4"><Icon size='18' type="md-contact" /></Col>
                          <Col span="20"><span>{{userInfoData.first_name+userInfoData.last_name||"example@net.com"}}</span></Col>
                      </Row>
                      <Row type="flex" justify="start" align="top"  class="account-detail-desc">
                          <Col span="4"><Icon size='18' type="md-mail" /></Col>
                          <Col span="20"><span>{{userInfoData.email||"example@net.com"}}</span></Col>
                      </Row>
                      <Row type="flex" justify="start" align="top"  class="account-detail-desc">
                          <Col span="4"><Icon size='18' type="md-call" /></Col>
                          <Col span="20"><span>{{userInfoData.mobile||"1XXexample"}}</span></Col>
                      </Row>
              </div>
            </div>
          <Button type="primary" :disabled="isload" @click="next">{{NextStep}}</Button>
        </Col>
      </Row>
    </div> -->
    <div class="book_step">
      <Steps :current="current" class="thisFix">
        <Step content="搜索客户"></Step>
        <Step content="选择项目"></Step>
        <Step content="预约"></Step>
        <Step content="结账"></Step>
      </Steps>
    </div>
    <div class="book_content" >
      <firstStep v-if="current === 0" />
      <secondStep v-else-if="current === 1" />
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
      current: 0,
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      moadlTitle: this.$t("Registration"),
      paramsData: {
        title: "",
        Memo: "",
        address: [],
        PostCode: "",
        mobileCode: "",
        mobile: "",
        AreaCode: "",
        emailCode: "",
        email: "Cullen.s@svsmarkets.com",
        dob: "",
        lastname: "",
        firstname: ""
      },
      userInfoData:{},
      resetRule: {
        title: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("title")}`,
            trigger: "blur"
          }
        ],
        Memo: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("Memo")}`,
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            type: "array",
            message: `${this.$t("PleaseEnterThe")}${this.$t("address")}`,
            trigger: "blur"
          }
        ],
        PostCode: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("PostCode")}`,
            trigger: "blur"
          }
        ],
        mobileCode: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("mobileCode")}`,
            trigger: "blur"
          }
        ],
        AreaCode: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("AreaCode")}`,
            // message: `${this.$t("PleaseEnterThe")}${this.$t("AreaCode")}`,
            trigger: "blur"
          },
          {
            type: "string",
            pattern: /^(283|282|281|280|269|268|267|266|265|264|263|262|261|260|259|258|257|256|255|254|253|252|251|250|249|248|247|246|245|244|243|242|241|240|239|238|237|236|235|234|233|232|231|230|229|228|227|226|225|224|223|222|221|220|219|218|217|216|215|214|213|212|211|210|98|95|94|93|92|91|90|86|84|82|81|66|65|64|63|62|61|60|58|57|56|55|54|53|52|51|49|48|47|46|45|44|43|41|40|39|36|34|33|32|31|30|27|20|7|1)$/,
            message: `${this.$t("WrongFormat")}`
          }
        ],
        mobile: [
          {
            // required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("mobile")}`,
            trigger: "blur"
          },
          {
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            pattern: /^[0-1]([0-9])[0-9]{9}$/,
            message: `${this.$t("WrongFormat")}`
          }
        ],
        emailCode: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("emailCode")}`,
            trigger: "blur"
          }
        ],
        email: [
          {
            // required: true,
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
        dob: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("dob")}`,
            trigger: "blur"
          }
        ],
        lastname: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("lastname")}`,
            trigger: "blur"
          }
        ],
        firstname: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseEnterThe")}${this.$t("firstname")}`,
            trigger: "blur"
          }
        ]
      }
    };
  },
  components: {
    firstStep,
    secondStep
  },
  computed: {
    NextStep: function() {
      if (this.current === 0) {
        return this.$t("search");
      } else {
        return "下一步";
      }
    },
    isload: function() {
      if (this.paramsData.mobile === ''&&this.paramsData.email === '') {
        return true;
      } else {
        return false;
      }
    },
    capitalize: function() {
      if (this.showtime) {
        return "";
      } else {
        return this.$t("VerificationCode");
      }
    }
  },
  methods: {
    next() {
      let Fuc = () => {
        if (this.current === 0) {
          let params = {
            mobile: this.paramsData.mobile,
            email: this.paramsData.email
          };
          let successFuc = res => {this.userInfoData= res.data;this.current += 1;};
          let elseFuc = res => {};
          AjaxApi("GetUserByEmailMob", params, successFuc, elseFuc);
        }
        // if (this.current == 3) {
        //   this.current = 0;
        // } else {
        //   this.current += 1;
        // }
      };
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          Fuc();
        }
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
    },
    timeNow: function() {
      console.log(this.timeNow);
    }
  },
  created() {}
};
</script>
<style  lang="less">
.book{
  .book_step{
    padding: 20px 0;
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
    margin-top: 20px;
  }
}

</style>