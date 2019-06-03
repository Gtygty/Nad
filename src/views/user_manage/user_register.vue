<template>
  <div class="user_register">
    <div class="m_t_10">
      <Form ref="resetForm" :model="paramsData" :rules="resetRule" :label-width="labelWidth">
        <Row>
          <Col span="23" :md="11" :lg="10" :xl="9" :xxl="8">
            <FormItem :label="$t('title')" prop="title">
              <Input v-model="paramsData.title" :placeholder="`${$t('title')}...`" clearable></Input>
            </FormItem>
          </Col>
          <Col span="23" :md="11" :lg="10" :xl="9" :xxl="8">
            <Row :gutter="16">
              <Col span="14">
                <FormItem :label="$t('Name')" prop="firstname">
                  <Input
                    v-model="paramsData.firstname"
                    :placeholder="`${$t('firstname')}...`"
                    clearable
                  ></Input>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem :label-width="0" prop="lastname">
                  <Input
                    v-model="paramsData.lastname"
                    :placeholder="`${$t('lastname')}...`"
                    clearable
                  ></Input>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span="23" :md="11" :lg="10" :xl="9" :xxl="8">
            <FormItem :label="$t('nurse.birth')" prop="dob">
              <DatePicker
                type="date"
                :options="disabledData"
                :placeholder="`${this.$t('nurse.birth')}...`"
                style="width: 100%"
                :value="paramsData.dob"
                format="yyyy-MM-dd"
                @on-change="paramsData.dob=$event"
              ></DatePicker>
            </FormItem>
          </Col>
          <Col span="23" :md="11" :lg="10" :xl="9" :xxl="8">
            <FormItem :label="$t('PostCode')" prop="PostCode">
              <Input v-model="paramsData.PostCode" :placeholder="`${$t('PostCode')}...`" clearable></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23"  :md="11" :lg="10" :xl="9" :xxl="8">
            <FormItem :label="$t('email')" prop="email">
              <Input v-model="paramsData.email" :placeholder="`${$t('email')}...`" clearable></Input>
            </FormItem>
          </Col>
          <Col span="23"  :md="11" :lg="10" :xl="9" :xxl="8" style="text-align:left">
            <FormItem :label-width="30">
              <Button
                type="primary"
                @click="getVerificationCode"
                :loading="buttonLoading"
                :disabled="showtime"
              >
                {{capitalize}}
                <Time :time="timeNow" :interval="1" v-if="showtime"/>
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23"  :md="11" :lg="10" :xl="9" :xxl="8">
            <FormItem :label="$t('emailCode')" prop="emailCode">
              <Input
                v-model="paramsData.emailCode"
                :placeholder="`${$t('emailCode')}...`"
                clearable
              ></Input>
            </FormItem>
          </Col>
          </Row>
          <Row>
          <Col span="23"  :md="11" :lg="10" :xl="9" :xxl="8">
            <Row>
              <Col span="12" style="padding-right:10px">
                <FormItem :label="$t('mobile')" prop="AreaCode">
                  <Input
                    prefix="md-add"
                    v-model="paramsData.AreaCode"
                    :placeholder="`${$t('AreaCode')}...`"
                  ></Input>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem :label-width="0" prop="mobile">
                  <Input v-model="paramsData.mobile" :placeholder="`${$t('mobile')}...`" clearable></Input>
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span="23" :md="11" :lg="10" :xl="9" :xxl="8" style="text-align:left">
            <FormItem :label-width="30">
              <Button
                type="primary"
                @click="getVerificationCode"
                :loading="buttonLoading"
                :disabled="showtime"
              >
                {{capitalize}}
                <Time :time="timeNow" :interval="1" v-show="showtime"/>
              </Button>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23" :md="11" :lg="10" :xl="9" :xxl="8">
            <FormItem :label="$t('mobileCode')" prop="mobileCode">
              <Input
                v-model="paramsData.mobileCode"
                :placeholder="`${$t('mobileCode')}...`"
                clearable
              ></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="23" :md="11" :lg="10" :xl="9" :xxl="8">
            <FormItem :label="$t('Memo')" prop="Memo">
              <Input type="textarea" v-model="paramsData.Memo" :placeholder="`${$t('Memo')}...`" clearable></Input>
            </FormItem>
          </Col>
          <Col span="23" :md="18">
            <FormItem :label="$t('address')" prop="address">
              <Row>
                <Col
                  span="15"
                  :md="18"
                  v-for="(item,index) in paramsData.address"
                  :key="index"
                  class="m_b_10"
                >
                  <Row>
                    <Col span="18" :md="21">
                      <Input
                        v-if="index===paramsData.address.length-1"
                        v-model="paramsData.address[index]"
                        :placeholder="`${$t('address')}...`"
                        :readonly="index!==paramsData.address.length-1"
                        clearable
                      ></Input>
                      <span v-if="index!==paramsData.address.length-1">{{paramsData.address[index]}}</span>
                    </Col>
                    <Col span="3" :md="2" class="m_l_10">
                      <Icon
                        type="md-close-circle"
                        size="30"
                        color="#ed4014"
                        style="cursor: pointer;"
                        @click="minusAdress(index)"
                      />
                    </Col>
                  </Row>
                </Col>
                <Col
                  style="text-align:left"
                  span="6"
                  :md="5"
                  v-show="paramsData.address.length!==0&&paramsData.address[paramsData.address.length-1].length!==0||paramsData.address.length===0"
                >
                  <Icon
                    type="md-add-circle"
                    size="30"
                    color="#2d8cf0"
                    style="cursor: pointer;"
                    @click="addAdress"
                  />
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </div>
    <div style="margin-top:50px;margin-left:360px;text-align:left">
      <Button type="primary" @click="do_Apply">{{$t('Apply')}}</Button>
      <Button class="m_l_25" @click="do_Cancel">{{$t('Cancel')}}</Button>
    </div>
  </div>
</template>

<script>
import { CODE_OK, IsAlert, AjaxApi, IsMessage } from "@/utils/api";
export default {
  name: "user_register",
  data() {
    return {
      disabledData: {
        //生日不可选的时间
        disabledDate(date) {
          // return date && date.valueOf() < Date.now() - 86400000;
          return date && date.valueOf() > Date.now();
        }
      },
      buttonLoading: false,
      clientHeight: null, //浏览器窗口高度
      dynamicHeight: 400, //table动态高度
      timeNow: new Date(),
      showtime: false,
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
        email: "",
        dob: "",
        lastname: "",
        firstname: ""
      },
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
            required: true,
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
        dob: [
          {
            required: true,
            type: "string",
            pattern: /\s\S+|S+\s|\S/,
            message: `${this.$t("PleaseChooseThe")}${this.$t("nurse.birth")}`,
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
            message: `${this.$t("firstname")}`,
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    labelWidth: function() {
      if (this.$store.state.app.isCollapsed) {
        return 110;
      } else {
        return 120;
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
    do_Apply() {
      if (this.paramsData.address.length) {
        if (
          this.paramsData.address[this.paramsData.address.length - 1].length ===
          0
        ) {
          this.paramsData.address.splice(this.paramsData.address.length - 1, 1);
        }
      }
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.validateAll();
        }
      });
    },
    do_Cancel() {
      this.paramsData = {
        title: "",
        Memo: "",
        address: [],
        PostCode: "",
        mobileCode: "",
        mobile: "",
        AreaCode: "",
        emailCode: "",
        email: "",
        dob: "",
        lastname: "",
        firstname: ""
      };
      this.$refs.resetForm.resetFields();
      // this.modalType = false;
    },
    validateAll() {},
    addAdress() {
      this.paramsData.address.push("");
    },
    minusAdress(i) {
      this.paramsData.address.splice(i, 1);
    },
    getVerificationCode() {
      let now = () => {
        this.timeNow = new Date();
        return this.timeNow.setTime(this.timeNow.getTime() - 1000);
      };
      this.timeNow = now();
      this.showtime = true;
      setTimeout(() => {
        this.showtime = false;
        this.timeNow = now();
      }, 5000);
      // setTimeout(()=>{ this.buttonLoading =false;this.showtime = true; setTimeout(()=>{ this.showtime = false; },5000);},1000);
    },
    //获取初始table数据
    getInitData() {
      let successFuc = res => {
        this.$nextTick(() => {
          this.userListData = res.data.data;
          this.count = res.data.count;
        });
      };
      let elseFuc = () => {};
      AjaxApi("GetUsersList", this.seach_params, successFuc, elseFuc);
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
  created() {
    this.getInitData();
  }
};
</script>
<style  lang="less">
</style>