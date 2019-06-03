export function getToken() {
  return localStorage.getItem("token");
}
export function getLanguage() {
  return localStorage.getItem("language");
}

export function setToken(token) {
  return localStorage.setItem("token", token);
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time == "object") {
    date = time;
  } else {
    if (("" + time).length === 10) time = parseInt(time) * 1000;
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key];
    if (key === "a")
      return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return time_str;
}

export function formatTime(time, option) {
  time = +time * 1000;
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return "刚刚";
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + "分钟前";
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + "小时前";
  } else if (diff < 3600 * 24 * 2) {
    return "1天前";
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return (
      d.getMonth() +
      1 +
      "月" +
      d.getDate() +
      "日" +
      d.getHours() +
      "时" +
      d.getMinutes() +
      "分"
    );
  }
}

// 格式化时间
export function getQueryObject(url) {
  url = url == null ? window.location.href : url;
  const search = url.substring(url.lastIndexOf("?") + 1);
  const obj = {};
  const reg = /([^?&=]+)=([^?&=]*)/g;
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1);
    let val = decodeURIComponent($2);
    val = String(val);
    obj[name] = val;
    return rs;
  });
  return obj;
}

/**
 *判断字符串长度
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1; //中文记为1
    } else {
      len += 0.5; //数字英文记0.5
    }
  }
  return Math.floor(len);
}
//拷贝数组
export function cleanArray(actual) {
  const newArray = [];
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i]);
    }
  }
  return newArray;
}

//json格式参数转url格式
export function param(json) {
  if (!json) return "";
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return "";
      return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
    })
  ).join("&");
}
//将url中的参数解析为对象
export function param2Obj(url) {
  const search = url.split("?")[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  );
}
//从html中去除div
export function html2Text(val) {
  const div = document.createElement("div");
  div.innerHTML = val;
  return div.textContent || div.innerText;
}

export function objectMerge(target, source) {
  /* Merges two  objects,
   giving the last one precedence */

  if (typeof target !== "object") {
    target = {};
  }
  if (Array.isArray(source)) {
    return source.slice();
  }
  for (const property in source) {
    if (source.hasOwnProperty(property)) {
      const sourceProperty = source[property];
      if (typeof sourceProperty === "object") {
        target[property] = objectMerge(target[property], sourceProperty);
        continue;
      }
      target[property] = sourceProperty;
    }
  }
  return target;
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return;
  const difference = to - element.scrollTop;
  const perTick = (difference / duration) * 10;
  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop === to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}
//class名添加和删除之间切换，第一个参数为dom，第二个参数为要添加的class名。例子：http://jsfiddle.net/4MBQa/
export function toggleClass(element, className) {
  if (!element || !className) {
    return;
  }
  let classString = element.className;
  const nameIndex = classString.indexOf(className);
  if (nameIndex === -1) {
    classString += "" + className;
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length);
  }
  element.className = classString;
}

export const pickerOptions = [
  {
    text: "今天",
    onClick(picker) {
      const end = new Date();
      const start = new Date(new Date().toDateString());
      end.setTime(start.getTime());
      picker.$emit("pick", [start, end]);
    }
  },
  {
    text: "最近一周",
    onClick(picker) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
      picker.$emit("pick", [start, end]);
    }
  },
  {
    text: "最近一个月",
    onClick(picker) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      picker.$emit("pick", [start, end]);
    }
  },
  {
    text: "最近三个月",
    onClick(picker) {
      const end = new Date(new Date().toDateString());
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      picker.$emit("pick", [start, end]);
    }
  }
];

export function getTime(type) {
  if (type === "start") {
    return new Date().getTime() - 3600 * 1000 * 24 * 90;
  } else {
    return new Date(new Date().toDateString());
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;
  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;
    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function(...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

export function deepClone(source) {
  if (!source && typeof source !== "object") {
    throw new Error("error arguments", "shallowClone");
  }
  const targetObj = source.constructor === Array ? [] : {};
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === "object") {
        targetObj[keys] = source[keys].constructor === Array ? [] : {};
        targetObj[keys] = deepClone(source[keys]);
      } else {
        targetObj[keys] = source[keys];
      }
    }
  }
  return targetObj;
}

export function clearNoNum(value) {
  if (value != "" && value.substr(0, 1) == ".") {
    value = "";
  }
  value = value.replace(/^0*(0\.|[1-9])/, "$1"); //解决 粘贴不生效
  value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
  value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
  value = value
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
  value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3"); //只能输入两个小数
  if (value.indexOf(".") < 0 && value != "") {
    //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    if (value.substr(0, 1) == "0" && value.length == 2) {
      value = value.substr(1, value.length);
    }
  }
  return value;
}

export function clearNoNumInt(value) {
  if (value != "" && value.substr(0, 1) == ".") {
    value = "";
  }
  value = value.replace(/^0*(0\.|[1-9])/, "$1").replace("-", ""); //解决 粘贴不生效
  value = value.replace(/[^\d.]/g, ""); //清除“数字”和“.”以外的字符
  value = value.replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的
  value = value
    .replace(".", "$#$")
    .replace(/\./g, "")
    .replace("$#$", ".");
  value = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2"); //
  if (value.indexOf(".") < 0 && value != "") {
    //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
    if (value.substr(0, 1) == "0" && value.length == 2) {
      value = value.substr(1, value.length);
    }
  }
  return value;
}
export function getObjectsLength(obj) {
  if (!Object.keys) {
    Object.keys = function (obj) {
        var arr = [],
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                arr.push(key);
            }
        }
        return arr;
    };
}
  return Object.keys(obj).length;
}

export function downloadFile(url, fileName = ''){
  let eleLink = document.createElement('a');
  eleLink.download = fileName;
  eleLink.style.display = 'none';
  eleLink.href = url;
  // 受浏览器安全策略的因素，动态创建的元素必须添加到浏览器后才能实施点击
  document.body.appendChild(eleLink);
  // 触发点击  
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
};

export function getNow(){
  let now = new Date();
  let year = now.getFullYear();
  let mouth = now.getMonth() + 1 < 10? "0" + (now.getMonth() + 1): now.getMonth() + 1;
  let date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
  let hour = now.getHours() < 10 ? "0" + now.getHours() : now.getHours();
  let min = now.getMinutes() < 10 ? "0" + now.getMinutes() : now.getMinutes();
  let sec = now.getSeconds() < 10 ? "0" + now.getSeconds() : now.getSeconds();
  console.log( `${year}-${mouth}-${date} ${hour}:${min}:${sec}`);
  return `${year}-${mouth}-${date} ${hour}:${min}:${sec}`
};