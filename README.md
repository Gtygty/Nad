# NAD-CRM

> NAD项目管理后台

## 项目启动

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9091
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

# NAD-CRM系统文档

## 项目目录

```
.
|-- build                            // webpack的初始化配置
|   |-- build.js                     // 
|   |-- check-versions.js            // 
|   |-- utils.js                     // 通用方法
|   |-- vue-loader.conf.js           // 
|   |-- webpack.base.conf.js         // 配置基础
|   |-- webpack.dev.conf.js          // 运行配置
|   |-- webpack.prod.conf.js         // 生产配置

|-- config                           // 项目开发环境配置
|   |-- dev.env.js                   // 
|   |-- index.js                     // 项目打包部署配置
|   |-- prod.env.js                  // 

|-- src                              // 源码目录
|   |-- api                          // 注册接口Api//根据目录结构存放
|   |-- asset                        // 静态资源（图片）
|   |-- components                   // 公共组件
|       |--uploadImg                 //
|          |--uploadImgAdd.vue       // 上传图片
|          |--uploadImgFormData.vue  // 上传图片
|       |-- tinymce.vue              // tinymce富文本编辑器组件
|   |-- language                     // i18n多语言文件
|       |--en-US                     //英文
|       |--zh-CN                     // 中文
|   |-- router                       // 路由配置和程序的基本信息配置
|       |-- index.js                 // 基础配置
|       |-- permission.js            // 路由拦截、路由导航守卫
|   |-- store                        // VUEX
|   |-- utils                        // 公共方法
|       |-- api.js                   // axios封装处理，请求和返回的拦截，
|       |-- index.js                 // 封装好的公共处理方法
|   |-- views                        // 页面组件
|       |-- backend                  // 后台
|       |-- inventory                // 库存管理
|       |-- messeage                 // 通信中心
|       |-- order                    // 订单管理
|       |-- organize                 // 组织
|       |-- treat                    // 护理项目
|       |-- user_manage              // 客户管理
|       |-- work_desk                // 工作台
|   |-- admin.vue                    // 侧面菜单及头部header
|   |-- login.vue                    // 登录页面
|-- static
|   |--css                           // 公共样式
|       |-- common.less              // 公共样式
|   |--tinymce                       // tinymce富文本配置和皮肤主题
|-- .babelrc                         // ES6语法编译配置
|-- .editorconfig                    // 
|-- index.html                       // 
|-- README.md                        // 项目说明
|-- package.json                     // 配置项目相关信息，通过执行 npm init 命令创建
.
```
## 方法说明

>AjaxApi(api, params, successFuc, elseFuc) ——AXIOS方法
  
      参数>
      api:actions函数名
      params:axios参数
      successFuc:返回成功的回调
      elseFuc:返回失败的回调
>IsAlert(type, title, desc)——公共Alert方法1
  
      参数>
      type:类型（success，error，warning）
      title:标题
      desc:内容（非必填，为空时title即为内容）
>IsMessage(type, content, duration) ——公共Alert方法2
  
      参数>
      type:类型（success，error，warning）
      content:内容
      duration:持续时间（为0时不关闭）
        
>IsLoading() ——同步Laoding方法


>AsyncLoading() ——异步Laoding方法

     const Loading = AsyncLoading();设置loading
     ...
     ...
     Loading();触发取消loading 
      
>getTreeDeepArr(key, treeData) ——根据后台返回的单独id计算出层级选择器需要的复合id数组数据
  
      参数>
      key:独立id
      treeData:层级数据
>CODE_OK = "2000"  ——与后台约定的正常状态码
  


  ## 开发说明

*   ajax利用axios插件，axios利用VUEX的actions分发函数触发
*   富文本编辑器是tinyMCE 5.0 官方文档地址：[点这里](https://www.tiny.cloud/docs/ )；配置及私有化开发在components文件夹tinymce.vue中
*   main.js中
*  *  处理iview InputNumber控件使用precision属性光标混乱的hack
```JavaScript
  iView.InputNumber.computed.precisionValue = function() {
    let arr = (this.currentValue + "").split(".");
    if (this.precision && arr[1] && this.precision < arr[1].length)
      return this.currentValue.toFixed(this.precision);
      return this.currentValue;
  };
```
*  *  解决iview使用this.$函数调用组件时和i18n冲突
```JavaScript
  Vue.use(iView, {
      i18n: (key, value) => i18n.t(key, value), //解决iview使用this.$函数调用组件时和i18n冲突
  });
```