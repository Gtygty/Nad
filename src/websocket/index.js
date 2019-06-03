import Vue from 'vue'
import store from '@/store'
import iView from 'iview'
const socket = new WebSocket('wss://api_matchliquidity_prod.alphapoint.com/WSGateway/')
Vue.prototype.$socket = socket
socket.onopen = () => {
  // Web Socket 已连接上，使用 send() 方法发送数据
  console.log('链接成功');
};

socket.onmessage = (evt) => {
  let msg = JSON.parse(evt.data);
  if(msg.m===1&&msg.i===store.state.app.wsParams.i){
    let res = JSON.parse(msg.o)
    if (msg.n==='WebAuthenticateUser') {
      if (!res.Authenticated) {
        iView.Notice.error({
          title:'VT后台链接出错',
          duration:0,
          desc:res.errormsg
        })
        setTimeout(()=>{
          store.dispatch('LogOut')
        },3000)
      }else{
        store.commit('SET_WS_TOKEN', res.SessionToken)
        store.commit('SET_WS_RES',msg)
      }
    }else{
      store.commit('SET_WS_RES',msg)
    }
  }
};

socket.onclose = () => {
  // 关闭 websocket
};
export default socket
