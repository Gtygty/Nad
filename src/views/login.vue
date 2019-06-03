<template>
  <div class="login">
    
     <div class="flex-container" id="login" :style="{height: screenHeight+'px'}">
    <div class="canvaszz" :style="{height: screenHeight+'px'}">

<Row type="flex" justify="center">
      <Col :xs="10" :sm="10" :md="8" :lg="6" class="content">
        <!-- <img src="@/assets/logo.png" alt="logo" class="img"> -->
        <div class="img">
          <svg id="icon-logo-two" viewBox="0 0 166 32" width="130" height="80%">
            <!-- style="display: block;margin:5px auto;"
            >-->
            <path
              d="M99.886 25.943c-1.829 1.829-3.886 3.314-6.857 3.314-4.571 0-8.8-3.886-8.8-8.8 0-4.686 3.886-8.8 8.8-8.8 2.743 0 5.143 1.257 6.971 3.314l-3.429 2.857c-.8-1.143-2.171-1.829-3.657-1.829-2.514 0-4.457 1.943-4.457 4.457s2.057 4.457 4.457 4.457a4.444 4.444 0 0 0 3.543-1.714l3.429 2.743zM102.4 6.514h5.029v22.629H102.4V6.514zm11.2 4.343c-1.6 0-2.857-1.257-2.857-2.857S112 5.143 113.6 5.143c1.6 0 2.857 1.257 2.857 2.857s-1.257 2.857-2.857 2.857zm-2.514 1.943h5.029v16.343h-5.029V12.8zm25.371 8.229v8.114h-4.914v-8.114c0-2.629-.914-4-3.886-4-2.057 0-3.657 1.714-3.771 3.886v8.229h-5.029V12.687h4.914v1.257s1.714-1.829 4.457-1.829c6.743 0 8.229 5.029 8.229 8.914zm6.057-10.172c-1.6 0-2.857-1.257-2.857-2.857s1.257-2.857 2.857-2.857c1.6 0 2.857 1.257 2.857 2.857s-1.257 2.857-2.857 2.857zM140 12.8h5.029v16.343H140V12.8zm23.314 13.6c-1.829 1.829-3.886 3.314-6.857 3.314-4.571 0-8.8-3.886-8.8-8.8 0-4.686 3.886-8.8 8.8-8.8 2.743 0 5.143 1.257 6.971 3.314l-3.429 2.857c-.8-1.143-2.171-1.829-3.657-1.829-2.514 0-4.457 1.943-4.457 4.457s2.057 4.457 4.457 4.457a4.444 4.444 0 0 0 3.543-1.714l3.429 2.743zm-95.2-14.171h.571c2.857 0 5.257 2.4 5.257 5.714s-2.514 5.714-5.257 5.829h-5.714v-6.4H57.6v11.771h10.514c6.171 0 11.2-5.029 11.2-11.2s-4.343-11.086-11.2-11.086z"
            ></path>
            <path
              fill="var(--color2, #0ddece)"
              d="M67.543 6.857h-4.571V2.286h-5.371v4.571H53.03v5.371h4.571v4.571h5.371v-4.571h4.571z"
            ></path>
            <path
              d="M24 6.971v22.171h-5.257L7.657 15.885v13.257H2.286V6.971h5.257L18.629 20.8V6.971H24zm22.171 19.2H35.428l-1.486 3.086h-5.943L38.97 7.086h4l10.629 22.171h-5.943l-1.486-3.086zm-2.057-4.342L40.8 14.743l-3.086 7.086h6.4z"
            ></path>
          </svg>
        </div>
        <Form ref="formCustom" :model="formCustom" :rules="ruleCustom">
          <FormItem prop="identifier">
            <Input type="text" v-model="formCustom.identifier">
              <Icon
                type="ios-person-outline"
                slot="prepend"
                style="padding:0 13px;font-size:18px;"
              />
            </Input>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formCustom.password">
              <Icon type="ios-lock-outline" slot="prepend" style="padding:0 13px;font-size:18px;"/>
            </Input>
          </FormItem>
          <FormItem style="margin-bottom:5px">
            <Button type="primary" @click="handleSubmit('formCustom')" :loading="btnLoading">登录</Button>
          </FormItem>
            <Dropdown style="margin-left: 20px" class="langDrop" @on-click="changeLangFn">
              <Button>
                {{this.langTxt}}
                <Icon type="ios-arrow-down"></Icon>
              </Button>
              <DropdownMenu slot="list">
                <DropdownItem name="cn">中文</DropdownItem>
                <DropdownItem name="en" divided>English</DropdownItem>
              </DropdownMenu>
            </Dropdown>
        </Form>
      </Col>
    </Row>

    </div>
    <canvas id="canvas" :style="{height: screenHeight+'px'}"></canvas>
  </div>
  </div>
</template>
<script>
import { crmLogin } from "@/api/login";
import { mapGetters } from "vuex";
import { CODE_OK } from "@/utils/api";
export default {
  created() {
    // console.log(this);
    // console.log(this.$sendWS);
    //  this.$http.get('/api/users').then((response) => {
    //   console.log(response)
    // }).catch((error) => {
    //   console.log(error)
    // })
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    };
    return {
       screenHeight: window.innerHeight, // 屏幕高度
      langTxt:'English',
      langheader:'en',
      btnLoading: false,
      formCustom: {
        identifier: "17621337050",
        password: "123456"
        // language: "english"
      },
      ruleCustom: {
        identifier: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          }
          // {
          //   type: "email",
          //   message: "请输入真确的邮箱账号",
          //   trigger: "blur"
          // }//gty验证邮箱格式
        ],
        password: [
          {
            validator: validatePass,
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["wsParams", "wsResMsg"]),
     

  },
  watch: {
    wsResMsg() {
      this.$router.push({
        path: "/"
      });
    },
    'screenHeight': function (val) { // 监听屏幕高度变化
      var oIframe = document.getElementById('login')
      oIframe.style.height = Number(val) + 'px' // '120'是页面布局调整，可去除
    }
  },
  methods: {
    addClass (val) {
      document.getElementById(val).style.color = 'black'
      // document.getElementById('register').style.color = 'black'
    },
    deleteClass (val) {
      document.getElementById(val).style.color = ''
    },
    changeLangFn(name){
      this.langheader = name;
      this.langTxt = name==='cn'?'中文':'English';
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          localStorage.clear();
          this.btnLoading = true;
          this.$store.dispatch("LoginAction", this.formCustom).then(res => {
            if (res.code === CODE_OK) {
              this.$store.commit(
                "SET_LOGGED_IN",
                res.data.user_info.have_logged_in
              );
              this.$store.commit("SET_USER_ID", res.data.user_info.id);
              // this.$store.commit("SET_USER_NAME", res.data.user_info.admin_name);
              // this.$store.commit("SET_USER_AVATAR", res.data.user_info.avatar);
              this.$store.commit("SET_STORE_ID", res.data.user_info.store_id);
              localStorage.setItem('language',this.langheader)
              // let UserName = '13912341234'
              // let Password = 'Qwer1234'
              // let WSparams = {
              //   n: 'WebAuthenticateUser',
              //   o: JSON.stringify({
              //     UserName,
              //     Password,
              //   }),
              //   ...this.wsParams
              // }
              // this.$socket.send(JSON.stringify(WSparams))
              location.href = "/";
            } else {
              this.$Message.error(res.message);
              this.btnLoading = false;
            }
          });
        } else {
          this.$Message.error("Fail!");
        }
      });
    }
  },
  mounted () {
    var _this = this
    window.onresize = function () { // 定义窗口大小变更通知事件
      _this.screenHeight = document.documentElement.clientHeight // 窗口高度
    }
    var canvas = document.getElementById('canvas')
    var ctx = canvas.getContext('2d')
    var w = canvas.width = window.innerWidth
    var h = canvas.height = window.innerHeight
    var hue = 217
    var stars = []
    var count = 0
    var maxStars = 1300 // 星星数量

    var canvas2 = document.createElement('canvas')
    var ctx2 = canvas2.getContext('2d')
    canvas2.width = 100
    canvas2.height = 100
    var half = canvas2.width / 2
    var gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half)
    gradient2.addColorStop(0.025, '#CCC')
    gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)')
    gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)')
    gradient2.addColorStop(1, 'transparent')

    ctx2.fillStyle = gradient2
    ctx2.beginPath()
    ctx2.arc(half, half, half, 0, Math.PI * 2)
    ctx2.fill()

    // End cache

    function random (min, max) {
      if (arguments.length < 2) {
        max = min
        min = 0
      }

      if (min > max) {
        var hold = max
        max = min
        min = hold
      }

      return Math.floor(Math.random() * (max - min + 1)) + min
    }

    function maxOrbit (x, y) {
      var max = Math.max(x, y)
      var diameter = Math.round(Math.sqrt(max * max + max * max))
      return diameter / 2
      // 星星移动范围，值越大范围越小，
    }

    var Star = function () {
      this.orbitRadius = random(maxOrbit(w, h))
      this.radius = random(60, this.orbitRadius) / 8
      // 星星大小
      this.orbitX = w / 2
      this.orbitY = h / 2
      this.timePassed = random(0, maxStars)
      this.speed = random(this.orbitRadius) / 500000
      // 星星移动速度
      this.alpha = random(2, 10) / 10

      count++
      stars[count] = this
    }

    Star.prototype.draw = function () {
      var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX
      var y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY
      var twinkle = random(10)

      if (twinkle === 1 && this.alpha > 0) {
        this.alpha -= 0.05
      } else if (twinkle === 2 && this.alpha < 1) {
        this.alpha += 0.05
      }

      ctx.globalAlpha = this.alpha
      ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius)
      this.timePassed += this.speed
    }

    for (var i = 0; i < maxStars; i++) {
      /* eslint-disable no-new */
      new Star()
    }

    function animation () {
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 0.5 // 尾巴
      ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)'
      ctx.fillRect(0, 0, w, h)

      ctx.globalCompositeOperation = 'lighter'
      for (var i = 1, l = stars.length; i < l; i++) {
        stars[i].draw()
      };

      window.requestAnimationFrame(animation)
    }

    animation()
  },
};
</script>
<style lang="stylus" type="stylesheet/stylus">
@keyframes animatedBackground {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 100% 0;
  }
}

.login {
  width: 100vw;
  height: 100vh;
  // background-image: url('../assets/nad.jpg');
  // background-color:#fff;
  // background-position: 0px 0px;
  // background-size: auto 100vh;
  // background-repeat: repeat-x;
  // animation: animatedBackground 40s linear infinite;

  .img {
    margin: 2rem auto;
    width: 100%;
  }

  .content {
    margin-top: 10vh;
    padding: 1.5rem 2rem;
    background-color: #f6f6f6;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.14);
    border: 1px solid #eee;
  }
}
</style>
<style lang="less">
  .langDrop{
    position :absolute;
    right:5px;
    top:10px;

  }
  canvas {
  width: 100vw;
  height: auto /*默认全屏显示 可自己设置高度640px*/;
  display: inline-block;
  vertical-align: baseline;
  // position: absolute;
  z-index: -1;
}
.flex-container{
  width:100vw
}
.canvaszz {
  width: 100%;
  // background: url(../../../static/img/in_top_bj.jpg) no-repeat;
  // height: 640px;
  position: absolute;
  z-index: 10;
  // filter: alpha(opacity=40);
  // -moz-opacity: 0.4;
  // -khtml-opacity: 0.4;
  // opacity: 0.4;
}
</style>

