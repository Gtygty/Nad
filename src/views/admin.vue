<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu
          ref="mainMenu"
          mode="horizontal"
          :active-name="mainActive"
          @on-select="mainSelect"
          theme="dark"
        >
          <div
            @click="collapsedSider"
              :class="isCollapsed?'layout-logo2 com-Logo':'layout-logo com-Logo'"
              :title="$t('controlMenu')"
          >
            <!-- <img
              src="@/assets/logo.png"
              alt="logo"
              style="height:100%;padding:5px;margin-left:30px;"
            >-->
            <!-- <svg class="header logo">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-logo-two"></use>
            </svg>-->
            <Icon type="ios-list"v-show="isCollapsed" size="30" style="color:white;font-weight: bold;"/>
            <svg id="icon-logo-two" viewBox="0 0 166 32" width="130" height="80%" v-show="!isCollapsed">
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
          <div class="layout-nav" style="background: #transparent;min-width:720px"   id="scroller">
            <router-link
              v-for="(v,i) in topMenu"
              :key="i"
              :to="{ path: `/${v.path}` }"
              :v-show="true"
            >
              <!-- v-show="v.is_hidden==='0'" -->
              <MenuItem :name="v.menu_name" v-show="v.is_hidden===0">
                <!-- <Icon :type="v.icon" /> -->
                <span>{{v.menu_name}}</span>
              </MenuItem>
            </router-link>
            <Icon
              class="ivu-menu-item"
              type="md-apps"
              color="#fff"
              size="20"
              style="vertical-align:middle;cursor:pointer;display:inline-block;float:left;line-height: 52px;"
              @click.native="dialog=true"
            />
             <div style="clear:both;"></div>
          </div>
          <div class="layout-tip" style="text-align:right;">
            <Dropdown placement="bottom-end" @on-click="changeLangFn">
              <Button type="info" size="large">{{$t("admin.language")}}</Button>
              <DropdownMenu slot="list" style="text-align:center;">
                <DropdownItem name="cn">简体中文</DropdownItem>
                <DropdownItem name="en">English</DropdownItem>
                <!-- <DropdownItem name="tc">繁體中文</DropdownItem> -->
              </DropdownMenu>
            </Dropdown>
            <Dropdown placement="bottom-end" @on-click="avatarClick">
              <!-- <Avatar style="color: #f56a00;background-color: #fde3cf;cursor:pointer">{{userName}}</Avatar> -->
              <Avatar  size="large" class="randomAvatar">{{userName}}</Avatar>
              <!-- <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg"/> -->
              <DropdownMenu slot="list" style="text-align:center;">
                <DropdownItem name="1">登出</DropdownItem>
                <DropdownItem name="2">个人信息</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </Menu>
      </Header>
      <Layout style="height:calc(100vh - 52px);">
        <Sider
          breakpoint="xl"
          ref="collapsibleSider"
          collapsible
          :collapsed-width="0"
          v-model="isCollapsed"
          hide-trigger
          @on-collapse="onCollapse"
        >
          <Menu
            ref="subMenu"
            :active-name="subActive"
            width="auto"
            class="menu-item"
            :class="isCollapsed?'collapsed-menu':''"
            style="height:100%;"
            accordion
            :open-names="openName"
          >
            <div style="background:#fff;width:100%;text-align:center;line-height:30px;height:30px;">
              <b
                class="ivu-icon"
                :class="isCollapsed?'ivu-icon-arrow-expand':'ivu-icon-arrow-shrink'"
                style="font-size:22px;line-height:30px;cursor:pointer;"
                @click="collapsed"
              />
            </div>
            <Button
              v-for="(v,i) in buttonArr"
              :key="i"
              type="primary"
              @click="plusShowClick"
              style="margin:10px;"
            >
              <span>{{v.feature_name}}</span>
            </Button>
            <template v-for="(v,i) in subMenu" v-if="!v['children'] || v.children.length===0">
              <router-link :to="routerLink(v)" v-show="v.is_hidden===0">
                <!-- <router-link :to="routerLink(v)" v-show="v.is_hidden==='0'"> -->
                <MenuItem :name="v.menu_name" style="text-align:left;">
                  <Icon :type="v.icon"/>
                  <span>{{v.menu_name}}</span>
                </MenuItem>
              </router-link>
            </template>
            <template v-else>
              <Poptip placement="right" v-if="isCollapsed" trigger="hover">
                <div slot="content">
                  <router-link
                    v-for="(child,i) in v.children"
                    :key="i"
                    :to="routerLink(child)"
                    v-show="child.is_hidden==='0'"
                  >
                    <div class="ivu-menu-item">{{child.menu_name}}</div>
                  </router-link>
                </div>
                <MenuItem :name="v.menu_name">
                  <Icon :type="v.icon"/>
                  <span>{{v.menu_name}}</span>
                </MenuItem>
              </Poptip>
              <Submenu :name="v.menu_name" v-else style="text-align:left;">
                <template slot="title">
                  <Icon :type="v.icon"/>
                  <span>{{v.menu_name}}</span>
                </template>
                <router-link
                  v-for="(child,i) in v.children"
                  :key="i"
                  :to="routerLink(child)"
                  v-show="child.is_hidden===0"
                >
                  <MenuItem :name="child.menu_name">
                    <Icon :type="child.icon"/>
                    <span>{{child.menu_name}}</span>
                  </MenuItem>
                </router-link>
              </Submenu>
            </template>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0'}">
          <Content
            :style="{padding: '10px', height: 'calc(100vh - 62px)', background: '#fff', width:'100%',position:'relative',boxSizing:'border-box'}"
          >
            <transition :name="transitionName"  mode="out-in">
              <router-view
                v-if="!plusShow"
                class="child-view"
                style="width:calc(100% - 20px);height:calc(100% - 20px);"
              />
              <!-- <createAccount v-else/> -->
            </transition>
          </Content>
        </Layout>
      </Layout>
    </Layout>
    <Modal v-model="dialog" :title="$t('MenuManagement')" @on-ok="save">
      <div class="app-menu">
        <h3>
          {{$t('Topping')}}
          <Button
            :type="appEdit?'primary':'info'"
            size="small"
            style="float:right;"
            @click="save"
            :loading="saveLoading"
          >{{appEdit?$t('Save'):$t('Edit')}}</Button>
        </h3>
        <ul>
          <appIcon v-for="(v,i) in topMenu" :key="i" :icon="v" :edit="appEdit" @editApp="editApp"/>
        </ul>
      </div>
      <div slot="footer" class="app-menu" style="text-align:left;">
        <h3>{{$t('OtherMenu')}}</h3>
        <ul>
          <appIcon
            v-for="(v,i) in downMenu"
            :key="i"
            :icon="v"
            plus
            :edit="appEdit"
            @editApp="editApp"
          />
        </ul>
      </div>
    </Modal>
    <Modal
      v-model="resetPass"
      title="更新密码"
      @on-ok="setOk"
      @on-cancel="setCancel"
      :loading="resetPassLoading"
      width="330"
    >
      <Form ref="resetForm" :model="resetForm" :rules="resetRule" :label-width="80">
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="resetForm.password"></Input>
        </FormItem>
        <FormItem label="确认" prop="confirm_password">
          <Input type="password" v-model="resetForm.confirm_password"></Input>
        </FormItem>
      </Form>
    </Modal>
    <Modal
      v-model="ModalUser"
      :title="$t('userinfo')"
      @on-ok="cancelPassword"
      @on-cancel="cancelPassword"
      class-name="ModalUserClass"
      :footer-hide="true"
    >
       <div slot="header"></div>
      <!-- <p slot="head" style="color:#f60;text-align:center">
            <Icon type="information-circled"></Icon>
            <span>删除确认</span>
        </p> -->
    <Row>
        <Col :xs="24" :sm="24" :md="7" :lg="7" style="padding: 15px;">
            <div class="colInfo" style="padding: 15px;">
              <div class="demo-avatar">
                <Avatar v-if="!/^ *$/.test(userInfoData.avatar)" size="large" :src="userInfoData.avatar" />
                <Avatar v-else size="large" class="randomIcon">{{userInfoData.admin_name}}</Avatar>
                <p class="account-name">{{userInfoData.admin_name}}</p>
                  <div class="divider"></div>
                      <Row type="flex" justify="start" align="top"  class="account-detail-desc">
                          <Col span="4"><Icon size='18' type="md-mail" /></Col>
                          <Col span="20"><span>{{userInfoData.email||"example@net.com"}}</span></Col>
                      </Row>
                      <Row type="flex" justify="start" align="top"  class="account-detail-desc">
                          <Col span="4"><Icon size='18' type="md-call" /></Col>
                          <Col span="20"><span>{{userInfoData.mobile||"1XXexample"}}</span></Col>
                      </Row>
                      <Row type="flex" justify="start" align="top"  class="account-detail-desc">
                          <Col span="4"><Icon size='18' type="md-compass" /></Col>
                          <Col span="20"><span>{{userInfoData.mobile_area||"上海市"}}</span></Col>
                      </Row>
                      <Row type="flex" justify="start" align="top"  class="account-detail-desc">
                          <Col span="4"><Icon size='18' type="md-clock" /></Col>
                          <Col span="20"><span>{{userInfoData.time_zone||"Pacific/Apia"}}</span></Col>
                      </Row>
              </div>
            </div>
        </Col>
        <Col :xs="24" :sm="24" :md="17" :lg="17" style="padding: 15px;">
            <div class="colInfo" style="padding: 15px;">
              <Tabs v-model="TabsStatus">
                  <TabPane :label="$t('basicSettings')" name="name1">
                    <Form ref="userInfoData" :model="userInfoData" :rules="resetRule" label-position="left" :label-width="70" style="padding-left:20px">
                      <FormItem :label="`${$t('Name')}:`" style="width:60%">
                        <Input placeholder="Name..." v-model="userInfoData.admin_name"></Input>
                      </FormItem>
                      <FormItem :label="`${$t('email')}:`" style="width:60%">
                        <Input placeholder="Email..." v-model="userInfoData.email"></Input>
                      </FormItem>
                      <FormItem :label="`${$t('mobile')}:`" style="width:60%">
                        <Input placeholder="Mobile..." v-model="userInfoData.mobile"></Input>
                      </FormItem>
                    </Form>
                    <div class="round">
                        <a class="button" id="button1" href="javascript:void(0);"  @click="changeUserInfo()">{{$t('Apply')}}</a>
                        <a class="button" id="button2" href="javascript:void(0);" @click="cancelPassword">{{$t('Cancel')}}</a>
                    </div>
                  </TabPane>
                  <TabPane :label="$t('PasswordSettings')" name="name2">
                    <Form ref="userInfoData" :model="userInfoData" :rules="resetRule" label-position="left" :label-width="100" style="padding-left:20px">
                      <FormItem :label="`${$t('oldPassword')}:`" style="width:60%">
                        <Input :type="oldtype" v-model="PasswordData.old_password" :placeholder="`${$t('oldPassword')}...`"  :icon="eye_old" @on-click="seeOldPassWord"></Input>
                      </FormItem>
                      <FormItem :label="`${$t('Password')}:`" style="width:60%">
                        <Input :type="passwordtype" v-model="PasswordData.password" :placeholder="`${$t('Password')}...`"  :icon="eye" @on-click="seePassWord"></Input>
                      </FormItem>
                      <FormItem :label="`${$t('ConfirmPassword')}:`" style="width:60%">
                        <Input :type="confirmtype" v-model="PasswordData.password_confirmation" :placeholder="`${$t('ConfirmPassword')}...`"  :icon="eye_confim" @on-click="seeConfirmPassWord"></Input>
                      </FormItem>
                      
                      <!-- <FormItem :label="`${$t('Account')}:`" style="width:60%">
                        <Input placeholder="Account.." v-model="userInfoData.admin_account"></Input>
                      </FormItem> -->
                      <!-- <FormItem :label="`${$t('Password')}:`" style="width:60%">
                        <Input :type="passwordtype" placeholder="Account.." v-model="userInfoData.admin_account"  :icon="eye" @on-click="seePassWord"></Input>
                      </FormItem> -->
                    </Form>
                    <div class="round">
                        <a class="button" id="button1" href="javascript:void(0);"  @click="this_do_Password">{{$t('Apply')}}</a>
                        <a class="button" id="button2" href="javascript:void(0);" @click="cancelPassword">{{$t('Cancel')}}</a>
                    </div>
                  </TabPane>
              </Tabs>
            </div>
             
            
          
      </Col>
    </Row>
    </Modal>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import appIcon from "@/components/appIcon";
import { IsLoading,IsMessage,AjaxApi } from "@/utils/api";
import { updateTopMenu } from "@/api/admin";
import { updateCrmUserPassword } from "@/api/manage";
import { createRouter } from "@/router";
import createAccount from "@/components/base/createAccount";
export default {
  name: "admin",
  inject: ["reload"],
  data() {
    const validatePasswordConfirm = (rule, value, callback) => {
      if (value !== this.resetForm.password) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      TabsStatus:"name1",
      oldtype:"password",
      passwordtype:"password",
      confirmtype:"password",
      eye:"md-eye",
      eye_old:"md-eye",
      eye_confim:"md-eye",
      userName: this.$store.state.app.userName,
      isCollapsed: this.$store.state.app.isCollapsed,
      PasswordData:{
        admin_name: this.$store.state.app.userName,
        old_password : "",
        password : "",
        password_confirmation: "",
      },
      userInfoData:{
        admin_account: "",
        admin_name: "",
        avatar: "",
        created_at: "",
        created_by: 1,
        deleted_at: null,
        deleted_by: 0,
        department_id: 1,
        email: "",
        id: 1,
        is_admin: "N",
        last_login_date: "",
        last_logout_date: "",
        mobile: "",
        mobile_area: "",
        password_updated_date: "",
        status: 1,
        store_id: 1,
        time_zone: "",
        updated_at: "",
        updated_by: 0
        },
      mainActive: "",
      // transitionName: "slide-left",
      transitionName: "slide-left",
      childName: "",
      subActive: "",
      subMenu: [],
      openName: [],
      widthInfo: "800",
      dialog: false,
      topMenu: [],
      downMenu: [],
      ModalUser: false,
      appEdit: false,
      saveLoading: false,
      resetPass: false,
      resetForm: {
        crm_user_id: localStorage.getItem("userId"),
        password: "",
        confirm_password: ""
      },
      resetRule: {
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 4,
            max: 15,
            message: "密码长度需在4~15个字符",
            trigger: "blur"
          }
        ],
        confirm_password: [
          {
            required: true,
            message: "请输入确认密码",
            trigger: "blur"
          },
          {
            validator: validatePasswordConfirm,
            trigger: "blur"
          }
        ]
      },
      resetPassLoading: true,
      plusShow: false,
      buttonArr: []
    };
  },
  components: {
    appIcon,
    createAccount
  },
  watch: {
    $route(to, from) {
      this.plusShow = false;
      if (to.path == "/") {
        this.transitionName = "slide-right";
      } else {
        this.transitionName = "slide-left";
      }
    }
  },
  computed: {
    ...mapGetters(["menuRouter", "loggedIn"])
  },
  created() {
    this.getShowMenu();
    this.showList();
  },
  mounted() {
    if (this.loggedIn === 0) {
      this.resetPass = true;
    }
  },
  methods: {
      this_do_Password(){
          let successFuc = () => {
            IsMessage("success", this.$t("Successful"));
            this.cancelPassword();
          };
        let elseFuc = () => {};
        let params = {
          id : this.userInfoData.id,
          params : this.PasswordData,
        }
        AjaxApi("ChangeAdminPassword",params, successFuc, elseFuc);
    },
    seePassWord(){
      this.eye = this.eye==="md-eye"?"md-eye-off":"md-eye";
      this.passwordtype = this.passwordtype==="password"?"text":"password";
    },
    seeOldPassWord(){
      this.eye_old = this.eye_old==="md-eye"?"md-eye-off":"md-eye";
      this.oldtype = this.oldtype==="password"?"text":"password";
    },
    seeConfirmPassWord(){
      this.eye_confim = this.eye_confim==="md-eye"?"md-eye-off":"md-eye";
      this.confirmtype = this.confirmtype==="password"?"text":"password";
    },
    changeUserInfo(){//修改用户信息（个人中心弹窗）
      let successFuc = () => {
            IsMessage("success", this.$t("Successful"));
            this.cancelPassword();
          };
        let elseFuc = res => {
          IsMessage("error",res.message)
        };
        let params = {
          id : this.userInfoData.id,
          params : {
            admin_name:this.userInfoData.admin_name,
            mobile:this.userInfoData.mobile,
            email:this.userInfoData.email
          }
        }
        AjaxApi("ChangeUserInfo",params, successFuc, elseFuc);
    },
    cancelPassword(){
      this.ModalUser=false;
    },
    getShowMenu() {
      let top = [],
        down = [];
      this.menuRouter.forEach(v => {
        if (v.is_top === 1) {
          //控制菜单是否显示为1则显示
          top.push(v);
        } else {
          down.push(v);
        }
      });
      this.topMenu = [...top].sort((a, b) => {
        return a.id - b.id;
      });
      this.downMenu = [...down];
    },
    showList() {
      this.topMenu.forEach(v => {
        v.children.forEach(child => {
          // if (child.menu_name === this.$route.name) {
          if ("/" + child.path === this.$route.path) {
            this.mainActive = v.path;
            this.subMenu = v.children;
            // this.subActive = this.$route.name;
            this.subActive = child.menu_name;
            this.buttonArr = v.feature;
          } else {
            child.children.forEach(sub => {
              // if (sub.menu_name === this.$route.name) {
              if ("/" + sub.path === this.$route.path) {
                this.mainActive = v.menu_name;
                this.subMenu = v.children;
                // this.subActive = this.$route.name;
                this.subActive = sub.menu_name;
                this.openName = [child.menu_name];
                this.buttonArr = v.feature;
              }
            });
          }
        });
      });
      this.$nextTick(() => {
        this.$refs.subMenu.updateOpened();
        this.$refs.mainMenu.updateActiveName();
        this.$refs.subMenu.updateActiveName();
      });
    },
    mainSelect(name) {
      this.subMenu = this.menuRouter.find(v => {
        return v.menu_name === name;
      }).children;
      this.buttonArr = this.menuRouter.find(v => {
        return v.menu_name === name;
      }).feature;
      if (
        !this.subMenu[0]["children"] ||
        this.subMenu[0]["children"].length === 0
      ) {
        this.subActive = this.subMenu[0].menu_name;
      } else {
        this.subActive = this.subMenu[0].children[0].menu_name;
        this.openName = [this.subMenu[0].menu_name];
        this.$nextTick(() => {
          this.$refs.subMenu.updateOpened();
        });
      }
      this.$nextTick(() => {
        this.$refs.subMenu.updateActiveName();
      });
    },
    collapsed() {
      this.isCollapsed = !this.isCollapsed;
      this.$refs.collapsibleSider.toggleCollapse();
      this.showList();
    },
    collapsedSider() {
      this.$refs.collapsibleSider.toggleCollapse();
    },
    onCollapse() {
      this.$store.commit("COLLAPSED", this.isCollapsed);
    },
    save() {
      if (this.appEdit) {
        let params = {
          top_menu: this.topMenu.map(v => v.id),
          un_top_menu: this.downMenu.map(v => v.id)
        };
        this.updateTopMenu(params);
      }
      this.appEdit = !this.appEdit;
    },
    editApp(params) {
      console.log(params)
      if (!params.plus) {
        this.calc(this.menuRouter, this.downMenu, this.topMenu, params);
      } else {
        this.calc(this.menuRouter, this.topMenu, this.downMenu, params);
      }
    },
    calc(main, plus, minus, params) {
      minus.forEach((v, i) => {
        if (v.id === params.id) {
          minus.splice(i, 1);
        }
      });
      main.forEach(v => {
        if (v.id === params.id) {
          plus.push(v);
        }
      });
    },
    updateTopMenu(params){
      let successFuc = res => {
        this.reload();
        };
        let elseFuc = () => {};
        AjaxApi("GetAllMenu", params, successFuc, elseFuc);
    },
    // async updateTopMenu(params) {
    //   this.saveLoading = true;
    //   let res = await updateTopMenu(params);
    //   if (res.code === "2000") {
    //     await this.$store.dispatch("SetRouter", this.$router).then(res => {
    //       if (res.code === "2000") {
    //         this.$router.addRoutes([
    //           ...this.$store.getters.vueRouter,
    //           {
    //             path: "*",
    //             redirect: "/work_desk"
    //           }
    //         ]);
    //       } else {
    //         this.$store.dispatch("LogOut"); //获取菜单失败
    //       }
    //     });
    //     this.$router.push({
    //       path: "/"
    //     });
    //     // this.$router.replace({
    //     //   path: "/"
    //     // });
    //     await this.getShowMenu();
    //     await this.showList();
    //   } else {
    //     this.getShowMenu();
    //     this.$Message.error(res.msg);
    //   }
    //   this.saveLoading = false;
    // },
    avatarClick(name) {
      //登录右上角的下拉选项
      switch (name) {
        case "1":
          this.$store.dispatch("LogOut");
          break;
        case "2":
          this.$store.dispatch("GetUserInfo").then(res=>{
              this.userInfoData = res.data;
              this.PasswordData={
              admin_name: this.$store.state.app.userName,
              old_password : "",
              password : "",
              password_confirmation: "",
            };
            this.TabsStatus="name1";
            this.oldtype="password";
            this.passwordtype="password";
            this.confirmtype="password";
            this.eye="md-eye";
            this.eye_old="md-eye";
            this.eye_confim="md-eye";
            this.$nextTick(() => {
              this.ModalUser=true;
            });
            
            }).catch(error => {
          IsMessage("error",this.$t('NoData'));
        });
        break;
        default:
          break;
      }
    },
    seePassWord(){
      this.eye = this.eye==="md-eye"?"md-eye-off":"md-eye";
      this.passwordtype = this.passwordtype==="password"?"text":"password";
    },
    //   切换多语言
    changeLangFn(name) {
      if (localStorage.getItem("language")===name) {
        name==="en"?IsMessage("success","Now in English",2):IsMessage("info","现在是简体中文",2);
        return;
      }
      localStorage.setItem("language", name);
      //热重载data并切换菜单多语言文字
      IsLoading();
      this.$store.dispatch("SetRouter", this.$router).then(res => {
        if (res.code === "2000") {
          // this.$store.commit("SETMENU", res.data);
          this.$router.addRoutes([
            ...this.$store.getters.vueRouter,
            {
              path: "*",
              redirect: "/work_desk"
            }
          ]);
          localStorage.setItem("language", name);
          this.$i18n.locale = name;
          this.reload();
        } else {
          this.$store.dispatch("LogOut"); //获取菜单失败
        }
      });
    },
    async updateCrmUserPassword() {
      let res = await updateCrmUserPassword(this.resetForm);
      if (res.code === 0) {
        this.$store.dispatch("LogOut");
      } else {
        this.$Message.error(res.msg);
      }
    },
    setOk() {
      this.$refs.resetForm.validate(valid => {
        if (valid) {
          this.updateCrmUserPassword();
        } else {
          this.resetPassLoading = false;
          this.$nextTick(() => {
            this.resetPassLoading = true;
          });
        }
      });
    },
    setCancel() {
      this.$store.commit("SET_LOGGED_IN", "0");
    },
    plusShowClick() {
      this.subActive = "";
      this.plusShow = true;
    },
    routerLink(menu) {
      if (this.plusShow) {
        return {
          path: menu.path.split("/")[menu.path.split("/").length - 1],
          query: {
            type: new Date()
          }
        };
      } else {
        return {
          path: menu.path.split("/")[menu.path.split("/").length - 1]
        };
      }
    }
  }
};
</script>

<style>
.layout {
  position: relative;
  /* overflow: hidden; */
}
.app-menu ul {
  margin-top: 10px;
}
.ivu-layout-header .ivu-menu {
  display: flex;
}
.ivu-layout-header .ivu-menu .layout-logo {
  flex: 0 0 200px;
  width: 200px;
  height: 100%;
  border-radius: 3px;
  position: relative;
  text-align:center;padding-top:5px;
  /* text-align: left; */
}
.ivu-layout-header .ivu-menu .layout-logo2 {
  flex: 0 0 78px;
  width: 78px;
  height: 100%;
  border-radius: 3px;
  position: relative;
  text-align:center;
}
.ivu-layout-header .ivu-menu .layout-nav {
  /* min-width:650px; */
  flex: 1;
  margin: 0 auto;
}
.ivu-layout-header .ivu-menu .layout-nav .ivu-menu-item {
  padding: 0 10px;
  font-size: 14px;
  color: #fff;
  text-align: center;
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.ivu-layout-header .ivu-menu .layout-nav .ivu-menu-item:hover {
  background: #2293e4;
}
.ivu-layout-header .ivu-menu .layout-nav .router-link-active .ivu-menu-item {
  background: #1f89d6;
}
.ivu-layout-header .ivu-menu .layout-tip {
  flex: 0 0 20%;
  width: 20%;
  text-align: left;
  margin-right: 12px;
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: auto;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
.ivu-menu-vertical .ivu-menu-item {
  padding: 8px 24px;
  line-height: normal;
}
.ivu-menu-vertical .ivu-menu-submenu-title {
  padding: 8px 24px 8px 5px;
  line-height: normal;
}
.ivu-menu-vertical .ivu-menu-submenu-title-icon {
  float: left;
  top: 3px;
  left: 10px;
  text-align: left;
}
.ivu-menu-vertical .ivu-menu-submenu .ivu-menu .ivu-menu-item {
  padding: 8px 26px !important;
  font-size: 12px;
}
.ivu-menu .ivu-icon:hover {
  color: #5cadff;
}
.child-view {
  position: absolute;
  /* transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1); */
   width:100%;
   transition: all 0.1s cubic-bezier(.55,0,.1,1);
  /* transition: transform 2.5s linear !important; */
}
.slide-left-enter,
.slide-right-leave-active {
  /* opacity: 0;
  transform: translate(500px, 0); */
  opacity: 0;
  -webkit-transform: translate(50px, 0);
  transform: translate(50px, 0);
}
.slide-left-leave-active,
.slide-right-enter {
  /* opacity: 0;
  transform: translate(-500px, 0); */
  opacity: 0;
  -webkit-transform: translate(-50px, 0);
  transform: translate(-50px, 0);
}
</style>
<style lang="less">

  .ModalUserClass{
        display: flex;
        align-items: center;
        justify-content: center;
        .ivu-modal{
          .ivu-modal-header{
            display: none;
          }
          .ivu-modal-body{
            background: #f3f6f8;
            padding: 30px 16px
          }
            top: 0;
            width: 80vw !important;
        }
}
.colInfo{
  background: #fff;
  border-radius: 4px;
  position: relative;
  border: 1px solid #eee;
  .divider {
    border-top: 1px dashed #e8e8e8;
    display: block;
    height: 0;
    width: 100%;
    margin: 24px 0;
    clear: both;
  }
}
.demo-avatar{
  text-align: center;
  width: 100%;
  .account-name {
    text-align: center;
    font-size: 24px;
    line-height: 28px;
    font-weight: 500;
    color: rgba(0,0,0,.85);
    margin-bottom: 10px;
    margin-top: 10px;
}
.account-detail-desc {
    text-align: left;
    -webkit-font-smoothing: antialiased;
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,\\5FAE\8F6F\96C5\9ED1,Arial,sans-serif;
    font-size: 14px;
    line-height: 1.5;
    margin-top: 10px;
    p{
      margin-top: 8px;
    }
    span{
      word-wrap:break-word;
      // margin-left: 10px;
      vertical-align: middle;
    }
}
}
.generate-color() {
  @r: `Math.random() * 255`;
  @g: `Math.random() * 255`;
  @b: `Math.random() * 255`;
  @color: (rgb(@r, @g, @b));
  // use the @color var after calling this mixin
}
.randomIcon{
  .generate-color();
  font-weight: bold !important;
  cursor:pointer;
  color: #fff;
  background-color:@color;
}
.randomAvatar{
  .generate-color();
  font-weight: bold !important;
  cursor:pointer;
  color: #fff;
  background-color:@color;
}
.layout-tip{
   .generate-color();
  .ivu-btn-info.active, .ivu-btn-info:active, .ivu-btn-info:hover {
    color: #fff;
}
.ivu-btn-info {
    color: #fff;
    background-color: #2199ef;
    border-color: #2199ef;
}
.ivu-btn-info:hover {
    color: #fff;
    background-color: desaturate(@color, 20%);
    border-color: desaturate(@color, 20%);
}
}
</style>
<style scoped>
a {
		color: #000;
    font-size: 5px;
		text-decoration: none;
		/* text-transform: uppercase; */
		font-family: Helvetica;
}

/* a,
span {
		font-size: 20px;
} */
/* THE ROUND PSEUDO-ELEMENT HOVER STYLES */
.round {
		max-width: 960px;
		margin:0 auto;
}

.round a {
		color: crimson;
}

.round .button {
    text-align: center;
		display: inline-block;
		width: 80px;
		height: 20px;
		line-height: 18px;
		margin: 20px;
		position: relative;
		overflow: hidden;
		border: 2px solid crimson;
		transition: color .5s;
}
.round #button1 {
    color: blue;
		margin: 20px 20px 20px 90px;
		border: 2px solid blue;
}

.round #button1:before {
		content: "";
		position: absolute;
		z-index: -1;
		background: blue;
		height: 150px;
		width: 170px;
		border-radius: 50%;
}
.round #button2:before {
		content: "";
		position: absolute;
		z-index: -1;
		background: crimson;
		height: 150px;
		width: 170px;
		border-radius: 50%;
}

.round .button:hover {
		color: #fff;
}
.round #button1:hover {
		color: #fff;
}

.round .button:nth-child(1):before {
		top: 100%;
		left: 100%;
		transition: all .7s;
}

.round .button:nth-child(1):hover:before {
		top: -30px;
		left: -30px;
}

.round .button:nth-child(2):before {
		left: -30px;
		bottom: 100%;
		transition: all .7s;
}

.round .button:nth-child(2):hover:before {
		bottom: -50px;
}

.round .button:nth-child(3):before {
		top: 0;
		left: -200%;
		transition: all .7s;
}

.round .button:nth-child(3):hover:before {
		top: -30px;
		left: -30px;
}
</style>
<style lang="less" scoped>
  #scroller{
    // height: 60px;
    z-index: 1000;
    // overflow-x: hidden;
    // overflow-y: scroll;
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 3px #5caeff2a;
  box-shadow: inset 0 0 3px #5caeff2a;
  background-color: #5caeff2a;
}
::-webkit-scrollbar {
  width: 4px;
  height: 4px;
  background-color: #5caeff2a;
}
::-webkit-scrollbar-thumb {
  background-color: #ff4d4f;
}
</style>


