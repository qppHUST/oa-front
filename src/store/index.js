import { getRequest } from '@/utils/api'
import Vue from 'vue'
import Vuex from 'vuex'
import Sockjs from 'sockjs-client'
import Stomp from 'stompjs'

Vue.use(Vuex)

const now = new Date()

const store =  new Vuex.Store({
  state: {
    routes: [],
    sessions:{},
    admins:[],
    currentSession:null,
    filterKey:'',
    stomp:null
  },
  mutations: {//同步执行
     initRoutes(state, data) {
          state.routes = data
     },
     changeCurrentSession (state,currentSession) {
        state.currentSession = currentSession;
     },
     addMessage (state,msg) {
      let currentAdmin = JSON.parse(window.sessionStorage.getItem('user'))
      let mss = state.sessions[currentAdmin.username+'#'+msg.to]
      if(!mss){
        // state.sessions[state.currentAdmin.username+'#'+msg.to] = []
        Vue.set(state.sessions,currentAdmin.username+'#'+msg.to,[])
      }
      state.sessions[currentAdmin.username+'#'+msg.to].push({
        content:msg.content,
        date:new Date(),
        self: !msg.notSelf
      })
     },
     INIT_DATA (state) {
     let data = localStorage.getItem('vue-chat-session');
     //console.log(data)
     if (data) {
        state.sessions = JSON.parse(data);
     }
    },
    INIT_ADMINS(state,data){
      state.admins = data
    }
  },
  actions: {
      //异步执行
      connect(context){
        context.state.stomp = Stomp.over(new Sockjs('/ws/ep'))
        let token = window.sessionStorage.getItem('tokenStr')
        context.state.stomp.connect({'Auth-Token':token},success=>{
          context.state.stomp.subscribe('/user/queue/chat',msg=>{
            let receiveMsg = JSON.parse(msg.body)
            receiveMsg.notSelf = true
            receiveMsg.to = receiveMsg.from
            context.commit('addMessage',receiveMsg)
          })
        },error=>{

        })
      },
      initData (context) {
        getRequest('/chat/admin').then(resp=>{
          if(resp){
            context.commit('INIT_ADMINS',resp)
          }
        })
        context.commit('INIT_DATA')
      }
  }
})

store.watch(function (state) {
    return state.sessions
  },function (val) {
    console.log('CHANGE: ', val);
    localStorage.setItem('vue-chat-session', JSON.stringify(val));
  },{
    deep:true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})
  
export default store;