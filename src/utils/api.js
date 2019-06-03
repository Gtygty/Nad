import i18n from "@/main";
import store from "@/store";
import {getLanguage, getToken} from "@/utils";
import axios from "axios";
import iView from "iview";
import qs from "qs";
// 创建axios实例
const service = axios.create({
  // baseURL: process.env.BASE_API, // api的base_url//不加baseurl才能反向代理
  timeout: 300, // 请求超时时间
  retry: 1, //重发次数
  retryDelay: 500 //失败请求之间等待的时间（自定义）
});
// request拦截器
service.interceptors.request.use(
  config => {
    // iView.Spin.show({
    //   //全局loading
    //   render: h => {
    //     return h("div", [
    //       h("Icon", {
    //         class: "demo-spin-icon-load",
    //         props: {
    //           type: "ios-loading",
    //           size: 18
    //         }
    //       }),
    //       h("div", "Loading")
    //     ]);
    //   }
    // });
    config.headers["Authorization"] = getToken()
      ? getToken()
      : "f356aebba6cec92c53f5bf7f38de7ef5";
    config.headers["platform"] = "web";//后台判断请求接口的平台（web端）
    config.headers["lang"] = getLanguage() ? getLanguage() : "en";//语言参数
    config.data = qs.stringify(config.data);
    return config;
  },
  error => {
    Promise.reject(error);
  }
);
//respone(超时重发2次)
service.interceptors.response.use(
  response => {
    // iView.Spin.hide(); //取消全局loading
    if (typeof response == "undefined") {
      iView.Notice.error({
        title: "Server Error!",
        duration: 0
      });
      return;
    } else if (//token失效或超时
      response.data.code === "1004" ||
      response.data.code === "1005" ||
      response.data.code === "1006"
    ) {
      setTimeout(function() {
        localStorage.clear();
        location.href = "/";
      }, 5000);
      // return Promise.reject(error);
      response = {
        data: { message: "身份失效，4秒后返回登录页！" }
      };
      return response;
    } else {
      return response;
    }
  },
  error => {
    var config = error.config;
    if (!config || !config.retry) return Promise.reject(error);
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= config.retry) {
      iView.Spin.hide(); //取消全局loading
      // setTimeout(function() {
      //   localStorage.clear();
      //   location.href = "/";
      // }, 4000);
      // return Promise.reject(error);
      return {
        code: 99999,
        message: error.response.data.message
      };
      return Promise.reject(error);
    }
    config.__retryCount += 1;
    var backoff = new Promise(function(resolve) {
      setTimeout(function() {
        resolve();
      }, config.retryDelay || 1);
    });
    if (typeof config.data === "string") {
      config.data = qs.parse(config.data);
    }
    return backoff.then(function() {
      return service(config);
    });
  }
);

export async function axiosPost(url, params) {
  try {
    let res = await service.post(url, params);
    if (typeof res.data === "object") {
      return res.data;
    } else {
      return res;
    }
  } catch (error) {
    return {
      code: 99999,
      message: error
    };
  }
}
export async function axiosGet(url, _params) {
  try {
    let res = await service.get(url, {
      params: _params
    });
    if (typeof res.data === "object") {
      return res.data;
    } else {
      return res;
    }
  } catch (error) {
    return {
      code: 99999,
      message: error
    };
  }
}
export async function axiosFormData(url, params) {
  //formdata类型参数上传表单
  try {
    let res = await axios.post(url, params, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: getToken()
          ? getToken()
          : "f356aebba6cec92c53f5bf7f38de7ef5"
      }
    });
    if (typeof res.data === "object") {
      return res.data;
    } else {
      return res;
    }
  } catch (error) {
    return {
      code: 99999,
      message: error
    };
  }
}

export async function axiosFrom(url, from) {
  try {
    let res = await service.post(url, from, {
      headers: {
        "Content-type":
          "multipart/form-data; charset=utf-8; boundary=" +
          Math.random()
            .toString()
            .substr(2)
      }
    });
    if (typeof res.data === "object") {
      return res.data;
    } else {
      return res;
    }
  } catch (error) {
    return {
      code: 99999,
      message: error
    };
  }
}
export default service;
export const CODE_OK = "2000"; //后台接口数据返回正常时的状态码
iView.Message.config({//Message公共配置
  top: 20,
  duration: 3
});
iView.Notice.config({//Notice公共配置
  top: 80,
  duration: 3
});
export function IsMessage(type, content, duration) {
  iView.Message[type]({
    content: content,
    duration: duration ? duration : 3
  });
}
export function IsLoading() {
  iView.Message.loading({
    content: "Loading...",
    duration: 0.5
  });
}
export function AsyncLoading() {
  return iView.Message.loading({
    content: "Loading...",
    duration: 0
  });
}
export function IsAlert(type, title, desc) {
  iView.Notice[type]({
    title: title,
    desc: desc
  });
}
export function AjaxApi(api, params, successFuc, elseFuc) {//公共axios方法
  store
    .dispatch(api, params)
    .then(res => {
      if (!res) {
          IsMessage("error", "It Is Not!", 5);
          elseFuc({code:2001,data:[],message:"Error!"});
          return;
      }
      if (res.code === CODE_OK) {
        successFuc(res);
      } else if (res.code === 99999) {
        elseFuc(res);
        iView.Notice.info({
          title: i18n.t("ServerError"),
          duration: 0,
          desc: res.message
        });
      } else {
        elseFuc(res);
        IsMessage("warning", res.message, 5);
      }
    })
    .catch(error => {
      IsAlert("error", i18n.t("Error"), error);
    });
}
export function getTreeDeepArr(key, treeData) {
  //根据后台返回的单独id计算出层级选择器需要的复合id数组数据
  let arr = []; // 在递归时操作的数组
  let returnArr = []; // 存放结果的数组
  let depth = 0; // 定义全局层级
  // 定义递归函数
  function childrenEach(childrenData, depthN) {
    for (var j = 0; j < childrenData.length; j++) {
      depth = depthN; // 将执行的层级赋值 到 全局层级

      arr[depthN] = childrenData[j].id;

      if (childrenData[j].id == key) {
        // returnArr = arr; // 原写法不行, 因 此赋值存在指针关系
        returnArr = arr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组，
        break;
      } else {
        if (childrenData[j].children) {
          depth++;
          childrenEach(childrenData[j].children, depth);
        }
      }
    }
    return returnArr;
  }
  return childrenEach(treeData, depth);
}
